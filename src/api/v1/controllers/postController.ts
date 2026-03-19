import { Request, Response, NextFunction } from "express";
import * as postService from "../services/postService";
import { successResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

// Handles creating new Post
export const createPostHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {userId, content} = req.body;
        const postData = {userId, content};

        const newPost = await postService.createPost(postData);

        res.status(HTTP_STATUS.CREATED).json(successResponse({newPost}, "Post created successfully"));
    } catch (error: unknown) {
        next(error);
    }
};

// handles request to get all posts
export const getAllPostsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const posts = await postService.getAllPosts();

        res.status(HTTP_STATUS.OK).json(successResponse({posts}, "Posts retrieved successfully"));
    } catch (error: unknown) {
        next(error);
    }
};

// handles request to get a single post by Id
export const getPostByIdHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const post = await postService.getPostById(id as string);

        res.status(HTTP_STATUS.OK).json(successResponse({post}, "Post retrieved successfully"));
    } catch (error: unknown) {
        next(error);
    }
};

// handles request to update an exsting post
export const updatePostHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {id} = req.params;
        const {userId, content} = req.body;

        const updatePostData = {userId, content};

        const updatedPost= await postService.updatePost(id as string, updatePostData);

        res.status(HTTP_STATUS.OK).json(successResponse({updatedPost}, "Post updated"));
    } catch (error: unknown) {
        next(error);
    }
};


// handles request to delete an exsting post
export const deletePostHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {id} = req.params;
        await postService.deletePost(id as string);

        res.status(HTTP_STATUS.OK).json(successResponse("Post deleted"));
    } catch (error: unknown) {
        next(error);
    }
};

// ... other controller functions (getPostByIdHandler, createPostHandler, deletePostHandler) ...