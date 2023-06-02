# anchor-ed

A lightweight (< 7kb) alternative to floating ui or popper. Basically three times smaller.

Usage:

```html
<anchor-ed anchor="my-anchor">
  <div class="boat">Anchor me</div>
</anchor-ed>
<a class="anchor" id="my-anchor">The anchor</a>
```

You can leave the `anchor` attribute or give it a special value `_next` or `_prev`.
Without value, it defaults to the next sibling.

## Placement

You can use any of the placement of floating ui (top, bottom, left, right with -start and -end suffixes).

```html
<anchor-ed to="my-anchor" placement="top-start">
  <div class="boat">Anchor me</div>
</anchor-ed>
<a class="anchor" id="my-anchor">The anchor</a>
```

Flip and auto-hide is all enabled by default.

Shift is enabled by default is floating element is larger than its anchor.

## Shift

In order to keep floating elements on screen, you can enable shift.

```html
<anchor-ed to="my-anchor" placement="top-start" data-config='{"shift": true}'>
  <div class="boat">Anchor me that is too large for the screen</div>
</anchor-ed>
<a class="anchor" id="my-anchor">The anchor</a>
```

## Scope

By default, the fixed element use the window as boundaries. You can scope it to a specific element
using the `scope` attribute.

```html
<anchor-ed to="my-anchor" scope="my-frame">
  <div class="boat">Anchor me (scoped)!</div>
</anchor-ed>
<a class="anchor" id="my-anchor">The anchor</a>
```

## Events

anchor-ed has the ability to listen to events on itself or on its target. This can be really
useful for dropdowns and tooltips. You can use `on` and `onTarget` helper.

## Arrows

You can also position arrows for tooltips. See `bootstrap-tooltips.js` for more info.

## Menus

If you want to show/hide on click, see `bootstrap-dropdowns.js` for more info.
