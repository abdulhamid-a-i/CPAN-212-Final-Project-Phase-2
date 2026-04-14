import { Router } from "express";
import { shipmentController } from "../controllers/shipmentController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import multer from "multer";


const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);

router.get("/", authorizeRoles("EMPLOYEE","ADMIN","MANAGER"), shipmentController.listShipments);

router.get("/:shipmentId", authorizeRoles("EMPLOYEE","ADMIN","MANAGER"), shipmentController.getShipmentById);

router.post("/", authorizeRoles("ADMIN","MANAGER"), upload.single("file"),shipmentController.createShipment);

router.patch("/:shipmentId/status", authorizeRoles("ADMIN","MANAGER"), shipmentController.updateShipmentStatus);

router.delete("/:shipmentId", authorizeRoles("ADMIN","MANAGER"), shipmentController.deleteShipment);

export default router;