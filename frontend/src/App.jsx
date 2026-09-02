import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import "./App.css";

const API_URL = "http://127.0.0.1:8000";

const emptyActivity = {
  name: "",
  bac: "",
  planned_progress: "",
  actual_progress: "",
  actual_cost: "",
};

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectData, setProjectData] = useState(null);

  const [activityForm, setActivityForm] = useState(emptyActivity);
  const [editingActivityId, setEditingActivityId] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadProjectEvm(selectedProjectId);
    } else {
      setProjectData(null);
    }
  }, [selectedProjectId]);

  async function loadProjects() {
    const response = await fetch(`${API_URL}/projects`);
    const data = await response.json();

    setProjects(data);

    if (data.length > 0 && !selectedProjectId) {
      setSelectedProjectId(String(data[0].id));
    }
  }

  async function loadProjectEvm(projectId) {
    const response = await fetch(`${API_URL}/projects/${projectId}/evm`);

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    setProjectData(data);
  }

  async function createProject(event) {
    event.preventDefault();

    if (!projectName.trim()) {
      return;
    }

    const response = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
      }),
    });

    const project = await response.json();

    setProjectName("");
    await loadProjects();
    setSelectedProjectId(String(project.id));
  }
  async function deleteProject() {
    if (!selectedProjectId) {
      return;
    }

    const confirmed = window.confirm(
      "Delete this project and all its activities?",
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch(`${API_URL}/projects/${selectedProjectId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return;
    }

    const projectsResponse = await fetch(`${API_URL}/projects`);
    const remainingProjects = await projectsResponse.json();

    setProjects(remainingProjects);
    setProjectData(null);

    if (remainingProjects.length > 0) {
      setSelectedProjectId(String(remainingProjects[0].id));
    } else {
      setSelectedProjectId("");
    }
  }
  function handleActivityChange(event) {
    const { name, value } = event.target;

    setActivityForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function saveActivity(event) {
    event.preventDefault();

    if (!selectedProjectId) {
      return;
    }

    const payload = {
      name: activityForm.name,
      bac: Number(activityForm.bac),
      planned_progress: Number(activityForm.planned_progress),
      actual_progress: Number(activityForm.actual_progress),
      actual_cost: Number(activityForm.actual_cost),
    };

    if (editingActivityId) {
      await fetch(`${API_URL}/activities/${editingActivityId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(`${API_URL}/projects/${selectedProjectId}/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    setActivityForm(emptyActivity);
    setEditingActivityId(null);

    await loadProjectEvm(selectedProjectId);
  }

  function editActivity(activity) {
    setEditingActivityId(activity.id);

    setActivityForm({
      name: activity.name,
      bac: activity.bac,
      planned_progress: activity.planned_progress,
      actual_progress: activity.actual_progress,
      actual_cost: activity.actual_cost,
    });
  }

  async function deleteActivity(activityId) {
    await fetch(`${API_URL}/activities/${activityId}`, {
      method: "DELETE",
    });

    await loadProjectEvm(selectedProjectId);
  }

  function cancelEdit() {
    setEditingActivityId(null);
    setActivityForm(emptyActivity);
  }

  const summary = projectData?.summary;

  return (
    <main className="container">
      <h1>EVM Project Dashboard</h1>

      <section className="project-section">
        <form onSubmit={createProject}>
          <input
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="Project name"
          />

          <button type="submit">Create project</button>
        </form>

        <select
          value={selectedProjectId}
          onChange={(event) => setSelectedProjectId(event.target.value)}
        >
          <option value="">Select project</option>

          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={deleteProject}
          disabled={!selectedProjectId}
        >
          Delete project
        </button>
      </section>

      {projectData && (
        <>
          <h2>{projectData.project_name}</h2>

          <section className="cards">
            <article>
              <span>BAC</span>
              <strong>${summary.bac.toFixed(2)}</strong>
            </article>

            <article>
              <span>CPI</span>
              <strong>
                {summary.cpi !== null ? summary.cpi.toFixed(2) : "N/A"}
              </strong>
              <small>{summary.cost_status}</small>
            </article>

            <article>
              <span>SPI</span>
              <strong>
                {summary.spi !== null ? summary.spi.toFixed(2) : "N/A"}
              </strong>
              <small>{summary.schedule_status}</small>
            </article>

            <article>
              <span>EAC</span>
              <strong>
                {summary.eac !== null ? `$${summary.eac.toFixed(2)}` : "N/A"}
              </strong>
            </article>
          </section>

          <section className="panel">
            <h3>{editingActivityId ? "Edit activity" : "Add activity"}</h3>

            <form className="activity-form" onSubmit={saveActivity}>
              <input
                name="name"
                placeholder="Activity name"
                value={activityForm.name}
                onChange={handleActivityChange}
                required
              />

              <input
                name="bac"
                type="number"
                placeholder="BAC"
                value={activityForm.bac}
                onChange={handleActivityChange}
                required
              />

              <input
                name="planned_progress"
                type="number"
                min="0"
                max="100"
                placeholder="Planned %"
                value={activityForm.planned_progress}
                onChange={handleActivityChange}
                required
              />

              <input
                name="actual_progress"
                type="number"
                min="0"
                max="100"
                placeholder="Actual %"
                value={activityForm.actual_progress}
                onChange={handleActivityChange}
                required
              />

              <input
                name="actual_cost"
                type="number"
                placeholder="Actual cost"
                value={activityForm.actual_cost}
                onChange={handleActivityChange}
                required
              />

              <button type="submit">
                {editingActivityId ? "Update" : "Add"}
              </button>

              {editingActivityId && (
                <button type="button" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </form>
          </section>

          <section className="panel">
            <h3>Activities</h3>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>BAC</th>
                    <th>PV</th>
                    <th>EV</th>
                    <th>AC</th>
                    <th>CV</th>
                    <th>SV</th>
                    <th>CPI</th>
                    <th>SPI</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {projectData.activities.map((activity) => (
                    <tr key={activity.id}>
                      <td>{activity.name}</td>
                      <td>{Number(activity.bac).toFixed(2)}</td>
                      <td>{activity.pv.toFixed(2)}</td>
                      <td>{activity.ev.toFixed(2)}</td>
                      <td>{Number(activity.actual_cost).toFixed(2)}</td>
                      <td>{activity.cv.toFixed(2)}</td>
                      <td>{activity.sv.toFixed(2)}</td>

                      <td>
                        {activity.cpi !== null
                          ? activity.cpi.toFixed(2)
                          : "N/A"}
                      </td>

                      <td>
                        {activity.spi !== null
                          ? activity.spi.toFixed(2)
                          : "N/A"}
                      </td>

                      <td>
                        <button onClick={() => editActivity(activity)}>
                          Edit
                        </button>

                        <button onClick={() => deleteActivity(activity.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel chart">
            <h3>PV vs EV vs AC</h3>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={projectData.activities}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar dataKey="pv" name="PV- Planned Value" fill="#2563eb" />
                <Bar dataKey="ev" name="EV - Earned Value" fill="#16a34a" />
                <Bar
                  dataKey="actual_cost"
                  name="AC - Actual Cost"
                  fill="#f97316"
                />
              </BarChart>
            </ResponsiveContainer>
          </section>
        </>
      )}
    </main>
  );
}

export default App;
