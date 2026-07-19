# 리뷰 운영 절차

이 프로젝트는 네이버 플레이스 리뷰를 임의로 크롤링하지 않습니다. 홈페이지에는 운영자가 사용 가능 여부를 확인한 실제 공개 리뷰 또는 고객이 제공한 리뷰만 등록합니다.

## 1. Supabase 마이그레이션 확인

Supabase SQL Editor에서 아래 마이그레이션 파일을 순서대로 실행합니다.

```text
supabase/migrations/20260719123000_create_homepage_reviews.sql
supabase/migrations/20260719130500_add_review_source_fields.sql
```

## 2. 실제 리뷰 등록

검증된 리뷰만 아래 형식으로 등록합니다. `is_published`가 `true`인 최신 20개 리뷰가 홈페이지 슬라이더에 표시됩니다.

```sql
insert into public.homepage_reviews
  (author, label, text, time, rating, source_type, source_url, is_published)
values
  ('작성자명', '★★★★★', '실제 리뷰 문구', '2026-07-19', 5, 'naver', '리뷰 확인 URL', true);
```

## 3. 자동 반영 방식

- 페이지 첫 진입 시 Supabase를 즉시 조회합니다.
- 접속 중에는 24시간마다 다시 조회합니다.
- 새 리뷰가 바로 보이지 않으면 브라우저 새로고침으로 즉시 확인할 수 있습니다.

## 4. 금지 기준

- 확인하지 않은 네이버 평점, 리뷰 수, 순위 문구를 실제 정보처럼 넣지 않습니다.
- 블로그/방문자 리뷰를 출처 없이 복사하지 않습니다.
- `source_url` 없이 등록해야 하는 경우 내부적으로 사용 허가를 받은 리뷰인지 먼저 확인합니다.
