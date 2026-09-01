from fastapi import Depends, FastAPI, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Activity, Project
from app.schemas import (
    ActivityCreate,
    ActivityResponse,
    ActivityUpdate,
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
)

app = FastAPI(
    title="EVM Project Dashboard API",
    version="1.0.0",
    docs_url="/api-docs",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post(
    "/projects",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
):
    project = Project(name=project_data.name)

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


@app.get(
    "/projects",
    response_model=list[ProjectResponse],
)
def get_projects(
    db: Session = Depends(get_db),
):
    return db.scalars(select(Project)).all()


@app.get(
    "/projects/{project_id}",
    response_model=ProjectResponse,
)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
):
    project = db.get(Project, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    return project


@app.put(
    "/projects/{project_id}",
    response_model=ProjectResponse,
)
def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
):
    project = db.get(Project, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    project.name = project_data.name

    db.commit()
    db.refresh(project)

    return project


@app.delete(
    "/projects/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
):
    project = db.get(Project, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    db.delete(project)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post(
    "/projects/{project_id}/activities",
    response_model=ActivityResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_activity(
    project_id: int,
    activity_data: ActivityCreate,
    db: Session = Depends(get_db),
):
    project = db.get(Project, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    activity = Activity(
        project_id=project_id,
        **activity_data.model_dump(),
    )

    db.add(activity)
    db.commit()
    db.refresh(activity)

    return activity


@app.get(
    "/projects/{project_id}/activities",
    response_model=list[ActivityResponse],
)
def get_project_activities(
    project_id: int,
    db: Session = Depends(get_db),
):
    project = db.get(Project, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    statement = select(Activity).where(
        Activity.project_id == project_id
    )

    return db.scalars(statement).all()


@app.get(
    "/activities/{activity_id}",
    response_model=ActivityResponse,
)
def get_activity(
    activity_id: int,
    db: Session = Depends(get_db),
):
    activity = db.get(Activity, activity_id)

    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found",
        )

    return activity


@app.put(
    "/activities/{activity_id}",
    response_model=ActivityResponse,
)
def update_activity(
    activity_id: int,
    activity_data: ActivityUpdate,
    db: Session = Depends(get_db),
):
    activity = db.get(Activity, activity_id)

    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found",
        )

    for field, value in activity_data.model_dump().items():
        setattr(activity, field, value)

    db.commit()
    db.refresh(activity)

    return activity


@app.delete(
    "/activities/{activity_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_activity(
    activity_id: int,
    db: Session = Depends(get_db),
):
    activity = db.get(Activity, activity_id)

    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found",
        )

    db.delete(activity)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)