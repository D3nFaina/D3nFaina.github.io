import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
base0=Image.open('can_clean.png').convert('RGBA')
base=Image.new('RGBA',base0.size,(0,0,0,0))
F='fonts/lobster-two/files/lobster-two-latin-700-normal.woff'
INTB='/usr/share/fonts/opentype/inter/Inter-Bold.otf'
INTS='/usr/share/fonts/opentype/inter/Inter-SemiBold.otf'
WHITE=(250,247,245,255)
def stamp(img, text, font, center, angle, fill=WHITE, stroke=0):
    tmp=Image.new('RGBA',(1400,400),(0,0,0,0)); d=ImageDraw.Draw(tmp)
    d.text((700,200),text,font=font,fill=fill,anchor='mm',stroke_width=stroke,stroke_fill=fill)
    bb=tmp.getbbox(); tmp=tmp.crop(bb)
    tmp=tmp.rotate(angle,resample=Image.BICUBIC,expand=True)
    img.alpha_composite(tmp,(int(center[0]-tmp.width/2),int(center[1]-tmp.height/2)))
    return bb
def fit(text,fontpath,width):
    s=100
    while True:
        f=ImageFont.truetype(fontpath,s); w=f.getbbox(text)[2]-f.getbbox(text)[0]
        if w>width: return ImageFont.truetype(fontpath,s-1)
        s+=1
import sys
cfg=dict(name_w=int(sys.argv[1]) if len(sys.argv)>1 else 400, nx=462, ny=398, ang=11)
f=fit('D. Fainozzi',F,cfg['name_w'])
stamp(base,'D. Fainozzi',f,(cfg['nx'],cfg['ny']),cfg['ang'],stroke=2)
# Est.1993, same slant as the original
fe=ImageFont.truetype(INTS,32)
stamp(base,'Est.1993',fe,(588,436),20)
# wrap the flat label layer around the cylinder: screen x = cx + R sin((u - cx)/R)
import numpy as np
L=np.asarray(base).astype(float); out=np.zeros_like(L)
cxc,R=479,236
xs=np.arange(L.shape[1])
v=np.clip((xs-cxc)/R,-0.999,0.999)
u=cxc+R*np.arcsin(v)
u0=np.clip(np.floor(u).astype(int),0,L.shape[1]-2); fr_=(u-u0)[None,:,None]
out=L[:,u0]*(1-fr_)+L[:,u0+1]*fr_
lay=Image.fromarray(np.clip(out,0,255).astype(np.uint8),'RGBA')
base=Image.new('RGBA',base0.size,(0,0,0,0)); base.alpha_composite(lay)

# badge number
fn=ImageFont.truetype(INTB,104)
stamp(base,'42',fn,(404,588),0)
# ring text along the badge ellipse, letters' tops toward the centre
cx,cy,rx,ry=408,590,99,77
text='AUTHENTIC BLEND OF 42 CHROMOSOMES'
fr=ImageFont.truetype(INTB,15)
# measure advance per char, distribute along arc from theta0 down to theta1
th0,th1=math.radians(208),math.radians(-28)
# arc-length parametrisation
N=2000; ts=[th0+(th1-th0)*i/N for i in range(N+1)]
pts=[(cx+rx*math.cos(t),cy+ry*math.sin(t)) for t in ts]
L=[0]
for i in range(1,len(pts)): L.append(L[-1]+math.dist(pts[i],pts[i-1]))
adv=[fr.getlength(c)+1.1 for c in text]; tot=sum(adv)
start=(L[-1]-tot)/2; pos=start
import bisect
for c,w in zip(text,adv):
    s=pos+w/2; i=min(bisect.bisect_left(L,s),N); t=ts[i]
    x,y=cx+rx*math.cos(t),cy+ry*math.sin(t)
    dx,dy=rx*math.sin(t),-ry*math.cos(t)
    ang=math.degrees(math.atan2(dy,dx))
    if c!=' ':
        tmp=Image.new('RGBA',(60,60),(0,0,0,0)); ImageDraw.Draw(tmp).text((30,30),c,font=fr,fill=WHITE,anchor='mm')
        tmp=tmp.rotate(-ang,resample=Image.BICUBIC)
        base.alpha_composite(tmp,(int(x-30),int(y-30)))
    pos+=w
print('arc',round(L[-1]),'text',round(tot), 'font', f.size)

# light the label like the can: darker towards the edges, as the original white is
ref=np.asarray(base0.convert('L')).astype(float)[760:860].mean(0)
inside=ref>40
prof=np.where(inside,ref,0); prof=np.convolve(prof,np.ones(61)/61,'same'); prof=prof/prof.max()
fac=np.clip(0.74+0.3*prof,0.7,1.0)
O=np.asarray(base).astype(float); O[...,:3]*=fac[None,:,None]
res=base0.copy(); res.alpha_composite(Image.fromarray(np.clip(O,0,255).astype(np.uint8),'RGBA'))
res.convert('RGB').save('can_new.png')
