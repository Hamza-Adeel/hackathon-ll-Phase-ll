from pydantic import BaseModel

class TaskBase(BaseModel):
    title: str

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    is_completed: bool
    owner_id: int

    class Config:
        orm_mode = True
