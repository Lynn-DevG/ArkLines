export const SKILLS = {
    // --- Char 1: Fire Vanguard ---
    'skill_001_basic': {
        id: 'skill_001_basic',
        name: '烈焰斩',
        type: 'BASIC',
        duration: 1.2,
        cooldown: 0,
        spCost: 0,
        energyGain: 0,
        nodes: [
            { time: 0.4, type: 'damage', multiplier: 1.0, element: 'Physical', scaling: 'atk' }
        ],
        variants: [
            {
                condition: { type: 'combo', value: 1 },
                name: '烈焰斩·一段',
                nodes: [{ time: 0.4, type: 'damage', multiplier: 1.0, element: 'Physical', scaling: 'atk' }]
            },
            {
                condition: { type: 'combo', value: 2 },
                name: '烈焰斩·二段',
                nodes: [{ time: 0.4, type: 'damage', multiplier: 1.2, element: 'Physical', scaling: 'atk' }]
            },
            {
                condition: { type: 'combo', value: 3 },
                name: '烈焰斩·三段',
                nodes: [{ time: 0.4, type: 'damage', multiplier: 1.4, element: 'Fire', scaling: 'atk' }]
            },
            {
                condition: { type: 'combo', value: 'heavy' }, // Special value for heavy
                name: '烈焰重击',
                duration: 1.8,
                nodes: [
                    { time: 0.5, type: 'damage', multiplier: 1.0, element: 'Fire', scaling: 'atk' },
                    { time: 1.0, type: 'damage', multiplier: 2.0, element: 'Fire', scaling: 'atk' }
                ]
            },
            // Example of new condition type: Buff Stacks
            // {
            //     condition: { type: 'buff_stacks', buffId: 'buff_fire_infusion', min: 1 },
            //     name: '烈焰斩·强化',
            //     nodes: [...]
            // }
        ]
    },
    'skill_001_tactical': {
        id: 'skill_001_tactical',
        name: '爆裂冲锋',
        type: 'TACTICAL', // 战技
        duration: 1.5,
        cooldown: 12,
        spCost: 100, // Fixed 100 SP
        energyGain: 6.5, // Ultimate energy gain logic handles this, but base provided here?
        nodes: [
            { time: 0.2, type: 'buff_add', target: 'self', buffId: 'buff_fire_infusion', duration: 5 },
            { time: 0.5, type: 'damage', multiplier: 2.5, element: 'Fire', scaling: 'atk' },
            { time: 0.5, type: 'status_apply', target: 'enemy', status: 'attachment_fire', layers: 1 }
        ]
    },
    'skill_001_chain': {
        id: 'skill_001_chain',
        name: '连环爆破',
        type: 'CHAIN', // 连携技
        duration: 1.0,
        cooldown: 20,
        spCost: 0,
        energyGain: 10,
        condition: { type: 'status_on_enemy', status: 'break' }, // Example condition
        nodes: [
            { time: 0.3, type: 'damage', multiplier: 3.0, element: 'Fire', scaling: 'atk' },
            { time: 0.3, type: 'status_apply', target: 'enemy', status: 'attachment_fire', layers: 2 }
        ]
    },
    'skill_001_ultimate': {
        id: 'skill_001_ultimate',
        name: '红莲地狱',
        type: 'ULTIMATE', // 终结技
        duration: 3.5,
        energyCost: 120,
        nodes: [
            { time: 0.1, type: 'buff_add', target: 'team', buffId: 'buff_atk_up', duration: 15 },
            { time: 1.0, type: 'damage', multiplier: 1.0, element: 'Fire', scaling: 'atk' },
            { time: 1.5, type: 'damage', multiplier: 1.0, element: 'Fire', scaling: 'atk' },
            { time: 2.0, type: 'damage', multiplier: 1.0, element: 'Fire', scaling: 'atk' },
            { time: 3.0, type: 'damage', multiplier: 5.0, element: 'Fire', scaling: 'atk' },
            { time: 3.0, type: 'status_apply', target: 'enemy', status: 'attachment_fire', layers: 4 } // Instant max stacks
        ]
    },

    // --- Char 2: Ice Sniper ---
    'skill_002_basic': {
        id: 'skill_002_basic',
        name: '冰霜射击',
        type: 'BASIC',
        duration: 1.0,
        nodes: [
            { time: 0.6, type: 'damage', multiplier: 0.9, element: 'Physical', scaling: 'atk' }
        ]
    },
    'skill_002_tactical': {
        id: 'skill_002_tactical',
        name: '寒冰陷阱',
        type: 'TACTICAL',
        duration: 0.8,
        spCost: 100,
        nodes: [
            { time: 0.4, type: 'damage', multiplier: 1.8, element: 'Ice', scaling: 'atk' },
            { time: 0.4, type: 'status_apply', target: 'enemy', status: 'attachment_ice', layers: 2 }
        ]
    },
    'skill_002_chain': {
        id: 'skill_002_chain',
        name: '碎冰一击',
        type: 'CHAIN',
        duration: 1.2,
        energyGain: 10,
        condition: { type: 'status_on_enemy', status: 'freeze' },
        nodes: [
            { time: 0.5, type: 'damage', multiplier: 4.0, element: 'Physical', scaling: 'atk' }, // Shatter
            { time: 0.5, type: 'status_remove', target: 'enemy', status: 'freeze' } // Consumes freeze?
        ]
    },
    'skill_002_ultimate': {
        id: 'skill_002_ultimate',
        name: '绝对零度',
        type: 'ULTIMATE',
        duration: 2.5,
        energyCost: 100,
        nodes: [
            { time: 1.5, type: 'damage', multiplier: 6.0, element: 'Ice', scaling: 'atk' },
            { time: 1.5, type: 'status_apply', target: 'enemy', status: 'attachment_ice', layers: 4 }
        ]
    },
};

export const SKILL_TYPES = {
    BASIC: { name: '普通攻击', color: 'bg-slate-500' },
    TACTICAL: { name: '战技', color: 'bg-blue-500' },
    CHAIN: { name: '连携技', color: 'bg-purple-500' },
    ULTIMATE: { name: '终结技', color: 'bg-amber-500' },
};
