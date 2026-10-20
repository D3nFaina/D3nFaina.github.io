import sys, pickle, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
im=Image.open('can.jpg').convert('RGB'); a=np.asarray(im).astype(float)
lab=np.load('lab.npy'); info=pickle.load(open('info.pkl','rb'))
keep={1,2,3,20,21,22,23}
erase=np.zeros(lab.shape,bool)
for k,v in info.items():
    if k in keep: continue
    if v[0]>=20: erase|=(lab==k)
# also tiny specks inside the text area (between letters) only if inside Pepper/Est/badge boxes
m=Image.fromarray(erase.astype(np.uint8)*255).filter(ImageFilter.MaxFilter(7))
M=np.asarray(m)>0
# protect kept strokes from the dilation
kept=np.isin(lab,list(keep))
kept_d=np.asarray(Image.fromarray(kept.astype(np.uint8)*255).filter(ImageFilter.MaxFilter(3)))>0
M&=~kept_d
y0,y1,x0,x1=150,720,240,720
sub=a[y0:y1,x0:x1].copy(); mm=M[y0:y1,x0:x1]
# also exclude kept strokes as sources (white): treat them as unknown for sampling but don't overwrite
src_bad=kept_d[y0:y1,x0:x1]
known=~mm & ~src_bad
fill=sub.copy()
# init with column median of known pixels
for x in range(sub.shape[1]):
    col=sub[known[:,x],x]
    if len(col): fill[mm[:,x],x]=np.median(col,axis=0)
for it in range(500):
    up=np.roll(fill,1,0); dn=np.roll(fill,-1,0); lf=np.roll(fill,1,1); rt=np.roll(fill,-1,1)
    w_up=np.roll(known|mm,1,0); w_dn=np.roll(known|mm,-1,0); w_lf=np.roll(known|mm,1,1); w_rt=np.roll(known|mm,-1,1)
    num=up*w_up[...,None]+dn*w_dn[...,None]+lf*w_lf[...,None]+rt*w_rt[...,None]
    den=(w_up.astype(float)+w_dn+w_lf+w_rt)[...,None]
    avg=num/np.maximum(den,1)
    fill[mm]=avg[mm]
rng=np.random.default_rng(1)
fill[mm]+=rng.normal(0,2.2,(mm.sum(),1))
a[y0:y1,x0:x1]=fill
out=Image.fromarray(np.clip(a,0,255).astype(np.uint8))
out.save('can_clean.png')
