export default function TopButton() {
  return (
    <button
      className="top-button"
      type="button"
      aria-label="맨 위로 이동"
      title="맨 위로 이동"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      TOP
    </button>
  );
}
