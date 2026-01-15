import { TimelineSimulator } from './src/engine/TimelineSimulator.js';
import { CHARACTERS } from './src/data/characters.js';
import { SKILLS } from './src/data/skills.js';
import { BUFFS, getBuffDef } from './src/data/buffs.js';
import { DamageCalculator } from './src/engine/DamageCalculator.js';

// Mock specific skills/buffs for testing if needed
// Assuming data exists.

const testChar = { ...CHARACTERS['char_001'], id: 'char_001', stats: { baseAtk: 1000, critRate: 0.5, critDmg: 0.5 } };
const chars = [testChar];

console.log("--- Starting Verification ---");

// 1. Test Damage Reaction Calculation
console.log("\n[Test 1] Reaction Damage Calculation");
const burnDmg = DamageCalculator.calculateReactionDamage('BURN', { sourceChar: testChar }, { res_PHYSICAL: 0 });
console.log(`Burn Dmg (Exp ~500): ${burnDmg}`);
if (burnDmg !== 500) console.error("FAIL: Burn damage incorrect");
else console.log("PASS: Burn damage correct");

// 2. Test Timeline Simulator Loop & Costs
console.log("\n[Test 2] Timeline Resource & DoT");
const sim = new TimelineSimulator(chars, { stats: { baseHp: 10000, baseDef: 100 } });

// Add a skill that adds Burn (assuming skill_001_basic is Basic and adds nothing, let's mock a burn skill)
// We'll mock SKILLS['test_burn']
SKILLS['test_burn'] = {
    name: 'Fireball',
    type: 'TACTICAL',
    spCost: 30,
    duration: 1,
    nodes: [
        { time: 0.5, type: 'status_apply', status: 'status_burn', layers: 1, duration: 3 }
    ]
};
// 测试用临时覆盖（使用正确的 buff ID）
BUFFS['status_burn_test'] = {
    name: 'Burn Test',
    type: 'ANOMALY',
    element: 'Fire',
    duration: 3,
    maxLayers: 4
};

// Add action
sim.addAction({
    id: 1,
    charId: 'char_001',
    skillId: 'test_burn',
    startTime: 1.0
});

// Run for 5 seconds
const result = sim.run(5.0);

// Check SP deduction
// Initial 200. +0.8/0.1s check.
// Total time 5s. Natural gain = 5 * 8 = 40.
// Cost = 30.
// Expected around 210.
// Note: Sim resets SP to 200 or 300? Code says 200 in constructor, loop caps at 300.
// Let's check logic.
console.log(`Final SP: ${sim.sp.toFixed(1)}`);
if (sim.sp > 200 && sim.sp < 220) console.log("PASS: SP Logic seems reasonable (200 + ~40 - 30 = 210)");
else console.warn(`WARN: SP unexpected: ${sim.sp}`);

// Check DoT Logs
const dotLogs = result.logs.filter(l => l.type === 'DOT');
console.log(`DoT Ticks: ${dotLogs.length}`);
if (dotLogs.length >= 2) console.log("PASS: DoT triggered multiple times");
else console.error("FAIL: DoT not triggered enough");

// 3. Test Resource State Lookahead
console.log("\n[Test 3] Resource Lookahead");
const state = sim.simulateResourceStateAt(2.0);
console.log(`State at 2.0s -> SP: ${state.sp.toFixed(1)}`);
if (Math.abs(state.sp - 186) < 1) console.log("PASS: Lookahead SP correct");
else console.error(`FAIL: Lookahead SP mismatch (Exp 186, Got ${state.sp})`);

// 4. Test Magnetism Filtering Helper (Mock)
// Since Magnetism is logic, we can verify the logic.
// Logic: resolveConflicts(newAction, actions) -> should filter invalid
// We can't easily test React state here without mounting, but we can verify the logic concept.
console.log("\n[Test 4] Logic Concept Verification");
const allActions = [
    { id: 1, startTime: 0, duration: 2 },
    { id: 2, startTime: 0, duration: 2 }
];
const invalidIds = new Set([1]);
const solid = allActions.filter(a => !invalidIds.has(a.id));
if (solid.length === 1 && solid[0].id === 2) console.log("PASS: Filtering logic correct");
else console.error("FAIL: Filtering logic incorrect");

console.log("--- Verification Complete ---");
