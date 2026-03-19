import request from "supertest";
import app from "../src/app";
import { auth } from "../config/firebaseConfig";
import * as postService from "../src/api/v1/services/postService"

// Mock Firebase auth
jest.mock("../config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn(),
    },
}));

describe("POST /api/v1/posts - Authentication and Authorization Integration", () => {
    it("should return 401 with proper error format when no token provided", async () => {
        // Act
        const response = await request(app)
            .post("/api/v1/posts")
            .send({ userId: "Test Post", content: "Test content" });

        // Assert
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
            success: false,
            error: {
                message: "Unauthorized: No token provided",
                code: "TOKEN_NOT_FOUND",
            },
            timestamp: expect.any(String),
        });
    });

    it("should return 403 with proper error format when user lacks role", async () => {
        // Arrange
        // User role, but route requires admin/manager
        (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
            uid: "user123",
            role: "user",
        });

        // Act
        const response = await request(app)
            .post("/api/v1/posts")
            .set("Authorization", "Bearer valid-token")
            .send({ userId: "Test Post", content: "Test content" });

        // Assert
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject({
            success: false,
            error: {
                message: "Forbidden: Insufficient role",
                code: "INSUFFICIENT_ROLE",
            },
            timestamp: expect.any(String),
        });
    });

    it("should succeed when user has proper role and token", async () => {

        jest.spyOn(postService, "createPost").mockResolvedValueOnce({
            id: "post123",
            userId: "Test Post",
            content: "Test content",
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        // Arrange
        (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
            uid: "admin123",
            role: "admin",
        });

        // Mock your post creation logic here
        // This would typically involve mocking your database or service layer

        // Act
        const response = await request(app)
            .post("/api/v1/posts")
            .set("Authorization", "Bearer valid-admin-token")
            .send({ userId: "Test Post", content: "Test content" });

        // Assert
        // Or whatever success status you use
        expect(response.status).toBe(201);
        expect(response.body.status).toBe("success");
    });
});