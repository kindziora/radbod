
import { mergeDeep } from "./merge.js";

export class i18n {

    private translation: Object;
    private language: string = "de_DE";

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

    /**
     * 
     * @param text 
     * @param language 
     * @returns 
     */
    _t(text: string, language: string = "en_EN"): string {
        if (this && typeof this.translation[language] !== "undefined" && typeof this.translation[language][text] !== "undefined") {
            return this.translation[language][text];
        }
        return text;
    }

    /**
     * 
     * @param langCode 
     */
    setLanguage(langCode: string) {
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