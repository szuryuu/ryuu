import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

// Submit a guestbook message after authenticating user and validating input.
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  // Check user authentication.
  if (authError || !user || !user.id) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized. Invalid user session.",
    });
  }

  const body = await readBody(event);
  const message = body.message?.trim();

  // Check message length.
  if (!message || message.length > 300) {
    throw createError({ statusCode: 400, message: "Invalid message length." });
  }

  // Get user display name and avatar from OAuth metadata.
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.user_name ||
    "Anonymous";
  const avatar_url = user.user_metadata?.avatar_url || "";

  // Insert guestbook entry into database.
  const { data, error } = await client
    .from("guestbook")
    .insert([
      {
        user_id: user.id,
        name: name,
        message: message,
        avatar_url: avatar_url,
      },
    ])
    .select()
    .single();

  // console.log("Supabase Payload:", {
  //   user_id: user?.id,
  //   name,
  //   message,
  //   avatar_url,
  // });

  // Handle database insertion error.
  if (error) {
    throw createError({ statusCode: 500, message: error.message });
  }

  return data;
});
