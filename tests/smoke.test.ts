import { makeStore } from "../src";

interface Store {
    value: number;
    readonly double: number;
    inc(this: Store): void;
}

describe("Store builder", () => {
    it("Is built correctly for simple types", () => {
        const store = makeStore<Store>()
            .observables({ value: 0 })
            .computeds({
                double() {
                    return this.value * 2;
                },
            })
            .actions({
                inc() {
                    this.value += 1;
                }
            })
            .build();
        store.inc();
        expect(store.value).toBe(1);
        expect(store.double).toBe(2);
        store.inc();
        expect(store.value).toBe(2);
        expect(store.double).toBe(4);
    });
});
