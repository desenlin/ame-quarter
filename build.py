"""Build a dependency-free static studio and a portable single-file review copy."""
from pathlib import Path
import json, zipfile, argparse

P=Path(__file__).resolve().parent
order=['layout','kit','lettering','facades','elevations','transit','traffic','roofs','terrace','life','shops','details','props','street','orbit','navigation','weather','environment','main']
parser=argparse.ArgumentParser()
parser.add_argument('--inline-output',type=Path)
args=parser.parse_args()
scene=P/'scene'
scene_fragment=(scene/'fragment.html').read_text()
scene_css=(scene/'style.css').read_text()
scene_code='\n'.join((scene/'src'/f'{name}.js').read_text() for name in order)
scene_head='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ame Quarter · District</title><style>html,body{margin:0;background:#17283b}</style></head><body>'
scene_styles='<style>'+scene_css+'\n#ame-district{height:100vh;max-height:none}</style>'
config='<script>window.AME_STUDIO_CONFIG={quality:"balanced"};</script>'
scene_bundle=scene_head+scene_fragment+scene_styles+config+'<script>/* '+(scene/'vendor/LICENSE-THREE.txt').read_text()+' */\n'+(scene/'vendor/three.min.js').read_text()+'</script><script>'+(scene/'vendor/Reflector.js').read_text()+'</script><script>'+scene_code+'</script></body></html>'
head='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ame Quarter | CRE studio</title><meta name="description" content="An interactive retail real estate studio: explore a six-shop plaza, read its hypothetical leases, and compare landlord leasing decisions."><style>html,body{margin:0}</style>'
shell=(P/'studio/shell.html').read_text()
css=(P/'studio/style.css').read_text()
code=(P/'studio/model.js').read_text()+'\n'+(P/'studio/app.js').read_text()
payload='<script id="cre-scene-source" type="application/json">'+json.dumps(scene_bundle,ensure_ascii=False).replace('<','\\u003c')+'</script>'
standalone=head+'<style>'+css+'</style></head><body>'+shell+payload+'<script>'+code+'</script></body></html>'
(P.parent/'ame-quarter-cre-studio.html').write_text(standalone)
# Production entry is modular: engine, geometry and textures load only on opening 3-D.
modular_app=(P/'studio/app.js').read_text()
(P/'studio/app.modular.js').write_text(modular_app)
modular_shell=shell.replace('<div id="cre-studio">','<div id="cre-studio" data-scene-url="scene/index.html">',1)
(P/'index.html').write_text(head+'<link rel="stylesheet" href="studio/style.css"></head><body>'+modular_shell+'<script src="studio/model.js"></script><script src="studio/app.modular.js"></script></body></html>')
scene_config='<script>window.AME_STUDIO_CONFIG={quality:new URLSearchParams(location.search).get("quality")||"balanced"};</script>'
(scene/'index.html').write_text(scene_head+scene_fragment+scene_styles+scene_config+'<script src="vendor/three.min.js"></script><script src="vendor/Reflector.js"></script>'+''.join('<script src="src/'+name+'.js"></script>' for name in order)+'</body></html>')
if args.inline_output:
    fragment=shell+'<style>'+css+'</style>'+payload+'<script>'+code+'</script>'
    assert len(fragment.encode())<1_000_000,'Inline preview exceeds 1 MB'
    args.inline_output.write_text(fragment)
with zipfile.ZipFile(P.parent/'ame-quarter-cre-studio-project.zip','w',zipfile.ZIP_DEFLATED) as z:
    for f in sorted(P.rglob('*')):
        if f.is_file() and not any(x in f.parts for x in ['.git','__pycache__','qa-output']):
            z.write(f,Path('ame-quarter')/f.relative_to(P))
print(json.dumps({'standalone_bytes':len(standalone.encode()),'scene_bundle_bytes':len(scene_bundle.encode()),'index_bytes':(P/'index.html').stat().st_size,'project_zip_bytes':(P.parent/'ame-quarter-cre-studio-project.zip').stat().st_size}))
