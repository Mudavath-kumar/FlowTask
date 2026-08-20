import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{title}</span>
        {Icon && (
          <div
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-hover)',
              color: color || 'var(--text-primary)',
              display: 'flex',
            }}
          >
            <Icon size={16} />
          </div>
        )}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
        {value}
      </div>
      {subtitle && <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{subtitle}</span>}
    </div>
  );
};

export default StatCard;
