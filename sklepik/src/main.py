from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Konfiguracja CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

#baza danych w pamięci
teas = [
    {"id": 1, "name": "Sencha", "type": "Zielona", "price": 25},
    {"id": 2, "name": "Yunnan", "type": "Czarna", "price": 20},
    {"id": 3, "name": "Rooibos", "type": "Ziołowa", "price": 22}
]

@app.get("/products")
def get_products():
    return teas

# Odpal serwer komendą: uvicorn main:app --reload
