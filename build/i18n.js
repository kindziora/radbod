import { mergeDeep } from "./merge.js";
export class i18n {
    constructor() {
        this.language = "de_DE";
        this.translation = { en_EN: {} };
    }
    /**
     *
     * @param {*} translationData
     */
    addTranslation(translationData) {
        translationData = translationData != null && translationData.constructor.name === "Object" ? translationData : {};
        this.translation = mergeDeep(this.translation, translationData);
    }
    /**
     *
     * @param text
     * @param language
     * @returns
     */
    _t(text, language = "en_EN") {
        if (this && typeof this.translation[language] !== "undefined" && typeof this.translation[language][text] !== "undefined") {
            return this.translation[language][text];
        }
        return text;
    }
    /**
     *
     * @param langCode
     */
    setLanguage(langCode) {
        if (langCode) {
            this.language = langCode;
        }
    }
    getLanguage() {
        return this.language;
    }
    getLanguages() {
    }
}
