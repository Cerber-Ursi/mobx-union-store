import { makeAutoObservable, reaction, runInAction } from "mobx";
import { prepareStoreFactory } from "..";

describe("Store builder", () => {
    it("Is built correctly for simple types", () => {
        const store = prepareStoreFactory({
            value: 0,
            get double() {
                return 2 * this.value;
            },
        })({
            inc() {
                this.value += 1;
            },
        })({});

        store.inc();
        expect(store.value).toBe(1);
        expect(store.double).toBe(2);
        store.inc();
        expect(store.value).toBe(2);
        expect(store.double).toBe(4);

        makeAutoObservable(store);
        const react = jest.fn();
        reaction(() => store.double, react);
        store.inc();
        expect(react.mock.calls.map((call) => [call[0], call[1]])).toEqual([
            [6, 4],
        ]);
    });
});
