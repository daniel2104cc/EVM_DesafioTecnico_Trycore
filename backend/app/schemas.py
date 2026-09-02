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

class ActivityEVMResponse(ActivityResponse):
    pv: float
    ev: float
    cv: float
    sv: float
    cpi: float | None
    spi: float | None
    eac: float | None
    vac: float | None
    cost_status: str
    schedule_status: str


class ProjectEVMSummary(BaseModel):
    bac: float
    pv: float
    ev: float
    ac: float
    cv: float
    sv: float
    cpi: float | None
    spi: float | None
    eac: float | None
    vac: float | None
    cost_status: str
    schedule_status: str


class ProjectEVMResponse(BaseModel):
    project_id: int
    project_name: str
    summary: ProjectEVMSummary
    activities: list[ActivityEVMResponse]