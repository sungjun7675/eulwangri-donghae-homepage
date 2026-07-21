-- Remove only the temporary review and private storage object created during upload verification.
-- This is scoped by exact test author/text and referenced image_paths only.

with target_reviews as (
  select id, image_paths
  from public.homepage_reviews
  where author = '업로드테스트**21'
    and text = '관리자 Edge Function 사진 업로드 저장 검증용 비공개 테스트 리뷰입니다.'
),
target_paths as (
  select unnest(image_paths) as name
  from target_reviews
),
deleted_objects as (
  delete from storage.objects as object
  using target_paths
  where object.bucket_id = 'review-photos'
    and object.name = target_paths.name
  returning object.name
),
deleted_reviews as (
  delete from public.homepage_reviews as review
  using target_reviews
  where review.id = target_reviews.id
  returning review.id
)
select
  (select count(*) from deleted_objects) as deleted_storage_objects,
  (select count(*) from deleted_reviews) as deleted_reviews;
