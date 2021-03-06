import { mergeDeep } from "./merge.js";
export class i18n {
    constructor() {
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
    _t(text, language = "en_EN") {
        if (this && typeof this.translation[language] !== "undefined" && typeof this.translation[language][text] !== "undefined") {
            return this.translation[language][text];
        }
        return text;
    }
    setLanguage() {
    }
    getLanguage() {
    }
    getLanguages() {
    }
}
