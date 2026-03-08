
-- Allow authenticated users to read all profiles (for reviewer names/avatars)
CREATE POLICY "Anyone can read profile metadata"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Drop the old restrictive select policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Fix search_shops to filter by minimum rating
CREATE OR REPLACE FUNCTION public.search_shops(
  search_query text DEFAULT '',
  filter_categories text[] DEFAULT '{}',
  filter_min_rating numeric DEFAULT 0,
  sort_by text DEFAULT 'name',
  result_limit integer DEFAULT 50,
  result_offset integer DEFAULT 0
)
RETURNS SETOF shops
LANGUAGE plpgsql
STABLE
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT s.*
  FROM public.shops s
  WHERE s.is_active = true
    AND (
      search_query = ''
      OR s.name ILIKE '%' || search_query || '%'
      OR s.category ILIKE '%' || search_query || '%'
      OR s.address ILIKE '%' || search_query || '%'
      OR s.description ILIKE '%' || search_query || '%'
      OR EXISTS (
        SELECT 1 FROM unnest(s.tags) AS t WHERE t ILIKE '%' || search_query || '%'
      )
    )
    AND (
      array_length(filter_categories, 1) IS NULL
      OR s.category = ANY(filter_categories)
    )
    AND (
      filter_min_rating <= 0
      OR (
        SELECT COALESCE(AVG(r.rating), 0)
        FROM public.shop_reviews r
        WHERE r.shop_id = s.id
      ) >= filter_min_rating
    )
  ORDER BY
    CASE WHEN sort_by = 'name' THEN s.name END ASC,
    CASE WHEN sort_by = 'newest' THEN s.created_at END DESC
  LIMIT result_limit
  OFFSET result_offset;
END;
$function$;
