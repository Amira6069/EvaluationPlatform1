import React from 'react';

const EvidenceViewer = ({ evidence, onClose }) => {
  const styles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    },
    modal: {
      background: 'white', borderRadius: '16px',
      padding: '32px', maxWidth: '500px', width: '100%',
      boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    },
    header: {
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: '24px',
    },
    title: { fontSize: '20px', fontWeight: '600', color: '#111827' },
    closeBtn: {
      width: '32px', height: '32px', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      border: 'none', background: '#f3f4f6', borderRadius: '8px',
      cursor: 'pointer', fontSize: '18px',
    },
    fileBox: {
      padding: '20px', background: '#f9fafb',
      borderRadius: '12px', border: '2px dashed #d1d5db',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '12px', marginBottom: '20px',
    },
    fileIcon: { fontSize: '48px' },
    fileName: { fontSize: '16px', fontWeight: '600', color: '#111827' },
    fileSize: { fontSize: '14px', color: '#6b7280' },
    infoRow: {
      display: 'flex', justifyContent: 'space-between',
      padding: '10px 0', borderBottom: '1px solid #f3f4f6',
    },
    infoLabel: { fontSize: '13px', color: '#6b7280' },
    infoValue: { fontSize: '13px', fontWeight: '500', color: '#111827' },
    note: {
      padding: '14px', background: '#fef3c7', borderRadius: '8px',
      fontSize: '13px', color: '#92400e', marginTop: '16px',
    },
    closeButton: {
      width: '100%', padding: '12px', background: '#2563eb', color: 'white',
      border: 'none', borderRadius: '8px', cursor: 'pointer',
      fontSize: '15px', fontWeight: '600', marginTop: '20px',
    },
  };

  const getFileIcon = (type) => {
    if (!type) return '📄';
    if (type.includes('pdf')) return '📕';
    if (type.includes('image')) return '🖼️';
    if (type.includes('word') || type.includes('doc')) return '📘';
    return '📄';
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Evidence File</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {evidence.fileName ? (
          <>
            <div style={styles.fileBox}>
              <span style={styles.fileIcon}>{getFileIcon(evidence.fileType)}</span>
              <span style={styles.fileName}>{evidence.fileName}</span>
              <span style={styles.fileSize}>
                {(evidence.fileSize / 1024).toFixed(1)} KB
              </span>
            </div>

            <div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>File Type</span>
                <span style={styles.infoValue}>{evidence.fileType || 'Unknown'}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>File Size</span>
                <span style={styles.infoValue}>{(evidence.fileSize / 1024).toFixed(2)} KB</span>
              </div>
            </div>

            <div style={styles.note}>
              ℹ️ File preview is not available. In the full system, this would link to the uploaded file.
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <p style={{ fontSize: '48px', marginBottom: '12px' }}>📭</p>
            <p style={{ fontWeight: '600' }}>No file uploaded</p>
            <p style={{ fontSize: '14px' }}>No evidence file was provided for this criterion</p>
          </div>
        )}

        <button style={styles.closeButton} onClick={onClose}
          onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
          onMouseLeave={(e) => e.target.style.background = '#2563eb'}
        >Close</button>
      </div>
    </div>
  );
};

export default EvidenceViewer;