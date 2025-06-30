// 为了将引入的 npm 包，也打包进最终结果中
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import json from '@rollup/plugin-json'

export default {
  input: './src/index.cjs',
  output: [
    {
      file: 'dist/main.cjs.js',
      format: 'cjs'
    }
  ],
  external: ['fs', 'path', 'http', 'https', 'os', 'url' /* ... 其他内置模块 ... */],
  plugins: [
    json(),
    commonjs(),
    resolve({
      preferBuiltins: true
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime'
    }),
    terser()
  ]
}
