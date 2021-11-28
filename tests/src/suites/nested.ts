import { expect } from "chai";
import { makeAutoObservable } from "mobx";
import { prepareStoreFactory } from "mobx-union-store";
import { describe, it } from "../helpers";

export = () => {
  describe("Nested store", () => {
    it("is created correctly", () => {
      const inner = prepareStoreFactory({ value: 0 })({
        inc() {
          this.value += 1;
        },
        reset() {
          this.value = 0;
        },
      })({});
      makeAutoObservable(inner);

      const outer = prepareStoreFactory({
        inner,
        get double() {
          return this.inner.value * 2;
        },
      })({
        setOne() {
          this.inner.reset();
          this.inner.inc();
        },
      })({});
      makeAutoObservable(outer);

      expect(outer.inner.value).to.be.equal(0);
      outer.setOne();
      expect(outer.double).to.be.equal(2);
      outer.inner.inc();
      expect(outer.double).to.be.equal(4);
    });
  });
};
