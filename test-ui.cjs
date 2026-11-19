const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync(process.argv[2] || __dirname+'/index.html','utf8');
const elements={};
function get(id){if(!elements[id])elements[id]={value:'',checked:false,disabled:false,hidden:false,dataset:{},textContent:'',innerHTML:'',setAttribute(){},getBoundingClientRect(){return{width:1100,height:680,left:0,top:0};},getContext(){return{};},click(){return this.onclick?.call(this);},async requestFullscreen(){doc.fullscreenElement=this;}};return elements[id];}
const doc={getElementById:get,documentElement:{dataset:{palette:'graphite',theme:'light'}},addEventListener(){},hidden:false,fullscreenElement:null,async exitFullscreen(){this.fullscreenElement=null;}};
const sandbox={document:doc,window:{devicePixelRatio:1,addEventListener(){}},localStorage:{getItem(){return null;},setItem(){}},requestAnimationFrame(){},console};vm.createContext(sandbox);
vm.runInContext(html.match(/<script id="engine">([\s\S]*?)<\/script>/)[1],sandbox);
vm.runInContext(html.match(/<script id="interface">([\s\S]*?)<\/script>/)[1],sandbox);
setImmediate(()=>{const result=get('checks').innerHTML;assert.ok(result.includes('16/16 Aktionen'),result);assert.ok(!result.includes('class="fail"'),result);assert.equal(get('invariantAlert').hidden,true);console.log('PASS: all 16 UI handler state changes, isolated fullscreen enter/exit, rendered status and brood DOM counter.');});
