X [ERROR] Could not resolve "@tiptap/extension-history"

    src/classes/TiptapEditor.js:15:20:
      15 │ import History from "@tiptap/extension-history";
         ╵                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~

  You can mark the path "@tiptap/extension-history" as external to exclude it from the bundle, which will remove this error and leave the unresolved path in the bundle.

1 error
node:child_process:954
    throw err;
    ^

Error: Command failed: D:\www\bonasbids.local\formidable-input\node_modules\@esbuild\win32-x64\esbuild.exe ./src/anchor-ed.js ./src/bound-input.js ./src/bs-autocomplete.js ./src/bs-tags.js ./src/bs-tags.raw.js ./src/cleave-input.js ./src/clipboard-copy.js ./src/coloris-input.js ./src/coloris-input.raw.js ./src/count-down.js ./src/count-up.js ./src/data-table.js ./src/data-table.raw.js ./src/filepond-input.js ./src/filepond-input.raw.js ./src/flatpickr-input.js ./src/flatpickr-input.raw.js ./src/floating-ui.js ./src/format-date.js ./src/format-number.js ./src/growing-textarea.js ./src/hi-mark.js ./src/hi-mark.raw.js ./src/input-mask.js ./src/limited-input.js ./src/locale-provider.js ./src/progress-button.js ./src/squire-editor.js ./src/squire-editor.raw.js ./src/superfile-input.js ./src/superfile-input.raw.js ./src/tabulator-grid.js ./src/tabulator-grid.raw.js ./src/tel-input.js ./src/tel-input.raw.js ./src/tiptap-editor.js ./src/tiptap-editor.raw.js ./src/tom-select.js ./src/tom-select.raw.js --bundle --minify --loader:.css=text --format=iife --outdir=dist --out-extension:.js=.min.js --metafile=meta.json --analyze
    at genericNodeError (node:internal/errors:983:15)
    at wrappedFn (node:internal/errors:537:14)
    at checkExecSyncError (node:child_process:915:11)
    at Object.execFileSync (node:child_process:951:15)
    at Object.<anonymous> (D:\www\bonasbids.local\formidable-input\node_modules\esbuild\bin\esbuild:222:28)
    at Module._compile (node:internal/modules/cjs/loader:1688:14)
    at Object..js (node:internal/modules/cjs/loader:1820:10)
    at Module.load (node:internal/modules/cjs/loader:1423:32)
    at Function._load (node:internal/modules/cjs/loader:1246:12)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14) {
  status: 1,
  signal: null,
  output: [ null, null, null ],
  pid: 14304,
  stdout: null,
  stderr: null
}

Node.js v22.18.0
