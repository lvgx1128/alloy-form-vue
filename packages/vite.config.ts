import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import DefineOptions from 'unplugin-vue-define-options/vite'
import dts from 'vite-plugin-dts'
export default defineConfig({
  build: {
    //压缩
    minify: false,
    rollupOptions: {
      //忽略不需要打包的文件
      external: ['vue', 'lodash-es'],
      input: ['index.ts'],
      output: [
        {
          //打包格式
          format: 'es',
          //打包后文件名
          entryFileNames: '[name].mjs',
          //让打包目录和我们目录对应
          preserveModules: true,
          preserveModulesRoot: 'src',
          exports: 'named',
          //配置打包根目录
          dir: '../alloy-form/es'
        },
        {
          //打包格式
          format: 'cjs',
          //打包后文件名
          entryFileNames: '[name].js',
          //让打包目录和我们目录对应
          preserveModules: true,
          preserveModulesRoot: 'src',
          exports: 'named',
          //配置打包根目录
          dir: '../alloy-form/lib'
        }
      ]
    },
    lib: {
      entry: './index.ts',
      name: 'alloy-form'
    }
  },
  plugins: [
    vue(),
    DefineOptions(),
    dts({
      outDir: ['../alloy-form/es', '../alloy-form/lib'],
      insertTypesEntry: true,
      rollupTypes: true,
      tsconfigPath: '../tsconfig.app.json'
    })
  ]
})
