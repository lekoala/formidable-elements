// @ts-nocheck (regular import is not working)
import * as FilePond from "../../node_modules/filepond/dist/filepond.esm.js";
// @ts-ignore
import styles from "../../node_modules/filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "../../node_modules/filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js";
import FilePondPluginFileValidateSize from "../../node_modules/filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.esm.js";
import FilePondPluginFilePoster from "../../node_modules/filepond-plugin-file-poster/dist/filepond-plugin-file-poster.esm.js";
import FilePondPluginFilePosterStyles from "../../node_modules/filepond-plugin-file-poster/dist/filepond-plugin-file-poster.min.css";
import FilePondPluginFileMetadata from "../../node_modules/filepond-plugin-file-metadata/dist/filepond-plugin-file-metadata.esm.js";
import FilePondPluginImageExifOrientation from "../../node_modules/filepond-plugin-image-exif-orientation/dist/filepond-plugin-image-exif-orientation.esm.js";
import FilePondPluginImagePreview from "../../node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js";
import FilePondPluginImagePreviewStyles from "../../node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginImageCrop from "../../node_modules/filepond-plugin-image-crop/dist/filepond-plugin-image-crop.esm.js";
import FilePondPluginImageResize from "../../node_modules/filepond-plugin-image-resize/dist/filepond-plugin-image-resize.esm.js";
import FilePondPluginImageTransform from "../../node_modules/filepond-plugin-image-transform/dist/filepond-plugin-image-transform.esm.js";
import FilePondPluginImageValidateSize from "../../node_modules/filepond-plugin-image-validate-size/dist/filepond-plugin-image-validate-size.esm.js";
import FormidableElement from "../utils/FormidableElement.js";
import injectStyles from "../utils/injectStyles.js";

// Example
/*            
<label for="file-input" class="form-label">File</label>
<filepond-input data-config='{}'>
  <input type="file" class="filepond" name="file" id="file-input" data-allow-reorder="true" data-max-file-size="3MB">
</filepond-input>
*/

const name = "filepond-input";

// 10kb styles
injectStyles(name, styles + FilePondPluginFilePosterStyles + FilePondPluginImagePreviewStyles);

// plugins represents more or less 50kb out of 180kb
FilePond.registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginFileMetadata,
  FilePondPluginFilePoster,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginImageValidateSize
);

class FilePondInput extends FormidableElement {
  /**
   * @returns {HTMLInputElement}
   */
  get el() {
    return this.querySelector("input");
  }

  created() {
    const el = this.el;
    // Credits
    this.config = Object.assign(
      {
        credits: false,
      },
      this.config
    );
    // Add name
    if (this.dataset.name) {
      this.config["name"] = el.getAttribute("name");
    }
    // Specific renamer override
    // Frontend alternative to https://pqina.nl/filepond/docs/api/plugins/file-rename/
    const renamer = this.config["fileRenameFunction"];
    if (typeof renamer === "string") {
      this.config["fileRenameFunction"] =
        /**
         * @param {Object} file
         * @returns {string}
         */
        (file) => {
          return renamer + file.extension;
        };
    }

    //@ts-ignore
    this.filepond = FilePond.create(el, this.config);
  }

  destroyed() {
    //@ts-ignore
    this.filepond.destroy();
    this.filepond = null;
  }
}

export default FilePondInput;
