import json
from pathlib import Path
import pypdfium2 as pdfium
from PIL import Image,ImageDraw
root=Path(__file__).parent
report=[]
for folder in root.glob('course-*'):
 for file in (folder/'documents').glob('*.pdf'):
  out=root/'quality-reports'/folder.name/file.stem;out.mkdir(parents=True,exist_ok=True)
  pdf=pdfium.PdfDocument(file);thumbs=[]
  for i,page in enumerate(pdf):
   im=page.render(scale=1.3).to_pil();im.save(out/f'page-{i+1:02}.png');thumb=im.copy();thumb.thumbnail((310,420));thumbs.append(thumb)
  sheet=Image.new('RGB',(310*3,450*((len(thumbs)+2)//3)),'#dddddd');d=ImageDraw.Draw(sheet)
  for i,im in enumerate(thumbs):sheet.paste(im,((i%3)*310,(i//3)*450));d.text(((i%3)*310+5,(i//3)*450+423),str(i+1),fill='black')
  sheet.save(out/'contact.png');report.append(dict(file=str(file.relative_to(root)),pages=len(pdf),renderer='Microsoft Word PDF export; PDFium rasterization'))
(root/'quality-reports/document-render.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
