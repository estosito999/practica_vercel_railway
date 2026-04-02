from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import actions, base


def create_application() -> FastAPI:
    """Crea y configura la aplicacion principal."""
    settings = get_settings()

    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Backend simple y modular para consumir desde Next.js.",
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(base.router)
    application.include_router(actions.router)

    return application


app = create_application()
