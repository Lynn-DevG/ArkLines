
import { TimelineSimulator } from './src/engine/TimelineSimulator.js';

const mockChar = {
    id: 'char_001',
    name: 'Test Char',
    stats: { baseAtk: 100, critRate: 0.5, critDmg: 0.5 }
};

const mockEnemy = {
    id: 'enemy_01',
    name: 'Sandbag',
    stats: { baseHp: 10000, baseDef: 10, res_Physical: 0, res_Fire: 0 }
};

const sim = new TimelineSimulator([mockChar], mockEnemy);

// Add a Basic Attack skill
// Assuming SKILLS has 'skill_001_basic'
// Need to know skill IDs. 
// Let's assume 'skill_001_basic' exists in skills.js

sim.addAction({
    id: 'action_1',
    charId: 'char_001',
    skillId: 'skill_001_basic',
    startTime: 1.0
});

sim.addAction({
    id: 'action_2',
    charId: 'char_001',
    skillId: 'skill_001_tactical',
    startTime: 2.5
});

console.log('Running simulation...');
try {
    const res = sim.run(5.0);
    console.log('Simulation finished.');
    console.log('Total Damage:', res.totalDamage);
    console.log('Logs:', res.logs);
} catch (e) {
    console.error('CRASH CAUGHT:');
    console.error(e);
}
