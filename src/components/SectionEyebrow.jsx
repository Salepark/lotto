import React from 'react';

export const cardStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 20,
  padding: '24px 24px 28px',
};

export const sectionTitleStyle = {
  fontSize: 22,
  fontWeight: 700,
  margin: 0,
  color: 'var(--text)',
};

export default function SectionEyebrow({ icon, children }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.4,
        color: '#DD2A7B',
        marginBottom: 6,
      }}
    >
      {icon}
      {children}
    </div>
  );
}
