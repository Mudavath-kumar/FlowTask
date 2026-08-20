import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { CheckSquare, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { taskService } from '../services/taskService';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';
import StatCard from '../components/StatCard';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await taskService.getAnalytics();
        if (res.success) {
          setAnalytics(res);
        }
      } catch (err) {
        showError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [showError]);

  const statusData = analytics
    ? [
        { name: 'Todo', count: analytics.statusBreakdown?.todo || 0, color: isDark ? '#64748b' : '#94a3b8' },
        { name: 'In Progress', count: analytics.statusBreakdown?.inProgress || 0, color: isDark ? '#60a5fa' : '#3b82f6' },
        { name: 'Done', count: analytics.statusBreakdown?.done || 0, color: isDark ? '#4ade80' : '#16a34a' },
      ]
    : [];

  const priorityData = analytics
    ? [
        { name: 'Low', count: analytics.priorityBreakdown?.low || 0, color: isDark ? '#94a3b8' : '#64748b' },
        { name: 'Medium', count: analytics.priorityBreakdown?.medium || 0, color: isDark ? '#fbbf24' : '#f59e0b' },
        { name: 'High', count: analytics.priorityBreakdown?.high || 0, color: isDark ? '#f87171' : '#ef4444' },
      ]
    : [];

  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderColor: isDark ? '#334155' : '#e2e8f0',
    color: isDark ? '#f8fafc' : '#0f172a',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    fontSize: '12px',
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Task Analytics</h1>
          <p className="page-subtitle">
            Visual metrics and breakdown of your tasks and productivity.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
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
              subtitle="All tasks logged"
            />
            <StatCard
              title="Completed"
              value={analytics?.completedTasks ?? 0}
              icon={CheckCircle2}
              color="var(--color-success)"
              subtitle="Finished items"
            />
            <StatCard
              title="Pending"
              value={analytics?.pendingTasks ?? 0}
              icon={Clock}
              color="var(--color-warning)"
              subtitle="Action items remaining"
            />
            <StatCard
              title="Completion Rate"
              value={`${analytics?.completionPercentage ?? 0}%`}
              icon={TrendingUp}
              color="var(--color-info)"
              subtitle="Efficiency ratio"
            />
          </>
        )}
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginTop: '24px' }}>
        {/* Status Distribution Bar Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>Tasks by Status</h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Current distribution across workflow stages
          </p>

          {loading ? (
            <div className="skeleton" style={{ height: 260, borderRadius: 8 }} />
          ) : analytics?.totalTasks === 0 ? (
            <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No task data available
            </div>
          ) : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: isDark ? '#1e293b55' : '#f1f5f955' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Priority Breakdown Pie Chart */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px' }}>Tasks by Priority</h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Urgency level distribution across tasks
          </p>

          {loading ? (
            <div className="skeleton" style={{ height: 260, borderRadius: 8 }} />
          ) : analytics?.totalTasks === 0 ? (
            <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No task data available
            </div>
          ) : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
