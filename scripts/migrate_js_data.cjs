const fs = require('fs');

const skillsFile = 'e:\\prototypes\\ArkLines\\src\\data\\skills.js';
const buffsFile = 'e:\\prototypes\\ArkLines\\src\\data\\buffs.js';

function migrateText(text) {
    let result = text;
    // Replace spCost -> atbCost
    result = result.replace(/spCost/g, 'atbCost');
    // Replace energyGain -> uspGain
    result = result.replace(/energyGain/g, 'uspGain');
    // Replace energyCost -> uspCost
    result = result.replace(/energyCost/g, 'uspCost');
    // Replace multiplier -> atk_scale
    result = result.replace(/multiplier(?=\s*[:])/g, 'atk_scale'); // mostly keys
    // Replace stagger -> poise
    result = result.replace(/stagger/gi, (m) => {
        if (m === 'STAGGER') return 'POISE';
        if (m === 'Stagger') return 'Poise';
        return 'poise';
    });
    return result;
}

try {
    // Process skills.js
    let skillsContent = fs.readFileSync(skillsFile, 'utf8');
    fs.writeFileSync(skillsFile, migrateText(skillsContent), 'utf8');
    console.log('skills.js updated Successfully.');

    // Process buffs.js
    let buffsContent = fs.readFileSync(buffsFile, 'utf8');
    fs.writeFileSync(buffsFile, migrateText(buffsContent), 'utf8');
    console.log('buffs.js updated Successfully.');

} catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
}
