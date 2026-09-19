export type AllowedFileType = "jpeg" | "png" | "webp" | "pdf";

const SIGNATURE_CHECKS: Record<AllowedFileType, (buf: Buffer) => boolean> = {
  jpeg: (buf) => buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff,
  png: (buf) =>
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47,
  webp: (buf) =>
    buf.length >= 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP",
  pdf: (buf) => buf.length >= 5 && buf.toString("ascii", 0, 5) === "%PDF-",
};

/**
 * Verifies a buffer's actual magic bytes match one of `allowedTypes` and its
 * size is under `maxBytes`, rather than trusting the client-supplied
 * `file.type` header (trivially spoofable). This is a backstop alongside —
 * not a replacement for — the Supabase Storage bucket's own
 * file_size_limit/allowed_mime_types config (supabase/media_storage.sql,
 * supabase/schema.sql).
 */
export function validateFile(
  buffer: Buffer,
  allowedTypes: AllowedFileType[],
  maxBytes: number,
): { ok: true } | { ok: false; error: string } {
  if (buffer.length === 0) {
    return { ok: false, error: "File is empty." };
  }
  if (buffer.length > maxBytes) {
    return {
      ok: false,
      error: `File exceeds the ${Math.round(maxBytes / (1024 * 1024))}MB limit.`,
    };
  }
  const matches = allowedTypes.some((type) => SIGNATURE_CHECKS[type](buffer));
  if (!matches) {
    return { ok: false, error: "Unsupported or invalid file type." };
  }
  return { ok: true };
}
