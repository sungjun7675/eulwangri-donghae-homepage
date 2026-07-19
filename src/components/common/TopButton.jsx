import { scrollToTarget } from "../../utils/scrollTo.js";

export default function TopButton() {
  return (
    <button
      className="top-button"
      type="button"
      aria-label="맨 위로 이동"
      title="맨 위로 이동"
      onClick={() => scrollToTarget("#home")}
    >
      TOP
    </button>
  );
}
