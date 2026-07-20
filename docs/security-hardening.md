# 보안 격상 운영 메모

## 현재 보안 경계

- 배포: GitHub Pages 정적 배포
- 앱: Vite React SPA
- 관리자 인증: Supabase Auth
- 관리자 권한: `homepage_admins` RLS + `is_homepage_admin()` 함수
- 파일 저장: Supabase Storage `review-photos`
- 고객 화면: Supabase 리뷰 자동 노출 없음

## 반드시 실행할 Supabase 마이그레이션

기존 세 개 마이그레이션 이후 아래 파일을 SQL Editor에서 실행해야 보안 격상 DB 정책이 적용됩니다.

```text
supabase/migrations/20260720223000_harden_admin_reviews_security.sql
```

적용 내용:

- `review-photos` 버킷을 private로 전환
- 관리자만 signed URL로 사진을 확인하도록 storage RLS 강화
- 업로드 경로를 `auth.uid()` 하위로 제한
- 리뷰 입력 길이, 출처 URL, source type DB 제약 추가
- `homepage_review_audit_logs` 감사 로그 테이블 추가
- 새 업로드는 `image_paths`, `image_hashes`에 저장
- 기존 `image_urls` 데이터는 legacy로 보존

## GitHub Pages 보안 헤더 한계

GitHub Pages는 프로젝트에서 임의 HTTP response header를 직접 설정할 수 없습니다.

현재 코드에서 적용한 대체/보강:

- `index.html` CSP meta
- `referrer` meta
- 서비스워커 navigation 캐시 회피
- Supabase 응답은 cross-origin이라 서비스워커 캐시에 저장하지 않음

아래 항목은 도메인 앞단에 Cloudflare, Netlify, Vercel, Nginx 같은 프록시를 붙일 때 HTTP header로 적용해야 합니다.

```text
Content-Security-Policy
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cache-Control: no-store
```

단, 관리자 앱에서 카메라 업로드를 계속 사용할 경우 `Permissions-Policy`의 `camera`는 관리자 경로 정책과 함께 별도 설계가 필요합니다.

## 검증 명령어

```bash
npm run security:check
npm audit --audit-level=moderate
npm run build
```
