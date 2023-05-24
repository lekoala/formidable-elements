import FilePondInput from "./classes/FilePondInput.js";
import defineEl from "./utils/defineEl.js";
// @ts-ignore
import styles from "../node_modules/filepond/dist/filepond.min.css";
// @ts-ignore
import FilePondPluginFilePosterStyles from "../node_modules/filepond-plugin-file-poster/dist/filepond-plugin-file-poster.min.css";
// @ts-ignore
import FilePondPluginImagePreviewStyles from "../node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import injectStyles from "./utils/injectStyles.js";

// 10kb styles
injectStyles("filepond-input", styles + FilePondPluginFilePosterStyles + FilePondPluginImagePreviewStyles);

defineEl("filepond-input", FilePondInput);

export default FilePondInput;
