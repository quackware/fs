const SANITIZE_RE = /\W/g;

export function sanitizeFileName(filename: string) {
  return filename.replaceAll(SANITIZE_RE, "-");
}
