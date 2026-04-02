from fastapi import APIRouter

from app.core.config import get_settings

router = APIRouter(tags=["base"])


@router.get("/")
def read_root() -> dict[str, str]:
    """Endpoint base para comprobar que el servicio esta vivo."""
    settings = get_settings()

    return {
        "message": "Backend FastAPI funcionando",
        "service": settings.app_name,
        "version": settings.app_version,
    }


@router.get("/saludo")
def read_saludo() -> dict[str, str]:
    """Respuesta sencilla para pruebas rapidas desde el frontend."""
    return {"message": "Hola desde el backend"}
