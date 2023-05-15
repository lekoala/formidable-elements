## Classes

<dl>
<dt><a href="#BsAutocomplete">BsAutocomplete</a></dt>
<dd></dd>
<dt><a href="#BsTags">BsTags</a></dt>
<dd></dd>
<dt><a href="#CleaveInput">CleaveInput</a></dt>
<dd><p>Cleave is a lightweight alternative to input-mask
It might be easier/simpler to use in some cases</p>
</dd>
<dt><a href="#ClipboardCopy">ClipboardCopy</a></dt>
<dd><p>Use data-value or data-selector to select data to copy to clipboard
Define a globalNotifier to notify (eg: use toaster)</p>
</dd>
<dt><a href="#GrowingTextarea">GrowingTextarea</a></dt>
<dd><p>A growing text area
Doesn&#39;t inherit from FormidableElement since it&#39;s not configurable
Set rows=1 to avoid layout shift in your html</p>
</dd>
<dt><a href="#LocaleProvider">LocaleProvider</a></dt>
<dd><p>In classes using this element, simply use localeProvider util and do not include this whole class multiple times</p>
</dd>
<dt><a href="#SquireEditor">SquireEditor</a></dt>
<dd></dd>
<dt><a href="#TiptapEditor">TiptapEditor</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#themeMode">themeMode</a> : <code>&quot;light&quot;</code> | <code>&quot;dark&quot;</code> | <code>&quot;auto&quot;</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#adjustStyles">adjustStyles(editor, toolbar, textarea)</a></dt>
<dd></dd>
<dt><a href="#checkButtonActive">checkButtonActive(btn, el, editor)</a></dt>
<dd></dd>
<dt><a href="#adjustStyles">adjustStyles(editor, toolbar, textarea)</a></dt>
<dd></dd>
<dt><a href="#checkButtonActive">checkButtonActive(btn, el, editor)</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#CountdownConfig">CountdownConfig</a></dt>
<dd></dd>
</dl>

<a name="BsAutocomplete"></a>

## BsAutocomplete
**Kind**: global class  
<a name="BsAutocomplete+el"></a>

### bsAutocomplete.el ⇒ <code>HTMLInputElement</code>
**Kind**: instance property of [<code>BsAutocomplete</code>](#BsAutocomplete)  
<a name="BsTags"></a>

## BsTags
**Kind**: global class  
<a name="BsTags+el"></a>

### bsTags.el ⇒ <code>HTMLSelectElement</code>
**Kind**: instance property of [<code>BsTags</code>](#BsTags)  
<a name="CleaveInput"></a>

## CleaveInput
Cleave is a lightweight alternative to input-maskIt might be easier/simpler to use in some cases

**Kind**: global class  
<a name="CleaveInput+el"></a>

### cleaveInput.el ⇒ <code>HTMLInputElement</code>
**Kind**: instance property of [<code>CleaveInput</code>](#CleaveInput)  
<a name="ClipboardCopy"></a>

## ClipboardCopy
Use data-value or data-selector to select data to copy to clipboardDefine a globalNotifier to notify (eg: use toaster)

**Kind**: global class  
**Link**: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript  

* [ClipboardCopy](#ClipboardCopy)
    * [.el](#ClipboardCopy+el) ⇒ <code>HTMLButtonElement</code>
    * [.notify(msg, successful)](#ClipboardCopy+notify)

<a name="ClipboardCopy+el"></a>

### clipboardCopy.el ⇒ <code>HTMLButtonElement</code>
**Kind**: instance property of [<code>ClipboardCopy</code>](#ClipboardCopy)  
<a name="ClipboardCopy+notify"></a>

### clipboardCopy.notify(msg, successful)
**Kind**: instance method of [<code>ClipboardCopy</code>](#ClipboardCopy)  

| Param | Type |
| --- | --- |
| msg | <code>string</code> | 
| successful | <code>Boolean</code> | 

<a name="GrowingTextarea"></a>

## GrowingTextarea
A growing text areaDoesn't inherit from FormidableElement since it's not configurableSet rows=1 to avoid layout shift in your html

**Kind**: global class  
<a name="GrowingTextarea+el"></a>

### growingTextarea.el ⇒ <code>HTMLTextAreaElement</code>
**Kind**: instance property of [<code>GrowingTextarea</code>](#GrowingTextarea)  
<a name="LocaleProvider"></a>

## LocaleProvider
In classes using this element, simply use localeProvider util and do not include this whole class multiple times

**Kind**: global class  

* [LocaleProvider](#LocaleProvider)
    * [.set(name, locale, obj)](#LocaleProvider.set) ⇒ <code>void</code>
    * [.for(name, locale)](#LocaleProvider.for) ⇒ <code>Object</code>

<a name="LocaleProvider.set"></a>

### LocaleProvider.set(name, locale, obj) ⇒ <code>void</code>
**Kind**: static method of [<code>LocaleProvider</code>](#LocaleProvider)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> |  |
| locale | <code>string</code> | A locale name or 'default' for default locale |
| obj | <code>Object</code> |  |

<a name="LocaleProvider.for"></a>

### LocaleProvider.for(name, locale) ⇒ <code>Object</code>
**Kind**: static method of [<code>LocaleProvider</code>](#LocaleProvider)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  |  |
| locale | <code>string</code> | <code>&quot;default&quot;</code> | A given locale (as stored by set method) or default |

<a name="SquireEditor"></a>

## SquireEditor
**Kind**: global class  
<a name="SquireEditor+el"></a>

### squireEditor.el ⇒ <code>HTMLTextAreaElement</code>
**Kind**: instance property of [<code>SquireEditor</code>](#SquireEditor)  
<a name="TiptapEditor"></a>

## TiptapEditor
**Kind**: global class  
<a name="TiptapEditor+el"></a>

### tiptapEditor.el ⇒ <code>HTMLTextAreaElement</code>
**Kind**: instance property of [<code>TiptapEditor</code>](#TiptapEditor)  
<a name="themeMode"></a>

## themeMode : <code>&quot;light&quot;</code> \| <code>&quot;dark&quot;</code> \| <code>&quot;auto&quot;</code>
**Kind**: global constant  
<a name="adjustStyles"></a>

## adjustStyles(editor, toolbar, textarea)
**Kind**: global function  

| Param | Type |
| --- | --- |
| editor | <code>HTMLElement</code> | 
| toolbar | <code>HTMLElement</code> | 
| textarea | <code>HTMLElement</code> | 

<a name="checkButtonActive"></a>

## checkButtonActive(btn, el, editor)
**Kind**: global function  

| Param | Type |
| --- | --- |
| btn | <code>Object</code> | 
| el | <code>HTMLButtonElement</code> | 
| editor | <code>Object</code> | 

<a name="adjustStyles"></a>

## adjustStyles(editor, toolbar, textarea)
**Kind**: global function  

| Param | Type |
| --- | --- |
| editor | <code>HTMLElement</code> | 
| toolbar | <code>HTMLElement</code> | 
| textarea | <code>HTMLElement</code> | 

<a name="checkButtonActive"></a>

## checkButtonActive(btn, el, editor)
**Kind**: global function  

| Param | Type |
| --- | --- |
| btn | <code>Object</code> | 
| el | <code>HTMLButtonElement</code> | 
| editor | <code>Editor</code> | 

<a name="CountdownConfig"></a>

## CountdownConfig
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| start | <code>string</code> \| <code>Object</code> | Start time or date expression |
| end | <code>string</code> \| <code>Object</code> | End time or date expression |
| url | <code>string</code> | Url on complete |
| unit | <code>string</code> | Unit to use instead of various components |
| locale | <code>string</code> | Locale |
| timer | <code>Boolean</code> | Self updating timer (true by default) |
| pad | <code>Boolean</code> | Pad h/m/s with 0 |
| decimalDigits | <code>Number</code> | Number of decimals to show for fractional numbers |
| labels | <code>Object</code> | Units labels |
| interval | <code>Number</code> | Time between timer update (1s by default) |
| reloadOnComplete | <code>Boolean</code> | Reload page at the end of the count down |
| onInit | <code>function</code> | Callback on init |
| onTick | <code>function</code> | Callback on tick |
| onComplete | <code>function</code> | Callback on complete |

