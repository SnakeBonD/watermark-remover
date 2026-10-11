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
console.log('Geometry tests: PASS');
