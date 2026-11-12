const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
const path=require('node:path');
function load(file, mocks={}) {
  const module={exports:{}};
  const source=ts.transpileModule(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(source,{module,exports:module.exports,require:name=>Object.hasOwn(mocks,name)?mocks[name]:require(name),Date,Response,console:{log(){},error(){}},process:{env:{CRON_SECRET:'isolated-secret'}}});
  return module.exports;
}
const dates=load('src/lib/nexia-billing.ts');
test('calendar boundaries keep the original anchor, including leap years and year end',()=>{
  for(const [start,day,end] of [['2026-01-31',31,'2026-02-28'],['2026-02-28',31,'2026-03-31'],['2028-01-31',31,'2028-02-29'],['2028-02-29',31,'2028-03-31'],['2028-02-29',29,'2028-03-29'],['2026-12-31',31,'2027-01-31'],['2026-01-30',30,'2026-02-28'],['2026-02-28',30,'2026-03-30'],['2026-10-15',15,'2026-11-15']])assert.equal(dates.nextBillingDate(start,day),end);
});
test('Korean date does not depend on UTC day or host timezone',()=>{
  assert.equal(dates.koreanDate('2026-01-30T15:00:00Z'),'2026-01-31');
  assert.equal(dates.billingAnchor('2026-01-30T15:00:00Z'),31);
  for(const invalid of [undefined,'2026-01-31','garbage'])assert.throws(()=>dates.billingAnchor(invalid));
  assert.throws(()=>dates.nextBillingDate('2026-02-30',31));
});
test('daily refund: start/full, end/zero, leap month and customer-favour rounding',()=>{
  assert.equal(dates.unusedPeriodRefund(59000,'2026-01-31','2026-02-28','2026-01-31'),59000);
  assert.equal(dates.unusedPeriodRefund(59000,'2026-01-31','2026-02-28','2026-02-14'),29500);
  assert.equal(dates.unusedPeriodRefund(59000,'2026-01-31','2026-02-28','2026-02-28'),0);
  assert.equal(dates.unusedPeriodRefund(29000,'2028-02-01','2028-03-01','2028-02-29'),1000);
  assert.equal(dates.unusedPeriodRefund(59000,'2026-03-01','2026-04-01','2026-03-31'),1904);
  assert.throws(()=>dates.unusedPeriodRefund(59000,'2026-02-28','2026-01-31','2026-02-14'));
});
function harness({anchor='2026-01-31T10:00:00+09:00',firstCount=1,dbError=null,status='active',paid=false,storageError=null}={}) {
  const calls=[],charges=[];
  const sub={customer_key:'fixture-customer',billing_key:'fixture-key',monthly_fee:59000,plan:'basic',status,next_billing_at:'2026-02-28'};
  const db={from(table){const q={table,filters:[],op:'select',value:null};const chain={select(){return chain;},eq(k,v){q.filters.push([k,v]);return chain;},lte(){return chain;},limit(){return chain;},single(){q.single=true;return chain;},insert(v){q.op='insert';q.value=v;return chain;},upsert(v){q.op='upsert';q.value=v;return chain;},update(v){q.op='update';q.value=v;return chain;},then(resolve,reject){calls.push(q);let result={data:null,error:q.op==='select'?null:storageError};if(q.op==='select'){if(table==='subscriptions')result.data=status==='active'?[sub]:[];if(table==='payments'){result.data=Array.from({length:firstCount},()=>({raw:{approvedAt:anchor}}));result.error=dbError;}if(table==='orders')result.data={order_id:'fixture-order',customer_key:sub.customer_key,monthly_fee:59000,plan:'basic',status:paid?'paid':'pending'};if(table==='customers')result.data={name:'synthetic',email:'test@example.invalid'};}return Promise.resolve(result).then(resolve,reject);}};return chain;}};
  const mocks={'next/server':{NextResponse:Response},'@/lib/supabaseAdmin':{supabaseAdmin:db},'@/lib/nexia-billing':dates,'@/lib/plans':{getPlan(){return {name:'Basic',setupFee:700000,monthlyFee:59000};}},'@/lib/toss':{async issueBillingKey(){return {billingKey:'fixture-key'};},async chargeBilling(p){charges.push(p);return {status:'DONE',approvedAt:'2026-01-31T10:00:00+09:00',orderId:p.orderId,totalAmount:p.amount,paymentKey:'fixture-payment'};}}};
  return {calls,charges,mocks};
}
const request=()=>({headers:new Headers({authorization:'Bearer isolated-secret'})});
test('cron advances Feb28 to Mar31 from original evidence; same cycle uses same idempotency key',async()=>{
  const h=harness();const {GET}=load('src/app/api/cron/billing/route.ts',h.mocks);
  await GET(request());await GET(request());
  assert.equal(h.charges.length,2);assert.equal(h.charges[0].orderId,h.charges[1].orderId);
  assert.equal(h.charges[0].amount,59000);
  assert.equal(h.calls.find(c=>c.table==='subscriptions'&&c.op==='update').value.next_billing_at,'2026-03-31');
  assert.deepEqual(JSON.parse(JSON.stringify(h.calls.find(c=>c.table==='subscriptions'&&c.op==='update').filters)),[['customer_key','fixture-customer']]);
});
test('unauthorized, stopped subscriptions and missing/ambiguous anchors never charge',async()=>{
  for(const options of [{firstCount:0},{firstCount:2},{anchor:null},{dbError:{message:'fixture'}},{status:'cancelled'}]){
    const h=harness(options);await load('src/app/api/cron/billing/route.ts',h.mocks).GET(request());assert.equal(h.charges.length,0);
  }
  const h=harness();assert.equal((await load('src/app/api/cron/billing/route.ts',h.mocks).GET({headers:new Headers()})).status,401);assert.equal(h.calls.length,0);
});
test('first charge uses monthly fee and provider approval date; already-paid order is not charged',async()=>{
  const h=harness();const req={json:async()=>({customerKey:'fixture-customer',authKey:'fixture-auth',orderId:'fixture-order'})};
  const res=await load('src/app/api/billing/confirm/route.ts',h.mocks).POST(req);assert.equal(res.status,200);assert.equal(h.charges[0].amount,59000);assert.equal(h.calls.find(c=>c.table==='subscriptions'&&c.op==='upsert').value.next_billing_at,'2026-02-28');
  const paid=harness({paid:true});await load('src/app/api/billing/confirm/route.ts',paid.mocks).POST(req);assert.equal(paid.charges.length,0);
});
test('order total matches monthly charge; setup fee retained as separate contract reference',async()=>{
  const h=harness();const {POST}=load('src/app/api/orders/route.ts',h.mocks);
  const res=await POST({json:async()=>({plan:'basic',name:'fixture',email:'test@example.invalid',phone:'synthetic'})});assert.equal(res.status,200);
  const order=h.calls.find(c=>c.table==='orders'&&c.op==='insert').value;assert.equal(order.amount,59000);assert.equal(order.setup_fee,700000);
});
test('post-charge storage failure is not returned as successful completion',async()=>{
  const h=harness({storageError:{message:'isolated storage failure'}});
  const res=await load('src/app/api/billing/confirm/route.ts',h.mocks).POST({json:async()=>({customerKey:'fixture-customer',authKey:'fixture-auth',orderId:'fixture-order'})});assert.equal(res.status,500);assert.match((await res.json()).message,/다시 결제하지/);
});
