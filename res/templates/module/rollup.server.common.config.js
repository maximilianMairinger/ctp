import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'


export default {
  input: 'test/src/test.ts',
  output: {
    file: 'test/dist/josmSimpleWebSocket.js',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    typescript({tsconfig: "./tsconfig.dev.json", noEmitOnError: false, sourcemap: true}), 
    resolve({modulesOnly: true, preferBuiltins: true}),
    commonJS({
      include: 'node_modules/**'
    }),
    json()
  ]
};
