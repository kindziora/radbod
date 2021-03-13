export class Middleware {

    private value: any = {};

    constructor(obj?: any) {

        let extras = []
        const stack = []
        const run = async (...args) => {
            let done = args[args.length - 1]
            if (typeof done === 'function') {
                args.pop()
                if (obj)
                    done = done.bind(obj)
            } else
                done = null
            try {
                for (let func of stack) {
                    if (obj)
                        func = func.bind(obj)
                    extras = await new Promise((resolve, reject) => {
                        func(...args.concat(extras), (err, ...extras) => {
                            if (err)
                                return reject(err)
                            resolve(extras)
                        })
                    })
                }
                args = args.concat(extras)
                if (done)
                    done(...args)
                return args
            } catch (err) { throw err }
        }
        Object.defineProperty(this, "run", { value: run })
        Object.defineProperty(this, 'use', { value: fn => stack.push(fn) })
    }


}




export class middlewareHandler {
    private environment: Object;

    construct(environment: Object) {
        this.environment = environment;
    }

    private middleware: { [index: string]: Object } = {
        preView: Middleware,
        preData: Middleware,
        preRouting: Middleware
    };

    addMiddleware(type: string): Middleware {
        this.middleware[type] = new Middleware(this.environment);
        return this.middleware[type];
    }

    removeMiddleware(type: string) {
        delete this.middleware[type];
    }

    getMiddleware(type: string): Middleware {
        return this.middleware[type];
    }

    getValue (type: string){
        this.middleware[type].value
    }

    setValue(type: string, value:any) {
        this.middleware[type].value = value;
    }
    async run(type: string, args: any) {
        try {
            this.setValue(type, await this.middleware[type].run.apply(this.environment, args);
            return this.getValue(type);
        } catch (err) {
            console.log('err', err.toString())
        }
    }

}