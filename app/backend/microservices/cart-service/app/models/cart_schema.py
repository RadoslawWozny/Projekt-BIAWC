from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# ==================== CART ITEMS ====================

class CartItemCreate(BaseModel):
    product_id: int
    ilosc: int

class CartItemUpdate(BaseModel):
    product_id: Optional[int] = None
    ilosc: Optional[int] = None
    data_dodania: Optional[datetime] = None

class CartItemResponse(BaseModel):
    id: int
    cart_id: int
    product_id: int
    ilosc: int
    data_dodania: datetime

    class Config:
        from_attributes = True

# ==================== CART ====================

class CartCreate(BaseModel):
    user_id: int
    aktywny: Optional[bool] = True

class CartResponse(BaseModel):
    id: int
    user_id: int
    data_utworzenia: datetime
    aktywny: bool
    items: List[CartItemResponse] = []

    class Config:
        from_attributes = True
