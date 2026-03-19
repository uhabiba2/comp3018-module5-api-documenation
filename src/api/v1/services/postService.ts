import { Post } from "../models/postModel";
import * as firestoreRepository from "../repositories/firestoreRepository";
import { postSchemas } from "../validations/postSchema";
import { validateRequest } from "../middleware/validate";

const COLLECTION = "posts";

// creating a new post
export const createPost = async (postData: {userId: string; content: string}): Promise<Post> => {
    try {
        const newPostData = {
            ... postData,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const id = await firestoreRepository.createDocument<Post>(COLLECTION, newPostData);

        return {id, ... newPostData} as Post;
       
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to create post: ${errorMessage}`
        );
    }
};


// retreiveing all posts
export const getAllPosts = async (): Promise<Post[]> => {
    try {
        const posts = await firestoreRepository.getAllDocuments<Post>(COLLECTION);
        return posts;
       
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to retrive all posts: ${errorMessage}`
        );
    }
};

// retreiveing a post by ID
export const getPostById = async (id: string): Promise<Post> => {
    try {
        const post = await firestoreRepository.getDocById<Post>(COLLECTION, id);
        
        if(!post){
            throw new Error("Post not found");
        }

        return post;
       
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to retrive the post: ${errorMessage}`
        );
    }
};

// updating a post
export const updatePost = async (id: string, postData: {userId: string, content: string}): Promise<Post> => {
    try {
        const updatedPost: Partial<Post> = {};

        if(postData.userId !== undefined) {
            updatedPost.userId = postData.userId;
        }

        if(postData.content !== undefined) {
            updatedPost.content = postData.content;
        }

        if (Object.keys(updatedPost).length === 0) {
            throw new Error("No fields provided to update");
        }
        
        updatedPost.updatedAt = new Date();

        // update the document 
        await firestoreRepository.updateDocument<Post>(
            COLLECTION,
            id,
            updatedPost
        );

        // retrieve the updated post document
        const updatedPostData = await firestoreRepository.getDocById<Post>(COLLECTION, id);

        if(!updatedPostData){
            throw new Error("Updated post couldn't be found");
        }

        return updatedPostData;


    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to update post ${id}: ${errorMessage}`
        );
    }
};


// retreiveing a post by ID
export const deletePost = async (id: string): Promise<void> => {
    try {
        await firestoreRepository.deleteDocument(COLLECTION, id);
       
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        throw new Error(
            `Failed to delete the post: ${errorMessage}`
        );
    }
};

// ... other service functions (getPostById, updatePost, deletePost) ...