import React, { useState, useEffect, useCallback } from 'react';
import { Plus, CheckSquare, Clock, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import DeleteModal from '../components/DeleteModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [analytics, setAnalytics] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [analyticsData, tasksData] = await Promise.all([
        taskService.getAnalytics(),
        taskService.getTasks({ limit: 5, sort: 'createdAt', order: 'desc' }),
      ]);

      if (analyticsData.success) {
        setAnalytics(analyticsData);
      }
      if (tasksData.success) {
        setRecentTasks(tasksData.tasks);
      }
    } catch (err) {
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

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
      loadDashboardData();
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
      showSuccess(`Task marked as ${newStatus}`);
      loadDashboardData();
    } catch (err) {
      showError('Failed to update task status');
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
      loadDashboardData();
    } catch (err) {
      showError('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, {user?.name || 'there'}! Manage your tasks and stay productive.
          </p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        {loading ? (
          <>
            <div className="card skeleton" style={{ height: 110 }} />
            <div className="card skeleton" style={{ height: 110 }} />
            <div className="card skeleton" style={{ height: 110 }} />
            <div className="card skeleton" style={{ height: 110 }} />
          </>
        ) : (
          <>
            <StatCard
              title="Total Tasks"
              value={analytics?.totalTasks ?? 0}
              icon={CheckSquare}
              subtitle="All tasks in workspace"
            />
            <StatCard
              title="Completed"
              value={analytics?.completedTasks ?? 0}
              icon={CheckCircle2}
              color="var(--color-success)"
              subtitle="Finished tasks"
            />
            <StatCard
              title="Pending"
              value={analytics?.pendingTasks ?? 0}
              icon={Clock}
              color="var(--color-warning)"
              subtitle="Todo & in progress"
            />
            <StatCard
              title="Completion Rate"
              value={`${analytics?.completionPercentage ?? 0}%`}
              icon={TrendingUp}
              color="var(--color-info)"
              subtitle="Overall task progress"
            />
          </>
        )}
      </div>

      {/* Recent Tasks Section */}
      <div style={{ marginTop: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Recent Tasks</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Recently created and updated tasks
            </p>
          </div>

          <Link
            to="/tasks"
            className="btn btn-ghost"
            style={{ fontSize: '0.85rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>View all</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="card skeleton" style={{ height: 90 }} />
            <div className="card skeleton" style={{ height: 90 }} />
            <div className="card skeleton" style={{ height: 90 }} />
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="empty-state">
            <CheckSquare className="empty-state-icon" />
            <h4 className="empty-state-title">No tasks yet</h4>
            <p className="empty-state-desc">
              Create your first task and start tracking your work efficiently.
            </p>
            <button onClick={handleOpenCreateModal} className="btn btn-primary">
              <Plus size={16} />
              <span>Create Task</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
            {recentTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

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

export default Dashboard;
