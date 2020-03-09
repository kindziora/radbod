var radbod =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./build/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./build/app.js":
/*!**********************!*\
  !*** ./build/app.js ***!
  \**********************/
/*! exports provided: app */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"app\", function() { return app; });\n/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component.js */ \"./build/component.js\");\n/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom.js */ \"./build/dom.js\");\n/* harmony import */ var _eventHandler_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./eventHandler.js */ \"./build/eventHandler.js\");\n/* harmony import */ var _dataHandler_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dataHandler.js */ \"./build/dataHandler.js\");\n/* harmony import */ var _store_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./store.js */ \"./build/store.js\");\n/* harmony import */ var _i18n_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./i18n.js */ \"./build/i18n.js\");\n\n\n\n\n\n\nclass app {\n    constructor(environment) {\n        this.components = {};\n        this.environment = environment;\n        this.dataH = new _dataHandler_js__WEBPACK_IMPORTED_MODULE_3__[\"dataHandler\"](new _eventHandler_js__WEBPACK_IMPORTED_MODULE_2__[\"eventHandler\"](), environment);\n    }\n    /**\n     *\n     * @param name\n     * @param componentObject\n     * @param callback\n     */\n    mountComponent(name, componentObject, callback) {\n        console.log(\"COMPOS\", this.loadStores(componentObject, (stores, data) => {\n            let compo = this.createComponent(name, componentObject.views, componentObject.data.call(this.dataH), componentObject.interactions(), componentObject.components, componentObject.translations());\n            callback(stores, data, compo);\n        }));\n    }\n    /**\n        *\n        * @param name\n        * @param html\n        * @param data\n        * @param actions\n        * @param injections\n        */\n    createComponent(name, views, data, actions, injections = {}, translations = {}) {\n        var _a, _b, _c, _d, _e, _f, _g, _h, _j;\n        let s;\n        if (data instanceof _store_js__WEBPACK_IMPORTED_MODULE_4__[\"store\"]) {\n            s = data;\n        }\n        else {\n            s = this.dataH.createStore(name, data);\n        }\n        let el = document.createElement(\"component\");\n        let storeArray = (_a = this.dataH) === null || _a === void 0 ? void 0 : _a.store.toArray();\n        let internationalize = new _i18n_js__WEBPACK_IMPORTED_MODULE_5__[\"i18n\"]();\n        internationalize.addTranslation(translations);\n        let _t = (text, lang) => internationalize._t(text, lang);\n        if (typeof ((_b = views) === null || _b === void 0 ? void 0 : _b[name]) === \"function\") {\n            el.innerHTML = (_d = (_c = views) === null || _c === void 0 ? void 0 : _c[name]) === null || _d === void 0 ? void 0 : _d.apply(s, [{ value: \"\" }, ...storeArray, _t]);\n        }\n        else {\n            el.innerHTML = (_e = views) === null || _e === void 0 ? void 0 : _e[name];\n        }\n        let ddom = new _dom_js__WEBPACK_IMPORTED_MODULE_1__[\"dom\"](el, injections, s, views, _t);\n        ddom.name = name;\n        el.setAttribute(\"data-name\", name);\n        this.components[name] = new _component_js__WEBPACK_IMPORTED_MODULE_0__[\"component\"](ddom, s, actions);\n        if (typeof ((_f = views) === null || _f === void 0 ? void 0 : _f[name]) !== \"function\") {\n            let stores = (_h = (_g = this.dataH) === null || _g === void 0 ? void 0 : _g.store.keys()) === null || _h === void 0 ? void 0 : _h.join(',');\n            this.components[name].dom.setTemplate(eval('(change,' + stores + ', _t)=>`' + this.components[name].dom._area.innerHTML + '`'));\n        }\n        else {\n            this.components[name].dom.setTemplate((_j = views) === null || _j === void 0 ? void 0 : _j[name]);\n        }\n        return this.components[name];\n    }\n    /**\n     *\n     * @param name\n     */\n    removeComponent(name) {\n        delete this.components[name];\n    }\n    /**\n     *\n     * @param url\n     */\n    render(url) {\n    }\n    fetchData(component, cb, allready, total, meta) {\n        let callback = function (meta, dataH) {\n            return (data) => {\n                cb(data);\n                meta.cnt++;\n                meta.loaded.push(component);\n                if (meta.cnt >= total) {\n                    allready(dataH, meta);\n                }\n            };\n        };\n        let result = component.data.call(this.dataH, callback(meta, this.dataH), {});\n        if (!result || typeof result.then !== \"function\") {\n            meta.cnt++;\n            meta.loaded.push(component);\n        }\n        for (let i in component.components) {\n            this.fetchData(component.components[i], cb, allready, total, meta);\n        }\n        if (meta.cnt >= total) {\n            allready(this.store.dataH, meta);\n        }\n    }\n    countForData(component, cnt) {\n        for (let i in component.components)\n            cnt = this.countForData(component.components[i], cnt);\n        return ++cnt;\n    }\n    loadStores(componentObject, cb) {\n        let count = this.countForData(componentObject, 0);\n        let met = { cnt: 0, loaded: [] };\n        this.fetchData(componentObject, (data) => {\n        }, cb, count, met, this.dataH);\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/app.js?");

/***/ }),

/***/ "./build/component.js":
/*!****************************!*\
  !*** ./build/component.js ***!
  \****************************/
/*! exports provided: component */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"component\", function() { return component; });\nclass component {\n    /**\n     *\n     * @param dom\n     * @param store\n     */\n    constructor(dom, store, acts) {\n        this.name = \"\";\n        this.interactions = {};\n        this.dom = dom;\n        this.store = store;\n        this.interactions = acts;\n        this.name = this.dom.name;\n        this.$el = dom._area;\n        this.bindEvents();\n    }\n    getName() {\n        return this.name;\n    }\n    setId(namesp, counter) {\n        let id = namesp || \"element\" + \"-\" + counter;\n        this.$el.setAttribute(\"data-id\", id);\n        this.id = id;\n    }\n    bindEvents() {\n        //this.update.bind(this);\n        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;\n        (_a = this.store.events) === null || _a === void 0 ? void 0 : _a.addEvent(this.name, \"/\", \"change\", this.update, this);\n        (_b = this.store.events) === null || _b === void 0 ? void 0 : _b.addEvent(this.store.name, \"/\", \"change\", this.update, this);\n        (_c = this.store.events) === null || _c === void 0 ? void 0 : _c.addEvent(this.name, \"/\", \"change\", (_e = (_d = this.interactions) === null || _d === void 0 ? void 0 : _d[\"/\"]) === null || _e === void 0 ? void 0 : _e[\"change\"], this);\n        (_f = this.store.events) === null || _f === void 0 ? void 0 : _f.addEvent(this.store.name, \"/\", \"change\", (_h = (_g = this.interactions) === null || _g === void 0 ? void 0 : _g[\"/\"]) === null || _h === void 0 ? void 0 : _h[\"change\"], this);\n        for (let path in this.interactions) {\n            for (let event in this.interactions[path]) {\n                for (let field in this.dom.elementByName[path]) {\n                    let $el = this.dom.elementByName[path][field].$el;\n                    let fieldID = this.dom.elementByName[path][field].id;\n                    let mapEvent = event.split('#');\n                    if (mapEvent.length > 1) {\n                        if (fieldID === mapEvent[1]) {\n                            (_j = this.store.events) === null || _j === void 0 ? void 0 : _j.addEvent(this.name, path, event, (_l = (_k = this.interactions) === null || _k === void 0 ? void 0 : _k[path]) === null || _l === void 0 ? void 0 : _l[event]);\n                            $el.addEventListener(mapEvent[0], (ev) => {\n                                var _a;\n                                (_a = this.store.events) === null || _a === void 0 ? void 0 : _a.dispatchEvent(this.name, path, event, { \"field\": this.dom.elementByName[path][field], ev }, this.store.data);\n                            });\n                        }\n                    }\n                    else {\n                        (_m = this.store.events) === null || _m === void 0 ? void 0 : _m.addEvent(this.name, path, event, (_p = (_o = this.interactions) === null || _o === void 0 ? void 0 : _o[path]) === null || _p === void 0 ? void 0 : _p[event]);\n                        $el.addEventListener(event, (ev) => {\n                            var _a;\n                            (_a = this.store.events) === null || _a === void 0 ? void 0 : _a.dispatchEvent(this.name, path, event, { \"field\": this.dom.elementByName[path][field], ev }, this.store.data);\n                        });\n                    }\n                }\n            }\n        }\n    }\n    update(changes) {\n        for (let i = 0; i < changes.length; i++) {\n            let change = changes[i];\n            let chs = this.dom.getBestMatchingElements(change.path);\n            chs.forEach((el) => el.update([change]));\n            if (chs.length === 0) {\n                this.render(change);\n            }\n        }\n    }\n    render(changes) {\n        console.log(\"COMPONENT UPDATE BECAUSE NO FIELD TO MATCH\");\n        this.dom.render(changes);\n        this.bindEvents();\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/component.js?");

/***/ }),

/***/ "./build/dataHandler.js":
/*!******************************!*\
  !*** ./build/dataHandler.js ***!
  \******************************/
/*! exports provided: dataHandler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"dataHandler\", function() { return dataHandler; });\n/* harmony import */ var _store_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./store.js */ \"./build/store.js\");\n\n;\nclass dataHandler {\n    constructor(eventH, environment) {\n        this.store = {};\n        this.pxy = {};\n        this.events = eventH;\n        this.environment = environment;\n        this.store.toArray = () => {\n            let arr = [];\n            for (let i in this.store) {\n                if (typeof this.store[i] === \"object\")\n                    arr.push(this.store[i].data);\n            }\n            let e = arr.sort() || [];\n            return e;\n        };\n        this.store.keys = () => {\n            let arr = [];\n            for (let i in this.store) {\n                if (typeof this.store[i] === \"object\")\n                    arr.push(i);\n            }\n            return arr.sort();\n        };\n    }\n    /**\n     *\n     * @param component\n     * @param data\n     */\n    createStore(component, data) {\n        var _a, _b;\n        this.store[component] = new _store_js__WEBPACK_IMPORTED_MODULE_0__[\"store\"](this.events, this, component, data);\n        this.store[component].setDb((_b = (_a = this) === null || _a === void 0 ? void 0 : _a.environment) === null || _b === void 0 ? void 0 : _b.data_loader);\n        return this.store[component];\n    }\n    getStore(component) {\n        return this.store[component];\n    }\n    /**\n     * collect all changes then bubble event after ...what is important?\n     * @param component\n     * @param changes\n     */\n    changeStores(component, change) {\n        console.log(component, change);\n        /* for(let i in this.relations[component]){\n             console.log(i, this.store[i].data, this.relations[component][i]);\n             //fjp.default.applyPatch(this.store[i].data, change);\n \n         }\n         */\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/dataHandler.js?");

/***/ }),

/***/ "./build/dom.js":
/*!**********************!*\
  !*** ./build/dom.js ***!
  \**********************/
/*! exports provided: dom */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"dom\", function() { return dom; });\n/* harmony import */ var _dom_element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom/element.js */ \"./build/dom/element.js\");\n/* harmony import */ var _dom_element_input_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom/element/input.js */ \"./build/dom/element/input.js\");\n/* harmony import */ var _dom_element_input_radio_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dom/element/input/radio.js */ \"./build/dom/element/input/radio.js\");\n/* harmony import */ var _dom_element_input_checkbox_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dom/element/input/checkbox.js */ \"./build/dom/element/input/checkbox.js\");\n/* harmony import */ var _dom_element_input_text_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom/element/input/text.js */ \"./build/dom/element/input/text.js\");\n/* harmony import */ var _dom_element_input_range_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dom/element/input/range.js */ \"./build/dom/element/input/range.js\");\n/* harmony import */ var _dom_element_input_file_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dom/element/input/file.js */ \"./build/dom/element/input/file.js\");\n/* harmony import */ var _dom_element_button_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dom/element/button.js */ \"./build/dom/element/button.js\");\n/* harmony import */ var _dom_list_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./dom/list.js */ \"./build/dom/list.js\");\n/* harmony import */ var _dom_list_select_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./dom/list/select.js */ \"./build/dom/list/select.js\");\n/* harmony import */ var _dom_element_textarea_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./dom/element/textarea.js */ \"./build/dom/element/textarea.js\");\n/* harmony import */ var _component_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./component.js */ \"./build/component.js\");\n/* harmony import */ var _store_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./store.js */ \"./build/store.js\");\n/* harmony import */ var _i18n_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./i18n.js */ \"./build/i18n.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nclass dom {\n    constructor(area, types, s, views, _t) {\n        var _a;\n        this._area = {};\n        this._identifier = '[data-name]';\n        this.element = {};\n        this.elementByName = {};\n        this.elementTypes = { input: _dom_element_input_js__WEBPACK_IMPORTED_MODULE_1__[\"input\"], text: _dom_element_input_text_js__WEBPACK_IMPORTED_MODULE_4__[\"text\"], radio: _dom_element_input_radio_js__WEBPACK_IMPORTED_MODULE_2__[\"radio\"], checkbox: _dom_element_input_checkbox_js__WEBPACK_IMPORTED_MODULE_3__[\"checkbox\"], range: _dom_element_input_range_js__WEBPACK_IMPORTED_MODULE_5__[\"range\"], file: _dom_element_input_file_js__WEBPACK_IMPORTED_MODULE_6__[\"file\"], button: _dom_element_button_js__WEBPACK_IMPORTED_MODULE_7__[\"button\"], list: _dom_list_js__WEBPACK_IMPORTED_MODULE_8__[\"elist\"], select: _dom_list_select_js__WEBPACK_IMPORTED_MODULE_9__[\"select\"], textarea: _dom_element_textarea_js__WEBPACK_IMPORTED_MODULE_10__[\"textarea\"], kelement: _dom_element_js__WEBPACK_IMPORTED_MODULE_0__[\"kelement\"] };\n        this.counter = 0;\n        this.id = \"component-0\";\n        this.name = \"component-x\";\n        this._area = area;\n        this.$el = this._area;\n        this.views = views;\n        this._t = _t;\n        this.setId();\n        if (area.hasAttribute('data-name')) {\n            this.name = area.getAttribute('data-name');\n        }\n        else {\n            this.name = (_a = area) === null || _a === void 0 ? void 0 : _a.tagName;\n        }\n        this.store = s;\n        this.addTypes(types);\n        this.loadElements();\n    }\n    setTemplate(template) {\n        this.template = template;\n    }\n    /**\n     * !!caution this is slow and overwrites the home html of the dom area\n     * @param data\n     */\n    render(data) {\n        var _a, _b;\n        this.element = {};\n        this.elementByName = {};\n        let params = [data];\n        for (let e in (_a = this.store.dataH) === null || _a === void 0 ? void 0 : _a.store) {\n            params.push((_b = this.store.dataH) === null || _b === void 0 ? void 0 : _b.store[e].data);\n        }\n        params.push(this._t);\n        this._area.innerHTML = this.template.apply(this, params);\n        this.loadElements();\n    }\n    /**\n     *\n     * @param types\n     */\n    addTypes(types) {\n        for (let i in types) {\n            types[i].prototype = \"component\";\n            this.elementTypes[i] = types[i];\n        }\n    }\n    setId() {\n        this.counter++;\n        let id = \"component-\" + this.counter;\n        this._area.setAttribute(\"data-id\", id);\n        this.id = id;\n    }\n    /**\n     *\n     * @param name\n     * @param $el\n     */\n    mapField(name, $element) {\n        var _a, _b;\n        switch (name) {\n            case \"input\":\n                if ($element.getAttribute('type'))\n                    name = $element.getAttribute('type');\n                break;\n            case \"ul\":\n                name = \"list\";\n                (_a = $element) === null || _a === void 0 ? void 0 : _a.setAttribute('data-type', \"list\");\n                break;\n        }\n        if (typeof this.elementTypes[name] === \"undefined\") { //unknown field type, back to default\n            name = \"kelement\";\n        }\n        if (((_b = $element) === null || _b === void 0 ? void 0 : _b.getAttribute('data-type')) == \"list\") {\n            name = \"list\";\n        }\n        return name;\n    }\n    /**\n     *\n     * @param el\n     * @param where\n     * @param html\n     */\n    insertElementByElement(el, where = 'beforeend', html) {\n        var _a;\n        (_a = el.$el) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML(where, html);\n    }\n    /**\n     *\n     * @param $el\n     * @param fieldTypeName\n     * @param data\n     */\n    createComponent($el, fieldTypeName, data) {\n        var _a, _b, _c, _d, _e, _f, _g, _h;\n        let s;\n        let componentObject = this.elementTypes[fieldTypeName];\n        let name = fieldTypeName;\n        if (data instanceof _store_js__WEBPACK_IMPORTED_MODULE_12__[\"store\"]) {\n            s = data;\n        }\n        else if (typeof data !== \"undefined\") {\n            s = this.store.dataH.createStore(name, data);\n        }\n        else {\n            s = componentObject.data.call(this.store.dataH);\n            if (s instanceof _store_js__WEBPACK_IMPORTED_MODULE_12__[\"store\"]) {\n            }\n            else {\n                // s = this.store.dataH.createStore(name, s);\n            }\n        }\n        let storeArray = (_a = this.store.dataH) === null || _a === void 0 ? void 0 : _a.store.toArray();\n        let stores = (_b = this.store.dataH) === null || _b === void 0 ? void 0 : _b.store.keys();\n        let internationalize = new _i18n_js__WEBPACK_IMPORTED_MODULE_13__[\"i18n\"]();\n        internationalize.addTranslation(componentObject.translations ? componentObject.translations() : {});\n        let _t = (text, lang) => internationalize._t(text, lang);\n        if ((_d = (_c = componentObject) === null || _c === void 0 ? void 0 : _c.views) === null || _d === void 0 ? void 0 : _d[name]) {\n            $el.innerHTML = componentObject.views[name].apply(s, [{ value: \"\" }, ...storeArray, _t]);\n        }\n        else {\n            $el.innerHTML = componentObject.html.trim();\n            // shadowRoot.innerHTML = componentObject.html.trim();\n        }\n        console.log(s, componentObject.views, name, componentObject);\n        let ddom = new dom($el, componentObject.components || {}, s, componentObject.views, _t);\n        ddom.name = name;\n        $el.setAttribute(\"data-name\", name);\n        let newcomponent = new _component_js__WEBPACK_IMPORTED_MODULE_11__[\"component\"](ddom, s, componentObject.interactions());\n        if (typeof ((_f = (_e = componentObject) === null || _e === void 0 ? void 0 : _e.views) === null || _f === void 0 ? void 0 : _f[name]) !== \"function\") {\n            newcomponent.dom.setTemplate(eval('(change,' + ((_g = stores) === null || _g === void 0 ? void 0 : _g.join(',')) + ',_t)=>`' + newcomponent.dom._area.innerHTML + '`'));\n        }\n        else {\n            newcomponent.dom.setTemplate((_h = componentObject) === null || _h === void 0 ? void 0 : _h.views[name]);\n        }\n        return newcomponent;\n    }\n    /**\n     *\n     * @param $el\n     * @param currentIndex\n     */\n    createElement($el, currentIndex) {\n        let fieldTypeName = this.mapField($el.tagName.toLowerCase(), $el);\n        return this.elementTypes[fieldTypeName].prototype === \"component\" ?\n            this.createComponent($el, fieldTypeName) :\n            new this.elementTypes[fieldTypeName]($el, this._area, currentIndex, this, this.views, this._t);\n    }\n    /**\n     *\n     * @param t_el\n     */\n    detectType(t_el) {\n        var _a, _b, _c, _d, _e, _f, _g;\n        let last = (_c = (_b = (_a = t_el) === null || _a === void 0 ? void 0 : _a.getName()) === null || _b === void 0 ? void 0 : _b.split(\"/\")) === null || _c === void 0 ? void 0 : _c.pop();\n        if (!isNaN(last) || ((_e = (_d = t_el) === null || _d === void 0 ? void 0 : _d.$el) === null || _e === void 0 ? void 0 : _e.getAttribute('data-type')) == \"list-item\") {\n            t_el.setIsListItem(true);\n            let id = (_g = (_f = t_el.$el) === null || _f === void 0 ? void 0 : _f.parentElement) === null || _g === void 0 ? void 0 : _g.getAttribute(\"data-id\");\n            if (id) {\n                if (this.element[id]) {\n                    t_el.setListContainer(this.element[id]);\n                }\n            }\n        }\n    }\n    /**\n     *\n     * @param $el\n     * @param currentIndex\n     */\n    loadElement($el, currentIndex) {\n        this.counter++;\n        let t_el = this.createElement($el, this.counter); //decorate and extend dom element\n        this.detectType(t_el);\n        this.addElement(t_el);\n        this.addElementByName(t_el, t_el.getName());\n        this.detectOrphanVariables(t_el)\n            .forEach(name => this.addElementByName(t_el, name));\n        return t_el;\n    }\n    /**\n     * detect orphan variable usages\n     * @param t_el\n     */\n    detectOrphanVariables(t_el) {\n        if (!t_el.$el)\n            return [];\n        let tpNode = t_el.$el.cloneNode(true);\n        Array.from(tpNode.childNodes).map(e => { if (e.hasAttribute && e.hasAttribute(\"data-name\"))\n            e.remove(); });\n        let transForm = (m) => (\"/$\" + m[1])\n            .replace(/\\.|\\[|\\]|\\'|\\\"/g, '/')\n            .replace(/\\/\\//g, \"/\")\n            .replace(/\\/$/, '');\n        let names = Array.from(tpNode.innerHTML.matchAll(/\\${([\\w\\.\\[\\]]*)}/ig), transForm);\n        //  console.log(tpNode.outerHTML);\n        return names;\n    }\n    loadElements() {\n        let element = this._area.querySelectorAll(this._identifier);\n        try {\n            element.forEach(($el, currentIndex) => this.loadElement($el, currentIndex));\n        }\n        catch (e) {\n            console.log(e);\n        }\n    }\n    removeElement(el) {\n        el.$el.remove();\n        delete this.element[el.id];\n    }\n    addElement(el) {\n        this.element[el.id] = el;\n    }\n    addElementByName(el, name) {\n        if (typeof this.elementByName[name] === \"undefined\") {\n            this.elementByName[name] = [];\n        }\n        this.elementByName[name].push(el);\n    }\n    // patch  == [\n    //   { op: \"replace\", path: \"/firstName\", value: \"Albert\"},\n    //   { op: \"replace\", path: \"/contactDetails/phoneNumbers/0/number\", value: \"123\" },\n    //   { op: \"add\", path: \"/contactDetails/phoneNumbers/1\", value: {number:\"456\"}}\n    // ];\n    /**\n     *\n     * @param path\n     */\n    getBestMatchingElements(path) {\n        let elements = [];\n        if (typeof this.elementByName[path] !== \"undefined\") {\n            elements = this.elementByName[path];\n        }\n        else {\n            let parentPath = path.split(\"/\");\n            if (parentPath.length > 1) {\n                parentPath.pop();\n                elements = this.getBestMatchingElements(parentPath.join('/'));\n            }\n        }\n        return elements;\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/dom.js?");

/***/ }),

/***/ "./build/dom/element.js":
/*!******************************!*\
  !*** ./build/dom/element.js ***!
  \******************************/
/*! exports provided: kelement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"kelement\", function() { return kelement; });\nclass kelement {\n    /**\n     *\n     * @param el\n     * @param $scope\n     * @param counter\n     * @param dom\n     */\n    constructor(el, $scope, counter, dom, views) {\n        var _a, _b, _c, _d, _e, _f, _g;\n        this._isListItem = false;\n        this.$el = el;\n        this.$scope = $scope;\n        this.dom = dom;\n        this.setId(this.$el.getAttribute('data-id') || null, counter);\n        this.setTemplate((_a = views) === null || _a === void 0 ? void 0 : _a[this.id]);\n        if (!this.$el.hasAttribute(\"data-view\")) {\n            this.$el.setAttribute(\"data-view\", this.id);\n            if (!((_b = views) === null || _b === void 0 ? void 0 : _b[this.id])) {\n                let stores = (_e = (_d = (_c = this.dom.store) === null || _c === void 0 ? void 0 : _c.dataH) === null || _d === void 0 ? void 0 : _d.store.keys()) === null || _e === void 0 ? void 0 : _e.join(',');\n                console.log('(change, ' + stores + ', _t ) => `' + ((_f = this.$el.innerHTML) === null || _f === void 0 ? void 0 : _f.trim()) + '`');\n                if (this.$el.innerHTML.trim() !== \"\")\n                    this.setTemplate(eval('(change, ' + stores + ', _t) => `' + ((_g = this.$el.innerHTML) === null || _g === void 0 ? void 0 : _g.trim()) + '`'));\n            }\n        }\n    }\n    getValue() {\n        return this.$el.value;\n    }\n    getName() {\n        return this.$el.getAttribute('data-name');\n    }\n    setId(namesp, counter) {\n        let id = namesp || \"element\" + \"-\" + counter;\n        this.$el.setAttribute(\"data-id\", id);\n        this.id = id;\n    }\n    update(changes) {\n        for (let i = 0; i < changes.length; i++) {\n            let change = changes[i];\n            console.log(change.op, change.value);\n            if (typeof this[change.op] !== \"undefined\") {\n                this[change.op](change);\n            }\n        }\n    }\n    setTemplate(template) {\n        this.template = template;\n    }\n    /**\n     * !!caution this is slow and overwrites the hole html of the $element\n     * @param data\n     */\n    render(change) {\n        var _a, _b;\n        if (this.template) {\n            let stores = (_b = (_a = this.dom.store) === null || _a === void 0 ? void 0 : _a.dataH) === null || _b === void 0 ? void 0 : _b.store.toArray();\n            this.$el.innerHTML = this.template.apply(this, [change, ...stores, this.dom._t]);\n        }\n        else {\n            this.$el.innerHTML = change.value;\n        }\n    }\n    replace(change) {\n        this.render(change);\n    }\n    add(change) {\n        this.render(change);\n    }\n    remove(change) {\n        var _a;\n        //if parent exists notify parent and remove el, otherwise tell domHandler to remove el\n        if (this.isListItem()) {\n            (_a = this.getListContainer()) === null || _a === void 0 ? void 0 : _a.remove(change);\n        }\n        else {\n            this.$el.remove();\n        }\n    }\n    isListItem() {\n        return this._isListItem;\n    }\n    setIsListItem(value) {\n        this._isListItem = value;\n    }\n    getListContainer() {\n        return this._listContainer;\n    }\n    setListContainer(value) {\n        this._listContainer = value;\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/dom/element.js?");

/***/ }),

/***/ "./build/dom/element/button.js":
/*!*************************************!*\
  !*** ./build/dom/element/button.js ***!
  \*************************************/
/*! exports provided: button */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"button\", function() { return button; });\n/* harmony import */ var _element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../element.js */ \"./build/dom/element.js\");\n\nclass button extends _element_js__WEBPACK_IMPORTED_MODULE_0__[\"kelement\"] {\n    /**\n       *\n       * @param change\n       */\n    render(change) {\n        this.$el.outerHTML = `<button data-name=\"${change.path}\">${change.value}</button>`;\n        return this.$el.outerHTML;\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/dom/element/button.js?");

/***/ }),

/***/ "./build/dom/element/input.js":
/*!************************************!*\
  !*** ./build/dom/element/input.js ***!
  \************************************/
/*! exports provided: input */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"input\", function() { return input; });\n/* harmony import */ var _element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../element.js */ \"./build/dom/element.js\");\n\nclass input extends _element_js__WEBPACK_IMPORTED_MODULE_0__[\"kelement\"] {\n    replace(change) {\n        this.$el.setAttribute(\"value\", change.value);\n        this.$el.value = change.value;\n    }\n    add(change) {\n        this.$el.setAttribute(\"value\", change.value);\n        this.$el.value = change.value;\n    }\n    /**\n     *\n     * @param change\n     */\n    render(change) {\n        console.log(\"RENDER\", change);\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/dom/element/input.js?");

/***/ }),

/***/ "./build/dom/element/input/checkbox.js":
/*!*********************************************!*\
  !*** ./build/dom/element/input/checkbox.js ***!
  \*********************************************/
/*! exports provided: checkbox */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"checkbox\", function() { return checkbox; });\n/* harmony import */ var _input_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../input.js */ \"./build/dom/element/input.js\");\n\nclass checkbox extends _input_js__WEBPACK_IMPORTED_MODULE_0__[\"input\"] {\n    /**\n   *\n   * @param change\n   */\n    render(change) {\n        this.$el.outerHTML = `<input type=\"checkbox\" data-name=\"${change.path}\" value=\"${change.value}\" />`;\n        return this.$el.outerHTML;\n    }\n    /**\n     *\n     * @param single\n     */\n    getValue(single = false) {\n        if (single)\n            return super.getValue();\n        return this.getFields()\n            .filter((checkbox) => checkbox.checked)\n            .map((checkbox) => checkbox.value);\n    }\n    getFields() {\n        return Array\n            .from(this.$scope.querySelectorAll(':scope input[data-name=\"' + this.getName() + '\"]'));\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/dom/element/input/checkbox.js?");

/***/ }),

/***/ "./build/dom/element/input/file.js":
/*!*****************************************!*\
  !*** ./build/dom/element/input/file.js ***!
  \*****************************************/
/*! exports provided: file */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"file\", function() { return file; });\n/* harmony import */ var _input_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../input.js */ \"./build/dom/element/input.js\");\n\nclass file extends _input_js__WEBPACK_IMPORTED_MODULE_0__[\"input\"] {\n    /**\n   *\n   * @param change\n   */\n    render(change) {\n        this.$el.outerHTML = `<input type=\"file\" data-name=\"${change.path}\" value=\"${change.value}\" />`;\n        return this.$el.outerHTML;\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/dom/element/input/file.js?");

/***/ }),

/***/ "./build/dom/element/input/radio.js":
/*!******************************************!*\
  !*** ./build/dom/element/input/radio.js ***!
  \******************************************/
/*! exports provided: radio */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"radio\", function() { return radio; });\n/* harmony import */ var _input_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../input.js */ \"./build/dom/element/input.js\");\n\nclass radio extends _input_js__WEBPACK_IMPORTED_MODULE_0__[\"input\"] {\n    /**\n   *\n   * @param change\n   */\n    render(change) {\n        this.$el.outerHTML = `<input type=\"radio\" data-name=\"${change.path}\" value=\"${change.value}\" />`;\n        return this.$el.outerHTML;\n    }\n    /**\n     *\n     * @param single\n     */\n    getValue(single = false) {\n        var _a;\n        return (_a = this.$scope.querySelector(':scope input[data-name=\"' + this.getName() + '\"]:checked')) === null || _a === void 0 ? void 0 : _a.value;\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/dom/element/input/radio.js?");

/***/ }),

/***/ "./build/dom/element/input/range.js":
/*!******************************************!*\
  !*** ./build/dom/element/input/range.js ***!
  \******************************************/
/*! exports provided: range */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"range\", function() { return range; });\n/* harmony import */ var _input_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../input.js */ \"./build/dom/element/input.js\");\n\nclass range extends _input_js__WEBPACK_IMPORTED_MODULE_0__[\"input\"] {\n    /**\n   *\n   * @param change\n   */\n    render(change) {\n        this.$el.outerHTML = `<input type=\"range\" data-name=\"${change.path}\" value=\"${change.value}\" />`;\n        return this.$el.outerHTML;\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/dom/element/input/range.js?");

/***/ }),

/***/ "./build/dom/element/input/text.js":
/*!*****************************************!*\
  !*** ./build/dom/element/input/text.js ***!
  \*****************************************/
/*! exports provided: text */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"text\", function() { return text; });\n/* harmony import */ var _input_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../input.js */ \"./build/dom/element/input.js\");\n\nclass text extends _input_js__WEBPACK_IMPORTED_MODULE_0__[\"input\"] {\n    /**\n     *\n     * @param change\n     */\n    render(change) {\n        this.$el.outerHTML = `<input type=\"text\" data-name=\"${change.path}\" value=\"${change.value}\" />`;\n        return this.$el.outerHTML;\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/dom/element/input/text.js?");

/***/ }),

/***/ "./build/dom/element/textarea.js":
/*!***************************************!*\
  !*** ./build/dom/element/textarea.js ***!
  \***************************************/
/*! exports provided: textarea */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"textarea\", function() { return textarea; });\n/* harmony import */ var _element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../element.js */ \"./build/dom/element.js\");\n\nclass textarea extends _element_js__WEBPACK_IMPORTED_MODULE_0__[\"kelement\"] {\n}\n\n\n//# sourceURL=webpack://radbod/./build/dom/element/textarea.js?");

/***/ }),

/***/ "./build/dom/list.js":
/*!***************************!*\
  !*** ./build/dom/list.js ***!
  \***************************/
/*! exports provided: elist */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"elist\", function() { return elist; });\n/* harmony import */ var _element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./element.js */ \"./build/dom/element.js\");\n\nclass elist extends _element_js__WEBPACK_IMPORTED_MODULE_0__[\"kelement\"] {\n    constructor() {\n        super(...arguments);\n        this._listItems = {};\n        this._listItemsByName = {};\n    }\n    isListItem() {\n        return true;\n    }\n    getNativeListItems() {\n        var _a;\n        return (_a = this.$el) === null || _a === void 0 ? void 0 : _a.children;\n    }\n    getListItems(cached = false) {\n        return cached ? this._listItems : this.mapListItems();\n    }\n    mapListItems() {\n        var _a;\n        let mappedItems = {};\n        let items = this.getNativeListItems();\n        for (let e in items) {\n            let id = (_a = items[e]) === null || _a === void 0 ? void 0 : _a.getAttribute(\"data-id\");\n            if (id in this.dom.element) {\n                mappedItems[id] = this.dom.element[id];\n                this._listItems[id] = this.dom.element[id];\n                this._listItemsByName[this.dom.element[id].getName()] = this.dom.element[id];\n            }\n            else {\n                let nelement = this.dom.loadElement(items[e]);\n                if (nelement) {\n                    mappedItems[nelement.id] = nelement;\n                    this._listItems[nelement.id] = nelement;\n                    this._listItemsByName[nelement.getName()] = nelement;\n                }\n            }\n        }\n        return mappedItems;\n    }\n    replace(change) {\n        console.log(\"replace whole list\");\n    }\n    add(change) {\n        var _a, _b, _c;\n        let where = \"afterbegin\";\n        let pointer = (_b = (_a = change.path) === null || _a === void 0 ? void 0 : _a.split(\"/\")) === null || _b === void 0 ? void 0 : _b.pop();\n        if (!isNaN(pointer)) {\n            let items = this.getListItems();\n            let pos = parseInt(pointer);\n            if (pos === 0) { // first added element\n                this.dom.insertElementByElement(this, where, this.renderItem(change));\n            }\n            //appendend to end\n            if (pos > Object.keys(items).length - 1) {\n                where = \"beforeend\";\n                this.dom.insertElementByElement(this, where, this.renderItem(change));\n            }\n            //inserted in between\n            if (pos > 0 && pos < Object.keys(items).length - 1) {\n                let tname = (_c = change.path) === null || _c === void 0 ? void 0 : _c.split(\"/\");\n                tname.pop();\n                tname.push(pos - 1);\n                let name = tname.join(\"/\");\n                where = \"afterend\";\n                if (this._listItemsByName[name]) {\n                    this.dom.insertElementByElement(this._listItemsByName[name], where, this.renderItem(change));\n                }\n                else {\n                    console.log(\"failed to find point to insert list-item\", name);\n                }\n            }\n        }\n        else {\n            console.log(\"failed pointer from path\", change.path);\n        }\n        let addedEl = this.$scope.querySelector(`:scope data-name=\"${change.path}\"`);\n        let resultEL = null;\n        if (addedEl) {\n            resultEL = this.dom.loadElement(addedEl);\n        }\n        return resultEL;\n    }\n    remove(change) {\n        var _a;\n        super.remove(change);\n        let el = (_a = this.dom.getBestMatchingElements(change.path)) === null || _a === void 0 ? void 0 : _a.pop();\n        if (el)\n            this.dom.removeElement(el);\n    }\n    /**\n    * !!caution this is slow and overwrites the hole html of the $element\n    * @param data\n    */\n    render(change) {\n        this.$el.innerHTML = change.value.map((e) => this.renderItem(change)).join(\"\\r\\n\");\n    }\n    /**\n     *\n     * @param value\n     */\n    renderItem(change) {\n        var _a, _b, _c, _d, _e, _f;\n        let pointer = (_b = (_a = change.path) === null || _a === void 0 ? void 0 : _a.split(\"/\")) === null || _b === void 0 ? void 0 : _b.pop();\n        change.index = pointer;\n        if (this.template) {\n            let params = [change];\n            for (let e in (_d = (_c = this.dom.store) === null || _c === void 0 ? void 0 : _c.dataH) === null || _d === void 0 ? void 0 : _d.store) {\n                params.push((_f = (_e = this.dom.store) === null || _e === void 0 ? void 0 : _e.dataH) === null || _f === void 0 ? void 0 : _f.store[e].data);\n            }\n            params.push(this.dom._t);\n            return this.template.apply(this, params);\n        }\n        else {\n            return `<div data-type=\"list-item\" data-index=\"${pointer}\" data-name=\"${change.path}\">${change.value}</div>`;\n        }\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/dom/list.js?");

/***/ }),

/***/ "./build/dom/list/select.js":
/*!**********************************!*\
  !*** ./build/dom/list/select.js ***!
  \**********************************/
/*! exports provided: select */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"select\", function() { return select; });\n/* harmony import */ var _list_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../list.js */ \"./build/dom/list.js\");\n\nclass select extends _list_js__WEBPACK_IMPORTED_MODULE_0__[\"elist\"] {\n    /**\n     *\n     * @param value\n     */\n    renderItem(value) {\n        var _a, _b;\n        return `<option data-type=\"list-item\" data-index=\"${value.index}\" data-name=\"${value.path}\">${(_b = (_a = value) === null || _a === void 0 ? void 0 : _a.html) === null || _b === void 0 ? void 0 : _b.trim()}</option>`;\n    }\n    /**\n     *\n     * @param change\n     */\n    render(change) {\n        // this.$el.outerHTML = `<select data-type=\"list\" data-name=\"${change.path}\">${change.value.map(this.renderItem).join('')}</select>`;\n        //return this.$el.outerHTML;\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/dom/list/select.js?");

/***/ }),

/***/ "./build/eventHandler.js":
/*!*******************************!*\
  !*** ./build/eventHandler.js ***!
  \*******************************/
/*! exports provided: cyrb53, eventHandler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cyrb53\", function() { return cyrb53; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"eventHandler\", function() { return eventHandler; });\n/**\n *\n * @param str\n * @param seed\n */\nconst cyrb53 = function (str, seed = 0) {\n    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;\n    for (let i = 0, ch; i < str.length; i++) {\n        ch = str.charCodeAt(i);\n        h1 = Math.imul(h1 ^ ch, 2654435761);\n        h2 = Math.imul(h2 ^ ch, 1597334677);\n    }\n    h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);\n    h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);\n    return 4294967296 * (2097151 & h2) + (h1 >>> 0);\n};\n;\nclass eventHandler {\n    constructor() {\n        this.event = {};\n        this.eventById = {};\n    }\n    construct() {\n    }\n    /**\n     *\n     * @param cb\n     */\n    addFunction(cb, meta, context) {\n        let id = cyrb53(cb.toString());\n        /*\n        this.eventById[id] = ((meta, eventHdlr) => (args:object = {}, returnValue = null) =>{\n            return cb(args, returnValue, meta);\n        })(meta, this);\n*/\n        this.eventById[id] = cb.bind(context || this);\n        return id;\n    }\n    getFunction(id) {\n        return this.eventById[id];\n    }\n    removeEvent(callbackId) {\n        delete this.eventById[callbackId];\n        //todo: cleanup named object\n    }\n    /**\n     *\n     * @param component\n     * @param id\n     * @param name\n     * @param cb\n     */\n    addEvent(component, id, name, cb, context) {\n        if (typeof cb !== \"function\")\n            return;\n        let callbackId = this.addFunction(cb, { component, id, name }, context);\n        if (typeof this.event[component] === \"undefined\") {\n            this.event[component] = {};\n        }\n        if (typeof this.event[component][id] === \"undefined\") {\n            this.event[component][id] = {};\n        }\n        if (typeof this.event[component][id][name] === \"undefined\") {\n            this.event[component][id][name] = [];\n        }\n        if (this.event[component][id][name].indexOf(callbackId) === -1)\n            this.event[component][id][name].push(callbackId);\n        return callbackId;\n    }\n    dispatchEvent(component, id, name, args = null, returnValue = null, context) {\n        var _a, _b;\n        if ((_b = (_a = this.event[component]) === null || _a === void 0 ? void 0 : _a[id]) === null || _b === void 0 ? void 0 : _b[name]) {\n            let ret =  false || returnValue;\n            let special = name.indexOf(\"pre_\") > -1 || name.indexOf(\"post_\") > -1;\n            if (!special)\n                ret = this.dispatchEvent(component, id, \"pre_\" + name, args, ret);\n            for (let i in this.event[component][id][name]) {\n                let callbackID = this.event[component][id][name][i];\n                let mep = this.getFunction(callbackID)(args, ret);\n                if (typeof mep !== \"undefined\") {\n                    ret = mep;\n                }\n                if (false === ret) {\n                    break;\n                }\n            }\n            if (!special)\n                ret = this.dispatchEvent(component, id, \"post_\" + name, args, ret);\n            return ret;\n        }\n        else {\n            console.log(\"no listener for \", component, id, name);\n            return returnValue;\n        }\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/eventHandler.js?");

/***/ }),

/***/ "./build/i18n.js":
/*!***********************!*\
  !*** ./build/i18n.js ***!
  \***********************/
/*! exports provided: i18n */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"i18n\", function() { return i18n; });\n/* harmony import */ var _merge_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./merge.js */ \"./build/merge.js\");\n\nclass i18n {\n    constructor() {\n        this.translation = { en_EN: {} };\n    }\n    /**\n     *\n     * @param {*} translationData\n     */\n    addTranslation(translationData) {\n        this.translation = Object(_merge_js__WEBPACK_IMPORTED_MODULE_0__[\"mergeDeep\"])(this.translation, translationData);\n    }\n    _t(text, language = \"en_EN\") {\n        if (this && typeof this.translation[language] !== \"undefined\" && typeof this.translation[language][text] !== \"undefined\") {\n            return this.translation[language][text];\n        }\n        return text;\n    }\n    setLanguage() {\n    }\n    getLanguage() {\n    }\n    getLanguages() {\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/i18n.js?");

/***/ }),

/***/ "./build/merge.js":
/*!************************!*\
  !*** ./build/merge.js ***!
  \************************/
/*! exports provided: mergeDeep */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"mergeDeep\", function() { return mergeDeep; });\n/**\n * Performs a deep merge of `source` into `target`.\n * Mutates `target` only but not its objects and arrays.\n *\n * @author inspired by [jhildenbiddle](https://stackoverflow.com/a/48218209).\n */\nfunction mergeDeep(target, source) {\n    const isObject = (obj) => obj && typeof obj === 'object';\n    if (!isObject(target) || !isObject(source)) {\n        return source;\n    }\n    Object.keys(source).forEach(key => {\n        const targetValue = target[key];\n        const sourceValue = source[key];\n        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {\n            target[key] = targetValue.concat(sourceValue);\n        }\n        else if (isObject(targetValue) && isObject(sourceValue)) {\n            target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);\n        }\n        else {\n            target[key] = sourceValue;\n        }\n    });\n    return target;\n}\n\n\n//# sourceURL=webpack://radbod/./build/merge.js?");

/***/ }),

/***/ "./build/store.js":
/*!************************!*\
  !*** ./build/store.js ***!
  \************************/
/*! exports provided: dataHandler, store */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"store\", function() { return store; });\n/* harmony import */ var _dataHandler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dataHandler.js */ \"./build/dataHandler.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"dataHandler\", function() { return _dataHandler_js__WEBPACK_IMPORTED_MODULE_0__[\"dataHandler\"]; });\n\n\nclass store {\n    constructor(eventH, dataH, component, data) {\n        this._data = {};\n        this.patchQueue = [];\n        this.events = eventH;\n        this.dataH = dataH;\n        this.component = component;\n        this.name = component;\n        this.createStore(component, data);\n    }\n    unmaskComponentName(component) {\n        return component.charAt(0) === \"$\" ? component.substr(1) : component;\n    }\n    createStore(component, data) {\n        let createProxy = (data, parentPath = `/$${component}`) => {\n            const handler = {\n                get: (oTarget, key) => {\n                    var _a, _b, _c;\n                    if (typeof oTarget[key] === 'object' && oTarget[key] !== null || typeof oTarget[key] === 'function') {\n                        let px = parentPath + \"/\" + key;\n                        if (key.charAt(0) === \"$\") { //reference\n                            px = key;\n                        }\n                        this.dataH.pxy[px] = ((_a = this.dataH) === null || _a === void 0 ? void 0 : _a.pxy[px]) || createProxy(oTarget[key], px);\n                        return (_c = (_b = this.dataH) === null || _b === void 0 ? void 0 : _b.pxy) === null || _c === void 0 ? void 0 : _c[px];\n                    }\n                    else {\n                        return oTarget[key];\n                    }\n                    /**\n                     * @todo get value and use this.pxy[px] for $ connected values\n                     */\n                },\n                set: (oTarget, sKey, vValue) => {\n                    let op = typeof oTarget[sKey] === \"undefined\" ? \"add\" : \"replace\";\n                    let diff = { op, path: parentPath + \"/\" + sKey, value: vValue };\n                    /**\n                     * @todo set value and use this.pxy[px] for $ connected values\n                     */\n                    if (oTarget[sKey] !== vValue) {\n                        let tmpChain = this.changeStore(component, diff);\n                    }\n                    oTarget[sKey] = vValue;\n                    return true;\n                },\n                deleteProperty: (oTarget, sKey) => {\n                    console.log(\"delete\", oTarget[sKey]);\n                    delete oTarget[sKey];\n                    this.changeStore(component, { op: \"remove\", path: parentPath + \"/\" + sKey });\n                    return true;\n                },\n                defineProperty: (oTarget, sKey, oDesc) => {\n                    if (oDesc && \"value\" in oDesc) {\n                        oTarget[sKey] = oDesc.value;\n                    }\n                    return oTarget;\n                }\n            };\n            return new Proxy(data, handler);\n        };\n        if (typeof data !== \"object\") {\n            console.log(\"store data is not an object\", typeof data, data);\n            data = {};\n        }\n        this.dataH.pxy[`$${component}`] = this._data = createProxy(data); //fjp.default.deepClone(data);\n        return this;\n    }\n    /**\n     * collect all changes then bubble event after ...what is important?\n     * @param component\n     * @param changes\n     */\n    changeStore(component, change) {\n        var _a, _b, _c;\n        let ret = null;\n        this.patchQueue.push(change);\n        let retChange = (_a = this.events) === null || _a === void 0 ? void 0 : _a.dispatchEvent(component, \"/\", \"change\", [change], this.data);\n        //console.log(component, \"/\", \"change\", change);\n        try {\n            ret = (_b = this.events) === null || _b === void 0 ? void 0 : _b.dispatchEvent(component, change.path, \"change\", [change], this.data);\n            ret = (_c = this.events) === null || _c === void 0 ? void 0 : _c.dispatchEvent(component, change.path, change.op, [change], this.data, ret);\n        }\n        catch (e) {\n            ret = retChange;\n        }\n        return ret;\n    }\n    get data() {\n        return this._data;\n    }\n    db() {\n        return this._storage;\n    }\n    setDb(db) {\n        return this._storage = db;\n    }\n    load(selector, cb) {\n        if (this.db()) {\n            return new Promise((resolve, reject) => this.db().find(selector, (data) => {\n                if (typeof data === \"object\")\n                    this.createStore(this.name, data);\n                cb.call(this.dataH, data);\n                resolve(data);\n            }));\n        }\n    }\n}\n\n\n//# sourceURL=webpack://radbod/./build/store.js?");

/***/ })

/******/ });