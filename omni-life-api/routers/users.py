from fastapi import APIRouter, Depends
from pydantic import BaseModel

from auth import get_current_user

router = APIRouter(prefix="/api", tags=["users"])


class UserProfile(BaseModel):
    name: str
    email: str
    picture: str
    message: str


@router.get("/me", response_model=UserProfile)
def get_me(user: dict = Depends(get_current_user)):
    return UserProfile(
        name=user.get("name", ""),
        email=user.get("email", ""),
        picture=user.get("picture", ""),
        message=f"Welcome to Omni Life, {user.get('given_name', user.get('name', 'there'))}!",
    )
