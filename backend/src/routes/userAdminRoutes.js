import { Router } from "express";
import { userAdminController } from "../controllers/userAdminController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { updateUserStatusValidator } from "../validators/userAdminValidator.js";
import { handleValidation } from "../middleware/validationMiddleware.js";

const router = Router();

router.use(authenticate);

router.get("/", authorizeRoles("ADMIN"), userAdminController.listUsers);
router.put("/:userId/status", authorizeRoles("ADMIN"), updateUserStatusValidator, handleValidation, userAdminController.updateUserStatus);
router.get("/customers", authorizeRoles("ADMIN", "AGENT"), userAdminController.listCustomers);
router.post("/",  authorizeRoles("ADMIN"), userAdminController.createUser);
router.get("/:userId", authorizeRoles("ADMIN"), userAdminController.getUser);
router.put("/:userId", authorizeRoles("ADMIN"), userAdminController.updateUser);
router.put("/:userId/password", authorizeRoles("ADMIN"), userAdminController.updateUserPassword);

export default router;