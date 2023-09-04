# SimpleHTMLLocalizer

SimpleHTMLLocalizer is a lightweight tool allowing you to easily localize HTML text inside your HTML webpage dynamically during rendering.
* Lightweight, simple localization module
* Automatically loads localized texts based on the navigator's locale (can be overwritten with a js function call)
* Automatically translate HTML texts within `<l-text>` tag
* Automatically translate option elements with `is="l-option"` attribute
* Dynamically switch languages without page reload
* No extra parsing needed
* Everything is done client-side, no server calls needed

This module is perfect for small menu-style applications. I personally use it all my web-based config interfaces for ESP32/Arduino projects. It probably is not the best solution for websites with big blocks of text, since the translation dictionary can become unwieldy.

# Usage

Copy `localizer.js` and `user_dictionary.js` to your project (`localizer_debug.js` too, if you want debugging functionality).

Edit `user_dictionary.js` dictionary to add your text for each language you want to support. Note that the script falls-back to language "en" if a requested language is not defined in the dictionary, therefore "en" should always be included:

```javascript
var loc_dictionary = { // do not change the name "loc_dictionary"!
    "en": { // "en" is allso the fallback lang, so it should always be included
        "hello_world": "Hello World!"
    },
    "ja": {
        "hello_world": "こんにちは！"
    }
}
```

[Here is the list of all Language Codes](http://4umi.com/web/html/languagecodes.php)

Next, load the module at the top of your HTML page by simply importing the script as well as the js file with the dictionary:

```html
<script src="./user_dictionary.js" type="text/javascript"></script>
<script src="./localizer.js" type="text/javascript"></script>
```

You're now ready to localize any HTML text inside your page! To do that, use the tag `<l-text>` with the `key` attribute.

```html
<l-text key="hello_world"></l-text>
```

If you want to force a specific language for your text to be localized, add the `lang` attribute.

```html
<l-text key="hello_world" lang="ja"></l-text>
```

Localize option elements by using the `is="l-option"` attribute:

```html
<select id="fruit">
    <option is="l-option" key="opt_apple" value="apple"></option>
</select>
```


Include the following code to use a specific language instead of the browser locale for elements without the `lang` attribute:

```html
<script type="text/javascript">
    loc_switchLangGlobal('de'); // force default language to german
</script>
```

You can dynamically switch the language for all existing elements (and elements created dynamically in the future) by calling `loc_switchLangGlobal( lang )` with a language code.

You can get all languages defined in the dictionary with the following code:

```javascript
const knownLangs = Object.getOwnPropertyNames(loc_dictionary);
```

You can split your dictionary into multiple files for bigger projects and only include the one relevant to the page at hand (i.e. the file does not need to be named `user_dictionary.js`, as long as it defines a `loc_dictionary` object in the style shown above).

The script is silent and does not report any errors (e.g. missing keys). For spotting mistakes in your application read about debugging below.

# Debugging

Replace `localizer.js` with `localizer_debug.js` to get debugging functionality:

```html
<script src="./user_dictionary.js" type="text/javascript"></script>
<script src="./localizer_debug.js" type="text/javascript"></script>
```

* localized elements get a pink background, so you can easily see if you missed something
* clicking on such an element will cycle through all translations, allowing you to quickly see if the translations also fit the layout
* Show element key on hover
* Output error when key is not found
* Output warning for unused key in fallback set (dynamic content is not taken into account,
  only what was loaded. But you can call loc_printUnusedKeys() manually from debug console)
* Output warning when keys do not align in the sets

# Example

See `example.html` for an example implementation of all features.

# Browser compatibility

TL;DR: All modern browsers with HTML5 support (=not older than 2016-2018).

Individual features used:
* [customElements.define](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define)
* [connectedCallback](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#using_the_lifecycle_callbacks)
