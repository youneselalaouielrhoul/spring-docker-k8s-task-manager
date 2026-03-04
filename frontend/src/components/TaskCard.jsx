const STATUS_CONFIG = {
    TODO: { label: 'To Do', color: 'badge-todo' },
    IN_PROGRESS: { label: 'In Progress', color: 'badge-progress' },
    DONE: { label: 'Done', color: 'badge-done' },
};

export default function TaskCard({ task, onEdit, onDelete }) {
    const config = STATUS_CONFIG[task.status] || { label: task.status, color: 'badge-todo' };
    const date = new Date(task.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="task-card">
            <div className="task-card-header">
                <span className={`badge ${config.color}`}>{config.label}</span>
                <span className="task-date">{date}</span>
            </div>
            <h3 className="task-title">{task.title}</h3>
            {task.description && (
                <p className="task-description">{task.description}</p>
            )}
            <div className="task-card-actions">
                <button className="btn btn-edit" onClick={() => onEdit(task)}>
                    ✏️ Edit
                </button>
                <button className="btn btn-delete" onClick={() => onDelete(task)}>
                    🗑️ Delete
                </button>
            </div>
        </div>
    );
}
