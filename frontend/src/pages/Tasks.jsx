import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';
import { taskService } from '../services/taskService';
import { useToast } from '../components/Toast';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import DeleteModal from '../components/DeleteModal';

const Tasks = () => {
  const { showSuccess, showError } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, totalPages: 1 });

  // Filters and Query Params
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTasks = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 9,
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        sort: sortBy,
        order: sortOrder,
      };

      const res = await taskService.getTasks(params);
      if (res.success) {
        setTasks(res.tasks);
        setPagination(res.pagination);
      }
    } catch (err) {
      showError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, sortBy, sortOrder, showError]);

  useEffect(() => {
    fetchTasks(1);
  }, [fetchTasks]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTasks(newPage);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    setIsSaving(true);
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, taskData);
        showSuccess('Task updated successfully');
      } else {
        await taskService.createTask(taskData);
        showSuccess('Task created successfully');
      }
      setIsTaskModalOpen(false);
      fetchTasks(pagination.page);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save task';
      showError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      showSuccess(`Status changed to ${newStatus}`);
      fetchTasks(pagination.page);
    } catch (err) {
      showError('Failed to update status');
    }
  };

  const handleOpenDeleteModal = (task) => {
    setDeletingTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    try {
      await taskService.deleteTask(deletingTask._id);
      showSuccess('Task deleted successfully');
      setIsDeleteModalOpen(false);
      // If we deleted the last item on a page > 1, go back one page
      const nextPage = tasks.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
      fetchTasks(nextPage);
    } catch (err) {
      showError('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const hasActiveFilters = search || statusFilter || priorityFilter || sortBy !== 'createdAt' || sortOrder !== 'desc';

  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">
            Organize, search, filter, and track all your tasks.
          </p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter & Controls Toolbar */}
      <div
        className="card"
        style={{
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search
            size={16}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>

        {/* Dropdown filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          {/* Status filter */}
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '120px' }}
          >
            <option value="">All Statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          {/* Priority filter */}
          <select
            className="form-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '120px' }}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* Sort field */}
          <select
            className="form-select"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="dueDate-asc">Due Date (Soonest)</option>
            <option value="dueDate-desc">Due Date (Furthest)</option>
            <option value="priority-desc">Priority</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn btn-ghost"
              style={{ fontSize: '0.8rem', padding: '7px 10px' }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Task List / Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="card skeleton" style={{ height: 130 }} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <CheckSquare className="empty-state-icon" />
          <h4 className="empty-state-title">
            {hasActiveFilters ? 'No tasks match your criteria' : 'No tasks created yet'}
          </h4>
          <p className="empty-state-desc">
            {hasActiveFilters
              ? 'Try adjusting your search query or removing active filters.'
              : 'Get started by creating your first task.'}
          </p>
          {hasActiveFilters ? (
            <button onClick={clearFilters} className="btn btn-secondary">
              Clear All Filters
            </button>
          ) : (
            <button onClick={handleOpenCreateModal} className="btn btn-primary">
              <Plus size={16} />
              <span>Create Task</span>
            </button>
          )}
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>

          {/* Pagination Bar */}
          {pagination.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Showing page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.total} tasks total)
              </span>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px' }}
                >
                  <ChevronLeft size={16} />
                  <span>Prev</span>
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`btn ${pagination.page === p ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ minWidth: '36px', padding: '6px 10px' }}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px' }}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        isDeleting={isDeleting}
        taskTitle={deletingTask?.title}
      />
    </div>
  );
};

export default Tasks;
