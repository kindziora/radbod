import {dom} from "dom/element";

export class domHandler {
    private _area: HTMLElement = {} as HTMLElement;
    private _identifier: string = '[data-name]';

    public element:{[index:string]:dom.kelement} = {};
    public elementByName: {[index:string]:Array<dom.kelement>} = {};
    
    public counter: number = 0;
    public id: string = "component-0";

    construct(area: HTMLElement) {
        this._area = area as HTMLElement;
        this.counter++;
        this.setId();
        this.loadElements();
    }

    private setId() {
        let id: string = "component-" + this.counter;
        this._area.setAttribute("data-id", id);
        this.id = id;
    }

    loadElements() {

        let element: NodeListOf<Element> = this._area.querySelectorAll(this._identifier) as NodeListOf<Element>;

        element.forEach(($el: Element, currentIndex: number) => {
            let t_el: dom.kelement = new dom[$el.tagName.toLowerCase()]($el, this._area, currentIndex); //decorate and extend dom element

            this.addElement(t_el);
            this.addElementByName(t_el);
        }
        );

    }

    addElement(el: dom.kelement) {
        this.element[<string>el.id] = el;
    }

    addElementByName(el: dom.kelement) {
        if (typeof this.elementByName[<string>el.getName()] === "undefined") {
            this.elementByName[<string>el.getName()] = [];
        }
        this.elementByName[<string>el.getName()].push(el);
    }

}