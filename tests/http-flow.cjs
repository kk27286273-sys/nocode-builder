// Local-only integration: real Next server -> local REST adapter -> PostgreSQL WASM.
// No production credentials, DNS mutation or payment-provider request.
const {test}=require('node:test'),assert=require('node:assert/strict');
const {spawn}=require('node:child_process');const http=require('node:http');const fs=require('node:fs');const path=require('node:path');
const {PGlite}=require(process.env.PGLITE_MODULE_PATH || '../.test-tools/node_modules/@electric-sql/pglite');

test('real Next HTTP: THsoft preserved, domain isolation, save/publish/unpublish and auth',async()=>{
 const db=new PGlite();let app;const requests=[];
 await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
 create table sites(id text primary key,name text,data jsonb,template_type text,updated_at timestamptz);`);
 await db.exec(fs.readFileSync(path.join(__dirname,'../supabase/custom_domains_review_before_apply.sql'),'utf8'));
 await db.exec(fs.readFileSync(path.join(__dirname,'../supabase/custom_domains_lockdown_review_before_apply.sql'),'utf8'));
 const fixture=http.createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,'http://fixture');requests.push(url.pathname);
   let rows;
   if(url.pathname==='/rest/v1/rpc/manage_builder_site'){
    let body='';for await(const chunk of req)body+=chunk;const b=JSON.parse(body);
    rows=(await db.query('select manage_builder_site($1,$2,$3,$4) as result',[b.p_site_id,b.p_action,JSON.stringify(b.p_data),b.p_template])).rows[0].result;
   }else{
    const table=url.pathname.split('/').pop();if(!['sites','site_domains','site_publications'].includes(table))throw Error('Unexpected table');
    const filters=[],values=[];
    for(const [key,value] of url.searchParams){
     if(['select','order','limit'].includes(key))continue;
     if(!['id','site_id','domain','status','is_public','template_type'].includes(key)||!value.startsWith('eq.'))throw Error('Unexpected filter');
     values.push(value.slice(3));filters.push(`${key}=$${values.length}`);
    }
    rows=(await db.query(`select * from ${table}${filters.length?' where '+filters.join(' and '):''}`,values)).rows;
    if(url.searchParams.has('limit'))rows=rows.slice(0,Number(url.searchParams.get('limit')));
   }
   res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify(rows));
  }catch(error){res.writeHead(400,{'Content-Type':'application/json'});res.end(JSON.stringify({message:error.message}));}
 });
 await new Promise(resolve=>fixture.listen(0,'127.0.0.1',resolve));const dbPort=fixture.address().port;
 const port=Number(process.env.TEST_APP_PORT||3207);
 const data=name=>({templateType:'corporate',company:{name,logoUrl:'/next.svg'},hero:{title:name,subtitle:'Local fixture'},sectionsVisible:{footer:false,corporateInfo:false}});
 for(const [id,name,host] of [['medinsure','MEDIN FIXTURE','medinsure'],['기업형','OTHER FIXTURE','other']]){
  await db.query('select manage_builder_site($1,$2,$3,$4)',[id,'create','{}','corporate']);
  await db.query('select manage_builder_site($1,$2,$3,$4)',[id,'publish',JSON.stringify(data(name)),'corporate']);
  await db.query("insert into site_domains(domain,site_id,status,verification_token,verified_at) values($1,$2,'active','test',now())",[`${host}.thsoft.co.kr`,id]);
 }
 await db.query('select manage_builder_site($1,$2,$3,$4)', ['피트니스','create','{}','fitness']);
 await db.query('select manage_builder_site($1,$2,$3,$4)', ['피트니스','publish',JSON.stringify({
   templateType:'fitness', classes:[{id:'yoga',name:'LOCAL YOGA CLASS',instructor:'Local Trainer',time:'09:00'}],
 }), 'fitness']);
 const logs=[];
 app=spawn(process.execPath,[path.join(__dirname,'../node_modules/next/dist/bin/next'),'start','-p',String(port)],{
  cwd:path.join(__dirname,'..'),windowsHide:true,env:{...process.env,NODE_ENV:'production',NEXT_TELEMETRY_DISABLED:'1',CUSTOM_DOMAINS_ENABLED:'true',PLATFORM_HOSTS:'thsoft.co.kr,www.thsoft.co.kr',ADMIN_ACCESS_TOKEN:'test-session',SUPABASE_URL:`http://127.0.0.1:${dbPort}`,NEXT_PUBLIC_SUPABASE_URL:`http://127.0.0.1:${dbPort}`,SUPABASE_SERVICE_ROLE_KEY:'test-service',NEXT_PUBLIC_SUPABASE_ANON_KEY:'test-anon'}
 });
 app.stdout.on('data',c=>logs.push(String(c)));app.stderr.on('data',c=>logs.push(String(c)));
 const call=(url,host='thsoft.co.kr',options={})=>new Promise((resolve,reject)=>{
  const req=http.request({hostname:'127.0.0.1',port,path:url,method:options.method||'GET',headers:{host,...options.headers}},res=>{
   const chunks=[];res.on('data',chunk=>chunks.push(chunk));res.on('end',()=>resolve(new Response([204,304].includes(res.statusCode)?null:Buffer.concat(chunks),{status:res.statusCode,headers:res.headers})));
  });req.on('error',reject);req.end(options.body);
 });
 try{
  let ready=false;for(let i=0;i<80;i++){try{await call('/');ready=true;break;}catch{await new Promise(r=>setTimeout(r,250));}}
  assert.ok(ready,logs.join(''));
  const home=await call('/');assert.equal(home.status,200);assert.match(await home.text(),/NEXIA/);
  const builder=await call('/builder');assert.equal(builder.status,307);
  assert.equal((await call('/builder','thsoft.co.kr',{headers:{cookie:'nexia_admin_session=test-session'}})).status,200);
  assert.equal((await call('/pay')).status,200);
  let page=await call('/','medinsure.thsoft.co.kr');assert.equal(page.status,200);let html=await page.text();
  assert.match(html,/MEDIN FIXTURE/);assert.doesNotMatch(html,/OTHER FIXTURE/);assert.doesNotMatch(html,/© 2026 TH SOFT/);
  assert.match(html,/https:\/\/medinsure.thsoft.co.kr/);assert.match(page.headers.get('cache-control'),/no-store/);
  const other=await call('/','other.thsoft.co.kr');assert.match(await other.text(),/OTHER FIXTURE/);
  const koreanId = encodeURIComponent('기업형');
  assert.equal((await call(`/preview/${koreanId}`)).status, 200);
  const koreanPublic = await call(`/api/public-site?siteId=${koreanId}`);
  assert.equal((await koreanPublic.json()).company.name, 'OTHER FIXTURE');
  const koreanAdmin = await call(`/api/manage/sites?siteId=${koreanId}`, 'thsoft.co.kr', {headers:{cookie:'nexia_admin_session=test-session'}});
  assert.equal(koreanAdmin.status, 200);
  assert.equal((await koreanAdmin.json()).data[0].id, '기업형');
  const browserModule=process.env.PLAYWRIGHT_MODULE_PATH || path.join(__dirname,'../.test-tools/node_modules/playwright-core');
  if(fs.existsSync(browserModule)){
    const {chromium}=require(browserModule);
    const browser=await chromium.launch({executablePath:process.env.TEST_BROWSER_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--no-proxy-server','--host-resolver-rules=MAP *.thsoft.co.kr 127.0.0.1, MAP thsoft.co.kr 127.0.0.1']});
    try{
      for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
        const context=await browser.newContext({viewport});
        await context.route('**/*',route=>{const h=new URL(route.request().url()).hostname;return h.endsWith('.thsoft.co.kr')?route.continue():route.abort();});
        const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
        await page.goto(`http://medinsure.thsoft.co.kr:${port}/`,{waitUntil:'networkidle'});
        assert.equal(await page.title(),'MEDIN FIXTURE');
        assert.equal(await page.getByRole('button',{name:'회사소개',exact:true}).count(),0);
        await page.getByRole('button',{name:'고객센터',exact:true}).click();
        assert.equal(new URL(page.url()).pathname,'/');
        await page.getByRole('button',{name:'홈으로 이동',exact:true}).click();
        await page.getByRole('heading',{name:'MEDIN FIXTURE',exact:true}).waitFor();
        await page.waitForFunction(()=>{const heading=document.querySelector('h1');return heading?.textContent.includes('MEDIN FIXTURE')&&Number(getComputedStyle(heading).opacity)>.99;});
        await page.waitForFunction(()=>[...document.images].some(img=>img.naturalWidth>0));
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'horizontal overflow');
        assert.equal(await page.locator('body').getByText('© 2026 TH SOFT. All rights reserved.').count(),0);
        assert.deepEqual(errors,[]);
        if(process.env.TEST_SCREENSHOT_DIR){fs.mkdirSync(process.env.TEST_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.TEST_SCREENSHOT_DIR,`domain-${viewport.width}.png`),fullPage:true});}
        await context.close();
      }
      const context=await browser.newContext();
      await context.addCookies([{url:`http://thsoft.co.kr:${port}`,name:'nexia_admin_session',value:'test-session'}]);
      const page=await context.newPage();page.on('dialog',dialog=>dialog.accept());
      await page.goto(`http://thsoft.co.kr:${port}/preview/${encodeURIComponent('피트니스')}`);
      await page.getByRole('heading',{name:'LOCAL YOGA CLASS',exact:true}).waitFor();
      await page.goto(`http://thsoft.co.kr:${port}/builder`,{waitUntil:'networkidle'});
      const publication = page.getByRole('region', { name: '공개 설정' });
      await publication.getByText('사용자 지정 도메인 관리', { exact: true }).click();
      await publication.getByPlaceholder('medinsure.co.kr').waitFor();
      const image = { name: 'background.gif', mimeType: 'image/gif', buffer: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64') };
      const uploaded = ['/globe.svg', '/missing-logo.svg', '/window.svg'];
      await page.route('**/api/images/upload', async route => {
        assert.match(route.request().headers()['content-type'], /multipart\/form-data/);
        await route.fulfill({ json: { url: uploaded.shift(), srcSet: null } });
      });
      const fileChooser = page.waitForEvent('filechooser');
      await page.getByRole('button', { name: '메인 배경 이미지 파일 선택', exact: true }).click();
      await (await fileChooser).setFiles(image);
      await page.locator('#corporate-viewer-root img[src="/globe.svg"]').waitFor();
      await page.getByRole('checkbox', { name: '스크롤에 따라 배경 이동' }).check();
      const background = page.locator('#corporate-viewer-root [data-background-scroll="true"]');
      await background.waitFor();
      assert.equal(await background.evaluate(el => getComputedStyle(el).animationName), 'hero-background-drift');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await background.evaluate(el => getComputedStyle(el).animationName), 'none');
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.getByRole('button', { name: '회사 소개', exact: true }).click();
      const logoPicker = page.locator('input[type="file"][aria-label="회사 로고 (페이지 상단 메뉴 왼쪽)"]');
      await logoPicker.setInputFiles(image);
      await page.waitForFunction(() => [...document.images].some(img => img.getAttribute('src') === '/missing-logo.svg' && img.complete));
      await logoPicker.setInputFiles(image);
      const logo = page.locator('#corporate-viewer-root header img[src="/window.svg"]');
      await logo.waitFor();
      await page.waitForFunction(() => document.querySelector('#corporate-viewer-root header img[src="/window.svg"]')?.naturalWidth > 0);
      const saved=page.waitForResponse(r=>r.url().includes('/api/manage/sites')&&r.request().method()==='POST');
      await publication.getByRole('button',{name:'임시 저장',exact:true}).click();
      const savedResponse = await saved;
      assert.equal(savedResponse.status(),200);
      const savedData = savedResponse.request().postDataJSON().data;
      assert.equal(savedData.hero.mediaUrl, '/globe.svg');
      assert.equal(savedData.hero.backgroundScroll, true);
      assert.equal(savedData.company.logoUrl, '/window.svg');
      const published=page.waitForResponse(r=>r.url().includes('/api/manage/sites')&&r.request().method()==='POST');
      await page.getByRole('button',{name:'저장·발행',exact:true}).click();assert.equal((await published).status(),200);
      await context.close();
    }finally{await browser.close();}
  } else { console.log('Browser checks skipped: run npm run test:setup to install playwright-core.'); }
  assert.equal((await call('/','unmapped.thsoft.co.kr')).status,404);
  for(const url of ['/builder','/pay','/preview/other','/api/public-site?siteId=other'])assert.equal((await call(url,'medinsure.thsoft.co.kr')).status,404,url);
  assert.equal((await call('/api/manage/sites','thsoft.co.kr',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status,401);
  const manage=async(action,newData)=>{
   const r=await call('/api/manage/sites','thsoft.co.kr',{method:'POST',headers:{origin:'https://thsoft.co.kr',cookie:'nexia_admin_session=test-session','Content-Type':'application/json'},body:JSON.stringify({siteId:'medinsure',action,data:newData,templateType:'corporate'})});
   assert.equal(r.status,200,await r.text());
  };
  await manage('save',data('PRIVATE DRAFT'));
  html=await(await call('/','medinsure.thsoft.co.kr')).text();assert.match(html,/MEDIN FIXTURE/);assert.doesNotMatch(html,/PRIVATE DRAFT/);
  await manage('publish',data('MEDIN UPDATED'));
  html=await(await call('/','medinsure.thsoft.co.kr')).text();assert.match(html,/MEDIN UPDATED/);
  assert.match(await(await call('/','other.thsoft.co.kr')).text(),/OTHER FIXTURE/);
  await manage('unpublish');assert.equal((await call('/','medinsure.thsoft.co.kr')).status,404);
  assert.equal((await call('/api/public-site?siteId=medinsure')).status,404);
  const css=[...html.matchAll(/href="([^"]+\.css[^\"]*)"/g)].map(m=>m[1]);assert.ok(css.length>0);
  assert.equal((await call(css[0],'medinsure.thsoft.co.kr')).status,200);
  assert.ok(requests.includes('/rest/v1/rpc/manage_builder_site'));
 }finally{
  app.kill();await new Promise(resolve=>app.once('exit',resolve));await new Promise(resolve=>fixture.close(resolve));await db.close();
  fs.mkdirSync(path.join(__dirname,'../.test-build'),{recursive:true});fs.writeFileSync(path.join(__dirname,'../.test-build/http-server.log'),logs.join(''));
 }
});
