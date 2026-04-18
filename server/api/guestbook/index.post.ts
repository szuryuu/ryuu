import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (authError || !user || !user.id) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized. Invalid user session.",
    });
  }

  const body = await readBody(event);
  const message = body.message?.trim();

  if (!message || message.length > GUESTBOOK_MAX_MESSAGE_LENGTH) {
    throw createError({ statusCode: 400, message: "Invalid message length." });
  }

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.user_name ||
    "Anonymous";
  const avatarUrl = user.user_metadata?.avatar_url || "";

  const { data, error } = await client
    .from("guestbook")
    .insert([
      {
        user_id: user.id,
        name,
        message,
        avatar_url: avatarUrl,
      },
    ])
    .select()
    .single();

  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
