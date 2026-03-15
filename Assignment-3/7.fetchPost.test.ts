import { describe, it, expect, vi, beforeEach } from 'vitest';
import { APIService } from './7.fetchPost';

describe('APIService Tests', () => {
  let service: APIService;

  beforeEach(() => {
    service = new APIService();
    // Mocking global fetch to prevent actual network calls
    global.fetch = vi.fn();
  });

  describe('fetchPost()', () => {
    it('should successfully return a Post object', async () => {
      const mockData = { id: 10, title: 'Sample Post', body: 'Sample Body', userId: 1 };
      
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const post = await service.fetchPost(10);
      expect(post.title).toBe('Sample Post');
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/posts/10'));
    });

    it('should throw an error when API returns 404', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(service.fetchPost(999)).rejects.toThrow('Not Found');
    });
  });

  describe('fetchComments()', () => {
    it('should return exactly the number of comments requested', async () => {
      const mockList = [
        { id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }
      ];

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockList),
      });

      const results = await service.fetchComments(1, 2);
      expect(results).toHaveLength(2);
      expect(results[1].id).toBe(2);
    });
  });
});