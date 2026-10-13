
import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  status: "pending",
  dueDate: ""
};

function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "pending",
        dueDate: editingTask.dueDate
          ? editingTask.dueDate.slice(0, 10)
          : ""
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingTask]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    await onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate || null
    });

    setFormData(emptyForm);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">TASK DETAILS</p>
          <h2>{editingTask ? "Edit task" : "Create a new task"}</h2>
        </div>
      </div>

      <label htmlFor="title">Task title *</label>
      <input
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="What needs to be done?"
        required
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Add some details..."
        rows="3"
      />

      <div className="form-row">
        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate">Due date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <button className="primary-button" type="submit">
          {editingTask ? "Save Changes" : "＋ Add Task"}
        </button>

        {editingTask && (
          <button
            className="secondary-button"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
