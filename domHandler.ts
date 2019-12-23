namespace dom {

    class domHandler {
        private _area: HTMLElement;
        private _identifier: string = '[data-name]';
        public element: NodeListOf<Element>;

        construct(area: HTMLElement) {
            this._area = area as HTMLElement;
            this.loadElements();
        }

        loadElements() {

            this.element = this._area.querySelectorAll(this._identifier) as NodeListOf<Element>;
            let $el: Element;
            for (this.element as $el) {
                $el = new dom[$el.tagName.toLowerCase()]($el); //decorate and extend dom element
            }

        }


    }
}