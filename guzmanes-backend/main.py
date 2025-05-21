# main.py
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import json

app = FastAPI()

# Configuración de CORS para permitir solicitudes desde tu frontend
origins = [
    "http://localhost:3000", # Para React en desarrollo
    "http://127.0.0.1:3000", # Para React en desarrollo
    # Agrega aquí cualquier otra URL donde se despliegue tu frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Permite todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"], # Permite todos los encabezados
)

# Base de datos en memoria (para simular, reemplazar con una base de datos real si es necesario)
# Almacenaremos los participantes como una cadena JSON en 'participants_json'
# id_counter se usará para asignar IDs únicos a las rutas
db_routes = []
db_users = {} # {username: UserObject}
route_id_counter = 0
user_id_counter = 0

class User(BaseModel):
    id: Optional[int] = None
    username: str

class Route(BaseModel):
    id: Optional[int] = None
    name: str
    date: str # Formato YYYY-MM-DD
    type: str # "carretera" o "gravel"
    distance: int
    elevation: int
    trackLink: str
    # ¡CAMBIO CLAVE AQUÍ! Ahora 'participants' es una lista de strings
    participants: List[str] = Field(default_factory=list)

# Función auxiliar para convertir el formato de la DB a la Pydantic model
def _route_db_to_pydantic(route_data: Dict[str, Any]) -> Route:
    # Asegurarse de que participants_json existe y es una cadena, luego parsearla
    participants = []
    if 'participants_json' in route_data and isinstance(route_data['participants_json'], str):
        try:
            participants = json.loads(route_data['participants_json'])
        except json.JSONDecodeError:
            print(f"Warning: Could not decode participants_json for route {route_data.get('id')}: {route_data['participants_json']}")
            participants = [] # Default to empty list on error
    elif 'participants' in route_data and isinstance(route_data['participants'], list):
        # Si ya viene como lista (e.g. al crear), úsala directamente
        participants = route_data['participants']

    return Route(
        id=route_data.get('id'),
        name=route_data['name'],
        date=route_data['date'],
        type=route_data['type'],
        distance=route_data['distance'],
        elevation=route_data['elevation'],
        trackLink=route_data['trackLink'],
        participants=participants # Asigna la lista parseada
    )

# Función auxiliar para convertir el formato de la Pydantic model a la DB
def _route_pydantic_to_db(route: Route) -> Dict[str, Any]:
    return {
        "id": route.id,
        "name": route.name,
        "date": route.date,
        "type": route.type,
        "distance": route.distance,
        "elevation": route.elevation,
        "trackLink": route.trackLink,
        # ¡CAMBIO CLAVE AQUÍ! Serializa la lista 'participants' a una cadena JSON
        "participants_json": json.dumps(route.participants)
    }

# Endpoints para Rutas
@app.get("/routes", response_model=List[Route])
async def get_all_routes():
    """
    Obtiene todas las rutas.
    """
    # Convierte los datos de la DB al modelo Pydantic Route
    return [_route_db_to_pydantic(r) for r in db_routes]

@app.post("/routes", response_model=Route, status_code=status.HTTP_201_CREATED)
async def create_route(route: Route):
    """
    Crea una nueva ruta.
    """
    global route_id_counter
    route_id_counter += 1
    # Asegúrate de que la ruta tenga un ID y los participantes iniciales
    new_route_data = _route_pydantic_to_db(Route(
        id=route_id_counter,
        name=route.name,
        date=route.date,
        type=route.type,
        distance=route.distance,
        elevation=route.elevation,
        trackLink=route.trackLink,
        participants=[] # Inicializa la lista de participantes vacía
    ))
    db_routes.append(new_route_data)
    # Devuelve la ruta creada con el formato Pydantic correcto
    return _route_db_to_pydantic(new_route_data)

@app.delete("/routes/{route_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_route(route_id: int):
    """
    Borra una ruta por su ID.
    """
    global db_routes
    initial_len = len(db_routes)
    db_routes = [r for r in db_routes if r['id'] != route_id]
    if len(db_routes) == initial_len:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")
    return {"message": "Route deleted successfully"}

@app.post("/routes/{route_id}/join", response_model=Route)
async def join_route(route_id: int, user: User):
    """
    Permite a un usuario apuntarse a una ruta.
    """
    for i, r_data in enumerate(db_routes):
        if r_data['id'] == route_id:
            # Convertir de DB a Pydantic
            route = _route_db_to_pydantic(r_data)
            if user.username not in route.participants:
                route.participants.append(user.username)
                # Convertir de Pydantic a DB y actualizar
                db_routes[i] = _route_pydantic_to_db(route)
            return _route_db_to_pydantic(db_routes[i]) # Devuelve la ruta actualizada
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")

@app.post("/routes/{route_id}/leave", response_model=Route)
async def leave_route(route_id: int, user: User):
    """
    Permite a un usuario borrarse de una ruta.
    """
    for i, r_data in enumerate(db_routes):
        if r_data['id'] == route_id:
            # Convertir de DB a Pydantic
            route = _route_db_to_pydantic(r_data)
            if user.username in route.participants:
                route.participants.remove(user.username)
                # Convertir de Pydantic a DB y actualizar
                db_routes[i] = _route_pydantic_to_db(route)
            return _route_db_to_pydantic(db_routes[i]) # Devuelve la ruta actualizada
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")

# Endpoints para Usuarios (para sincronizar el usuario actual)
@app.post("/users", response_model=User)
async def sync_user(user: User):
    """
    Sincroniza un usuario con la base de datos, creándolo si no existe.
    """
    if user.username not in db_users:
        global user_id_counter
        user_id_counter += 1
        db_users[user.username] = User(id=user_id_counter, username=user.username)
    return db_users[user.username]