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

async function fetchProjectsData() {
  const response = await fetch(`${API_URL}/projects`);

  if (!response.ok) {
    throw new Error("Failed to load projects");
  }

  return response.json();
}

async function fetchProjectEvmData(projectId) {
  const response = await fetch(`${API_URL}/projects/${projectId}/evm`);

  if (!response.ok) {
    throw new Error("Failed to load project EVM data");
  }

  return response.json();
}

function formatNumber(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "N/A";
  }

  return number.toFixed(2);
}

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectData, setProjectData] = useState(null);

  const [activityForm, setActivityForm] = useState(emptyActivity);
  const [editingActivityId, setEditingActivityId] = useState(null);

  // Load projects when the application starts.
  useEffect(() => {
    async function loadInitialProjects() {
      try {
        const data = await fetchProjectsData();

        setProjects(data);

        if (data.length > 0) {
          setSelectedProjectId(String(data[0].id));
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadInitialProjects();
  }, []);

  // Load EVM information whenever the selected project changes.
  useEffect(() => {
    if (!selectedProjectId) {
      return;
    }

    async function loadSelectedProject() {
      try {
        const data = await fetchProjectEvmData(selectedProjectId);
        setProjectData(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadSelectedProject();
  }, [selectedProjectId]);

  async function refreshProjectEvm() {
    if (!selectedProjectId) {
      return;
    }

    try {
      const data = await fetchProjectEvmData(selectedProjectId);
      setProjectData(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleProjectSelection(event) {
    const projectId = event.target.value;

    setSelectedProjectId(projectId);

    if (!projectId) {
      setProjectData(null);
      setEditingActivityId(null);
      setActivityForm(emptyActivity);
    }
  }

  async function createProject(event) {
    event.preventDefault();

    if (!projectName.trim()) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const project = await response.json();
      const updatedProjects = await fetchProjectsData();

      setProjects(updatedProjects);
      setProjectName("");
      setSelectedProjectId(String(project.id));
    } catch (error) {
      console.error(error);
    }
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

    try {
      const response = await fetch(`${API_URL}/projects/${selectedProjectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      const remainingProjects = await fetchProjectsData();

      setProjects(remainingProjects);
      setProjectData(null);
      setEditingActivityId(null);
      setActivityForm(emptyActivity);

      if (remainingProjects.length > 0) {
        setSelectedProjectId(String(remainingProjects[0].id));
      } else {
        setSelectedProjectId("");
      }
    } catch (error) {
      console.error(error);
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

    try {
      let response;

      if (editingActivityId) {
        response = await fetch(`${API_URL}/activities/${editingActivityId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(
          `${API_URL}/projects/${selectedProjectId}/activities`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );
      }

      if (!response.ok) {
        throw new Error("Failed to save activity");
      }

      setActivityForm(emptyActivity);
      setEditingActivityId(null);

      await refreshProjectEvm();
    } catch (error) {
      console.error(error);
    }
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
    try {
      const response = await fetch(`${API_URL}/activities/${activityId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete activity");
      }

      await refreshProjectEvm();
    } catch (error) {
      console.error(error);
    }
  }

  function cancelEdit() {
    setEditingActivityId(null);
    setActivityForm(emptyActivity);
  }

  const summary = projectData?.summary;

  const chartData =
    projectData?.activities.map((activity) => ({
      name: activity.name,
      pv: Number(activity.pv),
      ev: Number(activity.ev),
      actual_cost: Number(activity.actual_cost),
    })) ?? [];

  return (
    <main className="container">
      <h1>EVM Project Dashboard</h1>

      <section className="project-section">
        <form onSubmit={createProject}>
          <input
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="Project name"
            required
          />

          <button type="submit">Create project</button>
        </form>

        <select value={selectedProjectId} onChange={handleProjectSelection}>
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

      {projectData && summary && (
        <>
          <h2>{projectData.project_name}</h2>

          <section className="cards">
            <article>
              <span>BAC</span>
              <strong>${formatNumber(summary.bac)}</strong>
            </article>

            <article>
              <span>CPI</span>

              <strong>{formatNumber(summary.cpi)}</strong>

              <small>{summary.cost_status}</small>
            </article>

            <article>
              <span>SPI</span>

              <strong>{formatNumber(summary.spi)}</strong>

              <small>{summary.schedule_status}</small>
            </article>

            <article>
              <span>EAC</span>

              <strong>
                {summary.eac !== null ? `$${formatNumber(summary.eac)}` : "N/A"}
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
                min="0"
                step="0.01"
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
                step="0.01"
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
                step="0.01"
                placeholder="Actual %"
                value={activityForm.actual_progress}
                onChange={handleActivityChange}
                required
              />

              <input
                name="actual_cost"
                type="number"
                min="0"
                step="0.01"
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

                      <td>{formatNumber(activity.bac)}</td>

                      <td>{formatNumber(activity.pv)}</td>

                      <td>{formatNumber(activity.ev)}</td>

                      <td>{formatNumber(activity.actual_cost)}</td>

                      <td>{formatNumber(activity.cv)}</td>

                      <td>{formatNumber(activity.sv)}</td>

                      <td>{formatNumber(activity.cpi)}</td>

                      <td>{formatNumber(activity.spi)}</td>

                      <td>
                        <button
                          type="button"
                          onClick={() => editActivity(activity)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteActivity(activity.id)}
                        >
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
            <h3>PV vs EV vs AC by activity</h3>

            <p>Accumulated values at the current cutoff date</p>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  label={{
                    value: "Activity",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />

                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("es-CO", {
                      notation: "compact",
                    }).format(value)
                  }
                  label={{
                    value: "Value (COP)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />

                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    }).format(Number(value))
                  }
                />

                <Legend />

                <Bar dataKey="pv" name="PV - Planned Value" fill="#2563eb" />

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
