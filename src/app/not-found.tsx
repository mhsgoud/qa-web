export default function NotFound() {
  return (
    <div className="shell browse-page">
      <h1 className="page-title">Page not found</h1>
      <p className="page-lead">
        That question or category is not in the library. Try search instead.
      </p>
      <p>
        <a href="/search" style={{ fontWeight: 700, color: "var(--accent)" }}>
          Go to search
        </a>
      </p>
    </div>
  );
}
