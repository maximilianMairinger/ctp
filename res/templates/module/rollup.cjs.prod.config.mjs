import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'


export default {
  input: './app/src/$[ name ].ts',
  output: {
    file: 'app/dist/cjs/$[ name ].js',
    format: 'cjs',
    sourcemap: true,
    inlineDynamicImports: true
  },
  plugins: [
    typescript({tsconfig: "./tsconfig.forRollupCjs.json", noEmitOnError: false, sourceMap: true}), 
    resolve({modulesOnly: true, preferBuiltins: true}),
    commonJS({
      include: 'node_modules/**'
    }),
    json()
  ]
};
