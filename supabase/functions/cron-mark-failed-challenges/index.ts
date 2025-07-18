import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("PROJECT_URL")!,
    Deno.env.get("SERVICE_ROLE_KEY")!
  );

  const now = new Date().toISOString();

  const { data, error: selectError } = await supabase
    .from("challenge_logs")
    .select("id, deadline")
    .lte("deadline", now)
    .eq("completed", false)
    .eq("is_failed", false);

  if (selectError) {
    console.error("Select error:", selectError);
    return new Response(JSON.stringify({ error: selectError.message }), { status: 500 });
  }

  for (const row of data) {
    const { error: updateError } = await supabase
      .from("challenge_logs")
      .update({
        is_failed: true,
        failed_at: row.deadline, 
      })
      .eq("id", row.id);

    if (updateError) {
      console.error(`Update failed for row ${row.id}:`, updateError);
    }
  }

  return new Response(JSON.stringify({ message: "Marked failed challenge logs" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});