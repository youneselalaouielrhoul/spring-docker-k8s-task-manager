const BASE = 'http://localhost:8082/tasks';

export async function getTasksByUser(userId) {
    const res = await fetch(`${BASE}?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
}

export async function createTask(task) {
    const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
}

export async function updateTask(id, task) {
    const res = await fetch(`${BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
}

export async function deleteTask(id, userId) {
    const res = await fetch(`${BASE}/${id}?userId=${userId}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete task');
}
