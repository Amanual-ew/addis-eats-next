export default function Loading() {
  return (
    <div className="menu-loading">

      <h1 className="skeleton-title"></h1>

      <div className="skeleton-categories">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="skeleton-grid">
        <div className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-small"></div>
          <div className="skeleton-button"></div>
        </div>

        <div className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-small"></div>
          <div className="skeleton-button"></div>
        </div>

        <div className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-small"></div>
          <div className="skeleton-button"></div>
        </div>

        <div className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-small"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>

    </div>
  );
}