const User = require("../models/User");

const createAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@quickstay.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminName = process.env.ADMIN_NAME || "Admin User";

  try {
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        isAdmin: true,
      });
      console.log(`Admin user created: ${adminEmail}`);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }
  } catch (error) {
    console.error("Admin user creation failed:", error.message);
  }
};

module.exports = createAdminUser;
