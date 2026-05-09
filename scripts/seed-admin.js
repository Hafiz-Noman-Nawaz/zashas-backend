import bcrypt from "bcryptjs";

import { connectDatabase } from "../src/config/db.js";
import User from "../src/models/user.model.js";

const parseArgs = () => {
  const args = process.argv.slice(2);
  const getValue = (name) => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : undefined;
  };

  return {
    name: getValue("--name"),
    email: getValue("--email"),
    password: getValue("--password"),
    role: getValue("--role") || "admin"
  };
};

const seedAdmin = async () => {
  const { name, email, password, role } = parseArgs();

  if (!name || !email || !password) {
    throw new Error(
      "Missing required args: --name <name> --email <email> --password <password>"
    );
  }

  await connectDatabase();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log("Admin already exists");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    isActive: true
  });

  console.log("Admin created successfully");
};

seedAdmin()
  .catch((err) => {
    console.error("Failed to seed admin", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await import("mongoose").then((mongoose) => mongoose.default.disconnect());
  });
