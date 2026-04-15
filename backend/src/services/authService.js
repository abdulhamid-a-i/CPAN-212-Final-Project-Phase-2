import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { tokenService } from "./tokenService.js";
import { AppError } from "../utils/appError.js";
import { stripSensitiveUserFields } from "../utils/safeObject.js";
import { Role } from "../models/Role.js";
import { ROLES } from "../constants/roles.js";
import { userRepository } from "../repositories/userRepository.js";

export const authService = {
  async login(username, password) {
    const user = await User.findOne({ username }).populate("roles");

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = tokenService.generateAccessToken(user);

    return {
      token,
      user: stripSensitiveUserFields(user)
    };
  },

  async register(payload) {
    const {username, password, firstName, lastName, email} = payload;

    const usernameExists = await User.findOne({ username: username.trim() });
    if (usernameExists) {
      throw new AppError("Username already taken", 409);
    }

    const customerRole = await Role.findOne({name: ROLES.CUSTOMER})


    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      username: username.trim(),
      passwordHash: passwordHash,
      roles: [customerRole._id],
      profile: {
        firstName: firstName,
        lastName: lastName,
        email: email.trim().toLowerCase(),
        userType: "CUSTOMER"
      },
      
    });

    return {user: stripSensitiveUserFields(user)};
  }
};