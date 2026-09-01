use std::collections::HashMap;
use std::error::Error;
use std::fmt;

const API_URL: &str = "https://api.example.com";
const DEFAULT_TIMEOUT: u64 = 30;

#[derive(Debug, Clone)]
struct User {
    id: u32,
    name: String,
    email: String,
    active: bool,
}

#[derive(Debug)]
enum UserError {
    InvalidId,
    NotFound(u32),
    Network(String),
}

impl fmt::Display for UserError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            UserError::InvalidId => write!(f, "user ID must be positive"),
            UserError::NotFound(id) => write!(f, "user {id} not found"),
            UserError::Network(message) => write!(f, "network error: {message}"),
        }
    }
}

impl Error for UserError {}

trait UserRepository {
    fn find_user(&self, id: u32) -> Result<User, UserError>;
}

struct InMemoryRepository {
    users: HashMap<u32, User>,
}

impl InMemoryRepository {
    fn new() -> Self {
        Self {
            users: HashMap::new(),
        }
    }

    fn add_user(&mut self, user: User) {
        self.users.insert(user.id, user);
    }
}

impl UserRepository for InMemoryRepository {
    fn find_user(&self, id: u32) -> Result<User, UserError> {
        if id == 0 {
            return Err(UserError::InvalidId);
        }

        self.users
            .get(&id)
            .cloned()
            .ok_or(UserError::NotFound(id))
    }
}

fn format_user(user: &User) -> String {
    let status = if user.active {
        "active"
    } else {
        "inactive"
    };

    format!("{} <{}> [{}]", user.name, user.email, status)
}

fn process_users<R: UserRepository>(
    repository: &R,
    ids: &[u32],
) -> Vec<User> {
    ids.iter()
        .filter_map(|id| match repository.find_user(*id) {
            Ok(user) if user.active => Some(user),
            Ok(_) => None,
            Err(error) => {
                eprintln!("Failed to fetch user: {error}");
                None
            }
        })
        .collect()
}

fn main() -> Result<(), Box<dyn Error>> {
    let mut repository = InMemoryRepository::new();

    repository.add_user(User {
        id: 1,
        name: String::from("Alice"),
        email: String::from("alice@example.com"),
        active: true,
    });

    repository.add_user(User {
        id: 2,
        name: String::from("Bob"),
        email: String::from("bob@example.com"),
        active: false,
    });

    let user_ids = vec![1, 2, 3];

    let active_users = process_users(&repository, &user_ids);

    for user in active_users {
        println!("{}", format_user(&user));
    }

    println!("API: {API_URL}");
    println!("Timeout: {DEFAULT_TIMEOUT}s");

    Ok(())
}