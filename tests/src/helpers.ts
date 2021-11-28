
import { Suite, Test } from "mocha";
import Mocha = require("mocha");

const mocha = new Mocha();
mocha.suite = new Suite("");
let currentSuite = mocha.suite;

export function describe(name: string, fn: () => void) {
    currentSuite = Suite.create(currentSuite, name);
    fn();
    currentSuite = currentSuite.parent || mocha.suite;
}

export function it(name: string, fn: () => void) {
    currentSuite.addTest(new Test(name, fn));
}

export function run() {
    mocha.run();
}