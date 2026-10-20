import numpy as np
from PIL import Image, ImageFilter
S=2
ph=Image.open('wings_full.jpg').convert('RGB')
W0,H0=ph.size
ph=ph.resize((W0*S,H0*S),Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.5,50,2))
can=Image.open('can_new.png').convert('RGB').crop((239,0,720,960))
# can alpha from the black backdrop
ca=np.asarray(can).astype(int).max(2)
calpha=Image.fromarray(np.clip((ca-18)*12,0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
canw=int(120*S); scale=canw/can.width; canh=int(can.height*scale)
can=can.resize((canw,canh),Image.LANCZOS)
from PIL import ImageEnhance
can=ImageEnhance.Brightness(can).enhance(0.9); calpha=calpha.resize((canw,canh),Image.LANCZOS)
cx,top=342*S,388*S
H=max(H0*S, top+canh+10)
out=Image.new('RGBA',(W0*S,H),(0,0,0,0))
# photo with soft edges, fading out in every direction around Den
yy,xx=np.mgrid[0:H0*S,0:W0*S]
d=np.sqrt(((xx-cx)/(300*S))**2+((yy-285*S)/(235*S))**2)
fade=np.clip((1.0-d)/0.5,0,1)**1.6
pa=Image.fromarray((fade*255).astype(np.uint8))
p=ph.convert('RGBA'); p.putalpha(pa)
out.alpha_composite(p,(0,0))
# the can over his legs
cl=can.convert('RGBA'); cl.putalpha(calpha)
out.alpha_composite(cl,(cx-canw//2,top))
# his shirt again over the back of the rim, so he sits inside the can
g=np.asarray(ph.convert('L')).astype(int)
band=np.zeros_like(g,dtype=np.uint8)
rows=np.asarray(can.convert('L')).astype(float)[:40].mean(1); rim=[i for i,v in enumerate(rows) if v>120]; print('rim rows',rim[:1],rim[-1:])
y0,y1=top-4*S, top+(rim[0]+rim[-1])//2 if rim else top+6
band[y0:y1, cx-45*S:cx+45*S]=(g[y0:y1, cx-45*S:cx+45*S]<26)*255
bm=Image.fromarray(band).filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(0.7))
# fade the overlay towards the bottom of the band so it melts into the can
bmn=np.asarray(bm).astype(float)
ramp=np.ones(bmn.shape[0]); ramp[y0:y1]=1
bmn=(bmn*ramp[:,None]).astype(np.uint8)
t=ph.convert('RGBA'); t.putalpha(Image.fromarray(bmn))
tt=Image.new('RGBA',out.size,(0,0,0,0)); tt.paste(t,(0,0)); out.alpha_composite(tt)
# a soft shadow of his body on the can, just under the front lip
sh=np.zeros((out.size[1],out.size[0]),np.float32)
lip=y1+3*S
for k in range(14*S):
    sh[lip+k, cx-34*S:cx+34*S]=0.35*(1-k/(14*S))
sh=Image.fromarray((sh*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))
shadow=Image.new('RGBA',out.size,(20,0,4,0)); shadow.putalpha(Image.fromarray(np.minimum(np.asarray(sh),np.asarray(out.getchannel('A')))))
out.alpha_composite(shadow)
bb=out.getbbox(); out=out.crop(bb); print(out.size, bb)
out.save('den-can.png')
out.save('den-can.webp',quality=86,method=6)
prev=Image.new('RGBA',out.size,(38,38,43,255)); prev.alpha_composite(out); prev.convert('RGB').save('den-can-prev.jpg',quality=85)
