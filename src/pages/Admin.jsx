import { useEffect, useMemo, useState } from "react";
import { siteInfo } from "../data/siteData.js";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient.js";
import { normalizeOcrReviewText } from "../utils/reviewText.js";

const REVIEW_PHOTO_BUCKET = "review-photos";
const DEFAULT_ADMIN_EMAIL = "tjdrhkde@gmail.com";

const makeStarLabel = (rating) => `${"★".repeat(rating)}${"☆".repeat(5 - rating)}`;

const getTodayInputValue = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getInitialForm = () => ({
  author: "방문자****",
  rating: 5,
  time: getTodayInputValue(),
  sourceUrl: siteInfo.naverPlaceUrl,
  text: "",
  isPublished: true,
});

const getSafeImageExtension = (file) => {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (["jpg", "jpeg", "png", "webp", "heic", "heif"].includes(extension)) {
    return extension;
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  return "jpg";
};

const getUploadPath = (userId, file, index) => {
  const randomId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.round(Math.random() * 100000)}`;

  return `${userId}/${Date.now()}-${index}-${randomId}.${getSafeImageExtension(file)}`;
};

function FilePreviewGrid({ previews }) {
  if (previews.length === 0) {
    return null;
  }

  return (
    <div className="admin-photo-preview-grid" aria-label="선택한 리뷰 사진 미리보기">
      {previews.map((preview) => (
        <figure key={preview.url}>
          <img src={preview.url} alt={`${preview.name} 미리보기`} />
          <figcaption>{preview.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function AdminLogin({ authForm, authStatus, isSigningIn, onChange, onSubmit }) {
  return (
    <form className="admin-card admin-login-card" onSubmit={onSubmit}>
      <p className="section-eyebrow">Secure Login</p>
      <h2>관리자 로그인</h2>
      <p>
        Supabase Authentication에 생성된 관리자 계정으로 로그인해야 리뷰와 사진을 등록할 수
        있습니다.
      </p>
      <label>
        이메일
        <input
          autoComplete="email"
          inputMode="email"
          name="email"
          type="email"
          value={authForm.email}
          onChange={onChange}
          required
        />
      </label>
      <label>
        비밀번호
        <input
          autoComplete="current-password"
          name="password"
          type="password"
          value={authForm.password}
          onChange={onChange}
          required
        />
      </label>
      <button className="admin-primary-button" type="submit" disabled={isSigningIn}>
        {isSigningIn ? "로그인 중" : "로그인"}
      </button>
      {authStatus ? <p className="admin-status-text">{authStatus}</p> : null}
    </form>
  );
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [authForm, setAuthForm] = useState({ email: DEFAULT_ADMIN_EMAIL, password: "" });
  const [authStatus, setAuthStatus] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [adminStatus, setAdminStatus] = useState({
    isChecking: false,
    isAdmin: false,
    error: "",
  });
  const [form, setForm] = useState(getInitialForm);
  const [ocrFile, setOcrFile] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [ocrStatus, setOcrStatus] = useState("");
  const [isReadingOcr, setIsReadingOcr] = useState(false);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [submitStatus, setSubmitStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [listStatus, setListStatus] = useState("");

  const userEmail = session?.user?.email ?? "";
  const canManageReviews = Boolean(session && adminStatus.isAdmin);
  const ratingOptions = useMemo(() => [5, 4, 3, 2, 1], []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setSession(data.session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const previews = photoFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setPhotoPreviews(previews);

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [photoFiles]);

  const loadAdminReviews = async () => {
    setListStatus("리뷰 목록을 불러오는 중입니다.");

    const { data, error } = await supabase
      .from("homepage_reviews")
      .select(
        "id, author, label, text, time, rating, is_published, created_at, image_urls, source_url",
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      setListStatus(`목록을 불러오지 못했습니다: ${error.message}`);
      return;
    }

    setReviews(data ?? []);
    setListStatus("");
  };

  const checkAdminAccess = async () => {
    setAdminStatus({ isChecking: true, isAdmin: false, error: "" });

    const { data, error } = await supabase.rpc("is_homepage_admin");

    if (error) {
      setAdminStatus({
        isChecking: false,
        isAdmin: false,
        error: `관리자 권한 확인 실패: ${error.message}`,
      });
      return;
    }

    setAdminStatus({
      isChecking: false,
      isAdmin: Boolean(data),
      error: data ? "" : "이 이메일은 아직 홈페이지 관리자 목록에 없습니다.",
    });

    if (data) {
      await loadAdminReviews();
    }
  };

  useEffect(() => {
    if (!session || !isSupabaseConfigured) {
      setAdminStatus({ isChecking: false, isAdmin: false, error: "" });
      setReviews([]);
      return;
    }

    checkAdminAccess();
  }, [session]);

  const handleAuthFieldChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((current) => ({ ...current, [name]: value }));
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setIsSigningIn(true);
    setAuthStatus("");

    const { error } = await supabase.auth.signInWithPassword({
      email: authForm.email.trim(),
      password: authForm.password,
    });

    setIsSigningIn(false);

    if (error) {
      setAuthStatus(`로그인 실패: ${error.message}`);
      return;
    }

    setAuthStatus("로그인되었습니다.");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAuthStatus("");
    setSubmitStatus("");
  };

  const handleFormChange = (event) => {
    const { checked, name, type, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoChange = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );

    setPhotoFiles(selectedFiles);
  };

  const handleCapturePhotoChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      return;
    }

    setPhotoFiles((current) => [...current, selectedFile]);
    event.target.value = "";
  };

  const uploadReviewPhotos = async () => {
    if (photoFiles.length === 0) {
      return [];
    }

    const bucket = supabase.storage.from(REVIEW_PHOTO_BUCKET);
    const uploadedUrls = [];

    for (const [index, file] of photoFiles.entries()) {
      const path = getUploadPath(session.user.id, file, index);
      const { error } = await bucket.upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });

      if (error) {
        throw new Error(`사진 업로드 실패: ${error.message}`);
      }

      const {
        data: { publicUrl },
      } = bucket.getPublicUrl(path);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleReadOcr = async (selectedFile = ocrFile) => {
    if (!selectedFile) {
      setOcrStatus("먼저 리뷰 캡처 이미지를 선택하세요.");
      return;
    }

    setIsReadingOcr(true);
    setOcrStatus("이미지를 선택했습니다. OCR 엔진을 준비하는 중입니다.");

    let worker;

    try {
      const { createWorker } = await import("tesseract.js");

      worker = await createWorker("kor+eng", 1, {
        logger: (message) => {
          if (!message.status) {
            return;
          }

          const progress = Number.isFinite(message.progress)
            ? ` ${Math.round(message.progress * 100)}%`
            : "";
          setOcrStatus(`${message.status}${progress}`);
        },
      });

      const {
        data: { text },
      } = await worker.recognize(selectedFile);
      const cleanedText = normalizeOcrReviewText(text);
      const fallbackText = text.trim().slice(0, 900);
      const nextText = cleanedText || fallbackText;

      setOcrText(nextText);
      setForm((current) => ({
        ...current,
        text: nextText,
      }));
      setOcrStatus(
        cleanedText
          ? "OCR 읽기와 자동 정제가 완료되었습니다. 내용을 확인하고 저장하세요."
          : "OCR은 됐지만 자동 정제할 문장을 찾지 못했습니다. 직접 필요한 문구만 남기세요.",
      );
    } catch (error) {
      setOcrStatus(`OCR 실패: ${error.message}`);
    } finally {
      if (worker) {
        await worker.terminate();
      }

      setIsReadingOcr(false);
    }
  };

  const handleOcrFileChange = (event) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setOcrFile(selectedFile);
    setOcrText("");

    if (selectedFile) {
      handleReadOcr(selectedFile);
    } else {
      setOcrStatus("");
    }
  };

  const handleUseOcrText = () => {
    setForm((current) => ({
      ...current,
      text: ocrText,
    }));
  };

  const resetForm = () => {
    setForm(getInitialForm());
    setOcrFile(null);
    setOcrText("");
    setOcrStatus("");
    setPhotoFiles([]);
    setSubmitStatus("");
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    if (!canManageReviews) {
      setSubmitStatus("관리자 권한 확인 후 저장할 수 있습니다.");
      return;
    }

    if (!form.text.trim()) {
      setSubmitStatus("리뷰 내용을 입력하거나 OCR로 읽어온 뒤 확인하세요.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("사진을 업로드하고 리뷰를 저장하는 중입니다.");

    try {
      const rating = Number(form.rating);
      const imageUrls = await uploadReviewPhotos();
      const { error } = await supabase.from("homepage_reviews").insert({
        author: form.author.trim() || "방문자****",
        label: makeStarLabel(rating),
        text: form.text.trim(),
        time: form.time || null,
        rating,
        source_type: "naver",
        source_url: form.sourceUrl.trim() || siteInfo.naverPlaceUrl,
        image_urls: imageUrls,
        is_published: form.isPublished,
      });

      if (error) {
        throw new Error(error.message);
      }

      setSubmitStatus("저장 완료. 공개 상태면 홈페이지 리뷰 슬라이드에 반영됩니다.");
      resetForm();
      await loadAdminReviews();
    } catch (error) {
      setSubmitStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublished = async (review) => {
    const { error } = await supabase
      .from("homepage_reviews")
      .update({ is_published: !review.is_published })
      .eq("id", review.id);

    if (error) {
      setListStatus(`공개 상태 변경 실패: ${error.message}`);
      return;
    }

    await loadAdminReviews();
  };

  const handleDeleteReview = async (review) => {
    const confirmed = window.confirm("이 리뷰를 삭제할까요? 홈페이지에서도 사라집니다.");

    if (!confirmed) {
      return;
    }

    const { error } = await supabase.from("homepage_reviews").delete().eq("id", review.id);

    if (error) {
      setListStatus(`삭제 실패: ${error.message}`);
      return;
    }

    await loadAdminReviews();
  };

  if (!isSupabaseConfigured) {
    return (
      <section className="admin-page">
        <div className="container admin-shell">
          <div className="admin-card">
            <h1>Supabase 설정 필요</h1>
            <p>
              관리자 앱을 사용하려면 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`가 필요합니다.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page" aria-labelledby="admin-title">
      <div className="container admin-shell">
        <div className="admin-hero">
          <div>
            <p className="section-eyebrow">Review Admin</p>
            <h1 id="admin-title">리뷰 관리자 앱</h1>
            <p>
              네이버 리뷰 캡처를 OCR로 읽고, 리뷰 사진을 함께 올린 뒤 홈페이지 슬라이드에
              반영합니다.
            </p>
          </div>
          <a className="admin-secondary-button" href="#home">
            홈페이지 보기
          </a>
        </div>

        {!session ? (
          <AdminLogin
            authForm={authForm}
            authStatus={authStatus}
            isSigningIn={isSigningIn}
            onChange={handleAuthFieldChange}
            onSubmit={handleSignIn}
          />
        ) : (
          <>
            <div className="admin-card admin-session-card">
              <div>
                <span>로그인 계정</span>
                <strong>{userEmail}</strong>
                {adminStatus.isChecking ? <p>관리자 권한 확인 중입니다.</p> : null}
                {adminStatus.error ? <p>{adminStatus.error}</p> : null}
              </div>
              <button className="admin-secondary-button" type="button" onClick={handleSignOut}>
                로그아웃
              </button>
            </div>

            {canManageReviews ? (
              <>
                <form className="admin-grid" onSubmit={handleSubmitReview}>
                  <div className="admin-card admin-form-card">
                    <p className="section-eyebrow">Review</p>
                    <h2>리뷰 내용</h2>
                    <label>
                      작성자 표시명
                      <input name="author" value={form.author} onChange={handleFormChange} required />
                    </label>
                    <div className="admin-inline-fields">
                      <label>
                        별점
                        <select name="rating" value={form.rating} onChange={handleFormChange}>
                          {ratingOptions.map((rating) => (
                            <option key={rating} value={rating}>
                              {makeStarLabel(rating)} {rating}점
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        리뷰 날짜
                        <input name="time" type="date" value={form.time} onChange={handleFormChange} />
                      </label>
                    </div>
                    <label>
                      출처 URL
                      <input
                        inputMode="url"
                        name="sourceUrl"
                        value={form.sourceUrl}
                        onChange={handleFormChange}
                      />
                    </label>
                    <label>
                      리뷰 문구
                      <textarea
                        name="text"
                        rows="7"
                        value={form.text}
                        onChange={handleFormChange}
                        placeholder="OCR 결과를 확인한 뒤 실제 리뷰 문구만 남기세요."
                        required
                      />
                    </label>
                    <label className="admin-checkbox">
                      <input
                        checked={form.isPublished}
                        name="isPublished"
                        type="checkbox"
                        onChange={handleFormChange}
                      />
                      저장 즉시 홈페이지에 공개
                    </label>
                  </div>

                  <div className="admin-card admin-upload-card">
                    <p className="section-eyebrow">OCR</p>
                    <h2>캡처 읽기</h2>
                    <p>
                      네이버 리뷰 화면 전체 캡처는 여기에 넣으세요. 이 이미지는 홈페이지에 표시하지
                      않고 글자만 읽습니다.
                    </p>
                    <label>
                      앨범/캡처에서 선택
                      <input
                        accept="image/*"
                        type="file"
                        onChange={handleOcrFileChange}
                      />
                    </label>
                    <label>
                      카메라로 촬영
                      <input
                        accept="image/*"
                        capture="environment"
                        type="file"
                        onChange={handleOcrFileChange}
                      />
                    </label>
                    <button
                      className="admin-secondary-button"
                      disabled={isReadingOcr}
                      type="button"
                      onClick={() => handleReadOcr()}
                    >
                      {isReadingOcr ? "자동 입력 중" : "다시 읽기"}
                    </button>
                    {ocrStatus ? <p className="admin-status-text">{ocrStatus}</p> : null}
                    {ocrText ? (
                      <div className="admin-ocr-result">
                        <strong>OCR 결과</strong>
                        <pre>{ocrText}</pre>
                        <button className="admin-secondary-button" type="button" onClick={handleUseOcrText}>
                          본문에 넣기
                        </button>
                      </div>
                    ) : null}
                  </div>

                  <div className="admin-card admin-upload-card">
                    <p className="section-eyebrow">Photos</p>
                    <h2>리뷰 사진</h2>
                    <p>
                      홈페이지에 보일 음식 사진만 올리세요. 네이버 화면 전체 캡처를 여기에 넣으면
                      홈페이지에도 캡처가 보입니다.
                    </p>
                    <label>
                      음식 사진 선택
                      <input accept="image/*" multiple type="file" onChange={handlePhotoChange} />
                    </label>
                    <label>
                      카메라로 음식 사진 촬영
                      <input
                        accept="image/*"
                        capture="environment"
                        type="file"
                        onChange={handleCapturePhotoChange}
                      />
                    </label>
                    <FilePreviewGrid previews={photoPreviews} />
                  </div>

                  <div className="admin-card admin-submit-card">
                    <button className="admin-primary-button" disabled={isSubmitting} type="submit">
                      {isSubmitting ? "저장 중" : "리뷰 저장"}
                    </button>
                    <button className="admin-secondary-button" type="button" onClick={resetForm}>
                      입력 초기화
                    </button>
                    {submitStatus ? <p className="admin-status-text">{submitStatus}</p> : null}
                  </div>
                </form>

                <section className="admin-card admin-review-list" aria-labelledby="admin-list-title">
                  <div className="admin-list-header">
                    <div>
                      <p className="section-eyebrow">Published Data</p>
                      <h2 id="admin-list-title">등록된 리뷰</h2>
                    </div>
                    <button className="admin-secondary-button" type="button" onClick={loadAdminReviews}>
                      새로고침
                    </button>
                  </div>
                  {listStatus ? <p className="admin-status-text">{listStatus}</p> : null}
                  <div className="admin-review-items">
                    {reviews.map((review) => (
                      <article key={review.id} className="admin-review-item">
                        <div>
                          <div className="admin-review-meta">
                            <strong>{review.author}</strong>
                            <span>{review.label ?? makeStarLabel(review.rating ?? 5)}</span>
                            <em>{review.is_published ? "공개" : "비공개"}</em>
                          </div>
                          <p>{review.text}</p>
                          {Array.isArray(review.image_urls) && review.image_urls.length > 0 ? (
                            <div className="admin-review-photo-row">
                              {review.image_urls.slice(0, 4).map((url) => (
                                <img key={url} src={url} alt={`${review.author} 리뷰 사진`} />
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <div className="admin-review-actions">
                          <button
                            className="admin-secondary-button"
                            type="button"
                            onClick={() => handleTogglePublished(review)}
                          >
                            {review.is_published ? "비공개" : "공개"}
                          </button>
                          <button
                            className="admin-danger-button"
                            type="button"
                            onClick={() => handleDeleteReview(review)}
                          >
                            삭제
                          </button>
                        </div>
                      </article>
                    ))}
                    {reviews.length === 0 && !listStatus ? <p>아직 등록된 리뷰가 없습니다.</p> : null}
                  </div>
                </section>
              </>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
