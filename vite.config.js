import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { skillEditorPlugin } from './plugins/skillEditorPlugin.js'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/ArkLines/',  // GitHub Pages 部署路径
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
