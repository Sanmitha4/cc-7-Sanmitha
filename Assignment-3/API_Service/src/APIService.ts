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

  async fetchPost(id: number): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/posts/${id}`);
    if (!response.ok) throw new Error(`Post ${id} not found`);
    return response.json();
  }

  async fetchComments(id: number, count: number): Promise<Comment[]> {
    const response = await fetch(`${this.baseUrl}/posts/${id}/comments`);
    if (!response.ok) throw new Error(`Comments for ${id} not found`);
    const allComments: Comment[] = await response.json();
    return allComments.slice(0, count);
  }
}
