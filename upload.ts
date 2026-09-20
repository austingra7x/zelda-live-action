
import type { APIRoute } from 'astro';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
  const fd = await request.formData();
  const file = fd.get('file') as File;
  if(!file) return new Response(JSON.stringify({error:'No file'}),{status:400});
  const buf = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
  try{ await mkdir(path.join(process.cwd(),'public','uploads'),{recursive:true}); await writeFile(path.join(process.cwd(),'public','uploads',name), buf);}catch{}
  const b64 = `data:${file.type};base64,${buf.toString('base64')}`;
  return new Response(JSON.stringify({path:`/uploads/${name}`, base64:b64}),{headers:{'Content-Type':'application/json'}});
};
