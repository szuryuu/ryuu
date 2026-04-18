import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  setHeader(
    event,
    "Cache-Control",
    "public, s-maxage=30, stale-while-revalidate=60",
  );

  const client = await serverSupabaseClient(event);

  const { data, error } = await client
    .from("guestbook")
    .select("id, name, message, avatar_url, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch guestbook entries",
    });
  }

  return data || [];
});
