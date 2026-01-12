import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Vite 插件：技能编辑器 API
 * 提供 /api/save-skills 端点用于直接保存技能数据到文件
 */
export function skillEditorPlugin() {
    return {
        name: 'skill-editor-api',
        configureServer(server) {
            // POST /api/save-skills - 保存技能数据到文件
            server.middlewares.use('/api/save-skills', async (req, res, next) => {
                if (req.method !== 'POST') {
                    return next();
                }

                let body = '';
                req.on('data', chunk => body += chunk);
                req.on('end', () => {
                    try {
                        const { content } = JSON.parse(body);
                        
                        // 获取项目根目录
                        const rootDir = process.cwd();
                        const filePath = path.resolve(rootDir, 'src/data/skills.js');
                        
                        // 备份原文件
                        const backupPath = path.resolve(rootDir, 'src/data/skills.backup.js');
                        if (fs.existsSync(filePath)) {
                            fs.copyFileSync(filePath, backupPath);
                        }
                        
                        // 写入新内容
                        fs.writeFileSync(filePath, content, 'utf-8');
                        
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ 
                            success: true, 
                            message: '技能数据已保存',
                            backupCreated: true
                        }));
                    } catch (err) {
                        console.error('保存技能数据失败:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ 
                            success: false, 
                            error: err.message 
                        }));
                    }
                });
            });

            // GET /api/skills-info - 获取技能文件信息
            server.middlewares.use('/api/skills-info', (req, res, next) => {
                if (req.method !== 'GET') {
                    return next();
                }

                try {
                    const rootDir = process.cwd();
                    const filePath = path.resolve(rootDir, 'src/data/skills.js');
                    const stats = fs.statSync(filePath);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        exists: true,
                        lastModified: stats.mtime,
                        size: stats.size
                    }));
                } catch (err) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        exists: false,
                        error: err.message
                    }));
                }
            });
        }
    };
}
