import sha256 from "crypto-js/sha256";
import Base64 from "crypto-js/enc-base64";

export function hashPassword(password: string) {
  const hashDigest = sha256(password);
  return Base64.stringify(hashDigest);
}
