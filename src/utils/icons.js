// Plus/minus
const iconPlus =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24"><line x1="4" y1="12" x2="20" y2="12" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><line y1="4" x1="12" y2="20" x2="12" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>';
const iconMinus =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24"><line x1="4" y1="12" x2="20" y2="12" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>';

// Tick/cross
const iconTick =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M5 13L9 17L19 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const iconCross =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// Pagination
const iconFirst =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" fill="currentColor"/></svg>';
const iconLast =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" fill="currentColor"/></svg>';
const iconNext =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>';
const iconPrev =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>';

// The SMIL specification says that durations cannot start with a leading decimal point.
// Firefox implements the specification as written, Chrome does not. Converting from dur=".75s" to dur="0.75s" will fix it in a cross-browser fashion.
const iconLoader =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" xml:space="preserve"><circle fill="currentColor" cx="4" cy="12" r="3"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1"/></circle><circle fill="currentColor" cx="12" cy="12" r="3"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2"/></circle><circle fill="currentColor" cx="20" cy="12" r="3"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3"/></circle></svg>';

export { iconPlus, iconMinus, iconTick, iconCross, iconFirst, iconLast, iconNext, iconPrev, iconLoader };
