import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";

type EditingTask = {
  id: string;
  title: string;
};

const TaskManager: React.FC = () => {
  const {
    tasks,
    addTask,
    editTask,
    deleteTask,
    getTaskStats,
    user,
    adminList,
  } = useAuthStore();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState<EditingTask | null>(null);

  const isAdmin = !!user && adminList.includes(user.id);

  // ➕ Добавление задачи (только админ)
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    if (!isAdmin) {
      alert("Only admins can add tasks.");
      return;
    }

    addTask({
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      completed: false,
    });

    setNewTaskTitle("");
  };

  // ✏️ Сохранение изменений (только админ)
  const handleSaveTask = () => {
    if (!editingTask) return;

    if (!isAdmin) {
      alert("Only admins can edit tasks.");
      return;
    }

    editTask(editingTask.id, { title: editingTask.title.trim() });
    setEditingTask(null);
  };

  // 🗑 Удаление задачи (только админ)
  const handleDeleteTask = (taskId: string) => {
    if (!isAdmin) {
      alert("Only admins can delete tasks.");
      return;
    }

    deleteTask(taskId);
  };

  const stats = getTaskStats();

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>Task Manager</h1>

      {/* ➕ ADD TASK */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task title"
        />
        <button onClick={handleAddTask} style={{ marginLeft: 8 }}>
          Add
        </button>
      </div>

      {/* 📋 TASK LIST */}
      <ul>
        {tasks.map((task) => {
          const isEditing = editingTask?.id === task.id;

          return (
            <li key={task.id} style={{ marginBottom: 8 }}>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        title: e.target.value,
                      })
                    }
                  />
                  <button onClick={handleSaveTask} style={{ marginLeft: 6 }}>
                    Save
                  </button>
                  <button
                    onClick={() => setEditingTask(null)}
                    style={{ marginLeft: 6 }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{task.title}</span>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() =>
                          setEditingTask({
                            id: task.id,
                            title: task.title,
                          })
                        }
                        style={{ marginLeft: 8 }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        style={{ marginLeft: 6 }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>

      {/* 📊 STATS */}
      <div style={{ marginTop: 24 }}>
        <h2>Task Stats</h2>
        <p>Total: {stats.total}</p>
        <p>Completed: {stats.completed}</p>
        <p>Pending: {stats.pending}</p>
      </div>
    </div>
  );
};

export default TaskManager;
