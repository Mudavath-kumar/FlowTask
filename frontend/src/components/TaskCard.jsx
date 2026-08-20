import React from 'react';
import { Calendar, Edit3, Trash2, CheckCircle2, Clock } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Done':
        return 'badge-status-done';
      case 'In Progress':
        return 'badge-status-in-progress';
      default:
        return 'badge-status-todo';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'badge-priority-high';
      case 'Low':
        return 'badge-priority-low';
      default:
        return 'badge-priority-medium';
    }
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formattedDate = formatDueDate(task.dueDate);

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '14px',
        padding: '18px',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
          <h4
            style={{
              fontSize: '0.975rem',
              fontWeight: 600,
              lineHeight: 1.4,
              textDecoration: task.status === 'Done' ? 'line-through' : 'none',
              color: task.status === 'Done' ? 'var(--text-muted)' : 'var(--text-primary)',
            }}
          >
            {task.title}
          </h4>

          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <span className={`badge ${getStatusClass(task.status)}`}>
              {task.status}
            </span>
            <span className={`badge ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        </div>

        {task.description && (
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '10px',
            }}
          >
            {task.description}
          </p>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
          {formattedDate ? (
            <>
              <Calendar size={13} />
              <span>{formattedDate}</span>
            </>
          ) : (
            <>
              <Clock size={13} />
              <span>No due date</span>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* Quick Mark Done / Toggle Status */}
          {task.status !== 'Done' ? (
            <button
              onClick={() => onStatusChange(task._id, 'Done')}
              className="btn-icon"
              title="Mark as Done"
              style={{ color: 'var(--color-success)', padding: 6 }}
            >
              <CheckCircle2 size={16} />
            </button>
          ) : (
            <button
              onClick={() => onStatusChange(task._id, 'Todo')}
              className="btn-icon"
              title="Reopen Task"
              style={{ color: 'var(--text-muted)', padding: 6 }}
            >
              <Clock size={16} />
            </button>
          )}

          <button
            onClick={() => onEdit(task)}
            className="btn-icon"
            title="Edit Task"
            style={{ padding: 6 }}
          >
            <Edit3 size={16} />
          </button>

          <button
            onClick={() => onDelete(task)}
            className="btn-icon"
            title="Delete Task"
            style={{ color: 'var(--color-danger)', padding: 6 }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
