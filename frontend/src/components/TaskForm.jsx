import { useState, useEffect } from 'react';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];

export default function TaskForm({ initial, onSubmit, onClose }) {
    const [title, setTitle] = useState(initial?.title || '');
    const [description, setDescription] = useState(initial?.description || '');
    const [status, setStatus] = useState(initial?.status || 'TODO');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        function handleKey(e) {
            if (e.key === 'Escape') onClose();
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim()) {
            setError('Title is required.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await onSubmit({ title: title.trim(), description: description.trim(), status });
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <h2>{initial ? 'Edit Task' : 'New Task'}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    {error && <div className="form-error">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="task-title">Title *</label>
                        <input
                            id="task-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="task-description">Description</label>
                        <textarea
                            id="task-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details..."
                            rows={3}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="task-status">Status</label>
                        <select
                            id="task-status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                    {s.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving…' : initial ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
