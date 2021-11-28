import { expect } from "chai";
import { makeAutoObservable, reaction } from "mobx";
import { prepareStoreFactory } from "mobx-union-store";
import sinon from "sinon";
import { describe, it } from "../helpers";

const getStore = () =>
  prepareStoreFactory({
    value: 0,
    get double() {
      return 2 * this.value;
    },
  })({
    inc() {
      this.value += 1;
    },
  })({});

export = () => {
  describe("Store builder", () => {
    it("works correctly for simple types", () => {
      const store = getStore();

      store.inc();
      expect(store.value).to.be.equal(1);
      expect(store.double).to.be.equal(2);
      store.inc();
      expect(store.value).to.be.equal(2);
      expect(store.double).to.be.equal(4);
    });

    it("produces store which is converted to auto observable", () => {
      const store = getStore();

      makeAutoObservable(store);
      const react = sinon.stub();
      reaction(() => store.double, react);
      store.inc();
      store.inc();
      expect(react.args.map((call) => [call[0], call[1]])).to.be.deep.equal([
        [2, 0],
        [4, 2],
      ]);
    });
  });
};
