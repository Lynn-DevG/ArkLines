export const ITEMS = {
    WEAPONS: [
        {
            id: 'weapon_sword_01',
            type: 'Sword',
            name: 'Standard Issue Blade',
            baseAtk: 100,
            growth: 1.5,
            effects: []
        },
        {
            id: 'weapon_bow_01',
            type: 'Bow',
            name: 'Composite Bow',
            baseAtk: 90,
            growth: 1.4,
            effects: []
        }
    ],
    EQUIPMENT: [
        {
            id: 'armor_heavy_01',
            type: 'Armor',
            name: 'Iron Plate',
            stats: { def: 50, hp: 100 },
        },
        {
            id: 'glove_leather_01',
            type: 'Glove',
            name: 'Leather Grips',
            stats: { atk: 20, agi: 5 },
        }
    ]
};
