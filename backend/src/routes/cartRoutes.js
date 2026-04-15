import { Router } from "express";
import { cartController } from "../controllers/cartController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.get("/", cartController.getOwnCart);

router.put("/add", cartController.addToCart);
router.put("/remove", cartController.removeFromCart);

router.patch("/quantity", cartController.updateCartQuantity);

router.put("/clear",cartController.clearCart);

export default router;