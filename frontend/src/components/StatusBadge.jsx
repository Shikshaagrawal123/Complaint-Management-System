// components/StatusBadge.jsx - Reusable status badge
const StatusBadge = ({ status }) => {
  const map = {
    Pending: 'badge-pending',
    'In Progress': 'badge-progress',
    Resolved: 'badge-resolved',
    Rejected: 'badge-rejected',
  };
  return <span className={map[status] || 'badge-pending'}>{status}</span>;
};

export const PriorityBadge = ({ priority }) => {
  const map = {
    High: 'badge-high',
    Medium: 'badge-medium',
    Low: 'badge-low',
  };
  return <span className={map[priority] || 'badge-medium'}>{priority}</span>;
};

export default StatusBadge;
