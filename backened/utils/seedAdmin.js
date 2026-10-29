
import Admin from "../models/Admin.js";

export const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!email || !passwordHash) {
    throw new Error("Admin environment variables are missing");
  }

  if (!/^\$2[aby]\$\d{2}\$/.test(passwordHash)) {
    throw new Error("ADMIN_PASSWORD_HASH must be a bcrypt hash");
  }

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    console.log("Admin account already exists.");
    return;
  }

  await Admin.create({
    name: "Admin",
    email,
    password: passwordHash,
    role: "admin",
  });

  console.log("Initial admin created.");
};
