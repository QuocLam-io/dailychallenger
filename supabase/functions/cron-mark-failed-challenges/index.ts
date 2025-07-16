import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("PROJECT_URL")!,
    Deno.env.get("SERVICE_ROLE_KEY")!
  );

  const now = new Date().toISOString();

  const { error } = await supabase
    .from("challenge_logs")
    .update({
      is_failed: true,
      failed_at: supabase.fn.cast("deadline", "timestamptz"),
    })
    .lte("deadline", now)
    .eq("completed", false)
    .eq("is_failed", false);

  if (error) {
    console.error("Failed to update challenge logs:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Marked failed challenge logs" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});