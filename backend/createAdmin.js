const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./src/models/User");

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "admin@test.com";
  const password = "admin123";

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name: "Admin",
    email,
    password: hashedPassword,
    role: "ADMIN",
  });

  console.log("Admin created successfully");
  process.exit();
}

createAdmin();

