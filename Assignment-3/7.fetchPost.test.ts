import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { APIService, type Post, type Comment } from './7.fetchPost';

describe('APIService', () => {
  let service: APIService;

  beforeEach(() => {
    service = new APIService();
    global.fetch = vi.fn();
  });

  describe('fetchPost', () => {
    it('should return a post object on success', async () => {
      const mockPost: Post = {
        userId: 1,
        id: 1,
        title: 'Test Title',
        body: 'Test Body',
      };

      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: async () => mockPost,
      });

      const result = await service.fetchPost(1);

      expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts/1');
      expect(result).toEqual(mockPost);
    });

    it('should throw an error if the response is not ok', async () => {
      (global.fetch as Mock).mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(service.fetchPost(999)).rejects.toThrow(
        'Failed to fetch post with id 999: Not Found'
      );
    });
  });

  describe('fetchComments', () => {
    it('should return the specified number of comments', async () => {
      const mockComments: Comment[] = [
        { postId: 1, id: 1, name: 'C1', email: 'e1', body: 'b1' },
        { postId: 1, id: 2, name: 'C2', email: 'e2', body: 'b2' },
        { postId: 1, id: 3, name: 'C3', email: 'e3', body: 'b3' },
      ];

      (global.fetch as Mock).mockResolvedValue({
        ok: true,
        json: async () => mockComments,
      });

      const count = 2;
      const result = await service.fetchComments(1, count);

      expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts/1/comments');
      expect(result).toHaveLength(count);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('should throw an error if the comments fetch fails', async () => {
      (global.fetch as Mock).mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(service.fetchComments(1, 5)).rejects.toThrow(
        'Failed to fetch comments for post 1: Internal Server Error'
      );
    });
  });
});