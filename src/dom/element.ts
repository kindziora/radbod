export class kelement {

        public id: string;
        public $el: HTMLElement;
        public $scope: HTMLElement;

        constructor(el: HTMLElement, $scope: HTMLElement, counter:number = 1) {
            this.$el = el;
            this.$scope = $scope;
            this.setId(this.$scope.getAttribute('data-id') || undefined, counter);
        }

        public getValue() {
            return this.$el.value;
        }    

        public getName(){
            return this.$el.getAttribute('data-name');
        }

        setId(namesp: string = "", counter:number) {
            let id: string = namesp+ "-" + counter;
            this.$el.setAttribute("data-id", id);
            this.id = id;
        }

    }