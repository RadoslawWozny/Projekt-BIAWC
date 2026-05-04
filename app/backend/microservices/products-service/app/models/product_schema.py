from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ProductCreate(BaseModel):
    """Schema do tworzenia nowego produktu (POST)"""
    nazwa: str
    opis: Optional[str] = None
    kategoria: Optional[str] = None
    podkategoria: Optional[str] = None
    cena: float
    podatek: Optional[float] = 0.0
    waga_g: Optional[float] = None
    ilosc: int = 0
    jednostka: Optional[str] = "szt"
    kraj_pochodzenia: Optional[str] = None
    dostepnosc: bool = True
    ocena: Optional[float] = 0.0


class ProductUpdate(BaseModel):
    """Schema do aktualizacji produktu (PUT) - wszystkie pola opcjonalne"""
    nazwa: Optional[str] = None
    opis: Optional[str] = None
    kategoria: Optional[str] = None
    podkategoria: Optional[str] = None
    cena: Optional[float] = None
    podatek: Optional[float] = None
    waga_g: Optional[float] = None
    ilosc: Optional[int] = None
    jednostka: Optional[str] = None
    kraj_pochodzenia: Optional[str] = None
    dostepnosc: Optional[bool] = None
    ocena: Optional[float] = None


class ProductResponse(BaseModel):
    """Schema odpowiedzi z danymi produktu"""
    id: int
    nazwa: str
    opis: Optional[str] = None
    kategoria: Optional[str] = None
    podkategoria: Optional[str] = None
    cena: float
    podatek: Optional[float] = None
    waga_g: Optional[float] = None
    ilosc: int
    jednostka: Optional[str] = None
    kraj_pochodzenia: Optional[str] = None
    dostepnosc: bool
    data_dodania: Optional[datetime] = None
    ocena: Optional[float] = None

    class Config:
        from_attributes = True
