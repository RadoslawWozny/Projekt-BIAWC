from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base


class Cart(Base):
    __tablename__ = "cart"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, nullable=False, index=True)
    data_utworzenia = Column(DateTime(timezone=True), server_default=func.now())
    aktywny = Column(Boolean, nullable=False, default=True)

    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    cart_id = Column(Integer, ForeignKey("cart.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(Integer, nullable=False)
    ilosc = Column(Integer, nullable=False, default=1)
    data_dodania = Column(DateTime(timezone=True), server_default=func.now())

    cart = relationship("Cart", back_populates="items")
