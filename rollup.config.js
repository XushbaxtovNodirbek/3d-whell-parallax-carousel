import resolve from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const external = ['react', 'react-dom', 'vue'];

const basePlugins = [
  peerDepsExternal(),
  resolve(),
];

export default [
  // Vanilla JS / core
  {
    input: 'src/index.js',
    external,
    plugins: basePlugins,
    output: [
      { file: 'dist/index.js',  format: 'es' },
      { file: 'dist/index.cjs', format: 'cjs' },
    ],
  },
  // React wrapper
  {
    input: 'src/react.jsx',
    external,
    plugins: basePlugins,
    output: [
      { file: 'dist/react.js',  format: 'es' },
      { file: 'dist/react.cjs', format: 'cjs' },
    ],
  },
  // Vue wrapper
  {
    input: 'src/vue.js',
    external,
    plugins: basePlugins,
    output: [
      { file: 'dist/vue.js',  format: 'es' },
      { file: 'dist/vue.cjs', format: 'cjs' },
    ],
  },
];
