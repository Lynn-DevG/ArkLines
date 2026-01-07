const fs = require('fs');

const charSkillsPath = 'e:\\prototypes\\ArkLines\\src\\data\\skills\\characters_skills.json';
const charInfoPath = 'e:\\prototypes\\ArkLines\\src\\data\\characters\\character_info.json';
const outputPath = 'e:\\prototypes\\ArkLines\\src\\data\\skills.js';

try {
    const charSkills = JSON.parse(fs.readFileSync(charSkillsPath, 'utf8'));
    const charInfo = JSON.parse(fs.readFileSync(charInfoPath, 'utf8'));

    const skillsOutput = {};

    // Helper to map type to suffix
    const typeToIdSuffix = {
        'BASIC': '_basic',
        'TACTICAL': '_tactical',
        'CHAIN': '_chain',
        'ULTIMATE': '_ultimate'
    };

    charInfo.forEach(char => {
        const charId_short = char.id;
        const charName = char.name;

        // Find character in charSkills by name or a better match
        const charSkillData = charSkills.characterRoster.find(c => c.name === charName) ||
            charSkills.characterRoster.find(c => c.id.toLowerCase() === charId_short.replace('chr_', '').replace('_', '').toLowerCase());

        if (!charSkillData) {
            console.warn(`No skill data found for character ${charName} (${char.id})`);
            return;
        }

        // Map basic attack
        const basicId = char.skills.basic;
        skillsOutput[basicId] = {
            id: basicId,
            name: `${charName}攻击`,
            type: 'BASIC',
            duration: charSkillData.attack_duration,
            damage_ticks: charSkillData.attack_damage_ticks || [],
            anomalies: charSkillData.attack_anomalies || [],
            uspGain: charSkillData.attack_uspGain || 0,
            element: charSkillData.element
        };

        // Map tactical skill
        const tacticalId = char.skills.tactical;
        skillsOutput[tacticalId] = {
            id: tacticalId,
            name: `${charName}战技`,
            type: 'TACTICAL',
            duration: charSkillData.normal_skill_duration,
            atbCost: charSkillData.normal_skill_atbCost,
            uspGain: charSkillData.normal_skill_uspGain,
            damage_ticks: charSkillData.normal_skill_damage_ticks || [],
            anomalies: charSkillData.normal_skill_anomalies || [],
            element: charSkillData.element
        };

        // Map chain skill
        const chainId = char.skills.chain;
        skillsOutput[chainId] = {
            id: chainId,
            name: `${charName}连携`,
            type: 'CHAIN',
            duration: charSkillData.combo_duration,
            atbCost: charSkillData.combo_atbCost || 0,
            uspGain: charSkillData.combo_uspGain || 0,
            cooldown: charSkillData.combo_cooldown || 0,
            damage_ticks: charSkillData.combo_damage_ticks || [],
            anomalies: charSkillData.combo_anomalies || [],
            element: charSkillData.element
        };

        // Map ultimate skill
        const ultimateId = char.skills.ultimate || `skill_${charId_short}_ultimate`;
        skillsOutput[ultimateId] = {
            id: ultimateId,
            name: `${charName}终结技`,
            type: 'ULTIMATE',
            duration: charSkillData.ultimate_duration,
            uspCost: charSkillData.ultimate_uspMax,
            uspReply: charSkillData.ultimate_uspReply || 0,
            damage_ticks: charSkillData.ultimate_damage_ticks || [],
            anomalies: charSkillData.ultimate_anomalies || [],
            element: charSkillData.element,
            animationTime: charSkillData.ultimate_animationTime
        };

        // Handle variants if any (e.g. for basic attack combos)
        // Note: characters_skills.json has some variants for POGRANICHNK
        if (charSkillData.variants && charSkillData.variants.length > 0) {
            skillsOutput[basicId].variants = charSkillData.variants.map(v => ({
                id: v.id,
                name: v.name,
                type: v.type,
                duration: v.duration,
                damage_ticks: v.damageTicks || [], // Note: camelCase in variants in characters_skills.json?
                uspGain: v.uspGain || 0,
                condition: v.condition // Need to ensure conditions are compatible
            }));
        }
    });

    // Write to skills.js
    const fileContent = `export const SKILLS = ${JSON.stringify(skillsOutput, null, 4)};\n`;
    fs.writeFileSync(outputPath, fileContent, 'utf8');
    console.log(`Successfully migrated ${Object.keys(skillsOutput).length} skills to ${outputPath}`);

} catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
}
