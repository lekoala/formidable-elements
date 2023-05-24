import BsTags from "./classes/BsTags.js";
import defineEl from "./utils/defineEl.js";
//@ts-ignore
import styles from "../node_modules/bootstrap5-tags/tags-pure.min.css";
import injectStyles from "./utils/injectStyles.js";

// WARNING: global side effect: with this, focus styles rely only on css variables now
injectStyles("bs-tags", styles);

defineEl("bs-tags", BsTags);

export default BsTags;
