# Formidable Elements

> A formidable set of libraries that can be used as custom elements with an unified API.

## Supported libraries

- cleave: https://github.com/lekoala/cleave-es6
- input-mask: https://github.com/RobinHerbots/Inputmask
- flatpickr: https://github.com/flatpickr/flatpickr
- coloris: https://github.com/mdbassit/Coloris
- filepond: https://github.com/pqina/filepond
- countdown: https://www.npmjs.com/package/countdown
- tel input: https://intl-tel-input.com/
- tip tap: https://tiptap.dev/
- tom select: https://tom-select.js.org/
- squire-editor: https://github.com/fastmail/Squire
- superfile: https://github.com/lekoala/superfile

Bootstrap specific:

- bootstrap5-tags: https://github.com/lekoala/bootstrap5-tags
- bootstrap5-autocomplete: https://github.com/lekoala/bootstrap5-autocomplete

And some custom made stuff as well:

- clipboard-copy
- growing-textarea
- locale-provider

## Documentation

Please see the demos for now and refer to original libraries

## Lifecycle of elements

As much as possible, this library tries to make your components easy to destroy, move or clone if needed

The lifecycle is like this

    created > connected > disconnected > destroyed
                ↑              ↓
                ----------------

connected/disconnected events happen each time the element is attached to the dom.
Typically, it happens on creation/removal, but also whenever the element is:

- moved (through appendChild, will call disconnected then connected on the instance)
- cloned (will call only created > connected on the new instance).

Elements do not hold firm references to elements, so as long as the underlying library is cleaning up
properly, everything can be garbage collected.

Since its not easy to distinguish a move (through node.appendChild) or a removal (through el.remove or
node.removeChild), this library assume a delay of 1 second, after which the destroyed function is called

destroyed will clear config. If for some reason that node is added again to the dom, created will happen again.

## Configure elements

Configure the underlying library by using the data-config attribute. Don't forget to use single quotes
for the attribute.

```html
<my-elem data-config='{"test": true}'></my-elem>
```

Why no plain data attributes ? Well, data attributes are a pain to use. They default to string and this
require conversion to make it work. Also, components with lots of options quickly become horrible.

Some elements have specific (data) attributes for some custom features, see dedicated docs (wip).

You can access the configuration using the `config` public property of the element.

Editing json in your vscode can be easier with https://marketplace.visualstudio.com/items?itemName=andersonbruceb.json-in-html

### Passing functions

JSON is great, but what when you want to pass callbacks, eg: onRender, onChange etc...

In order to support this, you can pass dedicated function object values that have two signatures
These will be replaced by the `replaceCallbacks` utility.

Simple strings (evaluated again window object):

    "onChange": {"__fn": "myGlobalCallback"}
    "onChange": {"__fn": "app.myGlobalCallback"} // can be nested

Full definitions using array [args, body] that use new Function constructor:

    "onChange": {"__fn":["ev,inst","console.log(ev)"]}}

## Styling

As much as possible, components have their style bundled (using `injectStyles` utility). They will be injected into document head
on first use.

If you want to load the styles yourself, you can insert before an element matching the id (styles won't load twice)
(they will still be loaded in the js, so it's not perfect in terms of bandwidth).

## Bootstrap support

As much as possible, these components are designed to work with any css framework. However, when possible
or needed, I try to make these look good by default on Bootstrap.

Adjustements are most of the time available as css variables.

## Translating

Some libraries (flatpickr, tom-select...) need to have some elements translated. While there is often a way
to provide some global translations, formidable elements gives you one convention to load all your translations.

This is done through the `locale-provider` element which is a very simple element that works like this in your html

```html
<script type="module" src="../dist/locale-provider.min.js"></script>
<script type="module">
    window['locale-provider'].set('tom-select', 'default', {
        option_create: '<div class="create">Ajouter <strong>{input}</strong>&hellip;</div>',
        no_results: '<div class="no-results">Aucun résultat trouvé</div>'
    });
</script>
```

Then, in each element, we can call `localeProvider` which returns the global instance. This means the translations
must be defined BEFORE the element.

For example

```js
const globalLocale = localeProvider().for(name);
if (globalLocale) {
  flatpickr.localize(globalLocale);
}
```

The `for` method can be given a specific locale or left to default, which will try to find in our dictionnary entries
matching curreny browser locale or will be using `default`.

## A note about separate elements

Since we bundle each element separately, it means that the core formidable-element is added
in each js. This can lead to duplicated code, but since the core is very lightweight, i don't see this
an a real issue (as opposed to heavier component library).

If this really bothers you, you are free to make one big bundle with all the components you need
and the core will be included only once.

Maybe I will at some point do something like uce-lib and provide the core as an utility than can be
loaded once through the custom elements registry, but I'm not sure yet that would be really interesting.

## Sizes

Including css injection

  dist\tiptap-editor.min.js     299.8kb
  dist\tel-input.min.js         288.2kb
  dist\filepond-input.min.js    184.8kb
  dist\input-mask.min.js         86.0kb
  dist\flatpickr-input.min.js    82.2kb
  dist\tom-select.min.js         69.7kb
  dist\squire-editor.min.js      67.6kb
  dist\bs-tags.min.js            26.3kb
  dist\coloris-input.min.js      24.4kb
  dist\cleave-input.min.js       17.6kb
  dist\bs-autocomplete.min.js    12.2kb
  dist\count-down.min.js          9.4kb
  dist\superfile-input.min.js     5.4kb
  dist\clipboard-copy.min.js      1.8kb
  dist\growing-textarea.min.js    416b
  dist\locale-provider.min.js     394b

## Missing a lib

Open an issue or use Modular Behaviour: https://github.com/lekoala/modular-behaviour.js

## Building on windows

The build script require glob support (not available by default on Windows at this time).
This can be fixed by using bash as script shell if you have git for windows installed.

32 bit installation

    npm config set script-shell "C:\\Program Files (x86)\\git\\bin\\bash.exe"

64 bit installation

    npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"

Revert if needed

    npm config delete script-shell
