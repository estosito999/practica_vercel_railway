# Backend FastAPI para monorepo Next.js + Railway

Este backend vive completamente dentro de `backend/` y se mantiene separado del frontend en Next.js. La idea es que el frontend se despliegue en Vercel y este backend en Railway, ambos conectados al mismo repositorio.

## Estructura

```text
backend/
├─ .env.example
├─ .gitignore
├─ README.md
├─ requirements.txt
└─ app/
   ├─ __init__.py
   ├─ main.py
   ├─ core/
   │  ├─ __init__.py
   │  └─ config.py
   ├─ routers/
   │  ├─ __init__.py
   │  ├─ base.py
   │  └─ actions.py
   ├─ schemas/
   │  ├─ __init__.py
   │  ├─ process.py
   │  └─ analyze.py
   └─ services/
      ├─ __init__.py
      └─ profile_service.py
```

## Endpoints disponibles

- `GET /`
- `GET /saludo`
- `POST /procesar`
- `POST /analizar`

## Variables de entorno

Archivo de ejemplo: `.env.example`

```env
APP_NAME=PracticaRail Backend
APP_VERSION=1.0.0
ALLOWED_ORIGINS=http://localhost:3000,https://tu-frontend.vercel.app
```

`ALLOWED_ORIGINS` acepta una lista separada por comas. Aqui debes poner el dominio local de Next.js y la URL real de tu frontend en Vercel.

## Ejecucion local

1. Entra a la carpeta del backend:

```bash
cd backend
```

2. Crea un entorno virtual:

```bash
python -m venv .venv
```

3. Activa el entorno virtual:

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

macOS / Linux:

```bash
source .venv/bin/activate
```

4. Instala dependencias:

```bash
pip install -r requirements.txt
```

5. Crea tu archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

En PowerShell puedes usar:

```powershell
Copy-Item .env.example .env
```

6. Ejecuta el servidor:

```bash
uvicorn app.main:app --reload
```

7. Abre la documentacion automatica:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Deploy en Railway

1. Sube este proyecto a GitHub.
2. Crea un nuevo proyecto en Railway.
3. Conecta el repositorio.
4. En la configuracion del servicio, usa `backend` como Root Directory.
5. Configura el build command:

```bash
pip install -r requirements.txt
```

6. Configura el start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

7. Agrega variables de entorno en Railway:

- `APP_NAME=PracticaRail Backend`
- `APP_VERSION=1.0.0`
- `ALLOWED_ORIGINS=http://localhost:3000,https://tu-frontend.vercel.app`

8. Despliega el servicio.

Cuando Railway publique el backend, copia su URL y usala en el frontend como `API_URL`.

## Ejemplo de consumo desde Next.js App Router

Este ejemplo es solo de referencia. No se crea ningun archivo de frontend dentro del backend.

### 1. Variable de entorno en el frontend

```env
API_URL=https://tu-backend.up.railway.app
```

### 2. Consumir `GET /saludo` desde un Server Component

```tsx
async function getSaludo() {
  const response = await fetch(`${process.env.API_URL}/saludo`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el saludo");
  }

  return response.json();
}

export default async function Page() {
  const data = await getSaludo();

  return <h1>{data.message}</h1>;
}
```

### 3. Consumir `POST /procesar`

```tsx
async function procesarPersona() {
  const response = await fetch(`${process.env.API_URL}/procesar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      nombre: "Ana",
      edad: 24,
    }),
  });

  if (!response.ok) {
    throw new Error("No se pudo procesar la informacion");
  }

  return response.json();
}
```

### 4. Consumir `POST /analizar`

```tsx
async function analizarPersona() {
  const response = await fetch(`${process.env.API_URL}/analizar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      nombre: "Carlos",
      edad: 34,
      ocupacion: "Disenador",
      ciudad: "La Paz",
    }),
  });

  if (!response.ok) {
    throw new Error("No se pudo analizar la informacion");
  }

  return response.json();
}
```

## Respuestas esperadas

### `GET /`

```json
{
  "message": "Backend FastAPI funcionando",
  "service": "PracticaRail Backend",
  "version": "1.0.0"
}
```

### `GET /saludo`

```json
{
  "message": "Hola desde el backend"
}
```

### `POST /procesar`

Request:

```json
{
  "nombre": "Ana",
  "edad": 24
}
```

Response:

```json
{
  "mensaje": "Hola Ana, tienes 24 anios y perteneces a la categoria adulto_joven.",
  "categoria": "adulto_joven"
}
```

### `POST /analizar`

Request:

```json
{
  "nombre": "Carlos",
  "edad": 34,
  "ocupacion": "Disenador",
  "ciudad": "La Paz"
}
```

Response:

```json
{
  "saludo": "Hola Carlos, analizamos tu perfil desde La Paz.",
  "categoria": "adulto",
  "recomendacion": "Como Disenador en La Paz, te conviene enfocarte en estabilidad laboral, bienestar y planificacion financiera.",
  "prioridad": "alta",
  "timestamp": "2026-04-01T00:00:00+00:00"
}
```

## Pruebas manuales recomendadas

- Verificar `GET /` con respuesta `200`.
- Verificar `GET /saludo` con respuesta `200`.
- Enviar un nombre vacio a `POST /procesar` y confirmar error `422`.
- Enviar una edad negativa a `POST /procesar` y confirmar error `422`.
- Enviar texto en `edad` a `POST /analizar` y confirmar error `422`.
- Confirmar que la categoria de edad coincida en `POST /procesar` y `POST /analizar`.
- Confirmar que CORS permite solicitudes desde `http://localhost:3000` y desde tu dominio de Vercel.
