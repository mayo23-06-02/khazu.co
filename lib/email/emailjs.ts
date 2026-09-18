// Server-side EmailJS sender. Uses EmailJS's REST API directly (no browser
// SDK) so the private key never reaches the client — sends only ever happen
// from server actions.
const EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send";

export async function sendEmailJs(templateParams: Record<string, string>) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    throw new Error(
      "Missing EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY or EMAILJS_PRIVATE_KEY",
    );
  }

  const res = await fetch(EMAILJS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: templateParams,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`EmailJS send failed (${res.status}): ${body}`);
  }
}

export async function sendVerificationEmail(email: string, code: string) {
  await sendEmailJs({
    to_email: email,
    code,
  });
}
