from PIL import Image, ImageDraw, ImageFont
import os, subprocess, textwrap
W,H=1280,720
font='/usr/share/fonts/truetype/noto/NotoSansArabicUI-Regular.ttf'
bold='/usr/share/fonts/truetype/noto/NotoSansArabicUI-Bold.ttf'
out='/mnt/data/finalwork/videos'; os.makedirs(out,exist_ok=True)
stories=[
('آدم عليه السلام','طاعة الله والتوبة','سورة طه 115–123','الله سبحانه ذكر قصة آدم، ثم علّمنا أن التوبة والرجوع إليه من أسباب الهداية.'),
('نوح عليه السلام','الصبر والثبات','سورة هود 36–49','أمر الله نوحًا ببناء السفينة، وصبر على أمر ربه حتى جاء وعد الله.'),
('إبراهيم عليه السلام','التوحيد والثبات على الحق','سورة الأنبياء 51–70','أقام إبراهيم عليه السلام الحجة على قومه وثبت على التوحيد، فنجاه الله من النار.'),
('إسماعيل عليه السلام','الطاعة والوفاء','سورة الصافات 100–111','أثنى الله على إسماعيل عليه السلام ووصفه بصدق الوعد، وقصة الابتلاء تعلم الطاعة والصبر.'),
('يوسف عليه السلام','الصبر والعفو','سورة يوسف 4–101','مر يوسف عليه السلام بابتلاءات كثيرة، ثم مكّنه الله، وعفا عن إخوته ولم يجعل النعمة سببًا للانتقام.'),
('موسى عليه السلام','الثقة بالله والشجاعة','سورة طه 9–98','قص الله خبر موسى عليه السلام، وأراه آياته، وعلّمه أن معية الله ونصره حق.'),
('يونس عليه السلام','الدعاء والرجوع إلى الله','سورة الأنبياء 87–88','دعا يونس عليه السلام ربه في الكرب، فاستجاب الله له ونجّاه من الغم.'),
('أيوب عليه السلام','الصبر وحسن الرجاء','سورة الأنبياء 83–84','دعا أيوب عليه السلام ربه وهو في البلاء، فاستجاب الله له وكشف ما به من ضر.'),
('داود عليه السلام','العدل وشكر النعمة','سورة ص 17–26','آتَى الله داود الملك والحكمة، وأمره بالحكم بالحق والعدل بين الناس.'),
('سليمان عليه السلام','شكر النعمة','سورة النمل 15–44','علّم الله سليمان منطق الطير وسخّر له من فضله، وكان من هديه شكر النعمة وردّ الفضل إلى الله.'),
('عيسى عليه السلام','الإيمان بالله والطاعة','سورة آل عمران 45–51','ذكر القرآن عيسى عليه السلام عبدًا ورسولًا، ودعا إلى عبادة الله وحده.'),
('محمد ﷺ','الرحمة وحسن الخلق','سورة القلم 4 • سورة الأحزاب 21','وصف الله نبيه ﷺ بعظيم الخلق، وجعله أسوة حسنة للمؤمنين.'),
]
def make_slide(path,title,subtitle,body=None):
    im=Image.new('RGB',(W,H),(17,66,54)); d=ImageDraw.Draw(im)
    # subtle geometric bands
    d.rectangle((0,0,W,16),fill=(196,160,80)); d.rectangle((0,H-16,W,H),fill=(196,160,80))
    ftitle=ImageFont.truetype(bold,58); fsub=ImageFont.truetype(font,36); fbody=ImageFont.truetype(font,31)
    def center(txt,y,f):
        box=d.textbbox((0,0),txt,font=f, direction='rtl', language='ar'); tw=box[2]-box[0]
        d.text(((W-tw)//2,y),txt,font=f,fill=(245,239,218),direction='rtl',language='ar')
    center(title,120,ftitle); center(subtitle,220,fsub)
    if body:
        lines=[]
        for part in textwrap.wrap(body, width=44): lines.append(part)
        y=330
        for line in lines: center(line,y,fbody); y+=48
    return im
for idx,(name,lesson,source,body) in enumerate(stories,1):
    sdir=f'/mnt/data/finalwork/tmp_story_{idx}'; os.makedirs(sdir,exist_ok=True)
    slides=[
        make_slide(f'{sdir}/1.png',name,'عالم الأطفال • قصة من القرآن والسنة'),
        make_slide(f'{sdir}/2.png','المصدر الشرعي',source,'لا نضيف أحداثًا خيالية ولا نصوّر الأنبياء أو الغيب.'),
        make_slide(f'{sdir}/3.png','ما نتعلمه',lesson,body),
    ]
    for j,im in enumerate(slides,1): im.save(f'{sdir}/{j}.png')
    mp4=f'{out}/story_{idx:02d}.mp4'
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','1/3','-i',f'{sdir}/%d.png','-c:v','libx264','-pix_fmt','yuv420p','-r','24','-movflags','+faststart',mp4],check=True)
    subprocess.run(['rm','-rf',sdir])
print('created',len(stories),'videos')
