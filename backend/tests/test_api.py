from decimal import Decimal


def create_project(client):
    response = client.post(
        "/projects",
        json={"name": "Test Project"},
    )
    assert response.status_code == 201
    return response.json()


def create_activity(client, project_id):
    response = client.post(
        f"/projects/{project_id}/activities",
        json={
            "name": "Test Activity",
            "bac": 10000,
            "planned_progress": 60,
            "actual_progress": 50,
            "actual_cost": 5500,
        },
    )
    assert response.status_code == 201
    return response.json()


def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_project(client):
    response = client.post(
        "/projects",
        json={"name": "Project A"},
    )

    assert response.status_code == 201
    assert response.json()["name"] == "Project A"
    assert "id" in response.json()


def test_get_projects(client):
    create_project(client)

    response = client.get("/projects")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_project(client):
    project = create_project(client)

    response = client.get(f"/projects/{project['id']}")

    assert response.status_code == 200
    assert response.json()["id"] == project["id"]


def test_update_project(client):
    project = create_project(client)

    response = client.put(
        f"/projects/{project['id']}",
        json={"name": "Updated Project"},
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Updated Project"


def test_delete_project(client):
    project = create_project(client)

    response = client.delete(f"/projects/{project['id']}")

    assert response.status_code == 204


def test_create_activity(client):
    project = create_project(client)

    response = client.post(
        f"/projects/{project['id']}/activities",
        json={
            "name": "Development",
            "bac": 10000,
            "planned_progress": 60,
            "actual_progress": 50,
            "actual_cost": 5500,
        },
    )

    assert response.status_code == 201
    assert response.json()["project_id"] == project["id"]
    assert response.json()["name"] == "Development"


def test_get_project_activities(client):
    project = create_project(client)
    create_activity(client, project["id"])

    response = client.get(
        f"/projects/{project['id']}/activities"
    )

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_get_activity(client):
    project = create_project(client)
    activity = create_activity(client, project["id"])

    response = client.get(
        f"/activities/{activity['id']}"
    )

    assert response.status_code == 200
    assert response.json()["id"] == activity["id"]


def test_update_activity(client):
    project = create_project(client)
    activity = create_activity(client, project["id"])

    response = client.put(
        f"/activities/{activity['id']}",
        json={
            "name": "Updated Activity",
            "bac": 12000,
            "planned_progress": 70,
            "actual_progress": 60,
            "actual_cost": 6500,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Updated Activity"
    assert Decimal(data["bac"]) == Decimal("12000")


def test_delete_activity(client):
    project = create_project(client)
    activity = create_activity(client, project["id"])

    response = client.delete(
        f"/activities/{activity['id']}"
    )

    assert response.status_code == 204


def test_project_evm_endpoint(client):
    project = create_project(client)
    create_activity(client, project["id"])

    response = client.get(
        f"/projects/{project['id']}/evm"
    )

    data = response.json()

    assert response.status_code == 200
    assert data["project_id"] == project["id"]

    assert "summary" in data
    assert "activities" in data

    assert data["summary"]["bac"] == 10000
    assert data["summary"]["pv"] == 6000
    assert data["summary"]["ev"] == 5000
    assert data["summary"]["ac"] == 5500

    assert len(data["activities"]) == 1