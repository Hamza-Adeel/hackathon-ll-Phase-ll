from fastapi.testclient import TestClient
import pytest
from sqlmodel import Session, SQLModel, create_engine

from app.db.session import get_session
from app.main import app
from app.models.task import Task

sqlite_file_name = "test.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url, echo=True)


def override_get_session():
    with Session(engine) as session:
        yield session


app.dependency_overrides[get_session] = override_get_session


@pytest.fixture(name="session")
def session_fixture():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)


@pytest.fixture(name="client")
def client_fixture():
    SQLModel.metadata.create_all(engine)
    with TestClient(app) as c:
        yield c
    SQLModel.metadata.drop_all(engine)


def test_create_task(client: TestClient):
    response = client.post(
        "/api/v1/tasks/",
        json={"title": "Test Task"},
    )
    data = response.json()
    assert response.status_code == 200
    assert data["title"] == "Test Task"
    assert data["is_completed"] is False
    assert data["owner_id"] == 1
    assert data["id"] is not None


def test_read_tasks(session: Session, client: TestClient):
    # Create a task directly in the DB
    task = Task(title="Test Task for reading", owner_id=1)
    session.add(task)
    session.commit()

    response = client.get("/api/v1/tasks/")
    data = response.json()

    assert response.status_code == 200
    assert len(data) > 0
    assert data[0]["title"] == "Test Task for reading"
