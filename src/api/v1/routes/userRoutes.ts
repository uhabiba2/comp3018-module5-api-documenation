import express, { Router } from "express";
import { getUserDetails } from "../controllers/userController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const userRouter: Router = express.Router();

// API doc 1: GET user endpoint with request parameters
/**
 * @openapi
 * /users/:id:
 *   get:
 *     summary: Retrieve a user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the user to retrieve
 *     responses:
 *       '200':
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized - Missing or invalid token
 *       '403':
 *         description: Forbidden - Admin access required
 *       '404':
 *         description: User not found
 */

// Only admins can view detailed user information
userRouter.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    getUserDetails
);

export default userRouter;