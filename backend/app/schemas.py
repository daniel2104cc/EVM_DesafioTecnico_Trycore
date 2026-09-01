from pydantic import BaseModel, ConfigDict, Field


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)


class ProjectUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=150)


class ProjectResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)