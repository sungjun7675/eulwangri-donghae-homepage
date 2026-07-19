import { scrollToTarget } from "../../utils/scrollTo.js";

export default function TopButton() {
  return (
    <button className="top-button" type="button" onClick={() => scrollToTarget("#home")}>
      TOP
    </button>
  );
}
