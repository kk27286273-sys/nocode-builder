const {spawnSync}=require('node:child_process');const path=require('node:path');
const result=spawnSync(process.execPath,[path.join(__dirname,'../node_modules/next/dist/bin/next'),'build','--webpack'],{
 cwd:path.join(__dirname,'..'),stdio:'inherit',windowsHide:true,
 env:{...process.env,NEXT_TELEMETRY_DISABLED:'1',NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:54329',NEXT_PUBLIC_SUPABASE_ANON_KEY:'test-anon',SUPABASE_URL:'http://127.0.0.1:54329',SUPABASE_SERVICE_ROLE_KEY:'test-service'}
});
process.exit(result.status??1);
