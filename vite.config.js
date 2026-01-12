import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { skillEditorPlugin } from './plugins/skillEditorPlugin.js'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        skillEditorPlugin()  // 技能编辑器 API 插件
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
