// NOTE: Could also use Map, but looking around the net, an object
// seems to be faster for just getting the values (esp. if const).
// https://csb-yuu1dm.netlify.app/
// https://www.zhenghao.io/posts/object-vs-map
// https://stackoverflow.com/a/37994079

const loc_dictionary = { // do not change the name "loc_dictionary"!
    "en": { // "en" is allso the fallback lang, so it should always be included
        "hello_world": "Hello World!",
        "hello_world2": "Hello <b>World!</b>",
        "btn_lang_descr": "Switch all localized elements to Japanese",
        "btn_lang": "Switch language",
        "opt_apple": "Apple",
        "opt_pear": "Pear",
        "opt_orange": "Orange",
        "opt_grape": "Grape",
        "unused_key": "This key is not used and only present in this language",
    },
    "de": {
        "hello_world": "Hallo, Welt!",
        "hello_world2": "Hallo, <b>Welt!</b>",
        "btn_lang_descr": "Alle lokalisierten Elemente auf Japanisch umschalten",
        "btn_lang": "Sprache wechseln",
        "opt_apple": "Apfel",
        "opt_pear": "Birne",
        "opt_orange": "Orange",
        "opt_grape": "Traube",
    },
    "ja": {
        "hello_world": "こんにちは世界！",
        "hello_world2": "こんにちは<b>世界！</b>",
        "btn_lang_descr": "すべてのローカライズされた要素をドイツ語に切り替えます",
        "btn_lang": "言語を切り替える",
        "opt_apple": "アップル",
        "opt_pear": "梨",
        "opt_orange": "オレンジ",
        "opt_grape": "ブドウ",
    },
}

// Uncomment the line below if you want to go the ES6-module include route:
// export { dictionary };