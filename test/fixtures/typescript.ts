interface User {
  readonly id: number;
  name: string;
  email: string;
  roles: string[];
}

type UserStatus = "active" | "inactive";

const DEFAULT_STATUS: UserStatus = "active";

class UserService {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getUser(id: number): Promise<User> {
    const response = await fetch(`${this.baseUrl}/users/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json();
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/users`);

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return response.json();
  }
}

const service = new UserService("https://api.example.com");

async function main(): Promise<void> {
  try {
    const users = await service.getUsers();

    for (const user of users) {
      console.log(
        `${user.name} <${user.email}>`
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

main();