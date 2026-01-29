from fastapi import FastAPI
from sqlmodel import SQLModel

from app.api.v1 import tasks as tasks_router
from app.db.session import engine


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


app = FastAPI()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(
    tasks_router.router, prefix="/api/v1/tasks", tags=["tasks"]
)