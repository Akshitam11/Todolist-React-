import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { FaPencilAlt } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import "./App.css"


function App() {

  let [task, setTask] = useState("");
  let [tasks, setTasks] = useState([]);
  let [filter, setFilter] = useState("all");
  let [edit, setEdit] = useState(null);


  useEffect(() => {

    let savedTasks = JSON.parse(localStorage.getItem("tasks"));

    if (savedTasks) {
      setTasks(savedTasks);
    }

  }, []);

  useEffect(() => {

    localStorage.setItem("tasks", JSON.stringify(tasks));

  }, [tasks]);
  function addtask() {

    if (edit !== null) {

      let updated = [...tasks];
      updated[edit].text = task;

      setTasks(updated);
      setEdit(null);

    } else {

      let newTask = {
        text: task,
        done: false
      };

      setTasks([...tasks, newTask]);
      setTask("");

    }
  }

  function completetask(index) {
    let updated = [...tasks];
    updated[index].done = !updated[index].done;

    setTasks(updated);
  }

  let filteredtask = tasks.filter((t) => {
    if (filter === "done") return t.done;
    if (filter === "todo") return !t.done;

    return true;

  });

  function edittask(index) {
    setTask(tasks[index].text);
    setEdit(index)
  }

  function deletetask(index) {

    let confirmdelete = window.confirm("Are you sure you want to delete this task?");

    if (confirmdelete) {
      let updated = tasks.filter((t, i) => i !== index);
      setTasks(updated);
    }
  }

  function deleteDone() {

    let confirmdone = window.confirm("Delete all Completed tasks?");

    if (confirmdone) {
      let updated = tasks.filter(t => !t.done);
      setTasks(updated);
    }
  }


  function deleteAll() {
    let confirmall = window.confirm("Delete all tasks?");

    if (confirmall) {
      setTasks([]);
    }
  }



  return (
    <div className="container">

      <h1> To Do Input</h1>

      <div className="inputbox ">
        <input type="text" placeholder='Add task' value={task} onChange={(e) => setTask(e.target.value)} />

        <button onClick={addtask}>{edit != null ? "Update Task" : "Add Task"}</button>
      </div>

      <h1>To Do List</h1>

      <div className="filters">

        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("done")}>Done</button>
        <button onClick={() => setFilter("todo")}>Todo</button>
      </div>

      <div className="tasklist">
        {filteredtask.map((t, index) => (
          <div className="task" key={index}  > <span className={t.done ? "done" : ""} onClick={() => completetask(index)} > {t.text}</span>
            <div className="actions">
              <input type="checkbox" checked={t.done} onChange={() => completetask(index)} />
              <button className='editBtn' onClick={() => edittask(index)}> <FaPencilAlt /></button>
              <button className='deleteBtn' onClick={() => deletetask(index)} disabled={edit === index}> <FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
      <div className='bottomButtons'>
        <button className='deleteDone' onClick={deleteDone} disabled={edit !== null}> Delete Done Tasks</button>
        <button className='deleteAll' onClick={deleteAll} disabled={edit !== null}> Delete All Tasks</button>


      </div>
    </div>
  )
}

export default App


