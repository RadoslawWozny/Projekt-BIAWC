# Mikroserwisy FastAPI

Architektura mikroserwisów e-commerce zbudowana w FastAPI.

## Serwisy

| Serwis | Port | Opis |
|--------|------|------|
| user-service | 8001 | Zarządzanie użytkownikami i autentykacja |
| products-service | 8002 | Zarządzanie produktami i katalogiem |
| cart-service | 8003 | Zarządzanie koszykiem zakupowym |
| orders-service | 8004 | Zarządzanie zamówieniami |

## Infrastruktura

| Usługa | Port | Opis |
|--------|------|------|
| PostgreSQL | 5432-5434 | Bazy danych dla serwisów |
| Redis | 6379-6382 | Cache i session storage |
| RabbitMQ | 5672, 15672 | Message broker |
| Elasticsearch | 9200 | Wyszukiwanie produktów |
| Nginx | 80 | API Gateway |

## Uruchomienie lokalne bez dockera

```bash
#1 Instalacja środowiska
py -3.12 -m venv .venv 

#2 Aktywacja srodowiska
.venv\Scripts\activate     

#3 Instalacja zalezności
pip install -r requirements.txt  

#4 Odpalenie 
uvicorn app.main:app --reload 
```


## Uruchomienie

```bash
# Uruchomienie wszystkich serwisów
docker-compose up --build

# Uruchomienie w tle
docker-compose up -d --build

# Zatrzymanie
docker-compose down

# Zatrzymanie z usunięciem wolumenów
docker-compose down -v
```

## Endpointy Health Check

```
GET http://localhost:8001/api/v1/ping      # User Service
GET http://localhost:8001/api/v1/health    # User Service Health

GET http://localhost:8002/api/v1/ping      # Products Service
GET http://localhost:8002/api/v1/health    # Products Service Health

GET http://localhost:8003/api/v1/ping      # Cart Service
GET http://localhost:8003/api/v1/health    # Cart Service Health

GET http://localhost:8004/api/v1/ping      # Orders Service
GET http://localhost:8004/api/v1/health    # Orders Service Health
```

## Struktura katalogów

```
microservices/
├── docker-compose.yml
├── nginx.conf
├── README.md
├── user-service/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── Dockerfile
│   └── requirements.txt
├── products-service/
│   └── ...
├── cart-service/
│   └── ...
└── orders-service/
    └── ...
```

## Warstwy architektury

- **api** - Endpointy REST API (routes)
- **core** - Konfiguracja i ustawienia aplikacji
- **db** - Połączenia z bazą danych
- **models** - Modele SQLAlchemy (ORM)
- **schemas** - Pydantic models (DTO/serializacja)
- **services** - Logika biznesowa
