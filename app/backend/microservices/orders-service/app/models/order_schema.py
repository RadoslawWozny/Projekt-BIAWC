from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from decimal import Decimal
from typing import List


class OrderCreateRequest(BaseModel):
    user_id: int


class OrderStatusUpdateRequest(BaseModel):
    status: str = Field(..., min_length=1, max_length=50)


class OrderItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    ilosc: int
    cena_w_momencie_zakupu: Decimal


class OrderHeaderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    status: str
    laczna_kwota: Decimal
    data_zamowienia: datetime


class OrderDetailResponse(OrderHeaderResponse):
    items: List[OrderItemResponse] = []
