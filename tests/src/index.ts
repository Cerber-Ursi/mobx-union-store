import { run } from "./helpers";

require("fs")
  .readdirSync(require("path").join(__dirname, "suites"))
  .forEach(function (file: string) {
    require("./suites/" + file)();
  });

run();
