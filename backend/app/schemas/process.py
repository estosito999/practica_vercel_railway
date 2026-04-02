from typing import Annotated

from pydantic import BaseModel, Field, StringConstraints

NameStr = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=2, max_length=100),
]

AgeInt = Annotated[
    int,
    Field(strict=True, ge=0, le=120, description="Edad entera entre 0 y 120."),
]


class ProcessRequest(BaseModel):
    """Datos minimos para el endpoint /procesar."""

    nombre: NameStr = Field(description="Nombre de la persona.")
    edad: AgeInt


class ProcessResponse(BaseModel):
    """Respuesta del endpoint /procesar."""

    mensaje: str
    categoria: str
