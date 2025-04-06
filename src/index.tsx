/* @refresh reload */
import { render } from "solid-js/web"
import { Routes } from "@generouted/solid-router"
import { prepareZXingModule } from "zxing-wasm/reader";
import "@lowlighter/matcha/dist/matcha.css";
import "@lowlighter/matcha/dist/matcha.utilities.css";

prepareZXingModule({
  overrides: {
    locateFile: (path: string, prefix: string) => {
      if (path.endsWith(".wasm")) {
        return `/wasm/${path}`;
      }
      return prefix + path;
    },
  },
  fireImmediately: true,
});

render(() => <Routes />, document.getElementById("root")!)