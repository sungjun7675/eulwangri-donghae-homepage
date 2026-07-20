import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.7";

const REVIEW_PHOTO_BUCKET = "review-photos";
const MAX_REVIEW_PHOTOS = 8;
const MAX_REVIEW_TEXT_LENGTH = 1200;
const MAX_REVIEW_AUTHOR_LENGTH = 40;
const MAX_REVIEW_TIME_LENGTH = 40;
const MAX_SOURCE_URL_LENGTH = 500;
const SIGNED_URL_EXPIRES_IN_SECONDS = 60 * 60;
const ALLOWED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif"]);
const ACTION_LIMITS = {
  createReview: { limit: 20, windowSeconds: 60 * 60 },
  togglePublished: { limit: 120, windowSeconds: 60 * 60 },
  deleteReview: { limit: 30, windowSeconds: 60 * 60 },
  signedPhotoUrls: { limit: 240, windowSeconds: 60 * 60 },
};

const defaultAllowedOrigins = [
  "https://sungjun7675.github.io",
  "http://localhost:5173",
  "http://localhost:4173",
];

const getAllowedOrigins = () =>
  (Deno.env.get("ALLOWED_ADMIN_ORIGINS") ?? defaultAllowedOrigins.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigins = getAllowedOrigins();
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
};

const json = (status: number, body: Record<string, unknown>, origin: string | null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(origin),
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });

const sanitizeSingleLine = (value: unknown, maxLength: number) =>
  String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

const sanitizeReviewText = (value: unknown) =>
  String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, MAX_REVIEW_TEXT_LENGTH);

const normalizeSourceUrl = (value: unknown) => {
  const trimmed = sanitizeSingleLine(value, MAX_SOURCE_URL_LENGTH);

  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    return ["http:", "https:"].includes(url.protocol) ? url.href.slice(0, MAX_SOURCE_URL_LENGTH) : null;
  } catch {
    return null;
  }
};

const isUuid = (value: unknown) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value ?? ""),
  );

const isSafeReviewPath = (path: string) => {
  if (path.length > 220 || path.includes("..") || path.startsWith("/") || !path.includes("/")) {
    return false;
  }

  const extension = path.split(".").pop()?.toLowerCase() ?? "";
  return ALLOWED_IMAGE_EXTENSIONS.has(extension);
};

const normalizeImagePaths = (value: unknown, userId: string, requireOwnerPath = false) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .map((path) => sanitizeSingleLine(path, 220))
        .filter((path) => isSafeReviewPath(path))
        .filter((path) => !requireOwnerPath || path.startsWith(`${userId}/`)),
    ),
  ).slice(0, MAX_REVIEW_PHOTOS);
};

const normalizeImageHashes = (value: unknown, count: number) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((hash) => sanitizeSingleLine(hash, 64).toLowerCase())
    .filter((hash) => /^[a-f0-9]{64}$/.test(hash))
    .slice(0, count);
};

const hashText = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const getRequestKey = async (request: Request, userId: string, action: string) => {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  const ipHash = forwardedFor ? await hashText(forwardedFor.split(",")[0].trim()) : "no-ip";
  return `admin-review:${action}:${userId}:${ipHash.slice(0, 24)}`;
};

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");

  if (origin && !getAllowedOrigins().includes(origin)) {
    return json(403, { ok: false, message: "허용되지 않은 요청 출처입니다." }, origin);
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: getCorsHeaders(origin) });
  }

  if (request.method !== "POST") {
    return json(405, { ok: false, message: "허용되지 않은 요청 방식입니다." }, origin);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return json(500, { ok: false, message: "관리자 서버 설정을 확인해야 합니다." }, origin);
  }

  const authHeader = request.headers.get("authorization") ?? "";

  if (!authHeader.startsWith("Bearer ")) {
    return json(401, { ok: false, message: "로그인이 필요합니다." }, origin);
  }

  let body: { action?: keyof typeof ACTION_LIMITS; payload?: Record<string, unknown> };

  try {
    const rawBody = await request.text();
    if (rawBody.length > 32_000) {
      return json(413, { ok: false, message: "요청 데이터가 너무 큽니다." }, origin);
    }
    body = JSON.parse(rawBody);
  } catch {
    return json(400, { ok: false, message: "요청 형식이 올바르지 않습니다." }, origin);
  }

  const action = body.action;
  const payload = body.payload ?? {};

  if (!action || !(action in ACTION_LIMITS)) {
    return json(400, { ok: false, message: "지원하지 않는 관리자 작업입니다." }, origin);
  }

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: authHeader } },
  });
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user?.id || !user.email) {
    return json(401, { ok: false, message: "유효한 로그인 세션이 아닙니다." }, origin);
  }

  const { data: admin, error: adminError } = await adminClient
    .from("homepage_admins")
    .select("email, is_active")
    .ilike("email", user.email)
    .eq("is_active", true)
    .maybeSingle();

  if (adminError || !admin) {
    return json(403, { ok: false, message: "관리자 권한이 필요합니다." }, origin);
  }

  const rateLimit = ACTION_LIMITS[action];
  const rateKey = await getRequestKey(request, user.id, action);
  const { data: limitRows, error: rateError } = await adminClient.rpc("homepage_take_rate_limit", {
    p_key: rateKey,
    p_limit: rateLimit.limit,
    p_window_seconds: rateLimit.windowSeconds,
  });
  const limitState = Array.isArray(limitRows) ? limitRows[0] : limitRows;

  if (rateError || !limitState?.allowed) {
    return json(429, { ok: false, message: "요청이 많습니다. 잠시 후 다시 시도하세요." }, origin);
  }

  await adminClient
    .from("homepage_admins")
    .update({ last_seen_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .ilike("email", user.email);

  if (action === "signedPhotoUrls") {
    const imagePaths = normalizeImagePaths(payload.paths, user.id);
    const signedUrls = [];

    for (const path of imagePaths) {
      const { data, error } = await adminClient.storage
        .from(REVIEW_PHOTO_BUCKET)
        .createSignedUrl(path, SIGNED_URL_EXPIRES_IN_SECONDS);

      if (!error && data?.signedUrl) {
        signedUrls.push(data.signedUrl);
      }
    }

    return json(200, { ok: true, data: { signedUrls } }, origin);
  }

  if (action === "createReview") {
    const author = sanitizeSingleLine(payload.author, MAX_REVIEW_AUTHOR_LENGTH);
    const text = sanitizeReviewText(payload.text);
    const rating = Number(payload.rating);
    const imagePaths = normalizeImagePaths(payload.imagePaths, user.id, true);
    const imageHashes = normalizeImageHashes(payload.imageHashes, imagePaths.length);

    if (!author || !text || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return json(400, { ok: false, message: "리뷰 입력값을 확인하세요." }, origin);
    }

    const { data: review, error: createError } = await adminClient
      .from("homepage_reviews")
      .insert({
        author,
        label: sanitizeSingleLine(payload.label, 10) || `${"★".repeat(rating)}${"☆".repeat(5 - rating)}`,
        text,
        time: sanitizeSingleLine(payload.time, MAX_REVIEW_TIME_LENGTH) || null,
        rating,
        is_published: Boolean(payload.isPublished),
        source_type: "naver",
        source_url: normalizeSourceUrl(payload.sourceUrl),
        image_urls: [],
        image_paths: imagePaths,
        image_hashes: imageHashes,
      })
      .select("id")
      .single();

    if (createError || !review?.id) {
      return json(500, { ok: false, message: "리뷰를 저장하지 못했습니다." }, origin);
    }

    if (imagePaths.length > 0) {
      await adminClient.from("homepage_review_audit_logs").insert({
        action: "review_photo_upload",
        review_id: review.id,
        actor_user_id: user.id,
        metadata: { image_count: imagePaths.length },
      });
    }

    await adminClient.from("homepage_review_audit_logs").insert({
      action: "review_create",
      review_id: review.id,
      actor_user_id: user.id,
      metadata: {
        is_published: Boolean(payload.isPublished),
        image_count: imagePaths.length,
        has_source_url: Boolean(normalizeSourceUrl(payload.sourceUrl)),
      },
    });

    return json(200, { ok: true, data: { id: review.id } }, origin);
  }

  if (action === "togglePublished") {
    const reviewId = sanitizeSingleLine(payload.id, 80);
    const nextPublished = Boolean(payload.isPublished);

    if (!isUuid(reviewId)) {
      return json(400, { ok: false, message: "리뷰 ID를 확인하세요." }, origin);
    }

    const { error } = await adminClient
      .from("homepage_reviews")
      .update({ is_published: nextPublished })
      .eq("id", reviewId);

    if (error) {
      return json(500, { ok: false, message: "공개 상태를 변경하지 못했습니다." }, origin);
    }

    await adminClient.from("homepage_review_audit_logs").insert({
      action: "review_publish_toggle",
      review_id: reviewId,
      actor_user_id: user.id,
      metadata: { is_published: nextPublished },
    });

    return json(200, { ok: true, data: { id: reviewId } }, origin);
  }

  if (action === "deleteReview") {
    const reviewId = sanitizeSingleLine(payload.id, 80);

    if (!isUuid(reviewId)) {
      return json(400, { ok: false, message: "리뷰 ID를 확인하세요." }, origin);
    }

    const { error } = await adminClient.from("homepage_reviews").delete().eq("id", reviewId);

    if (error) {
      return json(500, { ok: false, message: "리뷰를 삭제하지 못했습니다." }, origin);
    }

    await adminClient.from("homepage_review_audit_logs").insert({
      action: "review_delete",
      review_id: reviewId,
      actor_user_id: user.id,
      metadata: {
        was_published: Boolean(payload.wasPublished),
        image_count: Number(payload.imageCount) || 0,
      },
    });

    return json(200, { ok: true, data: { id: reviewId } }, origin);
  }

  return json(400, { ok: false, message: "지원하지 않는 관리자 작업입니다." }, origin);
});
