import React, { useEffect, useState } from "react";
import axios from "axios";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState({});
  const [, setNotifications] = useState([]); // yeni görev
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [editTaskTitles, setEditTaskTitles] = useState({});
  const token = localStorage.getItem("access_token");
  const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/tasks/",
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    checkNotifications();
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/tasks/", {
        headers: { Authorization: `Token ${token}` },
      });
      setTasks(
        Array.isArray(response.data)
          ? response.data
          : response.data.results || []
      );
      // BU SATIR ÖNEMLİ:
      const titles = {};
      response.data.forEach((task) => {
        titles[task.id] = task.title;
      });
      setEditTaskTitles(titles);
    } catch (error) {
      console.error("Görevler alınırken hata:", error);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || !newTaskDueDate) return;

    try {
      await axiosInstance.post("http://127.0.0.1:8000/tasks/", {
        title: newTaskTitle,
        due_date: newTaskDueDate,
      });
      setNewTaskTitle("");
      setNewTaskDueDate("");
      fetchTasks();
    } catch (error) {
      console.error(
        "Görev eklenirken hata:",
        error.response?.data || error.message
      );
    }
  };

  const handleDateChange = async (taskId, date) => {
    try {
      await axiosInstance.patch(`http://127.0.0.1:8000/tasks/${taskId}/`, {
        due_date: date,
      });
      fetchTasks();
    } catch (error) {
      console.error("Tarih eklenirken hata:", error);
    }
  };

  const toggleTaskCompletion = async (task) => {
    try {
      await axiosInstance.patch(`http://127.0.0.1:8000/tasks/${task.id}/`, {
        is_completed: !task.is_completed,
      });
      fetchTasks();
    } catch (error) {
      console.error("Görev tamamlanma durumu değiştirilirken hata:", error);
    }
  };
  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`${taskId}/`);
      fetchTasks();
    } catch (error) {
      console.error("Görev silinirken hata:", error);
    }
  };

  const handleUpdateTask = async (taskId) => {
    const updatedTitle = editTaskTitles[taskId];
    if (!updatedTitle || !updatedTitle.trim()) return;

    try {
      await axiosInstance.patch(`${taskId}/`, {
        title: updatedTitle,
      });
      fetchTasks();
    } catch (error) {
      console.error("Görev güncellenirken hata:", error);
    }
  };

  const checkNotifications = () => {
    const today = new Date();
    const updatedNotifications = tasks
      .filter((task) => {
        if (task.is_completed || !task.due_date) return false;
        const due = new Date(task.due_date);
        const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        return diff <= 3 && diff >= 0;
      })
      .map((task) => {
        const due = new Date(task.due_date);
        const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        return {
          id: task.id,
          title: task.title,
          message: `Görev "${task.title}" için son ${diff} gün!`,
        };
      });

    setNotifications(updatedNotifications);
    localStorage.setItem(
      "taskNotifications",
      JSON.stringify(updatedNotifications)
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">📝 Görevler</h2>

      {/* GÖREV EKLEME FORMU */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Yeni görev girin"
          className="border border-gray-300 p-2 rounded w-full md:flex-1"
        />
        <input
          type="date"
          value={newTaskDueDate}
          onChange={(e) => setNewTaskDueDate(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />
        <button
          onClick={handleAddTask}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          ➕ Ekle
        </button>
      </div>

      {/* GÖREV LİSTESİ */}
      {tasks.map((task) => (
        <div
          key={task.id}
          className="border border-gray-200 p-4 mb-4 rounded-lg shadow-sm bg-white"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <input
              type="text"
              value={editTaskTitles[task.id] || ""}
              onChange={(e) =>
                setEditTaskTitles({
                  ...editTaskTitles,
                  [task.id]: e.target.value,
                })
              }
              className={`border p-2 rounded w-full ${
                task.is_completed ? "line-through text-gray-400" : ""
              }`}
            />

            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateTask(task.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                title="Görevi Güncelle"
              >
                💾
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                title="Görevi Sil"
              >
                🗑
              </button>
              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={task.is_completed}
                  onChange={() => toggleTaskCompletion(task)}
                />
                Tamamlandı
              </label>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-700">
            {task.due_date ? (
              <p>
                📅 <span className="font-medium">Son Tarih:</span>{" "}
                {task.due_date}
              </p>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mt-2">
                <input
                  type="date"
                  onChange={(e) =>
                    setSelectedDate({
                      ...selectedDate,
                      [task.id]: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-1 rounded"
                />
                <button
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  onClick={() =>
                    handleDateChange(task.id, selectedDate[task.id])
                  }
                >
                  📌 Tarih Ekle
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskPage;
