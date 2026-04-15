import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDatabase } from "../config/db.js";
import { User } from "../models/User.js";
import { Role } from "../models/Role.js";
import { ROLES } from "../constants/roles.js";

async function seedUsers() {
  try {
    await connectDatabase();

    const [
      adminRole,
      customerRole,
      managerRole,
      employeeRole,
    ] = await Promise.all([
      Role.findOne({ name: ROLES.ADMIN }),
      Role.findOne({ name: ROLES.CUSTOMER }),
      Role.findOne({ name: ROLES.MANAGER }),
      Role.findOne({ name: ROLES.EMPLOYEE }),
    ]);

    if (!adminRole || !customerRole || !managerRole || !employeeRole) {
      throw new Error("Required roles not found. Seed roles first.");
    }

    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("Password123!", 10);

    await User.insertMany([
      {
        username: "admin1",
        passwordHash,
        roles: [adminRole._id],
        accountStatus: "ACTIVE",
        profile: {
          firstName: "Victoria",
          lastName: "Clark",
          email: "admin1@example.com",
          userType: "INTERNAL",
        }
      },
      {
        username: "customer1",
        passwordHash,
        roles: [customerRole._id],
        accountStatus: "ACTIVE",
        profile: {
          firstName: "Emma",
          lastName: "Watson",
          email: "customer1@example.com",
          userType: "CUSTOMER",
          city: "Toronto",
          country: "Canada"
        }
      },
      {
        username: "manager1",
        passwordHash,
        roles: [managerRole._id],
        accountStatus: "ACTIVE",
        profile: {
          firstName: "Daniel",
          lastName: "Foster",
          email: "manager1@example.com",
          userType: "INTERNAL",
        }
      },
      {
        username: "employee1",
        passwordHash,
        roles: [employeeRole._id],
        accountStatus: "ACTIVE",
        profile: {
          firstName: "Sophia",
          lastName: "Lee",
          email: "employee1@example.com",
          userType: "INTERNAL",
        }
      }
    ]);

    console.log("Users seeded successfully.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Failed to seed users:", error);
    process.exit(1);
  }
}

seedUsers();