# Formidable Elements

> A formidable set of libraries that can be used as custom elements with an unified API.

## Supported libraries

- cleave: https://github.com/lekoala/cleave-es6
- input-mask: https://github.com/RobinHerbots/Inputmask
- flatpickr: https://github.com/flatpickr/flatpickr
- coloris: https://github.com/mdbassit/Coloris
- filepond: https://github.com/pqina/filepond
- tel input: https://intl-tel-input.com/
- tip tap: https://tiptap.dev/
- tom select: https://tom-select.js.org/
- squire-editor: https://github.com/fastmail/Squire
- superfile: https://github.com/lekoala/superfile
- tabulator: https://tabulator.info/
- floating-ui: https://floating-ui.com/

Bootstrap specific:

- bootstrap5-tags: https://github.com/lekoala/bootstrap5-tags
- bootstrap5-autocomplete: https://github.com/lekoala/bootstrap5-autocomplete

And some custom made stuff as well:

- clipboard-copy
- countdown
- growing-textarea
- bound-input
- format-date
- format-number
- anchor-ed, a simple alternative to floating ui
- locale-provider

## Documentation

Please see the demos for now and refer to original libraries

Custom components are documented in /docs folder

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
(this feels like a hack, but if you have a better idea, let me know :-) ).

`destroyed` will clear config. If for some reason that node is added again to the dom, created will happen again.

## Configure elements

Configure the underlying library by using the data-config attribute. Don't forget to use 'single quotes'
for the attribute.

```html
<my-elem data-config='{"test": true}'></my-elem>
```

WARNING: this means that any value with a single quote needs to be escaped otherwise json will not be valid.
In php, this can be done like so : `$json = str_replace("'", '&#39;', $json);`

Why no plain data attributes ? Well, data attributes are a pain to use. They default to string and this
require conversion to make it work. Also, components with lots of options quickly become horrible.

Some elements have specific (data) attributes for some custom features, see dedicated docs in /docs.

You can access the configuration using the `config` public property of the element.

### Custom attributes

- Some heavier elements support the `lazy` attribute to make them `created` once visible in the viewport.
- Some elements have a `type` attribute
- Formatters favor reflected properties instead of using the data-config

### Custom data attributes and extra config

Some elements have some extra features exposed as data attributes on the element itself. These
features are added on top of the library being wrapped. See `dataset` usage for this.

Some other features can also be passed in the config object with underscored keys (`_myprop`).
These keys are not passed to the underlying library. See `getDelete` usage for this.

### Passing functions

JSON is great, but what when you want to pass callbacks, eg: onRender, onChange etc...

In order to support this, you can pass a dedicated object with the `__fn` key.
These will be replaced by the `replaceCallbacks` utility and are evaluated against the window object.

    "onChange": {"__fn": "myGlobalCallback"}
    "onChange": {"__fn": "app.myGlobalCallback"} // can be nested

You can also resolve the whole config like this

```html
<my-elem data-config="app.myGlobalFunc"></my-elem>
```

## Styling

As much as possible, components have their style bundled (using `injectStyles` utility). They will be injected into document head
on first use.

If you want to load the styles yourself, you can use the `.raw` variant of each element. It's the same code, but without injected styles.

## Bootstrap support

As much as possible, these components are designed to work with any css framework. However, when possible
or needed, I try to make these look good by default on Bootstrap.

Adjustements are most of the time available as css variables.

## Translating

Some libraries (flatpickr, tom-select...) need to have some elements translated. While there is often a way
to provide some global translations, formidable elements gives you one convention to load all your translations.

This is done through the `locale-provider` element which is a very simple element that works like this

```html
<script type="module" src="../dist/locale-provider.min.js"></script>
<script type="module">
  window["locale-provider"].set("tom-select", "default", {
    option_create: '<div class="create">Ajouter <strong>{input}</strong>&hellip;</div>',
    no_results: '<div class="no-results">Aucun résultat trouvé</div>',
  });
</script>
```

Then, in each element, we can call `localeProvider` helper. This means the translations
must be defined BEFORE the element.

For example

```js
const globalLocale = localeProvider(name, locale);
if (globalLocale) {
  flatpickr.localize(globalLocale);
}
```

You can pass a specific locale or leave it to default, which will try to find in our dictionnary entries
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

[Detailed file size are available here](./docs/filesize.md)
and analyzable with [esbuild bundle analyzer](https://esbuild.github.io/analyze/) using the `meta.json` files

## Names conflicts

If for some reason you already have a custom element with the same name, it's easy to import the base class
and define the custom elements since they are in separate files.

Elements DO NOT RELY on their tag name in order to work properly.

## Accessing underlying lib

All bundled libraries are accessible under the `lib` public property for each component.

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
