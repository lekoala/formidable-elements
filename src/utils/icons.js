// Plus/minus
const iconPlus =
  '<svg width="24" height="24" viewbox="0 0 24 24"><line x1="4" y1="12" x2="20" y2="12" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><line y1="4" x1="12" y2="20" x2="12" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>';
const iconMinus =
  '<svg width="24" height="24" viewbox="0 0 24 24"><line x1="4" y1="12" x2="20" y2="12" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>';

// Tick/cross
const iconTick =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M5 13L9 17L19 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const iconCross =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// Pagination
const iconFirst =
  '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" fill="currentColor"/></svg>';
const iconLast =
  '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" fill="currentColor"/></svg>';
const iconNext =
  '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>';
const iconPrev =
  '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>';

// The SMIL specification says that durations cannot start with a leading decimal point.
// Firefox implements the specification as written, Chrome does not. Converting from dur=".75s" to dur="0.75s" will fix it in a cross-browser fashion.
const iconLoader =
  '<svg width="24" height="24" viewBox="0 0 24 24" xml:space="preserve"><circle fill="currentColor" cx="4" cy="12" r="3"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"/></circle><circle fill="currentColor" cx="12" cy="12" r="3"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2"/></circle><circle fill="currentColor" cx="20" cy="12" r="3"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3"/></circle></svg>';

const iconError =
  '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M11.001 10h2v5h-2zM11 16h2v2h-2z" fill="currentColor"></path><path d="M13.768 4.2C13.42 3.545 12.742 3.138 12 3.138s-1.42.407-1.768 1.063L2.894 18.064a1.986 1.986 0 0 0 .054 1.968A1.984 1.984 0 0 0 4.661 21h14.678c.708 0 1.349-.362 1.714-.968a1.989 1.989 0 0 0 .054-1.968L13.768 4.2zM4.661 19 12 5.137 19.344 19H4.661z" fill="currentColor"></path></svg>';

export { iconPlus, iconMinus, iconTick, iconCross, iconFirst, iconLast, iconNext, iconPrev, iconLoader, iconError };
