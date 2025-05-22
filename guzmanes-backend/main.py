# guzmanes-backend/main.py

from fastapi import FastAPI, HTTPException, status, Depends # <-- Asegúrate de que Depends está importado
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
import json

from sqlmodel import Field, Session, SQLModel, create_engine, select

# --- Configuración de CORS ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://rutascclosguzmanes.netlify.app", # Tu frontend desplegado
    "https://guzmanes-backend.onrender.com", # Tu propio dominio de backend
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- FIN Configuración de CORS ---


# --- Configuración de la Base de Datos PostgreSQL ---
# ¡¡¡IMPORTANTE!!! Aquí usamos directamente tu URL de base de datos de Render.
# La he convertido de 'postgresql://' a 'postgresql://' porque SQLModel/SQLAlchemy
# requieren 'postgresql' como el nombre del driver.
SQLALCHEMY_DATABASE_URL = "postgresql://guzmanes_db_user:lBR00fbojPdRX9q1rOnPzXCtfwdLyK11@dpg-d0n4cv95pdvs7389hmrg-a.frankfurt-postgres.render.com/guzmanes_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True) # echo=True para ver las queries SQL en los logs


# Modelos (AHORA HEREDAN DE SQLModel para ser tablas de BD)
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)

class Route(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    date: str # Formato YYYY-MM-DD
    time: str  # Formato HH:MM o HH:MM:SS
    type: str # "carretera" o "gravel"
    distance: int
    elevation: int
    trackLink: Optional[str] = None # Hacemos trackLink opcional para ser coherentes
    # Los participantes se manejarán como una cadena JSON en la base de datos
    participants_json: str = Field(default="[]")

    @property
    def participants(self) -> List[str]:
        try:
            return json.loads(self.participants_json)
        except json.JSONDecodeError:
            return []

    @participants.setter
    def participants(self, value: List[str]):
        self.participants_json = json.dumps(value)


# Función para crear las tablas en la base de datos
def create_db_and_tables():
    # ¡¡¡IMPORTANTE!!! Ya no borramos la base de datos al iniciar.
    # SQLModel.metadata.drop_all(engine) # ¡¡¡ELIMINADA!!!
    SQLModel.metadata.create_all(engine)
    print("Database tables created if not existing.") # Mensaje útil para los logs de Render

# Dependencia para obtener la sesión de la base de datos
def get_session():
    with Session(engine) as session:
        yield session

# Evento de inicio de la aplicación: crear tablas
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Endpoints para Rutas
@app.get("/routes", response_model=List[Route])
async def get_all_routes(session: Session = Depends(get_session)):
    """
    Obtiene todas las rutas.
    """
    routes = session.exec(select(Route)).all()
    return routes

@app.post("/routes", response_model=Route, status_code=status.HTTP_201_CREATED)
async def create_route(route: Route, session: Session = Depends(get_session)):
    """
    Crea una nueva ruta.
    """
    new_route = Route(
        name=route.name,
        date=route.date,
        time=route.time,
        type=route.type,
        distance=route.distance,
        elevation=route.elevation,
        trackLink=route.trackLink,
        participants=[] # Se inicializa vacío, el setter lo convertirá a JSON
    )
    session.add(new_route)
    session.commit()
    session.refresh(new_route)
    return new_route

@app.delete("/routes/{route_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_route(route_id: int, session: Session = Depends(get_session)):
    """
    Borra una ruta por su ID.
    """
    route = session.get(Route, route_id)
    if not route:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")
    session.delete(route)
    session.commit()
    return

# Endpoint para modificar una ruta existente
@app.put("/routes/{route_id}", response_model=Route)
async def update_route(
    route_id: int,
    updated_route: Route, # Espera el objeto Route completo con los campos a actualizar
    session: Session = Depends(get_session)
):
    """
    Modifica una ruta existente por su ID.
    """
    route = session.get(Route, route_id)
    if not route:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")

    # Actualiza los campos de la ruta existente con los valores del updated_route
    # No actualizamos 'id' ni 'participants_json' directamente aquí.
    # Los participantes se manejan con los endpoints /join y /leave.
    route.name = updated_route.name
    route.date = updated_route.date
    route.time = updated_route.time
    route.type = updated_route.type
    route.distance = updated_route.distance
    route.elevation = updated_route.elevation
    route.trackLink = updated_route.trackLink

    session.add(route)
    session.commit()
    session.refresh(route)
    return route

@app.post("/routes/{route_id}/join", response_model=Route)
async def join_route(route_id: int, user: User, session: Session = Depends(get_session)):
    """
    Permite a un usuario apuntarse a una ruta.
    """
    route = session.get(Route, route_id)
    if not route:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")

    participants_list = route.participants
    if user.username not in participants_list:
        participants_list.append(user.username)
        route.participants = participants_list
        session.add(route)
        session.commit()
        session.refresh(route)
    return route

@app.post("/routes/{route_id}/leave", response_model=Route)
async def leave_route(route_id: int, user: User, session: Session = Depends(get_session)):
    """
    Permite a un usuario borrarse de una ruta.
    """
    route = session.get(Route, route_id)
    if not route:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")

    participants_list = route.participants
    if user.username in participants_list:
        participants_list.remove(user.username)
        route.participants = participants_list
        session.add(route)
        session.commit()
        session.refresh(route)
    return route

# Endpoints para Usuarios
@app.post("/users", response_model=User)
async def sync_user(user: User, session: Session = Depends(get_session)):
    """
    Sincroniza un usuario con la base de datos, creándolo si no existe.
    """
    existing_user = session.exec(select(User).where(User.username == user.username)).first()

    if not existing_user:
        new_user = User(username=user.username)
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return new_user
    return existing_user