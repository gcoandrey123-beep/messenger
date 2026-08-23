from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import crud

from database import engine, get_db
from schemas import (
    UserRegister,
    UserLogin,
    UserResponse,
    MessageCreate,
    MessageResponse
)


models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Messenger API работает"}


@app.post("/register", response_model=UserResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_username(db, user_data.username)

    if existing_user is not None:
        raise HTTPException(
            status_code=400,
            detail="Пользователь с таким логином уже существует"
        )

    user = crud.create_user(db, user_data)

    return user


@app.post("/login", response_model=UserResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = crud.check_user_login(
        db=db,
        username=user_data.username,
        password=user_data.password
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Неверный логин или пароль"
        )

    return user


@app.get("/users", response_model=list[UserResponse])
def get_users(current_user_id: int, db: Session = Depends(get_db)):
    users = crud.get_users(db, current_user_id)
    return users


@app.post("/messages", response_model=MessageResponse)
def create_message(
    message_data: MessageCreate,
    db: Session = Depends(get_db)
):
    message = crud.create_message(db, message_data)
    return message


@app.get("/messages", response_model=list[MessageResponse])
def get_messages(
    user_id: int,
    other_user_id: int,
    db: Session = Depends(get_db)
):
    messages = crud.get_dialog_messages(
        db=db,
        user_id=user_id,
        other_user_id=other_user_id
    )

    return messages