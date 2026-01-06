export const CHARACTERS = [
    {
        id: 'char_001',
        name: '烈焰先锋',
        classType: 'Vanguard',
        element: 'Fire',
        stats: {
            baseAtk: 600,
            baseDef: 400,
            baseHp: 2000,
            strength: 80,
            agility: 50,
            intelligence: 20,
            willpower: 40,
        },
        mainAttr: 'strength',
        subAttr: 'agility',
        level: 80, // Default level
        potential: 1,
        skills: {
            basic: 'skill_001_basic',
            tactical: 'skill_001_tactical',
            chain: 'skill_001_chain',
            ultimate: 'skill_001_ultimate',
        },
        talents: [
            { id: 't1', name: 'Attack Up', active: true, effects: { type: 'stat', stat: 'atk', value: 50 } },
            { id: 't2', name: 'Fire Mastery', active: true, effects: { type: 'dmg_boost', element: 'fire', value: 0.15 } }
        ]
    },
    {
        id: 'char_002',
        name: '寒冰射手',
        classType: 'Sniper',
        element: 'Ice',
        stats: {
            baseAtk: 750,
            baseDef: 200,
            baseHp: 1600,
            strength: 30,
            agility: 90,
            intelligence: 40,
            willpower: 30,
        },
        mainAttr: 'agility',
        subAttr: 'intelligence',
        level: 80,
        potential: 1,
        skills: {
            basic: 'skill_002_basic',
            tactical: 'skill_002_tactical',
            chain: 'skill_002_chain',
            ultimate: 'skill_002_ultimate',
        },
        talents: []
    }
];

// Level scaling factors (simplified from design doc for now)
export const getLevelStats = (baseStats, level) => {
    const scale = 1 + (level - 1) * 0.05; // 5% per level
    return {
        atk: Math.floor(baseStats.baseAtk * scale),
        def: Math.floor(baseStats.baseDef * scale),
        hp: Math.floor(baseStats.baseHp * scale),
        // Attributes might not scale linearly in design, but keeping simple for mock
        str: Math.floor(baseStats.strength * scale),
        agi: Math.floor(baseStats.agility * scale),
        int: Math.floor(baseStats.intelligence * scale),
        wil: Math.floor(baseStats.willpower * scale),
    };
};
