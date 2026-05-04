from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.database.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nazwa = Column(String(255), nullable=False)
    opis = Column(Text, nullable=True)
    kategoria = Column(String(100), nullable=True)
    podkategoria = Column(String(100), nullable=True)
    cena = Column(Float, nullable=False)
    podatek = Column(Float, nullable=True, default=0.0)
    waga_g = Column(Float, nullable=True)
    ilosc = Column(Integer, nullable=False, default=0)
    jednostka = Column(String(50), nullable=True, default="szt")
    kraj_pochodzenia = Column(String(100), nullable=True)
    dostepnosc = Column(Boolean, nullable=False, default=True)
    data_dodania = Column(DateTime(timezone=True), server_default=func.now())
    ocena = Column(Float, nullable=True, default=0.0)
