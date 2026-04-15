import { Router } from "express";
import { bookController } from "../controllers/bookController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = Router();

router.get(
    "/",
    bookController.listBooks
);

router.get(
    "/:bookId",
    bookController.getBookById
);

router.post(
    "/",
    authenticate,
    authorizeRoles("ADMIN", "MANAGER"),
    bookController.createBook
);

router.put(
    "/:bookId/update",
    authenticate,
    authorizeRoles("ADMIN", "MANAGER"),
    bookController.updateBookById
);

router.patch(
    "/:bookId/update",
    authenticate,
    authorizeRoles("ADMIN", "MANAGER"),
    bookController.updateBookQuantity
)

router.delete(
    "/:bookId",
    authenticate,
    authorizeRoles("ADMIN", "MANAGER"),
    bookController.deleteBook
)


export default router;