# 리뷰 운영 절차

이 프로젝트는 네이버 플레이스 리뷰를 임의로 크롤링하지 않습니다. 홈페이지에는 운영자가 사용 가능 여부를 확인한 실제 공개 리뷰 또는 고객이 제공한 리뷰만 등록합니다.

## 1. Supabase 마이그레이션 확인

Supabase SQL Editor에서 아래 마이그레이션 파일을 순서대로 실행합니다.

```text
supabase/migrations/20260719123000_create_homepage_reviews.sql
supabase/migrations/20260719130500_add_review_source_fields.sql
supabase/migrations/20260720001000_add_admin_reviews_and_photos.sql
```

세 번째 마이그레이션은 관리자 앱 권한, 리뷰 사진 저장 버킷, `image_urls` 컬럼을 만듭니다.

## 2. 관리자 계정 준비

1. Supabase Dashboard에서 `Authentication > Users`로 이동합니다.
2. `Add user` 또는 `Invite user`로 관리자 이메일 계정을 만듭니다.
3. 기본 허용 이메일은 `tjdrhkde@gmail.com`입니다.
4. 다른 이메일을 쓸 경우 세 번째 마이그레이션의 `homepage_admins` insert 이메일을 바꿔 실행하거나, 아래 SQL을 추가 실행합니다.

```sql
insert into public.homepage_admins (email)
values ('관리자이메일@example.com')
on conflict (email) do nothing;
```

## 3. 관리자 앱 사용

배포 후 아래 주소로 접속합니다.

```text
https://sungjun7675.github.io/eulwangri-donghae-homepage/#admin
```

폰에서는 브라우저 메뉴에서 홈 화면에 추가하면 앱처럼 열 수 있습니다.

- 리뷰 캡처 이미지는 OCR로 읽어 본문 입력을 보조합니다.
- OCR 결과는 반드시 사람이 확인한 뒤 저장합니다.
- 리뷰 작성자가 올린 음식 사진은 `리뷰 사진` 입력에서 여러 장 선택할 수 있습니다.
- 공개 상태로 저장하면 홈페이지 리뷰 슬라이더에 표시됩니다.

## 4. SQL로 직접 리뷰 등록

검증된 리뷰만 아래 형식으로 등록합니다. `is_published`가 `true`인 최신 20개 리뷰가 홈페이지 슬라이더에 표시됩니다.

```sql
insert into public.homepage_reviews
  (author, label, text, time, rating, source_type, source_url, image_urls, is_published)
values
  (
    '작성자명',
    '★★★★★',
    '실제 리뷰 문구',
    '2026-07-19',
    5,
    'naver',
    '리뷰 확인 URL',
    array['https://사진주소.example/review.jpg'],
    true
  );
```

## 5. 자동 반영 방식

- 페이지 첫 진입 시 Supabase를 즉시 조회합니다.
- 접속 중에는 24시간마다 다시 조회합니다.
- 새 리뷰가 바로 보이지 않으면 브라우저 새로고침으로 즉시 확인할 수 있습니다.

## 6. 금지 기준

- 확인하지 않은 네이버 평점, 리뷰 수, 순위 문구를 실제 정보처럼 넣지 않습니다.
- 블로그/방문자 리뷰를 출처 없이 복사하지 않습니다.
- `source_url` 없이 등록해야 하는 경우 내부적으로 사용 허가를 받은 리뷰인지 먼저 확인합니다.
