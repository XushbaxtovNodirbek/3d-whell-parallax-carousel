import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import babel from "@rollup/plugin-babel";

const external = ["react", "react-dom", "vue"];

const basePlugins = [peerDepsExternal(), resolve()];

const babelPlugin = babel({
  babelHelpers: "bundled",
  presets: [["@babel/preset-react", { runtime: "classic" }]],
  extensions: [".js", ".jsx"],
});

export default [
  // Vanilla JS / core
  {
    input: "src/index.js",
    external,
    plugins: basePlugins,
    output: [
      { file: "dist/index.js", format: "es", sourcemap: true },
      { file: "dist/index.cjs", format: "cjs", sourcemap: true },
    ],
  },
  // React wrapper (babel for JSX)
  {
    input: "src/react.jsx",
    external,
    plugins: [...basePlugins, babelPlugin],
    output: [
      { file: "dist/react.js", format: "es", sourcemap: true, exports: "named" },
      { file: "dist/react.cjs", format: "cjs", sourcemap: true, exports: "named" },
    ],
  },
  // Vue wrapper
  {
    input: "src/vue.js",
    external,
    plugins: basePlugins,
    output: [
      { file: "dist/vue.js", format: "es", sourcemap: true, exports: "named" },
      { file: "dist/vue.cjs", format: "cjs", sourcemap: true, exports: "named" },
    ],
  },
];
