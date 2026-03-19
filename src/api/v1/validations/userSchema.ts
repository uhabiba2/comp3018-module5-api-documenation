// File: src/api/v1/validations/userSchema.ts
import Joi from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - uid
 *         - email
 *       properties:
 *         uid:
 *           type: string
 *           description: Unique identifier for the user
 *           example: "userid-123"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "user@example.com"
 *         role:
 *           type: string
 *           enum: [user, admin, developer]
 *           description: User's role in the system
 */

// Your actual Joi validation schema
export const userSchema = Joi.object({
    uid: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("user", "admin", "developer"),
});

