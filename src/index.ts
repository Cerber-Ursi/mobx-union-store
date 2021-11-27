import { makeAutoObservable } from "mobx";

type Enum<T extends Object> = {
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

class StoreBuilder<
    Target extends object,
    Observables extends object = {},
    Computeds extends object = {},
    Actions extends object = {}
> {
    observables<K extends keyof Target>(
        fields: { [Key in K]: Target[Key] }
    ): StoreBuilder<
        Target,
        Observables & { [Key in K]: Target[Key] },
        Computeds,
        Actions
    > {
        objectAssign(this._observables, fields);
        return this as any;
    }

    // Здесь геттеры передаются как методы, чтобы мы могли в них использовать this
    computeds<K extends keyof Target>(
        getters: { [Key in K]: (this: Target) => Target[Key] }
    ): StoreBuilder<
        Target,
        Observables,
        Computeds & { [Key in K]: Target[Key] },
        Actions
    > {
        for (let key of Object.getOwnPropertyNames(getters)) {
            Object.defineProperty(this._computeds, key, {
                configurable: true,
                get: getters[key as K],
            });
        }
        return this as any;
    }

    actions<K extends keyof Target>(
        methods: { [Key in K]: Target[Key] }
    ): StoreBuilder<
        Target,
        Observables,
        Computeds,
        Actions & { [Key in K]: Target[Key] }
    > {
        objectAssign(this._actions, methods);
        return this as any;
    }

    private _observables: Observables = {} as Observables;
    private _computeds: Computeds = {} as Computeds;
    private _actions: Actions = {} as Actions;

    readonly build: Observables & Computeds & Actions extends Target
        ? () => Target
        : never = (() => {
        const store = Object.create(this._actions);
        objectAssign(store, this._observables);
        objectAssign(store, this._computeds);
        makeAutoObservable(store);
        return store;
    }) as any;
}

export function makeStore<Target extends object>() {
    return new StoreBuilder<Target>();
}
