import * as postService from '../src/api/v1/services/postService';
import * as firestoreRepository from '../src/api/v1/repositories/firestoreRepository';
import { mock } from 'node:test';

// Mock the repository module
jest.mock('../src/api/v1/repositories/firestoreRepository');

describe('Post Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Post Service - CreatePost', () => {
    // test case # 1
    it('should create a new post successfully', async () => {
      // Arrange
      const mockInput = { 
        userId: "test-user-1",
        content: "test content"
      };

      const mockRepositoryResponse = { 
        id: "post-1"
      };

      (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(mockRepositoryResponse);

      // Act
      const result = await postService.createPost(mockInput);

      // Assert
      expect(firestoreRepository.createDocument).toHaveBeenCalledWith("posts", 
            expect.objectContaining({
                userId: mockInput.userId,
                content: mockInput.content
            })
      );

      expect(result).toEqual(
        {
            id: mockRepositoryResponse,
            userId: mockInput.userId,
            content: mockInput.content,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        }
       );
    });
   });


   // test case # 2
   describe('Post Service - GetAllPosts', () => {

    it('should retrieve the list of all posts successfully', async () => {
      // Arrange
      const mockRepositoryResponse = { 
        // response should be an array containing all post documents from firestore
            id: "post-1",
            userId: "user-1",
            content: "test content",
            createdAt: new Date(),
            updatedAt: new Date()
      };

      (firestoreRepository.getAllDocuments as jest.Mock).mockResolvedValue(mockRepositoryResponse);

      // Act
      const result = await postService.getAllPosts();

      // Assert - call firestore repository function with the collection name
      expect(firestoreRepository.getAllDocuments).toHaveBeenCalledWith("posts");

      // expected eresults should be an array matching with the mockRepositoryResponse
      expect(result).toEqual(mockRepositoryResponse);
    });
   });
});