export class kelement {

        public id: string;
        public $el: HTMLElement;
        public $scope: HTMLElement;

        construct(el: HTMLElement, $scope: HTMLElement, counter:number = 1) {
            console.log("el",el,"scope", $scope,"counter", counter);

           /* this.$el = el;
            this.$scope = $scope;
            this.setId(this.$scope.getAttribute('data-id') || undefined, counter);*/
        }

        public getValue() {

        }

        public getName(){
            return "inputtest";//this.$el.getAttribute('data-name');
        }

        private setId(namesp: string = "", counter:number) {
            let id: string = namesp + counter;
            this.$el.setAttribute("data-id", id);
            this.id = id;
        }

    }