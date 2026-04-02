from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Variables de entorno y configuracion global."""

    app_name: str = Field(default="PracticaRail Backend", alias="APP_NAME")
    app_version: str = Field(default="1.0.0", alias="APP_VERSION")
    allowed_origins: list[str] = Field(
        default_factory=lambda: ["http://localhost:3000"],
        alias="ALLOWED_ORIGINS",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, value: str | list[str]) -> list[str]:
        """Convierte una cadena separada por comas en una lista limpia."""
        if isinstance(value, str):
            origins = [origin.strip() for origin in value.split(",") if origin.strip()]
            return origins or ["http://localhost:3000"]

        if isinstance(value, list):
            return value

        return ["http://localhost:3000"]


@lru_cache
def get_settings() -> Settings:
    """Evita recrear la configuracion en cada import o request."""
    return Settings()
