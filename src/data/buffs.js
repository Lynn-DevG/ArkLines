export const BUFFS = {
    // --- Elemental Attachments ---
    'attachment_fire': {
        id: 'attachment_fire',
        name: '灼热附着',
        type: 'ATTACHMENT',
        element: 'Fire',
        maxLayers: 4,
        description: 'Applies Fire alignment. Triggers Burn on reaction.'
    },
    'attachment_ice': {
        id: 'attachment_ice',
        name: '寒冷附着',
        type: 'ATTACHMENT',
        element: 'Ice',
        maxLayers: 4,
        description: 'Applies Ice alignment. Triggers Freeze on reaction.'
    },
    'attachment_nature': {
        id: 'attachment_nature',
        name: '自然附着',
        type: 'ATTACHMENT',
        element: 'Nature',
        maxLayers: 4,
        description: 'Applies Nature alignment. Triggers Corrosion on reaction.'
    },
    'attachment_electric': {
        id: 'attachment_electric',
        name: '电气附着',
        type: 'ATTACHMENT',
        element: 'Electric',
        maxLayers: 4,
        description: 'Applies Electric alignment. Triggers Conduct on reaction.'
    },

    // --- Anomalies (Status Effects) ---
    // --- Anomalies (Status Effects) ---
    'status_burn': {
        id: 'status_burn',
        name: '燃烧',
        type: 'ANOMALY',
        duration: 10,
        tickInterval: 1.0,
        effect: 'dot',
        description: 'Deals Fire DoT. (12% + 12%*Lv)'
    },
    'status_freeze': {
        id: 'status_freeze',
        name: '冻结',
        type: 'ANOMALY',
        duration: 6, // Base. +1s per stack
        effect: 'stun',
        description: 'Target cannot act.'
    },
    'status_corrosion': {
        id: 'status_corrosion',
        name: '腐蚀',
        type: 'ANOMALY',
        duration: 15,
        effect: 'res_shred', // Reduces resistance
        // Value formula: Init + Growth*Time. We store base params here.
        // Lv1: 3.6 + 0.84/s, Max 12
        maxLayers: 4,
        description: 'Reduces All Res over time.'
    },
    'status_conduct': {
        id: 'status_conduct',
        name: '导电',
        type: 'ANOMALY',
        duration: 12,
        effect: 'vulnerability_magic',
        // Values: 12%, 16%, 20%, 24%
        values: [0.12, 0.16, 0.20, 0.24],
        description: 'Increases Magic DMG taken.'
    },

    // --- Break / Physical ---
    'status_break': {
        id: 'status_break',
        name: '破防',
        type: 'DEBUFF',
        maxLayers: 4,
        description: 'Reduces defense (Counter). Enables Physical Anomalies.'
    },
    'status_stun': {
        id: 'status_stun',
        name: '失衡',
        type: 'STUN',
        duration: 5,
        effect: 'vulnerability_stun',
        value: 0.3, // +30%
        description: 'Target is unbalanced. Takes 30% more damage.'
    },

    // --- Physical Anomalies ---
    'status_sunder': {
        id: 'status_sunder',
        name: '碎甲',
        type: 'ANOMALY',
        effect: 'vulnerability_phys',
        // Values based on consumed break layers: 11%, 14%, 17%, 20%
        values: [0.11, 0.14, 0.17, 0.20],
        durations: [12, 18, 24, 30],
        description: 'Increases Physical DMG taken.'
    },
    // Slam and Launch are instant effects or simple CC, but might have duration logic?
    // Design says: Slam is instant damage? "猛击: 消耗所有破防层数...造成伤害" -> Instant
    // Design says: Launch/Down: "击飞/倒地...叠加一层破防...积累10点失衡值" -> Instant + StatusMod
    // So they might not need a 'status_' entry unless they have duration.
    // Launch/Down might have a short duration CC? unused for now in sim logic other than logging.

    // --- Named Buffs ---
    'buff_atk_up': {
        id: 'buff_atk_up',
        name: 'Attack Up',
        type: 'BUFF',
        statMod: { atk: 0.2 }, // +20%
        description: 'Increases Attack.'
    },
    'buff_fire_infusion': {
        id: 'buff_fire_infusion',
        name: 'Fire Infusion',
        type: 'BUFF',
        special: 'convert_basic_to_fire',
        description: 'Basic attacks deal Fire damage.'
    }
};

export const REACTIONS = {
    // Reaction logic is: Existing Attachment (Type A) + New Attachment (Type B) -> Anomaly (Type B's Anomaly)

    // Anomaly Map based on TRIGGERING element
    'Fire': 'status_burn',
    'Ice': 'status_freeze',
    'Nature': 'status_corrosion',
    'Electric': 'status_conduct'
};
