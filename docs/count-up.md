# count-up

> Integrate https://github.com/inorganik/countUp.js easily in your apps

## Installation

Simply include the ./dist/count-up.min.js or use the cdn

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/lekoala/formidable-elements@master/dist/count-up.min.js"></script>
```

Or from npm

```js
import CountUpElement from 'formidable-elements';
```

## Usage

Simply use the `<count-up>` tag

```html
<count-up>9999</count-up>
```

The js can be included before or after, it will self initialize when inserted into the dom.
The element is bound to an IntersectionObserver by default and will only start counting once in the viewport.

## Features

On top of what countUp.js provides and that can be configured through its data attribute (each attribute is pass as is as a parameter)
You can also do the following:

- Auto detect decimals (example 9999.99)
- Format according to a given locale `<count up lang="fr">5000</count-up>` or `<count-up intl>5000</count-up` for document locale

## Demo

[See the demo file](../demo/count-up.html) or the [codepen](https://codepen.io/lekoalabe/pen/MWxJoGN)

