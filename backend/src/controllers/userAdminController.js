import { userAdminService } from "../services/userAdminService.js";
import { successResponse } from "../utils/apiResponse.js";

export const userAdminController = {
  async listUsers(req, res, next) {
    try {
      const data = await userAdminService.listUsers();
      return successResponse(res, data, "Users loaded");
    } catch (error) {
      next(error);
    }
  },

  async listCustomers(req, res, next) {
    try {
      const data = await userAdminService.listCustomers();
      return successResponse(res, data, "Customers loaded");
    } catch (error) {
      next(error);
    }
 },

  async getUser(req, res, next) {
    try {
      const data = await userAdminService.getUser(req.params.userId);
      return successResponse(res, data, "User loaded");
    } catch (error) {
      next(error);
    }
 },
   async updateUser(req, res, next) {
    try {
      const data = await userAdminService.updateUser(
        req.params.userId,
        req.body
      );
      return successResponse(res, data, "User updated");
    } catch (error) {
      next(error);
    }
  },

  async updateUserStatus(req, res, next) {
    try {
      const data = await userAdminService.updateUserStatus(
        req.params.userId,
        req.body.accountStatus
      );
      return successResponse(res, data, "User status updated");
    } catch (error) {
      next(error);
    }
  },

  async updateUserPassword(req, res, next) {
    try {
      const data = await userAdminService.updateUserPassword(
        req.params.userId,
        req.body.password
      );
      return successResponse(res, data, "User password updated");
    } catch (error) {
      next(error);
    }
  },

  async createUser(req, res, next){
    try {
      const result = await userAdminService.createUser(req.body);
      return successResponse(res, result, "User created");
    } catch (error) {
      next(error)
    }
  }
  
};