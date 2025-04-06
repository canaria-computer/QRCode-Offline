/* @refresh reload */
import { render } from "solid-js/web"
import "simpledotcss/simple.min.css"
import { Routes } from "@generouted/solid-router"
import { prepareZXingModule } from "zxing-wasm/reader";

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