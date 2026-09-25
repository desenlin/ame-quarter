// Development-only DOM checks: npm install --no-save jsdom@26.1.0
// This emulates the DOM; it does not claim browser layout or WebGL validation.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const P=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(P,'studio/shell.html'),'utf8');
const dom=new JSDOM(html,{runScripts:'outside-only',url:'https://example.test/ame-quarter/'}),w=dom.window,d=w.document;
w.structuredClone=structuredClone;w.HTMLElement.prototype.scrollIntoView=function(){};let download;
w.URL.createObjectURL=blob=>(download=blob,'blob:test');w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){download.filename=this.download;};
w.eval(fs.readFileSync(path.join(P,'studio/model.js'),'utf8'));w.eval(fs.readFileSync(path.join(P,'studio/app.js'),'utf8'));
const $=s=>d.querySelector(s),$$=s=>[...d.querySelectorAll(s)],input=(id,value)=>{const e=$(id);e.value=value;e.dispatchEvent(new w.Event('input',{bubbles:true}));};
assert.equal($$('.plan-unit').length,6);assert.equal($$('#rent-roll tr').length,6);assert.equal($('#lease-title').textContent,'Midori');
for(const p of w.CRE.premises){$(`.plan-unit[data-id="${p.id}"]`).click();assert.equal($('#lease-title').textContent,p.name);assert.equal($('#premise-select').value,p.id);assert.equal($$('.plan-unit[aria-pressed="true"]').length,1);}
$('#premise-select').value='cafe';$('#premise-select').dispatchEvent(new w.Event('change'));assert.equal($('#lease-title').textContent,'Kissa Ao');
$('[data-page="leases"]').click();assert.equal($('[data-panel="leases"]').hidden,false);assert.equal($('[data-panel="property"]').hidden,true);
$('[data-lease="books"]').click();assert.equal($('#lease-title').textContent,'Tsuki Books');assert.equal($('[data-panel="property"]').hidden,false);
$('[data-open-activity]').click();assert.equal($('[data-panel="activity"]').hidden,false);assert.equal($$('#cash-flow tr').length,5);assert($('#comparison-results').textContent.includes('$12,073'));
input('#replace-rent','100');assert($('#comparison-results').textContent.includes('Re-lease leads'));
input('#replace-rent','');assert.equal($('#input-error').hidden,false);assert.equal($('#export-scenario').disabled,true);assert.equal($('#comparison-results').hidden,true);
input('#replace-rent','46');input('#replace-downtime','2.5');assert.equal($('#input-error').hidden,false);
$('#reset-offers').click();assert.equal($('#input-error').hidden,true);assert.equal($('#replace-downtime').value,'4');assert($('#comparison-results').textContent.includes('Renewal leads'));
$('#recommendation').value='=HYPERLINK("https://example.test")';$('#export-scenario').click();assert.equal(download.filename,'ame-quarter-landlord-comparison.csv');
const reader=new w.FileReader();reader.onload=()=>{assert(reader.result.includes("'=HYPERLINK"),'Export protects spreadsheet formulas');assert(reader.result.includes('Annual discount rate percent'));console.log('PASS: premise selection, rent roll navigation, input changes, invalid input states, reset, CSV export and formula-safe notes');w.close();};reader.readAsText(download);
$('#export-roll').click();assert.equal(download.filename,'ame-quarter-rent-roll.csv');
// Check native label associations and duplicate IDs across the generated interface.
const ids=$$('[id]').map(e=>e.id);assert.equal(new Set(ids).size,ids.length);for(const l of $$('label[for]'))assert(d.getElementById(l.htmlFor),'Missing input '+l.htmlFor);
