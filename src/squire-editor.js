import SquireEditor from "./classes/SquireEditor.js";
import defineEl from "./utils/defineEl.js";
//@ts-ignore
import styles from "./css/squire-editor.min.css";
import injectStyles from "./utils/injectStyles.js";

injectStyles("squire-editor", styles);

defineEl("squire-editor", SquireEditor);

export default SquireEditor;
