import React from 'react';

function SourceIcon({ type }) {
  switch (type) {
    case 'weather':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M7.5 16.5h8a3.5 3.5 0 0 0 0-7 4.5 4.5 0 0 0-8.6-1.5A3.6 3.6 0 0 0 3.5 11.6 3.9 3.9 0 0 0 7.5 16.5Z" />
          <path d="M9 19.2h6" />
          <path d="M10.5 21h3" />
        </svg>
      );
    case 'satellite':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M5.2 9.2h3.5v5.6H5.2z" />
          <path d="M15.3 9.2h3.5v5.6h-3.5z" />
          <rect height="5.4" rx="0.9" width="4.4" x="9.8" y="9.3" />
          <path d="M12 7v2.3" />
          <path d="m14.1 10.9 2.5-2.5" />
          <path d="M15.9 6.5a3.6 3.6 0 0 1 2.6 2.6" />
          <path d="M14.7 4.8a5.9 5.9 0 0 1 4.2 4.2" />
          <path d="m9.8 10.9-2.5-2.5" />
          <path d="M11 14.7v2.4" />
          <path d="M13 14.7v2.4" />
          <path d="M9.6 19h4.8" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="12" cy="10" r="2.2" />
          <path d="M12 12.2v5.6" />
          <path d="M9.7 18h4.6" />
          <path d="M7.8 10a4.2 4.2 0 0 1 8.4 0" />
          <path d="M5.4 10a6.6 6.6 0 0 1 13.2 0" />
        </svg>
      );
  }
}

export default SourceIcon;
