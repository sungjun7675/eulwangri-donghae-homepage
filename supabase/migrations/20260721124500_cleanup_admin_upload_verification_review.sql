-- Remove only the temporary review row created during upload verification.
-- Supabase blocks direct SQL deletion from storage.objects; referenced test objects remain private.
-- This is scoped by exact test author/text only.

with deleted_reviews as (
  delete from public.homepage_reviews
  where author = '업로드테스트**21'
    and text = '관리자 Edge Function 사진 업로드 저장 검증용 비공개 테스트 리뷰입니다.'
  returning cardinality(image_paths) as private_object_count
)
select
  count(*) as deleted_reviews,
  coalesce(sum(private_object_count), 0) as preserved_private_storage_objects
from deleted_reviews;
