-- Remove only the temporary review row created during admin boundary verification.
-- This does not touch real customer reviews or uploaded review photos.

delete from public.homepage_reviews
where author = '보안테스트**21'
  and text = '관리자 Edge Function 저장 삭제 검증용 비공개 테스트 리뷰입니다.';
