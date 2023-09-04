// Source: https://github.com/KonsomeJona/SimpleHTMLLocalizer
// https://github.com/KonsomeJona/SimpleHTMLLocalizer/issues/2

/***** 
DEBUG mode:
- localized elements get a pink background, so you can easily see if you missed something
- clicking on such an element will cycle through all the translations, allowing you to 
  quickly see if the translations also fit the layout without changing locale
- Show element key on hover
- Output error when key is not found
- Output warning for unused key in fallback set (dynamic content is not taken into account,
  only what was loaded. But you can call loc_printUnusedKeys() manually from debug console)
- Output warning when keys do not align in the sets
- Cycle through language for all elements with function call loc_switchLangGlobal in debug console
*****/

// import { loc_dictionary } from "./user_dictionary";

const _LOC_FALLBACK_KEY = "__no-key__";
const _LOC_FALLBACK_LANG = "en";

function _loc_translate(key, lang) {
    const dict = (lang in loc_dictionary) ? loc_dictionary[lang] : loc_dictionary[_LOC_FALLBACK_LANG]
    if (key in dict) {
        return dict[key];
    }
    else {
        console.error(`Lang "${lang}" is missing key "${key}"!`);
        return ("NoT:" + lang + ":" + key);
    }
}

// Ignore country code (example: en-US -> en)
var _loc_globalLang = ((navigator.languages != undefined) ? navigator.languages[0] : navigator.language).split("-")[0];

const _loc_knownLangs = Object.getOwnPropertyNames(loc_dictionary);
var _loc_unusedKeys = Object.getOwnPropertyNames(loc_dictionary[_LOC_FALLBACK_LANG]);
var _loc_registeredElements = new Array();

class LocalizedTextElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        var key = this.hasAttribute('key') ? this.getAttribute('key') : _LOC_FALLBACK_KEY; 
        var lang = this.hasAttribute('lang') ? this.getAttribute('lang') : _loc_globalLang;
        this.innerHTML = _loc_translate(key, lang);

        this.style.backgroundColor = "rgba(255, 0, 255, 0.25)";
        this.currLang = Object.getOwnPropertyNames(loc_dictionary).indexOf(lang);
        this.onclick = this.debugSwitchLang;
        this.title = key;

        const index = _loc_unusedKeys.indexOf(key);
        if (index != -1)
            _loc_unusedKeys.splice(index, 1);

        _loc_registeredElements.push(this);
    }

    debugSwitchLang() {
        if (this.currLang < 0)
            return;

        if (++this.currLang >= _loc_knownLangs.length)
            this.currLang = 0;
        this.innerHTML = _loc_translate(
                this.hasAttribute('key') ? this.getAttribute('key') : _LOC_FALLBACK_KEY, 
                _loc_knownLangs[this.currLang]);
    }
}

class LocalizedOptionElement extends HTMLOptionElement {
    constructor() {
        super();
    }

    connectedCallback() {
        var key = this.hasAttribute('key') ? this.getAttribute('key') : _LOC_FALLBACK_KEY;
        var lang = this.hasAttribute('lang') ? this.getAttribute('lang') : _loc_globalLang;
        this.innerHTML = _loc_translate(key, lang);

        this.style.backgroundColor = "rgba(255, 0, 255, 0.25)";
        this.title = key;

        const index = _loc_unusedKeys.indexOf(key);
        if (index != -1)
            _loc_unusedKeys.splice(index, 1);

        _loc_registeredElements.push(this);
    }
}

/* Compare each set of keys from a known language to the key set of the fallback language
   Will print out warnings to the console for keys present in one set, but not the other.
   So you can see if your key sets align
*/
function loc_crossCompareLangs() {
    const fallbackKeys = Object.getOwnPropertyNames(loc_dictionary[_LOC_FALLBACK_LANG]);
    for (var l = 0; l < _loc_knownLangs.length; ++l) {
        if (_loc_knownLangs[l] == _LOC_FALLBACK_LANG)
            continue;
        var keys = Object.getOwnPropertyNames(loc_dictionary[_loc_knownLangs[l]]);
        for (var k = 0; k < fallbackKeys.length; ++k) {
            const index = keys.indexOf(fallbackKeys[k]);
            if (index == -1) {
                console.warn(`Lang "${_loc_knownLangs[l]}" does not include key "${fallbackKeys[k]}"!`);
                continue;
            }
            keys.splice(index, 1);
        }
        for (var k = 0; k < keys.length; ++k) {
            console.warn(`Lang "${_loc_knownLangs[l]}" has extra key "${keys[k]}"!`);
        }
    }
}

/* Every time an element is registered thorugh connectedCallback it will remove its
   key from the list. With this function you can print out the contents of the list
   i.e. keys that were never used.
   NOTE: Dynamically created elements are only taken into account after they were
   created in HTML at least once.
*/
function loc_printUnusedKeys() {
    for (var i = 0; i < _loc_unusedKeys.length; ++i)
        console.warn(`Unused key "${_loc_unusedKeys[i]}" in dictionary!`);
}

/* Switch the language of every registered (i.e. created) element.
   You can pass a language as string (e.g. "en" or "de").
   Passing nothing will cycle through the known langauges.
*/
function loc_switchLangGlobal(newLang) {
    if (newLang == undefined) {
        const langIndex = _loc_knownLangs.indexOf(_loc_globalLang) + 1;
        if (langIndex >= _loc_knownLangs.length)
            _loc_globalLang = _loc_knownLangs[0];
        else
            _loc_globalLang = _loc_knownLangs[langIndex];
    }
    else
        _loc_globalLang = newLang;

    for (var i = 0; i < _loc_registeredElements.length; ++i) {
        _loc_registeredElements[i].innerHTML = _loc_translate(
                _loc_registeredElements[i].hasAttribute('key') ? _loc_registeredElements[i].getAttribute('key') : _LOC_FALLBACK_KEY,
                _loc_globalLang);
    }

    return _loc_globalLang;
}

// custom elements need to contain a '-'
customElements.define('l-text', LocalizedTextElement);
customElements.define('l-option', LocalizedOptionElement, { extends: 'option' });

window.addEventListener('load', function () {
    loc_crossCompareLangs();
    loc_printUnusedKeys();
});