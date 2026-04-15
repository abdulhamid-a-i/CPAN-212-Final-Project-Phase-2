import { Router } from "express";
import { body } from "express-validator";
import { keycloakController } from "../controllers/keycloakController.js";
import { handleValidation } from "../middleware/validationMiddleware.js";

const router = Router();

router.get("/config", keycloakController.getConfig);

router.post(
  "/exchange",
  [
    body("code")
      .notEmpty()
      .withMessage("Authorization code is required")
      .isString()
      .withMessage("Authorization code must be a string"),
    body("codeVerifier")
      .optional({ nullable: true })
      .isString()
      .withMessage("Code verifier must be a string"),
    body("redirectUri")
      .optional({ nullable: true })
      .isString()
      .withMessage("Redirect URI must be a string")
  ],
  handleValidation,
  keycloakController.exchangeCode
);

export default router;