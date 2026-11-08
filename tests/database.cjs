const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { PGlite } = require(process.env.PGLITE_MODULE_PATH || '../.test-tools/node_modules/@electric-sql/pglite');
const schema = ['custom_domains_review_before_apply.sql','custom_domains_lockdown_review_before_apply.sql'].map(file=>fs.readFileSync(path.join(__dirname,'../supabase',file),'utf8')).join('\n');

async function setup(type = 'text') {
  const db = new PGlite();
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
    CREATE TABLE sites(id ${type} PRIMARY KEY, name text, data jsonb, template_type text, updated_at timestamptz);
    GRANT ALL ON sites TO anon, authenticated;`);
  await db.exec(schema); return db;
}
const rpc = (db,id,action,data={}) => db.query('SELECT manage_builder_site($1,$2,$3,$4)',[id,action,JSON.stringify(data),'corporate']);

test('first billing claim is exclusive and failed persistence rolls back subscription and order completion', async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
      CREATE TABLE orders(id int PRIMARY KEY, order_id text UNIQUE, customer_key text, plan text, monthly_fee int, status text);
      CREATE TABLE subscriptions(customer_key text UNIQUE, billing_key text, plan text, monthly_fee int, status text, next_billing_at date);
      CREATE TABLE payments(order_id text UNIQUE, customer_key text, payment_key text, amount int, kind text, status text, raw jsonb);
      INSERT INTO orders VALUES(1,'order','customer','pro',79000,'pending');
      INSERT INTO payments(order_id) VALUES('order');
      GRANT ALL ON orders, subscriptions, payments TO service_role;
    `);
    await db.exec(fs.readFileSync(path.join(__dirname, '../supabase/billing_confirmation_review_before_apply.sql'), 'utf8'));
    const claim = () => db.query("SELECT claim_first_billing('order','customer',79000) AS claimed");
    await db.exec('SET ROLE anon');
    await assert.rejects(claim());
    await db.exec('RESET ROLE; SET ROLE service_role');
    assert.equal((await claim()).rows[0].claimed, true);
    assert.equal((await claim()).rows[0].claimed, false);
    const complete = (totalAmount) => db.query(
      "SELECT complete_first_billing('order','customer','billing','2027-01-01',$1)",
      [JSON.stringify({ orderId: 'order', paymentKey: 'payment', status: 'DONE', totalAmount })],
    );
    await assert.rejects(complete(79000));
    assert.equal((await db.query('SELECT * FROM subscriptions')).rows.length, 0);
    assert.equal((await db.query('SELECT status FROM orders')).rows[0].status, 'billing_processing');
    await db.exec("DELETE FROM payments WHERE order_id='order'");
    await assert.rejects(complete(1));
    await complete(79000);
    assert.equal((await db.query('SELECT status FROM orders')).rows[0].status, 'paid');
    assert.equal((await db.query('SELECT amount FROM payments')).rows[0].amount, 79000);
    assert.equal((await db.query('SELECT status FROM subscriptions')).rows[0].status, 'active');
  } finally { await db.close(); }
});

test('production Korean IDs survive backfill and save/publish unchanged', async () => {
  const db = await setup();
  try {
    const ids = ['기업형', '법률형', '인테리어', '피트니스'];
    for (const id of ids) {
      await db.query("insert into sites(id,name,data) values($1,$1,'{\"seed\":true}')", [id]);
    }
    const script = path.join(__dirname, '../scripts/prepare-publications.cjs');
    const { execFileSync } = require('node:child_process');
    await db.exec(execFileSync(process.execPath, [script, ...ids], { encoding: 'utf8' }));
    for (const id of ids) {
      const read = () => db.query('select data from site_publications where site_id=$1', [id]);
      assert.equal((await read()).rows[0].data.seed, true);
      await rpc(db, id, 'save', { title: id });
      assert.equal((await read()).rows[0].data.seed, true);
      await rpc(db, id, 'publish', { title: id });
      assert.equal((await read()).rows[0].data.title, id);
    }
    await assert.rejects(rpc(db, '기업형/../', 'create'));
  } finally { await db.close(); }
});

test('draft → publish → save → republish → unpublish; two sites stay isolated', async () => {
  const db = await setup();
  try {
    for(const id of ['medinsure','other']) await rpc(db,id,'create');
    await rpc(db,'medinsure','save',{ company:{ name:'DRAFT' } });
    assert.equal((await db.query('select * from site_publications')).rows.length,0);
    await rpc(db,'medinsure','publish',{ company:{ name:'MEDIN 1' } });
    await rpc(db,'other','publish',{ company:{ name:'OTHER' } });
    await rpc(db,'medinsure','save',{ company:{ name:'PRIVATE 2' } });
    let rows=(await db.query('select site_id,data,is_public,revision from site_publications order by site_id')).rows;
    assert.equal(rows[0].data.company.name,'MEDIN 1'); assert.equal(rows[1].data.company.name,'OTHER');
    await rpc(db,'medinsure','publish',{ company:{ name:'MEDIN 2' } });
    rows=(await db.query('select * from site_publications where site_id=$1',['medinsure'])).rows;
    assert.equal(rows[0].data.company.name,'MEDIN 2'); assert.equal(Number(rows[0].revision),2);
    await rpc(db,'medinsure','unpublish');
    assert.equal((await db.query('select * from site_publications where is_public')).rows[0].site_id,'other');
  } finally { await db.close(); }
});

test('domain uniqueness, verified activation, site FK and cascading deletion', async () => {
  const db=await setup();
  try {
    await rpc(db,'medinsure','create'); await rpc(db,'other','create');
    await db.query("insert into site_domains(domain,site_id,verification_token) values('medinsure.thsoft.co.kr','medinsure','token')");
    await assert.rejects(db.query("insert into site_domains(domain,site_id,verification_token) values('medinsure.thsoft.co.kr','other','token2')"));
    await assert.rejects(db.query("update site_domains set status='active'"));
    await assert.rejects(db.query("insert into site_domains(domain,site_id,verification_token) values('missing.example.com','missing','token')"));
    await rpc(db,'medinsure','publish',{company:{name:'MEDIN'}});
    await rpc(db,'medinsure','delete');
    assert.equal((await db.query('select * from site_domains')).rows.length,0);
    assert.equal((await db.query('select * from site_publications')).rows.length,0);
  } finally {await db.close();}
});

test('anonymous/authenticated cannot read drafts, change domains or execute management RPC',async()=>{
  const db=await setup();
  try {
    await rpc(db,'medinsure','create');
    for(const role of ['anon','authenticated']){
      await db.exec(`set role ${role}`);
      await assert.rejects(db.query('select * from sites'));
      await assert.rejects(db.query('select * from site_publications'));
      await assert.rejects(db.query("insert into site_domains(domain,site_id,verification_token) values('bad.example.com','medinsure','x')"));
      await assert.rejects(rpc(db,'medinsure','publish',{company:{name:'ATTACK'}}));
      await db.exec('reset role');
    }
  } finally {await db.close();}
});

test('migration supports existing UUID site IDs without changing their type',async()=>{
  const db=await setup('uuid');
  try {
    const id='11111111-1111-4111-8111-111111111111';
    await rpc(db,id,'create'); await rpc(db,id,'publish',{company:{name:'UUID'}});
    assert.equal((await db.query('select site_id from site_publications')).rows[0].site_id,id);
    await assert.rejects(rpc(db,'medinsure','create'));
  } finally {await db.close();}
});

test('failed publication leaves draft and public snapshot unchanged',async()=>{
  const db=await setup();
  try {
    await rpc(db,'medinsure','create'); await rpc(db,'medinsure','publish',{company:{name:'GOOD'}});
    await db.exec("create function reject_snapshot() returns trigger language plpgsql as $$ begin raise exception 'test failure'; end $$; create trigger fail_publication before update on site_publications for each row execute function reject_snapshot();");
    await assert.rejects(rpc(db,'medinsure','publish',{company:{name:'BAD'}}));
    assert.equal((await db.query('select data from sites')).rows[0].data.company.name,'GOOD');
    assert.equal((await db.query('select data from site_publications')).rows[0].data.company.name,'GOOD');
  } finally {await db.close();}
});
test('server service role can manage sites after browser privileges are revoked',async()=>{
  const db=await setup();
  try {
    await db.exec('set role service_role');
    await rpc(db,'medinsure','create');await rpc(db,'medinsure','publish',{company:{name:'SERVER'}});
    assert.equal((await db.query('select data from site_publications')).rows[0].data.company.name,'SERVER');
    await db.exec('reset role');
  }finally{await db.close();}
});
