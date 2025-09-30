export interface SurgeSMSParams {
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  message: string;
}

export const sendSurgeSMS = async ({
  phoneNumber,
  firstName,
  lastName,
  message,
}: SurgeSMSParams): Promise<boolean> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase configuration not found");
    return false;
  }

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/send-sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        phoneNumber,
        firstName,
        lastName,
        message,
      }),
    });

    if (!response.ok) {
      console.error("SMS Edge Function failed:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("SMS error:", error);
    return false;
  }
};