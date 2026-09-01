from dataclasses import dataclass
from typing import Optional

import asyncio


API_URL = "https://api.example.com"
DEFAULT_TIMEOUT = 30


@dataclass
class User:
    id: int
    name: str
    email: str
    active: bool = True


class UserService:
    def __init__(self, base_url: str, timeout: int = DEFAULT_TIMEOUT):
        self.base_url = base_url
        self.timeout = timeout

    async def get_user(self, user_id: int) -> Optional[User]:
        print(f"Fetching user {user_id}")

        try:
            await asyncio.sleep(0.1)

            if user_id <= 0:
                raise ValueError("User ID must be positive")

            user = User(
                id=user_id,
                name="Alice",
                email="alice@example.com"
            )

            return user

        except ValueError as error:
            print(f"Validation error: {error}")
            return None

        except Exception as error:
            print(f"Unexpected error: {error}")
            return None

    async def get_users(self, user_ids: list[int]) -> list[User]:
        users = []

        for user_id in user_ids:
            user = await self.get_user(user_id)

            if user is not None:
                users.append(user)

        return users


def format_user(user: User) -> str:
    status = "active" if user.active else "inactive"

    return (
        f"{user.name} <{user.email}> "
        f"[{status}]"
    )


async def main() -> None:
    service = UserService(
        base_url=API_URL,
        timeout=DEFAULT_TIMEOUT
    )

    user_ids = [1, 2, 3, -1]

    users = await service.get_users(user_ids)

    active_users = [
        user
        for user in users
        if user.active
    ]

    for user in active_users:
        print(format_user(user))


if __name__ == "__main__":
    asyncio.run(main())