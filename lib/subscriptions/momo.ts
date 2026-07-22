/**
 * MTN MoMo via RazPay (https://razpay.razonetix.com/docs).
 * RazPay fronts the MTN Collections API — we never talk to MTN directly.
 */

export type MomoStatus = "PENDING" | "SUCCESSFUL" | "FAILED" | "TIMEOUT";

const RAZPAY_BASE_URL =
  process.env.RAZPAY_BASE_URL || "https://api.razpay.razonetix.com/v1";
const RAZPAY_API_KEY = process.env.RAZPAY_API_KEY;

type RazPayEnvelope<T> = { success: boolean; message: string; data: T };

type RazPayTransaction = {
  external_reference: string;
  provider_id: string;
  provider_ref: string;
  amount: number;
  currency: string;
  status: "pending" | "successful" | "failed";
  payer_phone: string;
  description?: string;
  metadata?: Record<string, unknown> | null;
  financial_tx_id?: string;
  failure_reason?: string;
  created_at: number;
  updated_at: number;
};

async function razpayRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<RazPayEnvelope<T>> {
  if (!RAZPAY_API_KEY) throw new Error("RAZPAY_API_KEY is not configured");

  const res = await fetch(`${RAZPAY_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${RAZPAY_API_KEY}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = (await res.json()) as RazPayEnvelope<T>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || `RazPay request failed (${res.status})`);
  }
  return body;
}

function toMomoStatus(status: RazPayTransaction["status"]): MomoStatus {
  if (status === "successful") return "SUCCESSFUL";
  if (status === "failed") return "FAILED";
  return "PENDING";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function normalizeMomoMsisdn(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("268") && digits.length === 11) return digits;
  if (digits.length === 8 && digits.startsWith("7")) return `268${digits}`;
  return digits;
}

export function isValidMtnMsisdn(raw: string): boolean {
  const msisdn = normalizeMomoMsisdn(raw);
  return /^2687[6-8]\d{6}$/.test(msisdn);
}

export function newPaymentReference(): string {
  return `MOMO-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

/**
 * INITIATE — POST /payments/collect (sends the MTN Request-to-Pay prompt).
 * `reference` becomes RazPay's external_reference, our own idempotency key —
 * retrying with the same one returns the original transaction instead of
 * double-charging.
 */
export async function momoInitiateRequestToPay(input: {
  msisdn: string;
  amountSzl: number;
  externalId: string;
  description: string;
  reference?: string;
}): Promise<{
  ok: boolean;
  reference: string;
  status: MomoStatus;
  raw?: unknown;
}> {
  const reference = input.reference || newPaymentReference();
  const msisdn = normalizeMomoMsisdn(input.msisdn);

  if (!isValidMtnMsisdn(msisdn)) {
    return { ok: false, reference, status: "FAILED" };
  }

  try {
    const { data } = await razpayRequest<RazPayTransaction>(
      "/payments/collect",
      {
        method: "POST",
        body: JSON.stringify({
          external_reference: reference,
          provider: "momo",
          amount: input.amountSzl,
          currency: "SZL",
          phone_number: `+${msisdn}`,
          description: input.description.slice(0, 100),
          metadata: { external_id: input.externalId },
        }),
      },
    );

    return {
      ok: data.status !== "failed",
      reference: data.external_reference,
      status: toMomoStatus(data.status),
      raw: data,
    };
  } catch (err) {
    console.error("momoInitiateRequestToPay:", err);
    return {
      ok: false,
      reference,
      status: "FAILED",
      raw: { error: err instanceof Error ? err.message : String(err) },
    };
  }
}

/**
 * APPROVE — RazPay has no separate "approve" call; the payer confirms on
 * their handset. We re-check status once (RazPay polls MTN itself when the
 * transaction is still pending) so a fast decline surfaces immediately.
 */
export async function momoSimulateApproval(input: {
  reference: string;
  approve: boolean;
}): Promise<{ ok: boolean; status: MomoStatus; raw?: unknown }> {
  if (!input.approve) {
    return { ok: false, status: "FAILED", raw: { declined: true } };
  }

  try {
    const { data } = await razpayRequest<RazPayTransaction>(
      `/payments/${encodeURIComponent(input.reference)}`,
    );
    return {
      ok: data.status !== "failed",
      status: toMomoStatus(data.status),
      raw: data,
    };
  } catch (err) {
    console.error("momoSimulateApproval:", err);
    return {
      ok: false,
      status: "FAILED",
      raw: { error: err instanceof Error ? err.message : String(err) },
    };
  }
}

/**
 * VALIDATE — GET /payments/:reference. MTN prompts aren't instant, so this
 * polls a few times (~9s total) giving a fast approval a real chance to land
 * before handing back PENDING for the caller to re-check later.
 */
export async function momoValidatePayment(input: {
  reference: string;
}): Promise<{ ok: boolean; status: MomoStatus; raw?: unknown }> {
  const attempts = 4;
  const delayMs = 3000;

  let last: { ok: boolean; status: MomoStatus; raw?: unknown } = {
    ok: false,
    status: "PENDING",
  };

  for (let i = 0; i < attempts; i++) {
    try {
      const { data } = await razpayRequest<RazPayTransaction>(
        `/payments/${encodeURIComponent(input.reference)}`,
      );
      last = {
        ok: data.status === "successful",
        status: toMomoStatus(data.status),
        raw: data,
      };
      if (data.status !== "pending") return last;
    } catch (err) {
      console.error("momoValidatePayment:", err);
      return {
        ok: false,
        status: "FAILED",
        raw: { error: err instanceof Error ? err.message : String(err) },
      };
    }

    if (i < attempts - 1) await sleep(delayMs);
  }

  return last;
}
