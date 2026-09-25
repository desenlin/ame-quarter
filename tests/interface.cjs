// Development-only DOM checks: npm install --no-save jsdom@26.1.0
// DOM emulation does not validate browser layout, WebGL or actual popup behavior.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{JSDOM}=require('jsdom');
const P=path.resolve(__dirname,'..');
async function check(mode){
  const file=mode==='portable'?path.join(P,'../ame-quarter-cre-studio.html'):path.join(P,'index.html');
  const dom=new JSDOM(fs.readFileSync(file,'utf8'),{runScripts:'outside-only',url:'https://example.test/ame-quarter/'}),w=dom.window,d=w.document;
  w.structuredClone=structuredClone;w.HTMLElement.prototype.scrollIntoView=function(){};
  let download,serial=0;const blobs=new Map();
  w.URL.createObjectURL=blob=>{const url='blob:https://example.test/studio-'+(++serial);blobs.set(url,blob);return url;};w.URL.revokeObjectURL=url=>blobs.delete(url);
  w.HTMLAnchorElement.prototype.click=function(){download={filename:this.download,blob:blobs.get(this.href)};};
  if(mode==='modular'){const style=d.createElement('style');style.textContent=fs.readFileSync(path.join(P,'studio/style.css'),'utf8');d.head.append(style);}
  w.eval(fs.readFileSync(path.join(P,'studio/model.js'),'utf8'));w.eval(fs.readFileSync(path.join(P,'studio/app.js'),'utf8'));
  const $=s=>d.querySelector(s),$$=s=>[...d.querySelectorAll(s)],input=(id,value)=>{const e=$(id);e.value=value;e.dispatchEvent(new w.Event('input',{bubbles:true}));};
  const text=blob=>new Promise(resolve=>{const reader=new w.FileReader();reader.onload=()=>resolve(reader.result);reader.readAsText(blob);});
  assert.equal($('main').firstElementChild.tagName,'NAV','Navigation must directly follow the header');
  assert.equal($('.course-tag').textContent,'FIN 355 · Real Estate Investment Analysis');assert.equal($('.case-tag').textContent,'CRE studio');assert.equal($$('.tags>span').length,2);
  assert.equal(w.getComputedStyle($('.hero p')).maxWidth,'none');assert.equal(w.getComputedStyle($('.hero p')).width,'100%');
  assert($('footer').textContent.includes('This educational illustration is not financial, investment, tax, legal, or appraisal advice.'));
  assert.equal($$('a[href*="labs.html"]').length,0);assert.equal($('textarea'),null);assert.equal($('#export-scenario'),null);
  assert.equal($$('.plan-unit').length,6);assert.equal($$('#rent-roll tr').length,6);assert.equal($('#lease-title').textContent,'Midori');
  for(const p of w.CRE.premises){$(`.plan-unit[data-id="${p.id}"]`).click();assert.equal($('#lease-title').textContent,p.name);assert.equal($('#premise-select').value,p.id);assert.equal($$('.plan-unit[aria-pressed="true"]').length,1);assert.equal($(`#premise-select option[value="${p.id}"]`).textContent,`${p.unit} · ${p.name} — ${p.use}`);}
  $('#premise-select').value='cafe';$('#premise-select').dispatchEvent(new w.Event('change'));assert.equal($('#lease-title').textContent,'Kissa Ao');
  $('[data-page="leases"]').click();assert.equal($('[data-panel="leases"]').hidden,false);assert.equal($('[data-panel="property"]').hidden,true);
  $('[data-lease="books"]').click();assert.equal($('#lease-title').textContent,'Tsuki Books');assert.equal($('[data-panel="property"]').hidden,false);
  $('[data-open-activity]').click();assert.equal($('[data-panel="activity"]').hidden,false);assert.equal($$('#cash-flow tr').length,5);assert($('#comparison-results').textContent.includes('$12,073'));
  input('#replace-rent','100');assert($('#comparison-results').textContent.includes('Re-lease leads'));
  input('#replace-rent','');assert.equal($('#input-error').hidden,false);assert.equal($('#comparison-results').hidden,true);
  input('#replace-rent','46');input('#replace-downtime','2.5');assert.equal($('#input-error').hidden,false);
  $('#reset-offers').click();assert.equal($('#input-error').hidden,true);assert.equal($('#replace-downtime').value,'4');assert($('#comparison-results').textContent.includes('Renewal leads'));
  $('[data-page="rendering"]').click();assert.equal($('[data-panel="rendering"]').hidden,false);assert.equal($('[data-panel="activity"]').hidden,true);assert.equal($('[data-page="rendering"]').getAttribute('aria-pressed'),'true');
  $('[data-page="property"]').click();$('[data-view="scene"]').click();assert.equal($('#scene-wrap').hidden,false);assert($('#scene-host iframe'));
  const link=$('#open-scene-tab');assert.equal(link.target,'_blank');assert(link.rel.includes('noopener'));
  link.addEventListener('click',e=>e.preventDefault());
  for(const quality of ['balanced','full']){
    $('#scene-quality').value=quality;$('#scene-quality').dispatchEvent(new w.Event('change'));
    link.dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true}));
    const href=link.getAttribute('href');
    if(mode==='modular'){const url=new URL(href);assert.equal(url.pathname,'/ame-quarter/scene/index.html');assert.equal(url.searchParams.get('quality'),quality);assert.equal($('#scene-host iframe').src,href);}
    else{assert(href.startsWith('blob:'));const doc=await text(blobs.get(href));assert(doc.includes(`window.AME_STUDIO_CONFIG={quality:"${quality}"}`));assert(doc.includes('Three.js Authors'));assert.equal(doc,$('#scene-host iframe').srcdoc);}
  }
  $('#close-scene').click();assert.equal($('#scene-host iframe'),null);assert.equal($('#plan-wrap').hidden,false);
  $('#export-roll').click();assert.equal(download.filename,'ame-quarter-rent-roll.csv');assert((await text(download.blob)).includes('Annual recoveries USD'));
  const ids=$$('[id]').map(e=>e.id);assert.equal(new Set(ids).size,ids.length);for(const l of $$('label[for]'))assert(d.getElementById(l.htmlFor),'Missing input '+l.htmlFor);
  console.log('PASS ('+mode+'): FIN 355 frame, named uses, five sections, leasing interactions, validation/reset, rent-roll export, both new-tab graphics settings and labels');
  w.close();
}
(async()=>{await check('portable');await check('modular');})().catch(e=>{console.error(e);process.exitCode=1;});
