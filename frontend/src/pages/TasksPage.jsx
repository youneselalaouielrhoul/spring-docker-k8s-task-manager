import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getTasksByUser, createTask, updateTask, deleteTask } from '../api/tasks';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const FILTERS = ['ALL', 'TODO', 'IN_PROGRESS', 'DONE'];

export default function TasksPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        if (!user) { navigate('/'); return; }
        fetchTasks();
    }, [user]);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getTasksByUser(user.id);
            setTasks(data);
        } catch (err) {
            setError('Could not load tasks. Is the task-manager service running?');
        } finally {
            setLoading(false);
        }
    }, [user]);

    async function handleCreate(fields) {
        const task = await createTask({ ...fields, userId: user.id });
        setTasks((prev) => [task, ...prev]);
        setShowForm(false);
    }

    async function handleUpdate(fields) {
        const task = await updateTask(editingTask.id, {
            ...fields,
            userId: user.id,
        });
        setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
        setEditingTask(null);
    }

    async function handleDelete(task) {
        await deleteTask(task.id, user.id);
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
        setDeleteConfirm(null);
    }

    const filtered = filter === 'ALL' ? tasks : tasks.filter((t) => t.status === filter);

    const counts = {
        TODO: tasks.filter((t) => t.status === 'TODO').length,
        IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
        DONE: tasks.filter((t) => t.status === 'DONE').length,
    };

    return (
        <div className="app-layout">
            <Navbar />
            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">My Tasks</h1>
                        <p className="page-subtitle">{tasks.length} task{tasks.length !== 1 ? 's' : ''} total</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        + New Task
                    </button>
                </div>

                {/* Stats bar */}
                <div className="stats-bar">
                    {Object.entries(counts).map(([key, val]) => (
                        <div key={key} className={`stat-chip stat-${key.toLowerCase().replace('_', '-')}`}>
                            <span className="stat-count">{val}</span>
                            <span className="stat-label">{key.replace('_', ' ')}</span>
                        </div>
                    ))}
                </div>

                {/* Filter tabs */}
                <div className="filter-tabs">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            className={`filter-tab ${filter === f ? 'filter-active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'ALL' ? 'All' : f.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {/* Task grid */}
                {error && <div className="form-error">{error}</div>}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner" />
                        <span>Loading tasks…</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📋</span>
                        <p>{filter === 'ALL' ? 'No tasks yet. Create your first one!' : `No ${filter.replace('_', ' ')} tasks.`}</p>
                    </div>
                ) : (
                    <div className="task-grid">
                        {filtered.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={(t) => setEditingTask(t)}
                                onDelete={(t) => setDeleteConfirm(t)}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Create modal */}
            {showForm && (
                <TaskForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />
            )}

            {/* Edit modal */}
            {editingTask && (
                <TaskForm
                    initial={editingTask}
                    onSubmit={handleUpdate}
                    onClose={() => setEditingTask(null)}
                />
            )}

            {/* Delete confirm modal */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Delete Task?</h2>
                            <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
                        </div>
                        <p className="delete-msg">
                            Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>? This cannot be undone.
                        </p>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
