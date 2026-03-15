export interface User {
  id: number;
  name: string;
  email: string;
}

export async function getUsers(delay: number = 2000): Promise<User[]> {
  // Create a promise that resolves after the specified delay
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Perform the fetch and the delay concurrently
  const [response] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/users"),
    wait(delay)
  ]);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}