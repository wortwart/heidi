# Heidi -- makes forms more interactive #

Heidi is a tiny JavaScript library that shows or hides content areas according to user interaction on form elements. You only need to use `data`-attributes in HTML.

See the demo on www.woerter.de/projects/heidi/demo.html and check out its source code which is part of this repository.

## Installation ##

1) Embed jQuery (tested with v2, will possibly work with v1).
2) Embed heidi.js. You can do that in the head or anywhere in the body, as you prefer.
3) Embed heidi.css which contains a few necessary CSS classes.

Your header might look like this:

    <head>
        <meta charset="utf-8">
        <title>I contain an interactive form</title>
        <link rel="stylesheet" type="text/css" href="heidi.css"/>
        <script type="text/javascript" src="vendor/jquery2.js"></script>
        <script type="text/javascript" src="heidi.js"></script>
    </head>

## Basic Usage: ##

- Set a `data-select` attribute in a form element. Its value has to be a CSS selector as you use them in jQuery, e.g. `data-select="#element"` or `data-select=".class"`.
- All elements which fit to this selector will be hidden `onLoad` and show up when you enter content, select or check the form element &ndash; depending on the type of the form element.
- Heidi works with `<input>` (all types), `<option>`, and `<button>`.
- Heidi is tested on all modern browsers and Internet Explorer back to version 9. It possibly will work on even older IEs, but go check yourself if you have to.
- There is basic support for `<textarea>` but browsers don't handle `onChange` events on these elements very well. Heidi does not yet make use of `onInput`.

## Some Advanced Tips: ##

- If you hide other form elements you can decide if you want their contents deleted if they are hidden (default: no). Set the property `deleteHiddenFields` in the beginning of the script accordingly.
- You can use complex selectors. `<input type="checkbox" data-select=".class, #id"/>` will turn on `<x id="id">` and all `<x class="class">`.
- Negative selectors are possible! `<input type="checkbox" data-select="!.class"/>` will turn off all <x class="class"></code>
- If you need more than one condition to be met for an element to show, use different selectors, e.g. `#id` and `el#id`.
- Buttons are different from input and select fields. They are meant to be used as a row of switches turning alternate sections of content on (see demo below). They require a `data-value` attribute in their root element that states which section is on per default. They can't have multiple selectors.
