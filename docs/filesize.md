X [ERROR] Invalid build flag: "--analyze"

1 error
node:child_process:924
    throw err;
    ^

Error: Command failed: D:\www\bonasbids.local\formidable-input\node_modules\@esbuild\win32-x64\esbuild.exe ./src/bs-autocomplete.js ./src/bs-tags.js ./src/cleave-input.js ./src/clipboard-copy.js ./src/coloris-input.js ./src/count-down.js ./src/filepond-input.js ./src/flatpickr-input.js ./src/growing-textarea.js ./src/input-mask.js ./src/locale-provider.js ./src/squire-editor.js ./src/superfile-input.js ./src/tel-input.js ./src/tiptap-editor.js ./src/tom-select.js --bundle --minify --loader:.css=text --format=iife --outdir=dist --out-extension:.js=.min.js --metafile=meta.json --analyze --servedir=.
    at checkExecSyncError (node:child_process:885:11)
    at Object.execFileSync (node:child_process:921:15)
    at Object.<anonymous> (D:\www\bonasbids.local\formidable-input\node_modules\esbuild\bin\esbuild:220:28)
    at Module._compile (node:internal/modules/cjs/loader:1246:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1300:10)
    at Module.load (node:internal/modules/cjs/loader:1103:32)
    at Module._load (node:internal/modules/cjs/loader:942:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:83:12)
    at node:internal/main/run_main_module:23:47 {
  status: 1,
  signal: null,
  output: [ null, null, null ],
  pid: 1212,
  stdout: null,
  stderr: null
}

Node.js v19.6.0
