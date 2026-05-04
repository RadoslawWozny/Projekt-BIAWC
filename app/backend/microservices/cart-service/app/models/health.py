from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Optional


class PingResponse(BaseModel):
    status: str
    message: str
    timestamp: datetime


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: datetime
    checks: Optional[Dict[str, str]] = None
