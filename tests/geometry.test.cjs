const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const element = () => ({addEventListener(){},classList:{add(){},remove(){}},style:{}});
const context = {document:{querySelector:()=>element()},window:{},URL:{revokeObjectURL(){}},setTimeout,atob:value=>Buffer.from(value,'base64').toString('binary')};
vm.createContext(context);
vm.runInContext(fs.readFileSync('app.js','utf8'),context);
for(const [width,height,expected] of [[768,1376,48],[1143,2048,71],[1024,1024,64],[1536,1024,64],[1024,1536,64]]){
  const result=context.geometry(width,height);
  assert.ok(result,`${width}x${height} doit être pris en charge`);
  assert.equal(result.size,expected);
}
assert.equal(context.geometry(320,320),null);
assert.ok(Math.abs(context.calibratedGain(26.6824,144.7974,.45216)-.5355)<.001,'la variante Gemini légère doit réduire la correction');
assert.ok(Math.abs(context.calibratedGain(53.92,143.4,.478)-1.01)<.01,'le profil Gemini historique doit rester inchangé');
assert.equal(context.calibratedGain(200,20,.45),1.12,'la correction maximale doit être bornée');
console.log('Geometry and opacity calibration tests: PASS');
