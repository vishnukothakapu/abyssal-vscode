// User management example for testing Abyssal syntax highlighting

const API_URL = "https://api.example.com";
const DEFAULT_ROLE = "developer";

const users = [
  {
    id: 1,
    name: "Alice",
    role: DEFAULT_ROLE,
    active: true
  },
  {
    id: 2,
    name: "Bob",
    role: "designer",
    active: false
  }
];

class UserService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getUser(id) {
    const response = await fetch(
      `${this.baseUrl}/users/${id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json();
  }

  async createUser(user) {
    const response = await fetch(
      `${this.baseUrl}/users`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      }
    );

    return response.json();
  }
}

const service = new UserService(API_URL);

async function main() {
  try {
    const user = await service.getUser(1);

    console.log(
      `User: ${user.name}`
    );

    if (user.active) {
      console.log("User is active");
    } else {
      console.warn("User is inactive");
    }
  } catch (error) {
    console.error(
      "Something went wrong:",
      error
    );
  }
}

main();