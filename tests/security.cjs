const test=require('node:test'); const assert=require('node:assert/strict');
const fs=require('node:fs'); const path=require('node:path'); const ts=require('typescript');
const root=path.join(__dirname,'..'), build=path.join(root,'.test-build');
// Compile real handlers, with only TS syntax stripped; no source-mirroring test implementations.
const files=['src/lib/site-policy.ts','src/lib/admin-auth.ts','src/lib/public-sites.ts','src/lib/supabase/admin.ts','src/proxy.ts',
  'src/app/api/manage/sites/route.ts','src/app/api/domains/route.ts','src/app/api/public-site/route.ts','src/app/api/public-template/route.ts',
  'src/app/api/publish/route.ts','src/app/api/sites/publish/route.ts','src/app/api/images/upload/route.ts',
  'src/lib/supabaseAdmin.ts','src/lib/plans.ts','src/lib/toss.ts',
  'src/app/api/billing/confirm/route.ts','src/app/api/cron/billing/route.ts'];
for(const file of files){
 let source=fs.readFileSync(path.join(root,file),'utf8').replace(/(['"])@\/([^'"]+)\1/g,(_,q,p)=>JSON.stringify(path.join(build,'src',p).replaceAll('\\','/')));
 const result=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}});
 const out=path.join(build,file.replace(/\.ts$/,'.js'));fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,result.outputText);
}
process.env.NODE_ENV='production';process.env.PLATFORM_HOSTS='thsoft.co.kr,www.thsoft.co.kr';
process.env.ADMIN_ACCESS_TOKEN='test-session';process.env.CUSTOM_DOMAINS_ENABLED='true';
process.env.SUPABASE_URL='http://127.0.0.1:54329';process.env.SUPABASE_SERVICE_ROLE_KEY='test-service';
process.env.NEXT_PUBLIC_SUPABASE_URL=process.env.SUPABASE_URL;
process.env.TOSS_SECRET_KEY='test_sk_fixture';
const load=p=>require(path.join(build,p));
const {normalizeDomain,validSiteId}=load('src/lib/site-policy');
const {requireAdmin}=load('src/lib/admin-auth');
const {proxy}=load('src/proxy');const {NextRequest}=require('next/server');
test('post-charge DB failure requests review and repeat requests cannot charge again', async () => {
  const originalFetch = global.fetch;
  let status = 'pending';
  let charges = 0;
  global.fetch = async (input) => {
    const url = new URL(String(input));
    switch (url.pathname) {
      case '/rest/v1/orders':
        return Response.json({ order_id: 'order', customer_key: 'customer', monthly_fee: 79000, plan: 'pro', status });
      case '/rest/v1/customers':
        return Response.json({ email: 'test@example.invalid', name: 'Test' });
      case '/rest/v1/rpc/claim_first_billing':
        status = 'billing_processing';
        return Response.json(true);
      case '/v1/billing/authorizations/issue':
        return Response.json({ billingKey: 'fixture' });
      case '/v1/billing/fixture':
        charges++;
        return Response.json({ paymentKey: 'payment', orderId: 'order', status: 'DONE', totalAmount: 79000 });
      case '/rest/v1/rpc/complete_first_billing':
        return Response.json({ code: 'FIXTURE_FAILURE' }, { status: 500 });
      default: throw new Error('Unexpected fixture request');
    }
  };
  try {
    const confirm = load('src/app/api/billing/confirm/route').POST;
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await confirm(request('/api/billing/confirm', {
        method: 'POST', body: { customerKey: 'customer', authKey: 'auth', orderId: 'order' },
      }));
      assert.equal(response.status, 503);
      assert.equal((await response.json()).code, 'BILLING_REVIEW_REQUIRED');
    }
    assert.equal(charges, 1);
  } finally { global.fetch = originalFetch; }
});

test('cron rejects requests when its secret is missing', async () => {
  const previous = process.env.CRON_SECRET;
  delete process.env.CRON_SECRET;
  try {
    const cron = load('src/app/api/cron/billing/route').GET;
    const response = await cron(new NextRequest('https://thsoft.co.kr/api/cron/billing', {
      headers: { authorization: 'Bearer undefined' },
    }));
    assert.equal(response.status, 401);
  } finally { if (previous !== undefined) process.env.CRON_SECRET = previous; }
});
test('site IDs accept existing Korean names and reject path and SQL punctuation', () => {
  for (const id of ['기업형','법률형','인테리어','피트니스','Medinsure','medinsure']) assert.equal(validSiteId(id), true);
  for (const id of ['기업형/','기업형%2F','기업형\n',"기업형'",'', '가'.repeat(101)]) assert.equal(validSiteId(id), false);
});
test('Korean image upload looks up the exact site ID and uses an ASCII object key', async () => {
  const originalFetch = global.fetch;
  const calls = [];
  global.fetch = async (input) => {
    const url = new URL(typeof input === 'string' ? input : input.url);
    calls.push(url);
    return url.pathname === '/rest/v1/sites'
      ? Response.json([{ id: '기업형' }])
      : Response.json({ Key: url.pathname });
  };
  try {
    const form = new FormData();
    form.set('siteId', '기업형');
    form.set('file', new File([Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')], 'test.gif', { type: 'image/gif' }));
    const handler = load('src/app/api/images/upload/route').POST;
    const response = await handler(new Request('https://thsoft.co.kr/api/images/upload', {
      method: 'POST', body: form,
      headers: { host: 'thsoft.co.kr', origin: 'https://thsoft.co.kr', cookie: 'nexia_admin_session=test-session' },
    }));
    assert.equal(response.status, 200);
    assert.equal(calls[0].searchParams.get('id'), 'eq.기업형');
    assert.match(calls[1].pathname, /\/site-images\/unicode\/[0-9a-f]+\/.+-original\.gif$/);
    assert.match((await response.json()).url, /\/site-images\/unicode\//);
  } finally { global.fetch = originalFetch; }
});
function request(pathname='/', {method='GET',host='thsoft.co.kr',admin=false,origin,body}={}){
 const headers={host};if(admin)headers.cookie='nexia_admin_session=test-session';
 if(origin)headers.origin=origin;
 return new Request(`https://${host}${pathname}`,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
}
test('domain normalization rejects URL/path/port/wildcard/IP and confusable hosts',()=>{
 assert.equal(normalizeDomain('MEDINSURE.THsoft.co.kr.'),'medinsure.thsoft.co.kr');
 for(const value of ['https://medinsure.thsoft.co.kr','evil.com/path','evil.com:443','*.thsoft.co.kr','127.0.0.1','a..com','a_.com','a.com@evil.com','evil.com?x','évil.com'])assert.equal(normalizeDomain(value),null,value);
});
test('admin session requires platform host and same-origin mutation',()=>{
 assert.equal(requireAdmin(request('/',{admin:true})),null);
 assert.equal(requireAdmin(request('/'))?.status,401);
 assert.equal(requireAdmin(request('/',{admin:true,host:'medinsure.thsoft.co.kr'}))?.status,401);
 assert.equal(requireAdmin(request('/',{admin:true,method:'POST',origin:'https://evil.com'}))?.status,403);
 assert.equal(requireAdmin(request('/',{admin:true,method:'POST'}))?.status,403);
 assert.equal(requireAdmin(request('/',{admin:true,method:'POST',origin:'https://thsoft.co.kr'})),null);
});
test('THsoft home/payment/preview pass through; unauthenticated builder redirects',()=>{
 for(const p of ['/','/pay','/api/billing/confirm','/preview/medinsure'])assert.equal(proxy(new NextRequest(request(p))).headers.get('x-middleware-next'),'1');
 assert.equal(proxy(new NextRequest(request('/builder'))).status,307);
 assert.equal(proxy(new NextRequest(request('/builder',{admin:true}))).headers.get('x-middleware-next'),'1');
});
test('customer root rewrites internally; other site, builder, payment and APIs denied',()=>{
 const response=proxy(new NextRequest(request('/',{host:'medinsure.thsoft.co.kr'})));
 assert.equal(response.headers.get('x-middleware-rewrite'),'https://medinsure.thsoft.co.kr/domain-site');
 for(const p of ['/preview/other','/p/other','/builder','/pay','/api/manage/sites','/api/public-site?siteId=other','/domain-site']) assert.equal(proxy(new NextRequest(request(p,{host:'medinsure.thsoft.co.kr',admin:true}))).status,404,p);
 process.env.CUSTOM_DOMAINS_ENABLED='false';assert.equal(proxy(new NextRequest(request('/',{host:'medinsure.thsoft.co.kr'}))).status,404);process.env.CUSTOM_DOMAINS_ENABLED='true';
});
test('all management and legacy publication entry points reject missing auth before DB',async()=>{
 for(const [p,method] of [['manage/sites','GET'],['manage/sites','POST'],['domains','GET'],['domains','POST'],['publish','POST'],['sites/publish','POST']]){
  const handler=load(`src/app/api/${p}/route`)[method];
  assert.equal((await handler(request(`/api/${p}`,{method,body:method==='POST'?{}:undefined}))).status,401,p);
 }
});
test('public site uses publication filter; missing rows do not fall back to another site',async()=>{
 const original=global.fetch;const seen=[];
 global.fetch=async(input)=>{const url=new URL(typeof input==='string'?input:input.url);seen.push(url);
   assert.equal(url.origin,'http://127.0.0.1:54329');
   const id=url.searchParams.get('site_id');
   return Response.json(id==='eq.medinsure'?[{data:{company:{name:'MEDIN'}}}]:[]);
 };
 try{
  const handler=load('src/app/api/public-site/route').GET;
  const response=await handler(request('/api/public-site?siteId=medinsure'));
  assert.equal((await response.json()).company.name,'MEDIN');
  assert.equal(seen[0].pathname,'/rest/v1/site_publications');assert.equal(seen[0].searchParams.get('is_public'),'eq.true');
  assert.equal((await handler(request('/api/public-site?siteId=other'))).status,404);
  assert.equal((await handler(request('/api/public-site?siteId=medinsure',{host:'other.example.com'}))).status,404);
 }finally{global.fetch=original;}
});
test('same-origin publish calls atomic RPC with selected site; invalid data never reaches DB',async()=>{
 const original=global.fetch;const calls=[];
 global.fetch=async(input,init)=>{calls.push({url:String(input),body:JSON.parse(init.body)});return Response.json({siteId:'medinsure'});};
 try{
  const handler=load('src/app/api/manage/sites/route').POST;
  const options={method:'POST',admin:true,origin:'https://thsoft.co.kr'};
  const response=await handler(request('/api/manage/sites',{...options,body:{siteId:'medinsure',action:'publish',data:{company:{name:'MEDIN'}}}}));
  assert.equal(response.status,200);assert.ok(calls[0].url.endsWith('/rpc/manage_builder_site'));assert.equal(calls[0].body.p_site_id,'medinsure');
  assert.equal((await handler(request('/api/manage/sites',{...options,body:{siteId:'../other',data:{}}}))).status,400);
  assert.equal(calls.length,1);
 }finally{global.fetch=original;}
});
test('domain activation requires prior ownership verification and matching site',async()=>{
 const original=global.fetch;const calls=[];
 global.fetch=async(input)=>{const url=new URL(input);calls.push(url);
  return Response.json(url.pathname.endsWith('/sites')?[{id:'medinsure'}]:[{domain:'medinsure.thsoft.co.kr',site_id:'medinsure',verified_at:null}]);
 };
 try{
  const handler=load('src/app/api/domains/route').POST;
  const response=await handler(request('/api/domains',{method:'POST',admin:true,origin:'https://thsoft.co.kr',body:{siteId:'medinsure',domain:'medinsure.thsoft.co.kr',action:'activate'}}));
  assert.equal(response.status,409);assert.equal(calls[1].searchParams.get('site_id'),'eq.medinsure');
 }finally{global.fetch=original;}
});
test('host lookup uses exact active domain; forged forwarding headers cannot select another tenant',async()=>{
 const original=global.fetch; const {findDomain,getPublication}=load('src/lib/public-sites');
 global.fetch=async(input)=>{
  const url=new URL(input);
  if(url.pathname.endsWith('/site_domains')){
    assert.equal(url.searchParams.get('status'),'eq.active');
    return Response.json(url.searchParams.get('domain')==='eq.medinsure.thsoft.co.kr'?[{site_id:'medinsure',domain:'medinsure.thsoft.co.kr'}]:[]);
  }
  assert.equal(url.searchParams.get('site_id'),'eq.medinsure');
  return Response.json([{data:{company:{name:'MEDIN'}}}]);
 };
 try{
  assert.equal(await findDomain('other.thsoft.co.kr'),null);
  const mapping=await findDomain('medinsure.thsoft.co.kr');
  assert.equal((await getPublication(mapping.site_id)).data.company.name,'MEDIN');
  const req=new NextRequest(request('/',{host:'other.thsoft.co.kr'}));req.headers.set('x-forwarded-host','thsoft.co.kr');
  assert.ok(proxy(req).headers.get('x-middleware-rewrite')?.startsWith('https://other.thsoft.co.kr/'));
 }finally{global.fetch=original;}
});
test('domain registration → TXT verification → activation; duplicates and wrong-site actions denied',async()=>{
 const original=global.fetch;const dns=require('node:dns/promises'),resolveOriginal=dns.resolveTxt;
 let record;let wrongTxt=false;
 dns.resolveTxt=async()=>[[wrongTxt?'wrong-token':`thsoft-site=${record.verification_token}`]];
 global.fetch=async(input,init={})=>{
  const url=new URL(input),method=init.method||'GET';
  if(url.pathname.endsWith('/sites'))return Response.json([{id:url.searchParams.get('id')?.slice(3)}]);
  if(method==='POST'){
   if(record)return Response.json({code:'23505',message:'duplicate'},{status:409});
   record=JSON.parse(init.body);return new Response(null,{status:201});
  }
  if(method==='PATCH'){Object.assign(record,JSON.parse(init.body));return new Response(null,{status:204});}
  return Response.json(record&&url.searchParams.get('site_id')===`eq.${record.site_id}`?[record]:[]);
 };
 try{
  const handler=load('src/app/api/domains/route').POST;
  const call=(action,siteId='medinsure')=>handler(request('/api/domains',{method:'POST',admin:true,origin:'https://thsoft.co.kr',body:{siteId,domain:'medinsure.thsoft.co.kr',action}}));
  assert.equal((await call('register')).status,200);assert.equal(record.status,'pending');assert.equal(record.verification_token.length,48);
  assert.equal((await call('register')).status,409);
  wrongTxt=true;assert.equal((await call('verify')).status,409);assert.equal(record.status,'pending');
  wrongTxt=false;assert.equal((await call('verify')).status,200);assert.equal(record.status,'verified');
  assert.equal((await call('activate','other')).status,404);
  assert.equal((await call('activate')).status,200);assert.equal(record.status,'active');
  assert.equal((await call('verify')).status,200);assert.equal(record.status,'active');
 }finally{global.fetch=original;dns.resolveTxt=resolveOriginal;}
});
