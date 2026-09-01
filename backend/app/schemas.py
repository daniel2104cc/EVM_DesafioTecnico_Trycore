from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ProjectCreate(BaseModel):
    name: str
    
class ProjectUpdate(BaseModel):
    name: str

class ProjectResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class ActivityCreate(BaseModel):
    name: str
    bac: Decimal = Field(gt=0)
    planned_progress: Decimal = Field(ge=0, le=100)
    actual_progress: Decimal = Field(ge=0, le=100)
    actual_cost: Decimal = Field(ge=0)


class ActivityUpdate(BaseModel):
    name: str
    bac: Decimal = Field(gt=0)
    planned_progress: Decimal = Field(ge=0, le=100)
    actual_progress: Decimal = Field(ge=0, le=100)
    actual_cost: Decimal = Field(ge=0)


class ActivityResponse(BaseModel):
    id: int
    project_id: int
    name: str
    bac: Decimal
    planned_progress: Decimal
    actual_progress: Decimal
    actual_cost: Decimal

    model_config = ConfigDict(from_attributes=True)