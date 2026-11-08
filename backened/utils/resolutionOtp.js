import { createHmac, randomInt } from "crypto";

export const generateResolutionOtp = () =>
  String(randomInt(100000, 1000000));

export const hashResolutionOtp = (complaintId, code) => {
  const secret = process.env.OTP_HASH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("OTP hashing is not configured.");
  }

  return createHmac("sha256", secret)
    .update(`${complaintId}:${code}`)
    .digest("hex");
};
