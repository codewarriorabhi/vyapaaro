
-- Create a search function for shops with filtering
CREATE OR REPLACE FUNCTION public.search_shops(
  search_query text DEFAULT '',
  filter_categories text[] DEFAULT '{}',
  filter_min_rating numeric DEFAULT 0,
  sort_by text DEFAULT 'name',
  result_limit int DEFAULT 50,
  result_offset int DEFAULT 0
)
RETURNS SETOF public.shops
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = 'public'
AS $$
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
  ORDER BY
    CASE WHEN sort_by = 'name' THEN s.name END ASC,
    CASE WHEN sort_by = 'newest' THEN s.created_at END DESC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$;
