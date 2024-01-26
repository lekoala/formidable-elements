import HiMark from "./classes/HiMark.js";
import defineEl from "./utils/defineEl.js";
// @ts-ignore
import styles from "./css/hi-mark.min.css";
import injectStyles from "./utils/injectStyles.js";

injectStyles("hi-mark", styles);
defineEl("hi-mark", HiMark);

export default HiMark;
