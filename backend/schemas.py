from pydantic import BaseModel
class UserRegister(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    invite_code: str

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    sender_id: int
    receiver_id: int
    text: str
    message_type: str = "text"


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    text: str
    message_type: str

    class Config:
        from_attributes = True