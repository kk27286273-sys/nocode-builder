const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
const path=require('node:path');
function load(file,imports={}) {
 const exports={};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,
 {exports,require:(id)=>{if(id in imports)return imports[id];throw Error(id)},process:{env:{ADMIN_ACCESS_TOKEN:'qa',VERCEL_ENV:'production'}},Response,Buffer,AbortController,setTimeout,clearTimeout});
 return exports;
}
const limits=load('src/lib/medinsure/release-upload.ts');
let signed=[];
let approved=true;
const record={version:'2.0.9',artifact_kind:'update',object_path:'r2/staged/qa.zip',sha256:'a'.repeat(64)};
const api=load('src/app/api/medinsure/releases/route.ts',{
 'node:crypto':require('node:crypto'),
 '@/lib/supabase/admin':{createAdminClient:()=>({from:()=>({select:()=>({eq:()=>({single:async()=>({data:record})})})})})},
 '@/lib/medinsure/releases':{releaseIdPattern:/^[a-f0-9-]{36}$/,approvedArtifact:()=>approved,noReleaseCache:{'Cache-Control':'private, no-store'}},
 '@/lib/medinsure/release-upload':limits,
 '@/lib/medinsure/r2':{createReleaseDownload:async()=> 'https://example.invalid/short-lived',r2ReleaseKey:(id,ext)=>`${id}.${ext}`,createReleaseUpload:async(key,size)=>{signed.push(size);return {url:'https://example.invalid',headers:{}}}},
});
const request=(body,token='qa')=>({cookies:{get:()=>({value:token})},headers:new Headers(),json:async()=>body});
test('actual unchanged 2.0.9 Setup and ZIP fit the shared bound',async()=>{
 assert.equal(limits.releaseUploadLimit,268435456);
 for(const [name,size] of [['MedinSure-Setup.exe',122584910],['update.zip',129078843]]){
  const r=await api.POST(request({action:'prepare',name,size}));assert.equal(r.status,200);assert.ok((await r.json()).id);
 }
});
test('upper bound inclusive; oversize and invalid sizes never signed',async()=>{
 assert.equal((await api.POST(request({action:'prepare',name:'x.zip',size:limits.releaseUploadLimit}))).status,200);
 for(const size of [limits.releaseUploadLimit+1,0,-1,1.2,'129078843']){
  const n=signed.length;assert.equal((await api.POST(request({action:'prepare',name:'x.zip',size}))).status,400);assert.equal(signed.length,n);
 }
});
test('authentication and extension restrictions unchanged',async()=>{
 const n=signed.length;
 assert.equal((await api.POST(request({action:'prepare',name:'x.zip',size:129078843},'bad'))).status,401);
 assert.equal((await api.POST(request({action:'prepare',name:'x.html',size:129078843}))).status,400);
 assert.equal(signed.length,n);
});
test('registration and UI share the same maximum',()=>{
 const route=fs.readFileSync(path.join(__dirname,'../src/app/api/medinsure/releases/route.ts'),'utf8');
 const ui=fs.readFileSync(path.join(__dirname,'../src/components/builder/MedinsureReleaseManager.tsx'),'utf8');
 assert.match(route,/size > limit/);assert.match(route,/approvedArtifact/);assert.match(ui,/file.size > releaseUploadLimit/);
 assert.ok(!route.includes('100MiB')&&!ui.includes('100MiB'));
});
test('staged download remains admin-only, approved-only and uncached',async()=>{
 const body={action:'verify-download',id:'11111111-1111-4111-8111-111111111111'};
 assert.equal((await api.POST(request(body,'bad'))).status,401);
 assert.equal((await api.POST(request({...body,id:'../bad'}))).status,400);
 approved=false;assert.equal((await api.POST(request(body))).status,409);
 approved=true;const r=await api.POST(request(body));assert.equal(r.status,200);
 assert.equal(r.headers.get('Cache-Control'),'private, no-store');assert.equal((await r.json()).sha256,record.sha256);
});
