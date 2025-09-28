import React, { useState, useEffect } from 'react'
import { addTask, getUser, deleteTask, deleteAllTasks } from './apiCalls'

function App() {
  const [todoList, setTodoList] = useState([])
  const [currentText, setCurrentText] = useState('')
  const [username, setUsername] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const user = await getUser()
        setUsername(user.name)
        setTodoList(user.todos || [])
      } catch (error) {
        console.error('Error loading user data:', error)
        setUsername('Usuario')
        setTodoList([])
      }
    })()
  }, [])

  const updateCurrentText = (e) => {
    setCurrentText(e.target.value)
  }

  const handleAddTask = async (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && currentText.trim() !== '') {
      try {
        const newTask = await addTask(currentText.trim())
        setTodoList(prev => [newTask, ...prev])
        setCurrentText('')
      } catch (error) {
        console.error('Error adding task:', error)
      }
    }
  }

  const handleDeleteTask = async (i) => {
    try {
      const todoToDelete = todoList[i]
      await deleteTask(todoToDelete.id)
      setTodoList(prev => prev.filter((_, index) => index !== i))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const deleteAll = async () => {
    try {
      await deleteAllTasks()
      setTodoList([])
    } catch (error) {
      console.error('Error deleting all tasks:', error)
    }
  }

  return (
    <div className='container mt-3'>
      <span className='display-4'>
        {username}
      </span>
      <div className='row g-1 my-3'>
        <div className='col-12'>
          <input type='text'
            className='form-control'
            onChange={updateCurrentText}
            onKeyDown={handleAddTask}
            value={currentText}
          />
        </div>
        <div className="col-11">
          <button
            type='submit'
            className='w-100 btn btn-success'
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </div>
        <div className="col-1">
          <button
            className='w-100 btn btn-danger'
            onClick={deleteAll}
          >
            X
          </button>
        </div>
      </div>
      <div id='todo-list' className='row g-1'>
        {todoList.map((task, index) => (
          <React.Fragment key={task.id || index}>
            <div className='col-11'>
              <span className='w-100 form-control'>{task.label}</span>
            </div>
            <div className="col-1">
              <button
                className='w-100 btn btn-danger'
                onClick={() => handleDeleteTask(index)}
                aria-label={`Delete task: ${task.label}`}
              >
                X
              </button>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default App