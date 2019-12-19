class dom {
    private _area : HTMLElement;
    private _identifier: string = '[data-name]';
    private _elements: NodeListOf<Element>;

    construct(area: HTMLElement){
        this._area = area as HTMLElement;   
        this.loadElements();
    }

    loadElements(){
        this._elements = this._area.querySelectorAll(this._identifier) as NodeListOf<Element>;
    }

    

}