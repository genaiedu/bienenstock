/* Self-contained regression tests. Run: node test-model.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
for (const id of ['engine', 'interface']) new vm.Script(html.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)</script>'))[1]);
vm.runInThisContext(html.match(/<script id="engine">([\s\S]*?)<\/script>/)[1]);
let checks = 0;
function verify(s) {
  for (const result of BeeLab.invariants(s)) { assert.ok(result.pass, result.name + ': ' + result.detail); checks++; }
  assert.ok(s.cells.length <= 1200);
  assert.ok(s.bees.length <= 400);
  for (const key of BeeLab.KEYS) assert.equal(BeeLab.inventory(s, key).difference, 0);
}
const baseline = BeeLab.create();
let stages = new Map();
for (let i = 0; i < 2500; i++) {
  const old = baseline.cells.map(c => ({ type:c.type, fan:c.fanTicks, ticks:c.nectarTicks }));
  BeeLab.tick(baseline); verify(baseline);
  for (const c of baseline.cells) if (c.type === 6 && old[c.id]?.type !== 6) {
    assert.equal(old[c.id]?.type, 5, 'Honey must come from nectar');
    assert.ok(c.fanTicks >= 2 && c.nectarTicks >= 2);
    stages.set(c.id, true);
  }
}
assert.ok(!baseline.collapsed, 'Healthy baseline must remain viable for 250 days');
assert.ok(baseline.cells.length > 80);
assert.ok(stages.size > 20);
assert.ok(baseline.births > 0);
const pause = baseline.tick;
BeeLab.control(baseline, 'pause'); BeeLab.tick(baseline); assert.equal(baseline.tick, pause);
BeeLab.control(baseline, 'pause'); BeeLab.control(baseline, 'speed'); assert.equal(baseline.speed, 2);
const stress = BeeLab.create();
for (let i=0;i<200;i++) BeeLab.tick(stress);
const settings = {...stress.settings};
BeeLab.control(stress, 'stress');
for(let i=0;i<300&&!stress.collapsed;i++) { BeeLab.tick(stress);verify(stress); }
assert.ok(stress.report); assert.equal(stress.stress, null);
assert.deepEqual(stress.settings, settings);
assert.ok(stress.report.days <= 30);
assert.equal(stress.report.honeyLoss, Math.max(0,stress.report.honeyBefore-stress.report.honeyAfter));
const famine = BeeLab.create(); BeeLab.control(famine,'flowers',0); BeeLab.control(famine,'disease',100);
for(let i=0;i<3000&&!famine.collapsed;i++){BeeLab.tick(famine);verify(famine);}
assert.ok(famine.collapsed && famine.paused); assert.ok(famine.history.length <= 50);
assert.ok(famine.history.at(-1).events.some(e=>e.startsWith('Kollaps')));
const stopped=famine.tick;BeeLab.tick(famine);assert.equal(famine.tick,stopped);
const cap = BeeLab.create(); BeeLab.control(cap,'population',30);
for(let i=0;i<500&&!cap.collapsed;i++){const oldPop=cap.bees.length;BeeLab.tick(cap);verify(cap);assert.ok(cap.bees.length<=Math.max(oldPop,30));}
// Boundary capacity: force a dense initial lattice by duplicating coordinate records; growth must stop at 1,200.
const grid = BeeLab.create();
while(grid.cells.length<1199){const id=grid.cells.length;grid.cells.push({...grid.cells[0],id,type:1,age:0});}
for(let i=0;i<20&&!grid.collapsed;i++){BeeLab.tick(grid);verify(grid);}
assert.equal(grid.cells.length,1200);
// Mutation probes demonstrate that invariant checks fail when state is corrupted.
const bad = BeeLab.create();bad.accounts.nectar.input++;assert.equal(BeeLab.invariants(bad)[0].pass,false);
bad.cells[30].type=6;bad.cells[30].amount=10;assert.equal(BeeLab.invariants(bad)[1].pass,false);
bad.stats.brood++;assert.equal(BeeLab.invariants(bad)[2].pass,false);
bad.bees[0].target=-1;assert.equal(BeeLab.invariants(bad)[3].pass,false);
for(let seed=1;seed<=12;seed++){
 const s=BeeLab.create(seed);BeeLab.control(s,'flowers',(seed*13)%101);BeeLab.control(s,'weather',(seed*17)%101);BeeLab.control(s,'disease',(seed*7)%101);
 for(let i=0;i<600&&!s.collapsed;i++){BeeLab.tick(s);verify(s);}
}
console.log(JSON.stringify({result:'PASS',invariantAssertions:checks,healthyDays:250,honeyCellsSeen:stages.size,finalPopulation:baseline.bees.length,grid:baseline.cells.length,stress:stress.report,famineCollapseDay:famine.tick/10},null,2));
