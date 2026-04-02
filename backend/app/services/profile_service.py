from datetime import datetime, timezone

from app.schemas.analyze import AnalyzeRequest, AnalyzeResponse
from app.schemas.process import ProcessRequest, ProcessResponse


def get_age_category(age: int) -> str:
    """Clasifica una edad en una categoria simple y reutilizable."""
    if 0 <= age <= 12:
        return "nino"
    if 13 <= age <= 17:
        return "adolescente"
    if 18 <= age <= 29:
        return "adulto_joven"
    if 30 <= age <= 59:
        return "adulto"
    return "adulto_mayor"


def get_priority(category: str) -> str:
    """Asigna prioridad segun la categoria de edad."""
    priority_map = {
        "nino": "media",
        "adolescente": "media",
        "adulto_joven": "alta",
        "adulto": "alta",
        "adulto_mayor": "media",
    }
    return priority_map[category]


def build_recommendation(category: str, occupation: str, city: str) -> str:
    """Genera una recomendacion legible para el frontend."""
    recommendation_map = {
        "nino": "aprendizaje, acompanamiento familiar y actividades formativas",
        "adolescente": "orientacion academica y desarrollo de habilidades",
        "adulto_joven": "estudio, empleo y crecimiento profesional",
        "adulto": "estabilidad laboral, bienestar y planificacion financiera",
        "adulto_mayor": "salud, rutina y apoyo comunitario",
    }

    focus = recommendation_map[category]
    return f"Como {occupation} en {city}, te conviene enfocarte en {focus}."


def get_utc_timestamp() -> str:
    """Devuelve la fecha actual en formato ISO 8601 y zona UTC."""
    return datetime.now(timezone.utc).isoformat()


def build_process_response(payload: ProcessRequest) -> ProcessResponse:
    """Construye la respuesta para el endpoint /procesar."""
    category = get_age_category(payload.edad)
    message = (
        f"Hola {payload.nombre}, tienes {payload.edad} anios y "
        f"perteneces a la categoria {category}."
    )

    return ProcessResponse(mensaje=message, categoria=category)


def build_analysis_response(payload: AnalyzeRequest) -> AnalyzeResponse:
    """Construye la respuesta para el endpoint /analizar."""
    category = get_age_category(payload.edad)
    recommendation = build_recommendation(
        category=category,
        occupation=payload.ocupacion,
        city=payload.ciudad,
    )

    return AnalyzeResponse(
        saludo=f"Hola {payload.nombre}, analizamos tu perfil desde {payload.ciudad}.",
        categoria=category,
        recomendacion=recommendation,
        prioridad=get_priority(category),
        timestamp=get_utc_timestamp(),
    )
