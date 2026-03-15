export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export class APIService {
  private readonly baseUrl = "https://jsonplaceholder.typicode.com";

  /**
   * Fetches a post and handles potential network/API errors.
   */
  async fetchPost(id: number): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/posts/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post with id ${id}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetches comments for a post and returns a specific 'count'.
   */
  async fetchComments(id: number, count: number): Promise<Comment[]> {
    const response = await fetch(`${this.baseUrl}/posts/${id}/comments`);

    if (!response.ok) {
      throw new Error(`Failed to fetch comments for post ${id}: ${response.statusText}`);
    }

    const allComments: Comment[] = await response.json();
    
    // Limits the returned array to the requested count
    return allComments.slice(0, count);
  }
}