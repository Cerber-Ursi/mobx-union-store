import { makeAutoObservable } from "mobx";

type Enum<T extends object> = {
    [K in keyof T]: T[K] extends void
        ? { readonly discriminant: K }
        : { readonly discriminant: K; readonly data: T[K] };
}[keyof T];

type Acts<Values> = Record<string, (this: Values, ...args: any[]) => any>;

function objectAssign(to: object, from: object | null) {
    if (from !== null) {
        for (let key of Object.getOwnPropertyNames(from)) {
            const prop = Object.getOwnPropertyDescriptor(from, key);
            if (prop !== undefined) {
                Object.defineProperty(to, key, prop);
            }
        }
    }
}

export function prepareStoreFactory<Values extends {}>(defaults: Values) {
    return function hydrate<Actions extends Acts<Values>>(actions: Actions) {
        return function make(values: Partial<Values>): Values & Actions {
            // Workaround for https://github.com/mobxjs/mobx/issues/3197
            actions.constructor = () => {};

            const obj = Object.create(actions);
            objectAssign(obj, defaults);
            objectAssign(obj, values);
            return obj;
        }
    }
}
