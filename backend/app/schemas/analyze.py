from typing import Annotated

from pydantic import BaseModel, Field, StringConstraints

from app.schemas.process import AgeInt, NameStr

TextStr = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=2, max_length=100),
]


class AnalyzeRequest(BaseModel):
    """Datos de entrada para el endpoint /analizar."""

    nombre: NameStr = Field(description="Nombre de la persona.")
    edad: AgeInt
    ocupacion: TextStr = Field(description="Ocupacion actual de la persona.")
    ciudad: TextStr = Field(description="Ciudad principal de la persona.")


class AnalyzeResponse(BaseModel):
    """Respuesta enriquecida del endpoint /analizar."""

    saludo: str
    categoria: str
    recomendacion: str
    prioridad: str
    timestamp: str
