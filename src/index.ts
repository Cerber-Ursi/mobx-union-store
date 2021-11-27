import { makeAutoObservable } from "mobx";

type Enum<T extends object> = {
    [K in keyof T]: T[K] extends void
        ? { readonly discriminant: K }
        : { readonly discriminant: K; readonly data: T[K] };
}[keyof T];

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

export function makeStoreFactory<Values extends {}, Actions extends {}>(def: Values, actions: Actions) {
    return function(values: Partial<Values>): Values & Actions {
        const obj = Object.create(actions);
        objectAssign(obj, def);
        objectAssign(obj, values);
        return obj;
    }
}