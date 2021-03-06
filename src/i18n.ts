
import { mergeDeep } from "./merge.js";

export class i18n {

    private translation: Object;

    constructor() {
        this.translation = { en_EN: {} };
    }

    /**
     * 
     * @param {*} translationData 
     */
    addTranslation(translationData: Object) {
        translationData = translationData != null && translationData.constructor.name === "Object" ? translationData : {};
        this.translation = mergeDeep(this.translation, translationData);
    }

    _t(text: string, language: string = "en_EN"): string {
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