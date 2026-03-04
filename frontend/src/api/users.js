const BASE = 'http://localhost:8081/users';

export async function getAllUsers() {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
}

export async function getUserByUsername(username) {
    const users = await getAllUsers();
    return users.find((u) => u.username === username) || null;
}

export async function registerUser(username, email) {
    const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email }),
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Registration failed');
    }
    return res.json();
}
