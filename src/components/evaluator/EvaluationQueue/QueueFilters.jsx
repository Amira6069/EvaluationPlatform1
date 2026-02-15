import React from 'react';

const QueueFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'submitted' },
    { label: 'Under Review', value: 'under-review' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];

  const styles = {
    bar: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
    btn: {
      padding: '8px 18px', border: '1px solid #e5e7eb',
      borderRadius: '8px', background: 'white', cursor: 'pointer',
      fontSize: '14px', fontWeight: '500', color: '#374151', transition: 'all 0.2s',
    },
    btnActive: {
      background: '#2563eb', color: 'white', borderColor: '#2563eb',
    },
  };

  return (
    <div style={styles.bar}>
      {filters.map((f) => (
        <button
          key={f.value}
          style={{ ...styles.btn, ...(activeFilter === f.value ? styles.btnActive : {}) }}
          onClick={() => onFilterChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

export default QueueFilters;