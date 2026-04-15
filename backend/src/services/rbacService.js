import { Role } from "../models/Role.js";
import { User } from "../models/User.js";
import { roleRepository } from "../repositories/roleRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { AppError } from "../utils/appError.js";
import { stripSensitiveUserFields } from "../utils/safeObject.js";

export const rbacService = {
  async listRoles() {
    return roleRepository.findAll();
  },

  async assignRoles(userId, roles) {


    const adminRole = await Role.findOne({name: "ADMIN"});
    const adminCountExcludingUser = await User.countDocuments({
  roles: adminRole._id,
  _id: { $ne: userId } 
});

    const user = await User.findById(userId).populate("roles")
    

    const validRoles = await roleRepository.findByNames(roles);
    console.log(validRoles);


    if (validRoles.length !== roles.length) {
      throw new AppError("One or more roles are invalid", 400);
    }

    const isCurrentAdmin = user.roles.some(role => role.name === "ADMIN");
    const removingAdmin = !validRoles.some(role => role.name === "ADMIN");

    if (isCurrentAdmin && adminCountExcludingUser === 0 && removingAdmin){
          throw new AppError("Last Admin cannot revoke role", 403)
        }

     const roleIDs = validRoles.map(role => role._id);



     const userUpdated = await userRepository.updateById(userId, { roles: roleIDs });
     if (!userUpdated) {
       throw new AppError("User not found", 404);
     }

    return stripSensitiveUserFields(userUpdated);
  }
};