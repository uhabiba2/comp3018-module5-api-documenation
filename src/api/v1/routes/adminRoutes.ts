import express from "express";
import { setCustomClaims } from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import cors from "cors";

const adminRouter: express.Router = express.Router();

const authenticatedCorsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [],
    credentials: true,
    methods: ["POST"],
};

// Only admins can set custom claims
adminRouter.post(
    "/setCustomClaims", cors(authenticatedCorsOptions),
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    setCustomClaims
);

export default adminRouter;