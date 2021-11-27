import { makeAutoObservable } from "mobx";

type Enum<T extends Object> = {
    [K in keyof T]: T[K] extends void
        ? { readonly discriminant: K }
        : { readonly discriminant: K; readonly data: T[K] };
}[keyof T];

function objectAssign(to: object, from: object) {
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
    Observables extends {},
    Computeds extends {},
    Actions extends {}
> {
    protected constructor(
        protected observables: Observables,
        protected computeds: Computeds,
        protected actions: Actions
    ) {}

    build(): Observables & Computeds & Actions {
        const store = Object.create(this.actions);
        objectAssign(store, this.observables);
        objectAssign(store, this.computeds);
        makeAutoObservable(store);
        return store;
    }
}
