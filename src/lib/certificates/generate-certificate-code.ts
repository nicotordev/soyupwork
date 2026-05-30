const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_SUFFIX_LENGTH = 6;
const MAX_ATTEMPTS = 3;

function randomSuffix(): string {
  let suffix = "";
  for (let i = 0; i < CODE_SUFFIX_LENGTH; i += 1) {
    const index = Math.floor(Math.random() * CODE_ALPHABET.length);
    suffix += CODE_ALPHABET[index];
  }
  return suffix;
}

export function buildCertificateCode(date = new Date()): string {
  const year = date.getUTCFullYear();
  return `SOYUP-${year}-${randomSuffix()}`;
}

export function getCertificateCodeGenerationAttempts(): number {
  return MAX_ATTEMPTS;
}
