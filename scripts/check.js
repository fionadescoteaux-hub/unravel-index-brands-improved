'use strict';

/**
 * Build gate — run by `npm run check` (the netlify.toml build command).
 * A deploy stops here rather than shipping a broken function or a static
 * demo that depends on files it does not carry.
 *
 * Checks:
 *   1. Every function in netlify/functions and every lib module parses
 *      (fresh `node --check`).
 *   2. Every function resolves its requires (lib/ present and loadable).
 *   3. public/marquee-demo.html carries a __bundler block — proof the
 *      walkthrough embeds its instrument and payload rather than linking
 *      them, so it cannot half-render if an asset moves.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const problems = [];

function say(ok, label) {
  console.log(`  ${ok ? '✓' : 'x'} ${label}`);
  if (!ok) problems.push(label);
}

console.log('Functions and lib');
for (const dir of ['netlify/functions', 'lib']) {
  for (const f of fs.readdirSync(path.join(root, dir)).filter(x => x.endsWith('.js'))) {
    const p = path.join(root, dir, f);
    let ok = true;
    try { execFileSync(process.execPath, ['--check', p], { stdio: 'pipe' }); }
    catch (e) { ok = false; }
    say(ok, `${dir}/${f} parses`);
  }
}

console.log('Requires resolve');
for (const f of fs.readdirSync(path.join(root, 'netlify/functions')).filter(x => x.endsWith('.js'))) {
  let ok = true, detail = '';
  try { require(path.join(root, 'netlify/functions', f)); }
  catch (e) { ok = false; detail = ` — ${e.message}`; }
  say(ok, `netlify/functions/${f} loads${detail}`);
}

console.log('Static demo');
const demoPath = path.join(root, 'public', 'marquee-demo.html');
if (!fs.existsSync(demoPath)) {
  say(false, 'public/marquee-demo.html exists');
} else {
  const demo = fs.readFileSync(demoPath, 'utf8');
  say(demo.includes('__bundler'), 'marquee-demo.html has a __bundler block — embedded assets would be missing');
  say(!/<script src="instrument\.js">/.test(demo), 'marquee-demo.html does not link instrument.js (must embed it)');
}

console.log('Browser scripts');
for (const file of ['public/index.html','public/dashboard.html','public/line.html','public/report.html','public/marquee-demo.html']) {
  const full=path.join(root,file);
  let valid=fs.existsSync(full), detail='';
  if (valid) {
    const html=fs.readFileSync(full,'utf8');
    const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
    try { scripts.forEach(code => { if (code.trim()) new Function(code); }); }
    catch (e) { valid=false; detail=` — ${e.message}`; }
  }
  say(valid,`${file} inline scripts parse${detail}`);
}

console.log('Generated assets and routes');
try {
  execFileSync(process.execPath,[path.join(root,'scripts','build-demo.js'),'--check'],{stdio:'pipe'});
  say(true,'marquee-demo.html matches dashboard, instrument and demo data');
} catch (e) { say(false,'marquee-demo.html matches dashboard, instrument and demo data'); }
const netlify=fs.readFileSync(path.join(root,'netlify.toml'),'utf8');
say(netlify.includes('from = "/api/context"'),'netlify.toml exposes /api/context');
say(netlify.includes('from = "/api/registry"'),'netlify.toml exposes /api/registry');
for (const file of ['data/marquee-demo.json','docs/ontology.md','MIGRATION.md']) {
  say(fs.existsSync(path.join(root,file)),`${file} exists`);
}

console.log('Method language');
const dashboard=fs.readFileSync(path.join(root,'public','dashboard.html'),'utf8');
say(!/Fragile 0[–-]39/.test(dashboard),'dashboard does not describe an impossible 0–19 band');

console.log('Five-tab brand page');
const TABS=[["exec","Executive Audit"],["map","Commercial Map"],["evidence","Evidence"],["actions","Actions"],["history","History"]];
const demoHtml=fs.readFileSync(demoPath,'utf8');
for (const [k,label] of TABS){
  const sig="['"+k+"','"+label+"'";
  say(dashboard.includes(sig),'dashboard defines the '+label+' tab');
  say(demoHtml.includes(sig),'generated demo carries the '+label+' tab');
}
say(/TABSEL\[[^\]]+\]\|\|'exec'/.test(dashboard),'Executive Audit is the default tab');
say(dashboard.includes('role="tablist"')&&dashboard.includes('role="tabpanel"'),'tabs use accessible roles');
say(dashboard.includes('class="helpfab"')&&(dashboard.match(/class=\"helpfab\"/g)||[]).length===1,'exactly one floating guidance control');

console.log('Data integrity');
try{
  const data=JSON.parse(fs.readFileSync(path.join(root,'data','marquee-demo.json'),'utf8'));
  const m=demoHtml.match(/window\.__DEMO_PAYLOAD__ = (\{.*?\});<\/script>/s);
  const payload=JSON.parse(m[1]);
  say(payload.brands.length===data.brands.length&&data.brands.length>=19,'brand count unchanged ('+data.brands.length+' in data, '+payload.brands.length+' in demo)');
  const dLines=data.brands.reduce((t,b)=>t+((b.context||{}).lines||[]).length,0);
  const pLines=payload.brands.reduce((t,b)=>t+((b.context||{}).lines||[]).length,0);
  say(dLines===pLines,'commercial-line count unchanged ('+dLines+' in data, '+pLines+' in demo)');
  say(payload.brands.every(b=>b.brandId)&&payload.brands.every(b=>(b.context.lines||[]).every(l=>l.lineId)),'stable brand and line IDs present throughout');
  say(data.brands.every(b=>b.brandId)&&data.brands.every(b=>((b.context||{}).lines||[]).every(l=>l.lineId)),'stable IDs are stored in the SOURCE data, not only generated at build');
  say(payload.brands.some(b=>b.constraintStatus==='candidate')&&payload.brands.some(b=>b.constraintStatus==='priority')&&payload.brands.some(b=>b.constraintStatus==='validated'),'all three constraint states represented');
  const dComps=data.components||[], pComps=payload.components||[];
  say(dComps.length===17&&pComps.length===17,'17 commercial components in source and demo ('+dComps.length+'/'+pComps.length+')');
  say(dComps.every(c=>c.componentId&&/^OFF-\d{4}$/.test(c.componentId))&&new Set(dComps.map(c=>c.componentId)).size===dComps.length,'component IDs stored in source data, well-formed and unique');
  say(dComps.filter(c=>c.includedInAssessment).length===13&&dComps.filter(c=>!c.includedInAssessment).length===4,'13 components linked to assessed lines, 4 marked outside the assessment');
  const lineIds=new Set(data.brands.flatMap(b=>((b.context||{}).lines||[]).map(l=>l.lineId)));
  say(dComps.every(c=>!c.includedInAssessment||lineIds.has(c.commercialLineId)),'every linked component references a real stored line ID');
  const martha=data.brands.find(b=>b.name==='Martha Stewart');
  say(martha&&(martha.context.lines||[]).length===6&&(martha.constraintLines||[]).length===3&&Object.keys((data.lineCuts||{})['Martha Stewart']||{}).length===2,'Martha keeps 6 lines, 3 affected, 2 line cuts');
  const mline=martha&&(martha.context.lines||[]).find(l=>l.name==='Cookware & kitchen');
  const mcut=((data.lineCuts||{})['Martha Stewart']||{})['Cookware & kitchen'];
  say(mline&&mcut&&mline.renewal!==mcut.contract.renewal,'cookware renewal contradiction preserved for verification, not silently resolved');
}catch(e){ say(false,'demo payload parses for integrity checks — '+e.message); }

console.log('Controls preserved');
say(dashboard.includes('class="ghostlink impadd"')||dashboard.includes("class=\"ghostlink impadd\""),'add-to-plan control present');
say(dashboard.includes('cm-save'),'commit form present');
say(dashboard.includes('mv-status'),'move status control present');
say(dashboard.includes('evidenceHTML')&&dashboard.includes('testsHTML'),'evidence and three-test renderers present');

/* ── Tree guard ─────────────────────────────────────────────────────────
   The repository IS the manifest below. Any file the gate does not
   recognise fails the build with its name — so a stray upload, a
   hyphen-stripped duplicate (getportfolio.js) or a leftover from an old
   zip can never deploy silently again. Adding a real new file means
   adding it here in the same commit, which is the point. */
console.log('Repository tree');
const MANIFEST={
  '.':['CHANGELOG.md','IMPLEMENTATION-ASSESSMENT.md','MIGRATION.md','README.md','CLEANUP-GUIDE.md','netlify.toml','package.json','package-lock.json'],
  'data':['marquee-demo.json'],
  'lib':['airtable.js','auth.js','constraints.js','http.js','instruments.js','scoring.js'],
  'netlify':[],
  'netlify/functions':['get-brand-registry.js','get-portfolio.js','partner-lookup.js','save-assessment-context.js','save-move.js','submit-assessment.js'],
  'public':['_headers','_redirects','dashboard.html','home.html','index.html','instrument.js','line.html','marquee-demo.html','report.html'],
  'scripts':['build-demo.js','check.js'],
  'tests':['auth.test.js','brandpage.test.js','components.test.js','constraints.test.js','scoring.test.js'],
};
const IGNORE=new Set(['.git','.github','node_modules','.netlify','.DS_Store','.gitignore','.vscode']);
let strays=[];
for (const [dir,allowed] of Object.entries(MANIFEST)){
  const abs=path.join(root,dir);
  if(!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs)){
    if (IGNORE.has(f)) continue;
    const isDir=fs.statSync(path.join(abs,f)).isDirectory();
    if (isDir){
      if (dir==='.'&&['data','docs','lib','netlify','public','scripts','tests'].includes(f)) continue;
      if (dir==='netlify'&&f==='functions') continue;
      strays.push(path.join(dir,f)+'/');
      continue;
    }
    if (!allowed.includes(f)) strays.push(path.join(dir,f));
  }
}
if (strays.length){
  const stripped=strays.filter(f=>/(getportfolio|savemove|submitassessment|partnerlookup|getbrandregistry|saveassessmentcontext)\.js$/.test(f));
  strays.forEach(f=>say(false,'unexpected file: '+f+' — delete it, or add it to the manifest in scripts/check.js if it is intentional'));
  if (stripped.length) console.log('  ! '+stripped.length+' of these look like hyphen-stripped duplicates from a GitHub web upload — the classic silent breakage. Delete them.');
} else {
  say(true,'repository contains exactly the files the manifest expects');
}
say(!/the binding constraint is the lowest-scoring domain/i.test(dashboard),'dashboard does not overclaim a lowest score as validated');

if (problems.length) {
  console.error(`Build gate FAILED with ${problems.length} problem${problems.length === 1 ? '' : 's'}. Deploy stopped.`);
  process.exit(1);
}
console.log('Build gate passed.');
