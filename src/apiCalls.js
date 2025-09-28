const API = 'https://playground.4geeks.com/todo'
const USERNAME = 'fr33d0m'

export async function getUser() {
  const response = await fetch(`${API}/users/${USERNAME}`)

  if (!response.ok) {
    const createResponse = await fetch(`${API}/users/${USERNAME}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        name: USERNAME
      })
    })
    
    if (!createResponse.ok) {
      const errorText = await createResponse.text()
      throw new Error(`Failed to create user: ${createResponse.status} - ${errorText}`)
    }
    
    const newResponse = await fetch(`${API}/users/${USERNAME}`)
    if (!newResponse.ok) {
      const errorText = await newResponse.text()
      throw new Error(`Failed to fetch user after creation: ${newResponse.status} - ${errorText}`)
    }
    
    const data = await newResponse.json()
    return data
  }
  
  const data = await response.json()
  return data
}

export async function addTask(text) {
  const response = await fetch(`${API}/todos/${USERNAME}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      label: text,
      is_done: false
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to add task: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data
}

export async function deleteTask(todoId) {
  const response = await fetch(`${API}/todos/${todoId}`, {
    method: 'DELETE',
    headers: { 'content-type': 'application/json', accept: 'application/json' }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to delete todo: ${response.status} - ${errorText}`)
  }

  if (response.status === 204) {
    return { success: true }
  } else {
    return await response.json()
  }
}

export async function deleteAllTasks() {
  const user = await getUser()
  const tasks = user.todos || []
  
  if (tasks.length === 0) {
    return { success: true, deleted: 0 }
  }
  
  let deletedCount = 0
  for (const task of tasks) {
    try {
      await deleteTask(task.id)
      deletedCount++
    } catch (error) {
      console.error(`Failed to delete task ${task.id}:`, error)
    }
  }
  
  return { success: true, deleted: deletedCount, total: tasks.length }
}