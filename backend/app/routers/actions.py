from fastapi import APIRouter

from app.schemas.analyze import AnalyzeRequest, AnalyzeResponse
from app.schemas.process import ProcessRequest, ProcessResponse
from app.services.profile_service import build_analysis_response, build_process_response

router = APIRouter(tags=["acciones"])


@router.post("/procesar", response_model=ProcessResponse)
def procesar(payload: ProcessRequest) -> ProcessResponse:
    """Valida la entrada y devuelve un resumen basico."""
    return build_process_response(payload)


@router.post("/analizar", response_model=AnalyzeResponse)
def analizar(payload: AnalyzeRequest) -> AnalyzeResponse:
    """Devuelve un analisis simple listo para consumir desde Next.js."""
    return build_analysis_response(payload)
