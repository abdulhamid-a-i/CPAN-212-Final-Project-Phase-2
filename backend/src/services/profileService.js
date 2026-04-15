import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import { stripSensitiveUserFields } from "../utils/safeObject.js";
import { userRepository } from "../repositories/userRepository.js";

export const profileService = {
  async getOwnProfile(userId) {
    const user = await User.findById(userId).populate("roles");
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return stripSensitiveUserFields(user);
  },

  async updateOwnProfile(userId, updates) {
    const user = await User.findById(userId).populate("roles");
    if (!user) {
      throw new AppError("User not found", 404);
    }

    Object.assign(user.profile, updates);
    await user.save();

    const refreshedUser = await User.findById(userId).populate("roles");
    return stripSensitiveUserFields(refreshedUser);
  },
  async suspendOwnProfile(userId){
    const user = await User.findById(userId).populate("roles")

    if (user.roles.some(role => role.name === "ADMIN")){
      throw new AppError("Admin cannot suspend their own account", 403)
    }

    const userSuspended = await userRepository.updateById(userId, { accountStatus: "SUSPENDED" });
    if (!userSuspended) {
      throw new AppError("User not found", 404);
    }
    

    return stripSensitiveUserFields(user);

  }
};