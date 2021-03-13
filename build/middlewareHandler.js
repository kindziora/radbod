var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Middleware {
    constructor(obj) {
        this.value = {};
        let extras = [];
        const stack = [];
        const run = (...args) => __awaiter(this, void 0, void 0, function* () {
            let done = args[args.length - 1];
            if (typeof done === 'function') {
                args.pop();
                if (obj)
                    done = done.bind(obj);
            }
            else
                done = null;
            try {
                for (let func of stack) {
                    if (obj)
                        func = func.bind(obj);
                    extras = yield new Promise((resolve, reject) => {
                        func(...args.concat(extras), (err, ...extras) => {
                            if (err)
                                return reject(err);
                            resolve(extras);
                        });
                    });
                }
                args = args.concat(extras);
                if (done)
                    done(...args);
                return args;
            }
            catch (err) {
                throw err;
            }
        });
        Object.defineProperty(this, "run", { value: run });
        Object.defineProperty(this, 'use', { value: fn => stack.push(fn) });
    }
}
export class middlewareHandler {
    constructor() {
        this.middleware = {
            preView: Middleware,
            preData: Middleware,
            preRouting: Middleware
        };
    }
    construct(environment) {
        this.environment = environment;
    }
    addMiddleware(type) {
        this.middleware[type] = new Middleware(this.environment);
        return this.middleware[type];
    }
    removeMiddleware(type) {
        delete this.middleware[type];
    }
    getMiddleware(type) {
        return this.middleware[type];
    }
    getValue(type) {
        this.middleware[type].value;
    }
    setValue(type, value) {
        this.middleware[type].value = value;
    }
    run(type, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setValue(type, yield this.middleware[type].run.apply(this.environment, args));
                return this.getValue(type);
            }
            catch (err) {
                console.log('err', err.toString());
            }
        });
    }
}
