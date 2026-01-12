/**
 * Skill File Generator - 技能文件生成工具
 * 用于生成 skills.js 文件内容
 */

/**
 * 将 JavaScript 对象转换为格式化的代码字符串
 * @param {any} obj - 要转换的对象
 * @param {number} indent - 缩进级别
 * @returns {string}
 */
function objectToCode(obj, indent = 0) {
    const spaces = '    '.repeat(indent);
    const innerSpaces = '    '.repeat(indent + 1);

    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    if (typeof obj === 'string') return JSON.stringify(obj);
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);

    if (Array.isArray(obj)) {
        if (obj.length === 0) return '[]';
        
        // 检查是否是简单数组（所有元素都是基本类型）
        const isSimple = obj.every(item => 
            typeof item !== 'object' || item === null
        );
        
        if (isSimple && obj.length <= 5) {
            return '[' + obj.map(item => objectToCode(item, 0)).join(', ') + ']';
        }
        
        const items = obj.map(item => innerSpaces + objectToCode(item, indent + 1));
        return '[\n' + items.join(',\n') + '\n' + spaces + ']';
    }

    if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        if (keys.length === 0) return '{}';
        
        const entries = keys.map(key => {
            const value = objectToCode(obj[key], indent + 1);
            // 如果 key 是有效的标识符，不需要引号
            const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
            return innerSpaces + safeKey + ': ' + value;
        });
        
        return '{\n' + entries.join(',\n') + '\n' + spaces + '}';
    }

    return String(obj);
}

/**
 * 生成完整的 skills.js 文件内容
 * @param {Object} skills - 技能数据对象
 * @returns {string}
 */
export function generateSkillsFileContent(skills) {
    const header = `/**
 * Skills Data - 技能数据
 * 
 * 新格式：使用 actions 数组来定义技能行为
 * 
 * 行为类型：
 * - damage: 造成伤害
 * - add_stagger: 增加失衡值
 * - recover_usp_self: 回复自身终结技能量
 * - recover_usp_team: 回复全队终结技能量
 * - recover_atb: 回复技力
 * - add_buff: 添加buff
 * - consume_buff: 消耗buff
 */

export const SKILLS = `;

    const skillsCode = objectToCode(skills, 0);
    
    return header + skillsCode + ';\n';
}

/**
 * 保存技能数据到服务器
 * @param {Object} skills - 技能数据对象
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function saveSkillsToFile(skills) {
    try {
        const content = generateSkillsFileContent(skills);
        
        const response = await fetch('/api/save-skills', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * 获取技能文件信息
 * @returns {Promise<Object>}
 */
export async function getSkillsFileInfo() {
    try {
        const response = await fetch('/api/skills-info');
        return await response.json();
    } catch (error) {
        return {
            exists: false,
            error: error.message
        };
    }
}

/**
 * 生成唯一的技能 ID
 * @param {string} prefix - ID 前缀
 * @returns {string}
 */
export function generateSkillId(prefix = 'skill') {
    return `${prefix}_${Date.now()}`;
}

/**
 * 生成唯一的变体 ID
 * @returns {string}
 */
export function generateVariantId() {
    return `v_${Date.now()}`;
}
