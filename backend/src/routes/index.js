import { Router } from "express";
import authRoutes from "./authRoutes.js";
import rbacRoutes from "./rbacRoutes.js";
import bookRoutes from "./bookRoutes.js";
import shipmentRoutes from "./shipmentRoutes.js";
import cartRoutes from "./cartRoutes.js";
import userAdminRoutes from "./userAdminRoutes.js";
import checkoutRoutes from "./checkoutRoutes.js";
import profileRoutes from "./profileRoutes.js";


const router = Router();

router.use("/auth", authRoutes);
router.use("/admin/rbac", rbacRoutes);
router.use("/books", bookRoutes);
router.use("/shipments", shipmentRoutes);
router.use("/cart", cartRoutes);
router.use("/admin/users", userAdminRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/profile", profileRoutes);








export default router;