
function TaskItem({ task, onEdit, onDelete }) {
  const statusLabels = {
    pending: "Pending",
    "in-progress": "In Progress",
    completed: "Completed"
  };

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC"
      })
    : "No due date";

  return (
    <article className={`task-card status-${task.status}`}>
      <div className="task-card-top">
        <span className={`status-badge ${task.status}`}>
          {statusLabels[task.status] || task.status}
        </span>

        <span className="task-date">{formattedDate}</span>
      </div>

      <h3>{task.title}</h3>
      <p className="task-description">
        {task.description || "No description provided."}
      </p>

      <div className="task-card-actions">
        <button
          className="secondary-button"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          className="delete-button"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskItem;
