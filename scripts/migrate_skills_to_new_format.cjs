/**
 * 技能数据迁移工具
 * 
 * 将现有的 skills.js 格式迁移到新的 action 格式
 * 
 * 运行方式: node migrate_skills_to_new_format.cjs
 */

const fs = require('fs');
const path = require('path');

// 行为类型常量
const ACTION_TYPE = {
    DAMAGE: 'damage',
    ADD_STAGGER: 'add_stagger',
    RECOVER_USP_SELF: 'recover_usp_self',
    RECOVER_USP_TEAM: 'recover_usp_team',
    RECOVER_ATB: 'recover_atb',
    ADD_BUFF: 'add_buff',
    CONSUME_BUFF: 'consume_buff'
};

const TARGET_TYPE = {
    SELF: 'self',
    ALLY: 'ally',
    OTHER_ALLY: 'other_ally',
    MAIN_CHAR: 'main_char',
    ENEMY: 'enemy',
    TARGET_ENEMY: 'target_enemy',
    ANY: 'any'
};

/**
 * 将旧格式技能数据转换为新格式
 */
function convertSkill(oldSkill) {
    const newSkill = {
        id: oldSkill.id,
        name: oldSkill.name,
        type: oldSkill.type,
        duration: oldSkill.duration,
        element: oldSkill.element || 'physical',
        actions: []
    };

    // 可选字段
    if (oldSkill.cooldown) newSkill.cooldown = oldSkill.cooldown;
    if (oldSkill.atbCost) newSkill.atbCost = oldSkill.atbCost;
    if (oldSkill.uspCost) newSkill.uspCost = oldSkill.uspCost;
    if (oldSkill.uspGain !== undefined) newSkill.uspGain = oldSkill.uspGain;
    if (oldSkill.uspReply !== undefined) newSkill.uspReply = oldSkill.uspReply;
    if (oldSkill.animationTime) newSkill.animationTime = oldSkill.animationTime;

    // 转换 damage_ticks -> actions (type: damage)
    if (oldSkill.damage_ticks && Array.isArray(oldSkill.damage_ticks)) {
        oldSkill.damage_ticks.forEach((tick, index) => {
            newSkill.actions.push({
                type: ACTION_TYPE.DAMAGE,
                target: TARGET_TYPE.ENEMY,
                offset: tick.offset || 0,
                element: oldSkill.element || 'physical',
                atb: tick.atb || 0,
                poise: tick.poise || 0,
                index: index + 1
            });
        });
    }

    // 转换 anomalies -> actions (type: add_buff)
    if (oldSkill.anomalies && Array.isArray(oldSkill.anomalies)) {
        oldSkill.anomalies.forEach(anomalyGroup => {
            if (!Array.isArray(anomalyGroup)) return;
            
            anomalyGroup.forEach(anomaly => {
                const action = {
                    type: ACTION_TYPE.ADD_BUFF,
                    target: TARGET_TYPE.ENEMY,
                    offset: anomaly.offset || 0,
                    buffId: anomaly.type,
                    stacks: anomaly.stacks || 1
                };
                
                if (anomaly.duration !== undefined && anomaly.duration !== 0) {
                    action.duration = anomaly.duration;
                }
                if (anomaly.hideDuration) {
                    action.hideDuration = true;
                }
                
                newSkill.actions.push(action);
            });
        });
    }

    // 按 offset 排序 actions
    newSkill.actions.sort((a, b) => a.offset - b.offset);

    // 转换变体
    if (oldSkill.variants && Array.isArray(oldSkill.variants)) {
        newSkill.variants = oldSkill.variants.map(variant => {
            const newVariant = {
                id: variant.id,
                name: variant.name
            };
            
            // 转换条件
            if (variant.condition) {
                newVariant.condition = [variant.condition];
            }

            // 复制可覆盖的属性
            if (variant.type) newVariant.skillType = variant.type;
            if (variant.duration !== undefined) newVariant.duration = variant.duration;
            if (variant.uspGain !== undefined) newVariant.uspGain = variant.uspGain;

            // 转换变体的 damage_ticks
            if (variant.damage_ticks && Array.isArray(variant.damage_ticks)) {
                newVariant.actions = variant.damage_ticks.map((tick, index) => ({
                    type: ACTION_TYPE.DAMAGE,
                    target: TARGET_TYPE.ENEMY,
                    offset: tick.offset || 0,
                    element: oldSkill.element || 'physical',
                    atb: tick.atb || 0,
                    poise: tick.poise || 0,
                    index: index + 1
                }));
            }

            return newVariant;
        });
    }

    return newSkill;
}

/**
 * 读取现有的 skills.js 文件内容
 */
function readSkillsFile() {
    const skillsPath = path.join(__dirname, 'src', 'data', 'skills.js');
    const content = fs.readFileSync(skillsPath, 'utf-8');
    
    // 提取 SKILLS 对象 - 找到从 "export const SKILLS = {" 到 "};" 的内容
    // 需要处理嵌套的大括号
    const startMarker = 'export const SKILLS = ';
    const startIdx = content.indexOf(startMarker);
    if (startIdx === -1) {
        throw new Error('无法找到 SKILLS 对象起始位置');
    }
    
    // 从 { 开始，匹配到对应的 }
    const objStartIdx = content.indexOf('{', startIdx);
    let braceCount = 0;
    let objEndIdx = objStartIdx;
    
    for (let i = objStartIdx; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        else if (content[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                objEndIdx = i + 1;
                break;
            }
        }
    }
    
    const skillsStr = content.substring(objStartIdx, objEndIdx);
    
    // 将 JavaScript 对象字面量转换为 JSON
    // 1. 处理属性名（添加引号）
    // 2. 处理尾部逗号
    let jsonStr = skillsStr
        // 将属性名加引号（如果还没有的话）
        .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
        // 处理尾部逗号
        .replace(/,(\s*[}\]])/g, '$1')
        // null 值保持不变
        .replace(/:\s*null\s*([,}])/g, ': null$1');
    
    try {
        const skills = JSON.parse(jsonStr);
        return skills;
    } catch (e) {
        // 如果 JSON 解析失败，使用 eval（仅用于受信任的本地文件）
        console.log('   JSON 解析失败，尝试使用 eval...');
        
        // 创建临时的 CommonJS 文件
        const tempContent = `module.exports = ${skillsStr}`;
        const tempPath = path.join(__dirname, '_temp_skills_eval.cjs');
        fs.writeFileSync(tempPath, tempContent);
        
        try {
            const skills = require(tempPath);
            return skills;
        } finally {
            // 清理临时文件
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
        }
    }
}

/**
 * 生成新格式的 skills 文件
 */
function generateNewSkillsFile(skills) {
    const convertedSkills = {};
    
    for (const [id, skill] of Object.entries(skills)) {
        convertedSkills[id] = convertSkill(skill);
    }
    
    // 生成 JavaScript 代码
    let output = `/**
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

export const SKILLS_V2 = ${JSON.stringify(convertedSkills, null, 4)};

// 技能类型配置
export const SKILL_TYPES = {
    'BASIC': {
        name: '普通攻击',
        color: 'bg-slate-600',
        icon: 'Swords'
    },
    'TACTICAL': {
        name: '战技',
        color: 'bg-blue-600',
        icon: 'Zap'
    },
    'CHAIN': {
        name: '连携技',
        color: 'bg-purple-600',
        icon: 'Hexagon'
    },
    'ULTIMATE': {
        name: '终结技',
        color: 'bg-amber-600',
        icon: 'Sparkles'
    }
};
`;
    
    return output;
}

/**
 * 主函数
 */
function main() {
    console.log('开始迁移技能数据...\n');
    
    try {
        // 读取现有数据
        console.log('1. 读取现有 skills.js...');
        const skills = readSkillsFile();
        console.log(`   找到 ${Object.keys(skills).length} 个技能\n`);
        
        // 转换数据
        console.log('2. 转换为新格式...');
        const newContent = generateNewSkillsFile(skills);
        
        // 写入新文件
        const outputPath = path.join(__dirname, 'src', 'data', 'skills_v2.js');
        fs.writeFileSync(outputPath, newContent, 'utf-8');
        console.log(`   已写入: ${outputPath}\n`);
        
        // 生成迁移报告
        console.log('3. 迁移完成！\n');
        console.log('='.repeat(50));
        console.log('迁移报告:');
        console.log('='.repeat(50));
        
        let totalActions = 0;
        let totalVariants = 0;
        
        for (const [id, skill] of Object.entries(skills)) {
            const converted = convertSkill(skill);
            totalActions += converted.actions?.length || 0;
            totalVariants += converted.variants?.length || 0;
        }
        
        console.log(`- 技能总数: ${Object.keys(skills).length}`);
        console.log(`- 行为总数: ${totalActions}`);
        console.log(`- 变体总数: ${totalVariants}`);
        console.log('\n注意: 新格式文件已保存为 skills_v2.js');
        console.log('      原有的 skills.js 保持不变，以确保向后兼容');
        
    } catch (error) {
        console.error('迁移失败:', error.message);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = { convertSkill, generateNewSkillsFile };

