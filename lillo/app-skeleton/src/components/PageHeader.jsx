import React from 'react';

function PageHeader({ eyebrow, title, description, trailing }) {
  return (
    <header className="page-header">
      <div>
        {eyebrow ? <p className="page-header__eyebrow">{eyebrow}</p> : null}
        <h2 className="page-header__title">{title}</h2>
        {description ? <p className="page-header__description">{description}</p> : null}
      </div>
      {trailing ? <div className="page-header__trailing">{trailing}</div> : null}
    </header>
  );
}

export default PageHeader;
