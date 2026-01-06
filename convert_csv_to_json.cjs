// CSV to JSON Conversion Script
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data', 'characters');
const attrDir = path.join(dataDir, 'attr');

// Helper function to parse CSV
function parseCSV(content) {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/\r/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Handle quoted values with commas
        const values = [];
        let current = '';
        let inQuotes = false;

        for (const char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim().replace(/\r/g, ''));
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim().replace(/\r/g, ''));

        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        rows.push(row);
    }

    return rows;
}

// Map Chinese attribute names to English
const attrMap = {
    '力量': 'strength',
    '敏捷': 'agility',
    '智识': 'intelligence',
    '意志': 'willpower'
};

// Map Chinese element to English
const elementMap = {
    '物理': 'physical',
    '灼热': 'fire',
    '寒冷': 'ice',
    '电磁': 'electric',
    '自然': 'nature'
};

// Map Chinese class to English
const classMap = {
    '近卫': 'Guard',
    '术师': 'Caster',
    '先锋': 'Vanguard',
    '重装': 'Defender',
    '辅助': 'Supporter',
    '突击': 'Striker'
};

// Map weapon types
const weaponMap = {
    '单手剑': 'one_handed_sword',
    '双手剑': 'two_handed_sword',
    '施术单元': 'caster_unit',
    '手铳': 'handgun',
    '长柄武器': 'polearm'
};

// Parse character_info.csv
console.log('Reading character_info.csv...');
const charInfoContent = fs.readFileSync(path.join(dataDir, 'character_info.csv'), 'utf-8');
const charInfoRows = parseCSV(charInfoContent);

const characters = charInfoRows.map(row => {
    // Parse tags from quoted string
    const tags = row['角色标签列表'] ? row['角色标签列表'].split(',').map(t => t.trim()) : [];

    return {
        id: row['charId'],
        name: row['名称'],
        nameEn: row['英文名'],
        classType: classMap[row['职业']] || row['职业'],
        element: elementMap[row['属性']] || row['属性'],
        rarity: parseInt(row['稀有度']) || 0,
        weaponType: weaponMap[row['武器类型']] || row['武器类型'],
        mainAttr: attrMap[row['主属性']] || row['主属性'],
        subAttr: attrMap[row['副属性']] || row['副属性'],
        tags: tags,
        normalAttackRange: parseFloat(row['普通攻击范围']) || 3,
        toughnessCoef: parseFloat(row['韧性削减系数']) || 0.14,
        sortOrder: parseInt(row['排序']) || 0,
        stats: {
            baseStrength: parseFloat(row['力量']) || 0,
            baseAgility: parseFloat(row['敏捷']) || 0,
            baseIntelligence: parseFloat(row['智识']) || 0,
            baseWillpower: parseFloat(row['意志']) || 0,
            maxStrength: parseFloat(row['99级力量']) || 0,
            maxAgility: parseFloat(row['99级敏捷']) || 0,
            maxIntelligence: parseFloat(row['99级智识']) || 0,
            maxWillpower: parseFloat(row['99级意志']) || 0,
            maxAtk: parseFloat(row['99级攻击力']) || 0
        },
        // Placeholder data for fields required by design.md but not in CSV
        level: 1,
        potential: 1,
        skills: {
            basic: `skill_${row['charId']}_basic`,
            tactical: `skill_${row['charId']}_tactical`,
            chain: `skill_${row['charId']}_chain`,
            ultimate: `skill_${row['charId']}_ultimate`
        },
        talents: [],
        equipment: {
            armor: null,
            gloves: null,
            accessory1: null,
            accessory2: null
        },
        weapon: null
    };
});

// Save character_info.json
console.log('Writing character_info.json...');
fs.writeFileSync(
    path.join(dataDir, 'character_info.json'),
    JSON.stringify(characters, null, 2),
    'utf-8'
);
console.log(`Saved ${characters.length} characters to character_info.json`);

// Parse all attribute CSV files and combine into one
console.log('\nReading attribute CSV files...');
const attrFiles = fs.readdirSync(attrDir).filter(f => f.endsWith('.csv'));
const levelMappings = {};

for (const file of attrFiles) {
    console.log(`  Processing ${file}...`);
    const content = fs.readFileSync(path.join(attrDir, file), 'utf-8');
    const rows = parseCSV(content);

    if (rows.length === 0) continue;

    const charId = rows[0]['charId'];

    // Group by level and elite level to avoid duplicates
    const levelData = {};

    for (const row of rows) {
        const level = parseInt(row['等级']) || 1;
        const eliteLevel = parseInt(row['精英化等级']) || 0;
        const key = `${level}_${eliteLevel}`;

        levelData[key] = {
            level: level,
            eliteLevel: eliteLevel,
            strength: parseFloat(row['力量']) || 0,
            agility: parseFloat(row['敏捷']) || 0,
            intelligence: parseFloat(row['智识']) || 0,
            willpower: parseFloat(row['意志']) || 0,
            hp: parseInt(row['生命值']) || 0,
            atk: parseInt(row['攻击力']) || 0,
            spellLevelCoef: parseFloat(row['法术等级系数']) || 1,
            normalAttackRange: parseFloat(row['普通攻击范围']) || 3
        };
    }

    // Convert to ordered array
    const levels = Object.values(levelData).sort((a, b) => {
        if (a.eliteLevel !== b.eliteLevel) return a.eliteLevel - b.eliteLevel;
        return a.level - b.level;
    });

    levelMappings[charId] = {
        charId: charId,
        levels: levels
    };
}

// Save combined level_mappings.json
console.log('\nWriting level_mappings.json...');
fs.writeFileSync(
    path.join(dataDir, 'level_mappings.json'),
    JSON.stringify(levelMappings, null, 2),
    'utf-8'
);
console.log(`Saved level mappings for ${Object.keys(levelMappings).length} characters`);

console.log('\nConversion complete!');
