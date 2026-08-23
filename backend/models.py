from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from database import Base
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    #id — название колонки.
    #Integer — тип данных. Здесь хранятся только целые числа (1, 2, 3 и так далее).
    #primary_key=True — делает это поле первичным ключом.
    #index=True — создает индекс в базе данных. Это база данных делает "закладку", 
    username = Column(String, unique=True, index=True, nullable=False)
    #username — колонка для хранения логина (имени пользователя).
    #String — тип данных "строка" (текст).
    #unique=True — запрещает повторения
    #index=True — создает индекс.
    #nullable=False — поле обязательно для заполнения
    password_hash = Column(String, nullable=False)
    #password_hash — колонка для хранения пароля.
    #String — текст. 
    invite_code = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)

    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    text = Column(String, nullable=False)
    message_type = Column(String, default="text")

    created_at = Column(DateTime(timezone=True), server_default=func.now())