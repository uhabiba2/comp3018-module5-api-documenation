import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../src/api/v1/middleware/validate";
import Joi from "joi";

describe("validateRequest Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {},
        };
        mockNext = jest.fn();
    });



    // Test Case # 1
    it("should pass for valid body input", () => {
        // Arrange
        const testSchemas = {
            body: Joi.object({
                name: Joi.string().required(),
                age: Joi.number().integer().min(0).max(5000),
            }),
        };
        mockReq.body = { name: "Duncan MacLeod", age: 400 };

        const middleware = validateRequest(testSchemas);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });


    // test case # 2
    it("should fail for invalid body input", () => {
        // Arrange
        const testSchemas = {
            body: Joi.object({
                name: Joi.string().required(),
                age: Joi.number().integer().min(0).max(5000),
            }),
        };

        // Age is out of range
        mockReq.body = { name: "Methos", age: 5001 };
        const middleware = validateRequest(testSchemas);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: expect.stringContaining("Validation error"),
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    // test case # 3
    it("should validate params correctly", () => {
        // Arrange
        const testSchemas = {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        };
        mockReq.params = { id: "post123" };
        const middleware = validateRequest(testSchemas);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
    });

    // test case # 4
    it("should fail when required params are missing", () => {
        // Arrange
        const testSchemas = {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        };

        // Missing required id
        mockReq.params = {};
        const middleware = validateRequest(testSchemas);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: expect.stringContaining('Params: "id" is required'),
        });
    });

    // test case # 5
    it("should validate multiple request parts together", () => {
        // Arrange
        const testSchemas = {
            params: Joi.object({
                id: Joi.string().required(),
            }),
            body: Joi.object({
                name: Joi.string().required(),
            }),
            query: Joi.object({
                include: Joi.string().valid("details", "summary").optional(),
            }),
        };
        mockReq.params = { id: "post123" };
        mockReq.body = { name: "Updated Post" };
        mockReq.query = { include: "details" };
        const middleware = validateRequest(testSchemas);

        // Act
        middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
    });
});