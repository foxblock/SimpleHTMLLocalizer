// Source: https://github.com/KonsomeJona/SimpleHTMLLocalizer
// https://github.com/KonsomeJona/SimpleHTMLLocalizer/issues/2

// Using import is only allowed in modules, which don't work on localhost.
// That complicates testing, so we just rely on include order.
// But if you want to go that route, uncomment the line below and just include 
// this file as type="module" (and don't include the user_dictionary.js in the HTML):
// import { loc_dictionary } from "./user_dictionary.js";

const _LOC_FALLBACK_KEY = "__no-key__";
const _LOC_FALLBACK_LANG = "en";

var _loc_registeredElements = new Array();

function _loc_translate(key, lang) {
    const dict = (lang in loc_dictionary) ? loc_dictionary[lang] : loc_dictionary[_LOC_FALLBACK_LANG]
    return key in dict ? dict[key] : ("NoT:" + lang + ":" + key);
}

// Set default language to user locale
// Ignore country code (example: en-US -> en)
var _loc_globalLang = ((navigator.languages != undefined) ? navigator.languages[0] : navigator.language).split("-")[0];

class LocalizedTextElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const key = this.hasAttribute('key') ? this.getAttribute('key') : _LOC_FALLBACK_KEY; 
        const lang = this.hasAttribute('lang') ? this.getAttribute('lang') : _loc_globalLang;
        this.innerHTML = _loc_translate(key, lang);

        _loc_registeredElements.push(this);
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

        _loc_registeredElements.push(this);
    }
}

/* Switch the language of every registered (i.e. created) element,
   and set language for every element created after this call.
   You can pass a language as string (e.g. "en" or "de").
*/
function loc_switchLangGlobal(newLang) {
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