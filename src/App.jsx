import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [edit, setEdit] = useState(null);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    let savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addtask() {
    if (!task.trim()) return;

    if (edit !== null) {
      let updated = tasks.map((t) =>
        t.id === edit ? { ...t, text: task, priority } : t
      );
      setTasks(updated);
      setEdit(null);
    } else {
      let newTask = {
        id: Date.now(),
        text: task,
        done: false,
        priority: priority,
      };
      setTasks([...tasks, newTask]);
    }

    setTask("");
  }

  function completetask(id) {
    let updated = tasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setTasks(updated);
  }

  function edittask(taskObj) {
    setTask(taskObj.text);
    setPriority(taskObj.priority);
    setEdit(taskObj.id);
  }

  function deletetask(id) {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  }

  function deleteDone() {
    if (window.confirm("Delete all Completed tasks?")) {
      setTasks(tasks.filter((t) => !t.done));
    }
  }

  function deleteAll() {
    if (window.confirm("Delete all tasks?")) {
      setTasks([]);
    }
  }

  let filteredtask = tasks
    .filter((t) => {
      if (filter === "done") return t.done;
      if (filter === "todo") return !t.done;
      return true;
    })
    .filter((t) =>
      t.text.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="container">
      <h1>Smart Task Manager</h1>

      <div className="inputbox">
        <input
          type="text"
          placeholder="Add task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addtask();
          }}
        />

        {/* Priority */}
        <select
          className="prioritySelect"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button onClick={addtask}>
          {edit !== null ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search tasks..."
        className="searchInput"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("done")}>Done</button>
        <button onClick={() => setFilter("todo")}>Todo</button>
      </div>

      <div className="tasklist">
        {filteredtask.map((t) => (
          <div className="task" key={t.id}>
            <span
              className={t.done ? "done" : ""}
              onClick={() => completetask(t.id)}
            >
              {t.text}
            </span>

            {/* Priority badge */}
            <span className={`priority ${t.priority.toLowerCase()}`}>
              {t.priority}
            </span>

            <div className="actions">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => completetask(t.id)}
              />

              <button className="editBtn" onClick={() => edittask(t)}>
                <FaPencilAlt />
              </button>

              <button
                className="deleteBtn"
                onClick={() => deletetask(t.id)}
                disabled={edit === t.id}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bottomButtons">
        <button className="deleteDone" onClick={deleteDone}>
          Delete Done Tasks
        </button>

        <button className="deleteAll" onClick={deleteAll}>
          Delete All Tasks
        </button>
      </div>
    </div>
  );
}

export default App;