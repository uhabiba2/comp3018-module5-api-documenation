import express from "express";
import { validateRequest } from "../middleware/validate";
import * as postController from "../controllers/postController";
import { postSchemas } from "../validations/postSchema";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import cors from "cors";

const postRouter = express.Router();

const authenticatedCorsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};

/**
 * @openapi
 * /posts:
 *   post:
 *     summary: Create a new post item
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - content
 *             properties:
 *               uid:
 *                 type: string
 *                 example: "user123"
 *               content:
 *                 type: string
 *                 example: "test content 123"
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time when the item was created
 *                 example: "2024-01-15T10:30:00Z"
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time when the item was last updated
 *                 example: "2024-01-20T14:45:00Z"
 *     responses:
 *       '201':
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

postRouter.post("/", cors(authenticatedCorsOptions), 
    authenticate,
    isAuthorized({ hasRole: ["admin", "manager"] }),
    validateRequest(postSchemas.create), postController.createPostHandler);


postRouter.get("/", authenticate, postController.getAllPostsHandler);
postRouter.get("/:id", authenticate, validateRequest(postSchemas.getById), postController.getPostByIdHandler);


postRouter.put("/:id", 
    authenticate,
    isAuthorized({ hasRole: ["admin", "manager"], allowSameUser: true }),
    validateRequest(postSchemas.update), postController.updatePostHandler);

postRouter.delete("/:id", 
     authenticate,
     isAuthorized({ hasRole: ["admin", "manager"] }),
     validateRequest(postSchemas.delete), postController.deletePostHandler);

export default postRouter;