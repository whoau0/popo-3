import React from 'react';

export default function TAccountCard({ title, debitTitle = '차변 (Dr.)', creditTitle = '대변 (Cr.)', debits = [], credits = [], footerLeft, footerRight }) {
  return (
    <div
      style={{
        background: 'var(--bg-card-sub)',
        border: '1.5px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
        margin: '10px 0',
        fontSize: '0.82rem',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* 계정명 헤더 */}
      <div
        style={{
          background: 'var(--primary-glow)',
          color: 'var(--primary)',
          fontWeight: 800,
          textAlign: 'center',
          padding: '7px 10px',
          borderBottom: '2px solid var(--primary)',
          letterSpacing: '0.02em',
          fontSize: '0.88rem'
        }}
      >
        [계정원장] {title}
      </div>

      {/* T계정 몸체 (차변 / 대변) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* 차변 (왼쪽) */}
        <div style={{ borderRight: '1.5px solid var(--border)', padding: '8px 10px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6, borderBottom: '1px dashed var(--border)', paddingBottom: 2 }}>
            {debitTitle}
          </div>
          {debits.length === 0 ? (
            <div style={{ color: 'var(--text-sub)', fontSize: '0.75rem', padding: '4px 0' }}>-</div>
          ) : (
            debits.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: 'var(--text-main)', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                <span style={{ fontWeight: 600 }}>{item.amount}</span>
              </div>
            ))
          )}
          {footerLeft && (
            <div style={{ marginTop: 6, paddingTop: 4, borderTop: '1px solid var(--border)', fontWeight: 700, display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
              <span>{footerLeft.label}</span>
              <span>{footerLeft.amount}</span>
            </div>
          )}
        </div>

        {/* 대변 (오른쪽) */}
        <div style={{ padding: '8px 10px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6, borderBottom: '1px dashed var(--border)', paddingBottom: 2 }}>
            {creditTitle}
          </div>
          {credits.length === 0 ? (
            <div style={{ color: 'var(--text-sub)', fontSize: '0.75rem', padding: '4px 0' }}>-</div>
          ) : (
            credits.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: 'var(--text-main)', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                <span style={{ fontWeight: 600 }}>{item.amount}</span>
              </div>
            ))
          )}
          {footerRight && (
            <div style={{ marginTop: 6, paddingTop: 4, borderTop: '1px solid var(--border)', fontWeight: 700, display: 'flex', justifyContent: 'space-between', color: 'var(--primary)' }}>
              <span>{footerRight.label}</span>
              <span>{footerRight.amount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
