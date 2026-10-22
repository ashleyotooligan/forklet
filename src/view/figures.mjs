import {C,text,rule,disc,series} from './ink.mjs';
import {ACTIONS} from '../core/config.mjs';
export function probabilityRows(c,frame,x,y,w,color){frame.probabilities.forEach((p,i)=>{const yy=y+i*94;text(c,ACTIONS[i].toUpperCase(),x,yy,15,C.muted,'mono');c.fillStyle=color+'22';c.fillRect(x,yy+31,w-103,18);c.fillStyle=color;c.fillRect(x,yy+31,(w-103)*p,18);text(c,(p*100).toFixed(1)+'%',x+w-83,yy+25,20,color,'mono');if(frame.action===i)disc(c,x-18,yy+39,5,color);});}
export function radar(c,values,cx,cy,r,color){
 for(let i=0;i<8;i++){const a=-Math.PI/2+i*Math.PI/4,xx=cx+Math.cos(a)*r,yy=cy+Math.sin(a)*r;rule(c,cx,cy,xx,yy,'#75829955');text(c,'h'+i,xx+(xx<cx?-27:7),yy-9,15,'#c9d1df','mono');}
 c.beginPath();values.forEach((v,i)=>{const a=-Math.PI/2+i*Math.PI/4,rr=(v+1)/2*r,xx=cx+Math.cos(a)*rr,yy=cy+Math.sin(a)*rr;i?c.lineTo(xx,yy):c.moveTo(xx,yy);});c.closePath();c.fillStyle=color+'55';c.fill();c.strokeStyle=color;c.lineWidth=3;c.stroke();disc(c,cx,cy,3,'#c9d1df');
}
export function film(c,frames,x,y,w,color){const labels=['ADD','HOLD','REDUCE'];labels.forEach((label,i)=>{text(c,label,x-89,y+i*54-8,12,C.muted,'mono');rule(c,x,y+i*54,x+w,y+i*54,C.line);});frames.forEach((f,i)=>{const xx=x+i*w/Math.max(1,frames.length-1),yy=y+f.action*54;disc(c,xx,yy,4.4,color);});}
export function splitPath(c,x,y,x2,y2,color){c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x,y+(y2-y)*.48,x2,y+(y2-y)*.48,x2,y2);c.strokeStyle=color;c.lineWidth=7;c.stroke();}
