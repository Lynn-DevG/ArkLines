const fs = require('fs');
const path = require('path');

const charInfoPath = path.join(__dirname, 'src/data/characters/character_info.json');

try {
    const data = JSON.parse(fs.readFileSync(charInfoPath, 'utf8'));

    data.forEach(char => {
        if (char.skills) {
            // Update skill IDs to new pattern
            // basic -> _attack
            // tactical -> _normal_skill
            // chain -> _combo_skill
            // ultimate -> _ultimate_skill

            const baseSkillPrefix = `skill_${char.id}`;
            char.skills.basic = `${baseSkillPrefix}_attack`;
            char.skills.tactical = `${baseSkillPrefix}_normal_skill`;
            char.skills.chain = `${baseSkillPrefix}_combo_skill`;
            char.skills.ultimate = `${baseSkillPrefix}_ultimate_skill`;
        }
    });

    fs.writeFileSync(charInfoPath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Successfully updated skill IDs in character_info.json');
} catch (err) {
    console.error('Error updating character_info.json:', err);
    process.exit(1);
}
