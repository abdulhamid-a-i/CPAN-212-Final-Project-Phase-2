import { Router } from "express";
import { checkoutController } from "../controllers/checkoutController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.get("/", checkoutController.getOwnCheckout);

router.put("/cancel", checkoutController.clearCheckout);

router.put("/purchase", checkoutController.purchase);

export default router;
