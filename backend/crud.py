import uuid

from passlib.context import CryptContext
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from models import User, Message
from schemas import UserRegister, MessageCreate


password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return password_context.verify(password, password_hash)


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def get_user_by_invite_code(db: Session, invite_code: str):
    return db.query(User).filter(User.invite_code == invite_code).first()


def create_user(db: Session, user_data: UserRegister):
    user = User(
        username=user_data.username,
        password_hash=hash_password(user_data.password),
        invite_code=str(uuid.uuid4())[:8]
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def check_user_login(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)

    if user is None:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user


def get_users(db: Session, current_user_id: int):
    return db.query(User).filter(User.id != current_user_id).all()


def create_message(db: Session, message_data: MessageCreate):
    message = Message(
        sender_id=message_data.sender_id,
        receiver_id=message_data.receiver_id,
        text=message_data.text,
        message_type=message_data.message_type
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message


def get_dialog_messages(db: Session, user_id: int, other_user_id: int):
    return (
        db.query(Message)
        .filter(
            or_(
                and_(
                    Message.sender_id == user_id,
                    Message.receiver_id == other_user_id
                ),
                and_(
                    Message.sender_id == other_user_id,
                    Message.receiver_id == user_id
                )
            )
        )
        .order_by(Message.id.asc())
        .all()
    )