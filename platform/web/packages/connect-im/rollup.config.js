import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import image from '@rollup/plugin-image'
import json from 'rollup-plugin-json'
import svgr from '@svgr/rollup'
import postcss from 'rollup-plugin-postcss'
// import analyze from "rollup-plugin-analyzer";

import packageJson from './package.json' assert { type: 'json' }

const getGlobal = (localPackageJson) => {
  const externalsDependencies = Object.keys(
    localPackageJson.dependencies || {}
  ).concat(Object.keys(localPackageJson.peerDependencies || {}))
  const globals = {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
  return {
    external: [...externalsDependencies, 'tslib'],
    output: [
      {
        dir: '../komune-im/dist',
        globals: globals,
        format: 'cjs',
        sourcemap: true,
        entryFileNames: '[name].cjs'
      },
      {
        dir: '../komune-im/dist',
        globals: globals,
        format: 'es',
        sourcemap: true,
        entryFileNames: '[name].es.js'
      }
    ],
    plugins: [
      resolve({
        browser: true,
        extensions: ['.mjs', '.js', '.jsx', '.json', '.node', '.tsx', '.ts']
      }),
      commonjs({
        include: /\/node_modules\//
      }),
      typescript({ clean: true }),
      image(),
      json(),
      svgr(),
      postcss()
      // analyze(),
    ]
  }
}

export default {
  input: 'src/index.ts',
  ...getGlobal(packageJson)
}
