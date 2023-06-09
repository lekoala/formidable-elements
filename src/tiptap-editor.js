import TiptapEditor from "./classes/TiptapEditor.js";
import defineEl from "./utils/defineEl.js";
//@ts-ignore
import styles from "./css/tiptap-editor.min.css";
import injectStyles from "./utils/injectStyles.js";

injectStyles("tiptap-editor", styles);

defineEl("tiptap-editor", TiptapEditor);

export default TiptapEditor;
