import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
//@ts-ignore
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig(async () => {
  return {
    plugins: [
      react({
        //exclude stories
        exclude: [/\.stories\.(t|j)sx?$/],
      }),
      checker({
        typescript: true
      }),
      tsconfigPaths(),
      svgr()
    ],
    optimizeDeps: {
      include: ['prismjs'],
    },
    build: {
      commonjsOptions: {
        include: [
          /node_modules/,
        ]
      }
    }
  }
})
