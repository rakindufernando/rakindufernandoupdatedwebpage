import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import worker from '../dist/server/index.js';
const config = JSON.parse(await readFile(new URL('../app/lib/site-config.json', import.meta.url), 'utf8'));
const projects = JSON.parse(await readFile(new URL('../app/portfolio-data.json', import.meta.url), 'utf8'));
const slugs=['ui-ux-design','software-development','graphic-design','videography','photography'];
const types=['UI/UX Design','Software Development','Graphic Design','Videography','Photography'];
const paths=['/',...slugs.map(s=>`/work/${s}`)];
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}};
const ctx={waitUntil(){},passThroughOnException(){}};
const render=path=>worker.fetch(new Request(`https://untrusted-preview.example${path}`,{headers:{accept:'text/html'}}),env,ctx);
const graphs=html=>[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(m=>JSON.parse(m[1])['@graph']);

test('all canonical pages have unique metadata, semantic headings and valid connected JSON-LD',async()=>{
  const titles=new Set(), descriptions=new Set();
  for(const path of paths){
    const response=await render(path); assert.equal(response.status,200);
    const html=await response.text();
    const title=html.match(/<title>(.*?)<\/title>/s)?.[1]; assert.ok(title?.includes('Rakindu Fernando'));titles.add(title);
    const description=html.match(/<meta name="description" content="([^"]+)"/)?.[1];assert.ok(description);descriptions.add(description);
    const canonicals=[...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(m=>m[1]);
    assert.deepEqual(canonicals,[config.url+path]);
    assert.ok(html.includes(`property="og:url" content="${config.url+path}"`));
    assert.match(html,/name="twitter:card" content="summary_large_image"/);
    assert.match(html,/property="og:image"/);
    assert.match(html,/name="robots" content="index, follow"/);
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
    const data=graphs(html);const person=data.find(x=>x['@type']==='Person');
    assert.equal(person.name,'Rakindu Fernando');assert.equal(person.alternateName,'Rakindu Ferando');
    assert.ok(person.sameAs.includes('https://github.com/rakindufernando'));
    assert.ok(data.some(x=>x['@type']==='WebSite'));
    if(path!=='/'){
      const index=slugs.indexOf(path.split('/').pop());
      const expected=projects.filter(p=>p.category===types[index]);
      const works=data.filter(x=>['CreativeWork','SoftwareSourceCode'].includes(x['@type']));
      assert.deepEqual(works.map(x=>x.identifier),expected.map(x=>x.id));
      assert.ok(data.some(x=>x['@type']==='BreadcrumbList'));
      for(const p of expected){
        const work=works.find(w=>w.identifier===p.id);assert.equal(work.description,p.description);
        assert.deepEqual(work.image,p.images.map(src=>config.url+src));
        if(p.category==='Software Development')assert.equal(work['@type'],'SoftwareSourceCode');
      }
    }
  }
  assert.equal(titles.size,paths.length);assert.equal(descriptions.size,paths.length);
});

test('sitemap and robots expose exactly the six indexable canonical pages',async()=>{
  const xmlResponse=await render('/sitemap.xml');assert.equal(xmlResponse.status,200);
  const xml=await xmlResponse.text();
  assert.deepEqual([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]),paths.map(p=>config.url+p));
  const robots=await render('/robots.txt');assert.equal(robots.status,200);
  const text=await robots.text();assert.match(text,/Allow: \//);assert.ok(text.includes(`Sitemap: ${config.url}/sitemap.xml`));assert.doesNotMatch(text,/Disallow: \/\s/);
});

test('manifest icons exist and error pages are excluded from indexing',async()=>{
  const response=await render('/manifest.webmanifest');assert.equal(response.status,200);
  const manifest=await response.json();assert.equal(manifest.start_url,'/');
  for(const icon of manifest.icons) await access(new URL('../public'+icon.src,import.meta.url));
  for(const path of ['/work/invalid-category','/missing-page']){
    const r=await render(path);assert.equal(r.status,404);const html=await r.text();
    const robotTags = [...html.matchAll(/<meta[^>]+>/g)].map(m=>m[0]).filter(tag=>tag.includes('name="robots"'));
    assert.ok(robotTags.some(tag=>tag.includes('noindex')),'404 must be noindex');
    assert.ok(!robotTags.some(tag=>/content="index[,"]/.test(tag)),'404 must not also be indexable');
    assert.ok(html.includes('<title>Page not found | Rakindu Fernando</title>'));
    assert.doesNotMatch(html,/<link rel="canonical"/);
  }
});
