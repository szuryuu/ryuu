import { serverSupabaseClient } from "#supabase/server";

// Fetches the latest 100 guestbook entries including avatar URLs from the database.
export default defineEventHandler(async (event) => {
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
