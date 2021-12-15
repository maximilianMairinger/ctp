import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json'


export default [
  {
    input: "app/src/$[name].ts",
    output: {
      dir: 'app/dist/esm',
      format: 'esm'
    },
    plugins: [
      typescript({ tsconfig: "./tsconfig.prod.json", declaration: true, noEmitOnError: true, outDir: "app/dist/esm", include: "./app/src/**" }), 
      json()
    ]
  },
  {
    input: "app/src/$[name].ts",
    output: {
      dir: 'app/dist/cjs',
      format: 'cjs',
      sourcemap: true,
      exports: "named"
    },
    plugins: [
      typescript({ tsconfig: "./tsconfig.prod.json", declaration: false, noEmitOnError: true, sourceMap: true }), 
      json()
    ]
  }
];
