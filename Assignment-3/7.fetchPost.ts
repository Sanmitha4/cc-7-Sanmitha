/**
 * Represents a post entity from the JSONPlaceholder API.
 */
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

/**
 * Represents a comment entity associated with a specific post.
 */
export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

/**
 * A service class for interacting with the JSONPlaceholder API.
 * Provides methods to retrieve posts and their associated comments.
 */
export class APIService {
  /** The base URL for the external API. */
  private readonly baseUrl = "https://jsonplaceholder.typicode.com";

  /**
   * Fetches a single post by its identifier.
   * * @param {number} id - The unique ID of the post to retrieve.
   * @returns {Promise<Post>} A promise that resolves to the Post object.
   * @throws {Error} Throws an error if the fetch fails or the server returns a non-OK status.
   */
  async fetchPost(id: number): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/posts/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post with id ${id}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetches the comments associated with a specific post and limits the result set.
   *
   * @param {number} id - The ID of the post for which to fetch comments.
   * @param {number} count - The maximum number of comments to return.
   * @returns {Promise<Comment[]>} A promise that resolves to a slice of comments.
   * @throws {Error} Throws an error if the network request fails.
   */
  async fetchComments(id: number, count: number): Promise<Comment[]> {
    const response = await fetch(`${this.baseUrl}/posts/${id}/comments`);

    if (!response.ok) {
      throw new Error(`Failed to fetch comments for post ${id}: ${response.statusText}`);
    }
    const allComments: Comment[] = await response.json();
        return allComments.slice(0, count);
  }
}