
import { useCallback, useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from "./api/tasks";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [notice, setNotice] = useState("");

  const loadTasks = useCallback(async () => {
    try {
      setError("");
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load tasks. Check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleSubmit = async (taskData) => {
    try {
      setError("");
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
        setNotice("Task updated successfully.");
        setEditingTask(null);
      } else {
        await createTask(taskData);
        setNotice("Task created successfully.");
      }

      await loadTasks();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not save the task."
      );
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setError("");
      await deleteTask(id);
      setNotice("Task deleted successfully.");

      if (editingTask?._id === id) {
        setEditingTask(null);
      }

      await loadTasks();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not delete the task."
      );
    }
  };

  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((task) => task.status === filter);

  const completedCount = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pendingCount = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon">✓</span>
          <span>TaskFlow</span>
        </a>
        <span className="topbar-label">PERSONAL WORKSPACE</span>
      </header>

      <section className="hero">
        <p className="eyebrow">YOUR PRODUCTIVITY SPACE</p>
        <h1>Make time for what matters.</h1>
        <p className="hero-description">
          Organize your work, track your progress, and get things done.
        </p>
      </section>

      <section className="stats-grid" aria-label="Task summary">
        <div className="stat-card">
          <span className="stat-label">Total tasks</span>
          <strong>{tasks.length}</strong>
          <span className="stat-note">All your tasks</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <strong>{pendingCount}</strong>
          <span className="stat-note">Waiting to start</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">In progress</span>
          <strong>{inProgressCount}</strong>
          <span className="stat-note">Currently working on</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <strong>{completedCount}</strong>
          <span className="stat-note">Tasks finished</span>
        </div>
      </section>

      <section className="workspace">
        <aside className="form-panel">
          <TaskForm
            onSubmit={handleSubmit}
            editingTask={editingTask}
            onCancel={() => setEditingTask(null)}
          />
        </aside>

        <section className="tasks-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR WORKLOAD</p>
              <h2>My tasks <span className="task-count">{tasks.length}</span></h2>
            </div>

            <button className="refresh-button" onClick={loadTasks}>
              ↻ Refresh
            </button>
          </div>

          <div className="filter-bar">
            {[
              { value: "all", label: "All tasks" },
              { value: "pending", label: "Pending" },
              { value: "in-progress", label: "In progress" },
              { value: "completed", label: "Completed" }
            ].map((item) => (
              <button
                key={item.value}
                className={`filter-button ${
                  filter === item.value ? "active" : ""
                }`}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {notice && (
            <p className="notice-message" role="status">
              {notice}
            </p>
          )}

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <TaskList
            tasks={filteredTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </section>
      </section>

      <footer className="app-footer">
        TaskFlow · Stay organized, one task at a time.
      </footer>
    </main>
  );
}

export default App;
