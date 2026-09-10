import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,r as n}from"./mermaid-parser.core-Cn98guqZ.js";import{n as r,r as i}from"./chunk-Y2CYZVJY-C0ErJKbO.js";import{C as a,w as o}from"./src-CcHa7DV-.js";import{D as s,U as c,W as l,a as u,b as d,c as f,f as p,j as m,q as h,v as g,w as _,y as v}from"./chunk-DU6HZSFF-Czhxwst6.js";import{d as y,i as b}from"./chunk-75Z2AOVW-DHfGUNkD.js";import{n as x,t as S}from"./chunk-JWPE2WC7-fSzem9U5.js";import{_ as C,v as w}from"./playground.stories-DsF89XGQ.js";function T(e){let t=e+1831565813|0;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function E(e){let t=0;for(let n=0;n<e.length;n++){let r=e.charCodeAt(n);t=(t<<5)-t+r,t|=0}return t}function D(e,t){return typeof e==`number`&&Number.isFinite(e)&&e!==0?e:E(t)}function O(e,t,n,r){let i=e/2,a=r??e*.015,o=t/7,s=[];for(let e=0;e<=7;e++){let t=T(n+e*17)*a*2-a;s.push({x:i+t,y:e*o})}let c=`M${s[0].x},${s[0].y}`;for(let e=0;e<s.length-1;e++){let t=s[e],r=s[e+1],i=(t.y+r.y)/2,o=e%2==0?1:-1,l=a*1.5*o*T(n+e*31+7),u=t.x+l,d=i,f=r.x-l;c+=` C${u},${d} ${f},${i} ${r.x},${r.y}`}return c}function k(e,t,n,r){let i=t/2,a=r??t*.015,o=e/7,s=[];for(let e=0;e<=7;e++){let t=T(n+e*23)*a*2-a;s.push({x:e*o,y:i+t})}let c=`M${s[0].x},${s[0].y}`;for(let e=0;e<s.length-1;e++){let t=s[e],r=s[e+1],i=(t.x+r.x)/2,o=e%2==0?1:-1,l=a*1.5*o*T(n+e*37+11),u=i,d=t.y+l,f=i,p=r.y-l;c+=` C${u},${d} ${f},${p} ${r.x},${r.y}`}return c}function A(e,t){let n=e/2,r=t*.5,i=t,a=e*.03;return[`M${n},${r}`,`C${n+a},${r+(i-r)*.2}`,`${n-a*1.5},${r+(i-r)*.55}`,`${n+a*.5},${r+(i-r)*.75}`,`C${n-a},${r+(i-r)*.85}`,`${n+a*.3},${r+(i-r)*.95}`,`${n},${i}`].join(` `)}function j(e,t,n,r){return[`M${e-n},${t}`,`A${n},${r} 0 1,1 ${e+n},${t}`,`A${n},${r} 0 1,1 ${e-n},${t}`,`Z`].join(` `)}var M,N,P,F,I,L,R,z,B,V,H,U;function W(){return(W=e((()=>{S(),C(),y(),m(),a(),i(),t(),M=r(()=>({domains:new Map,transitions:[]}),`createDefaultData`),N=M(),P={getDomains:r(()=>N.domains,`getDomains`),getTransitions:r(()=>N.transitions,`getTransitions`),setDomains:r(e=>{if(e)for(let t of e){let e=t.domain,n=(t.items??[]).map(e=>({label:e.label}));N.domains.set(e,{name:e,items:n})}},`setDomains`),setTransitions:r(e=>{e&&(N.transitions=e.filter(e=>e.from!==e.to||(o.warn(`Cynefin: self-loop transition on domain "${e.from}" is not meaningful and will be skipped.`),!1)).map(e=>({from:e.from,to:e.to,label:e.label||void 0})))},`setTransitions`),getConfig:r(()=>b({...p.cynefin,...d().cynefin}),`getConfig`),clear:r(()=>{u(),N=M()},`clear`),setAccTitle:l,getAccTitle:v,setDiagramTitle:h,getDiagramTitle:_,getAccDescription:g,setAccDescription:c},F=r(e=>{x(e,P),P.setDomains(e.domains),P.setTransitions(e.transitions)},`populate`),I={parse:r(async e=>{let t=await n(`cynefin`,e);o.debug(t),F(t)},`parse`)},r(T,`seededRandom`),r(E,`hashString`),r(D,`resolveSeed`),r(O,`generateFoldPath`),r(k,`generateHorizontalBoundary`),r(A,`generateCliffPath`),r(j,`generateConfusionPath`),L={complex:{model:`Probe → Sense → Respond`,practice:`Emergent Practices`},complicated:{model:`Sense → Analyse → Respond`,practice:`Good Practices`},clear:{model:`Sense → Categorise → Respond`,practice:`Best Practices`},chaotic:{model:`Act → Sense → Respond`,practice:`Novel Practices`},confusion:{model:``,practice:`Disorder`}},R=r((e,t)=>{let n=e/2,r=t/2;return{complex:{cx:n/2,cy:r/2,x:0,y:0,w:n,h:r},complicated:{cx:n+n/2,cy:r/2,x:n,y:0,w:n,h:r},chaotic:{cx:n/2,cy:r+r/2,x:0,y:r,w:n,h:r},clear:{cx:n+n/2,cy:r+r/2,x:n,y:r,w:n,h:r},confusion:{cx:n,cy:r,x:n*.7,y:r*.7,w:n*.6,h:r*.6}}},`getDomainLayouts`),z=r(()=>{let e=s(),t=d();return b(e,t.themeVariables).cynefin},`getCynefinDomainColors`),B=3,V={draw:r((e,t,n,r)=>{let i=r.db,a=i.getDomains(),s=i.getTransitions(),c=i.getDiagramTitle(),l=i.getAccTitle(),u=i.getAccDescription(),d=i.getConfig(),p=z();o.debug(`Rendering Cynefin diagram`);let m=d.width,h=d.height,g=d.padding,_=d.showDomainDescriptions,v=d.boundaryAmplitude,y=m+g*2,b=h+g*2,x={complex:p.complexBg,complicated:p.complicatedBg,clear:p.clearBg,chaotic:p.chaoticBg,confusion:p.confusionBg},S=w(t);f(S,b,y,d.useMaxWidth??!0),S.attr(`viewBox`,`0 0 ${y} ${b}`),l&&S.append(`title`).text(l),u&&S.append(`desc`).text(u);let C=S.append(`g`).attr(`transform`,`translate(${g}, ${g})`),T=R(m,h),E=D(d.seed,t),M=C.append(`g`).attr(`class`,`cynefin-backgrounds`),N=[`complex`,`complicated`,`chaotic`,`clear`];for(let e of N){let t=T[e];M.append(`rect`).attr(`class`,`cynefinDomain`).attr(`x`,t.x).attr(`y`,t.y).attr(`width`,t.w).attr(`height`,t.h).attr(`fill`,x[e]).attr(`fill-opacity`,.4).attr(`stroke`,`none`)}let P=C.append(`g`).attr(`class`,`cynefin-boundaries`);P.append(`path`).attr(`class`,`cynefinBoundary`).attr(`d`,O(m,h,E,v)).attr(`fill`,`none`),P.append(`path`).attr(`class`,`cynefinBoundary`).attr(`d`,k(m,h,E+100,v)).attr(`fill`,`none`),P.append(`path`).attr(`class`,`cynefinCliff`).attr(`d`,A(m,h)).attr(`fill`,`none`);let F=m*.15,I=h*.15;C.append(`path`).attr(`class`,`cynefinConfusion`).attr(`d`,j(m/2,h/2,F,I)).attr(`fill`,x.confusion).attr(`fill-opacity`,.5);let V=C.append(`g`).attr(`class`,`cynefin-labels`);for(let e of N){let t=T[e];V.append(`text`).attr(`class`,`cynefinDomainLabel`).attr(`x`,t.cx).attr(`y`,_?t.cy-30:t.cy).attr(`text-anchor`,`middle`).attr(`dominant-baseline`,`middle`).text(e.charAt(0).toUpperCase()+e.slice(1))}if(V.append(`text`).attr(`class`,`cynefinDomainLabel`).attr(`x`,m/2).attr(`y`,_?h/2-10:h/2).attr(`text-anchor`,`middle`).attr(`dominant-baseline`,`middle`).text(`Confusion`),_){let e=C.append(`g`).attr(`class`,`cynefin-subtitles`);for(let t of N){let n=T[t],r=L[t];e.append(`text`).attr(`class`,`cynefinSubtitle`).attr(`x`,n.cx).attr(`y`,n.cy-10).attr(`text-anchor`,`middle`).attr(`dominant-baseline`,`middle`).text(r.model),e.append(`text`).attr(`class`,`cynefinSubtitle`).attr(`x`,n.cx).attr(`y`,n.cy+5).attr(`text-anchor`,`middle`).attr(`dominant-baseline`,`middle`).text(r.practice)}e.append(`text`).attr(`class`,`cynefinSubtitle`).attr(`x`,m/2).attr(`y`,h/2+8).attr(`text-anchor`,`middle`).attr(`dominant-baseline`,`middle`).text(L.confusion.practice)}let H=C.append(`g`).attr(`class`,`cynefin-items`);for(let e of[`complex`,`complicated`,`chaotic`,`clear`,`confusion`]){let t=a.get(e);if(!t||t.items.length===0)continue;let n=T[e],r=e===`confusion`,i=t.items,o=0;r&&t.items.length>B&&(o=t.items.length-B,i=t.items.slice(0,B));let s;if(r){let e=_?22:14;s=n.cy+e}else s=n.cy+(_?25:15);if([...i].forEach((t,r)=>{let i=s+r*30,a=H.append(`g`),o=a.append(`text`).attr(`class`,`cynefinItemText`).attr(`x`,0).attr(`y`,13).attr(`text-anchor`,`middle`).attr(`dominant-baseline`,`central`).text(t.label),c=t.label.length*7,l=o.node();if(l&&typeof l.getBBox==`function`){let e=l.getBBox();e.width>0&&(c=e.width)}let u=c+20,d=n.cx-u/2;a.attr(`transform`,`translate(${d}, ${i})`),a.insert(`rect`,`text`).attr(`class`,`cynefinItem`).attr(`x`,0).attr(`y`,0).attr(`width`,u).attr(`height`,26).attr(`rx`,4).attr(`ry`,4).attr(`fill`,x[e]).attr(`fill-opacity`,.95),o.attr(`x`,u/2).attr(`y`,13)}),o>0){let t=s+i.length*30,r=`+${o} more`,a=H.append(`g`),c=a.append(`text`).attr(`class`,`cynefinItemText`).attr(`x`,0).attr(`y`,13).attr(`text-anchor`,`middle`).attr(`dominant-baseline`,`central`).text(r),l=r.length*7,u=c.node();if(u&&typeof u.getBBox==`function`){let e=u.getBBox();e.width>0&&(l=e.width)}let d=l+20,f=n.cx-d/2;a.attr(`transform`,`translate(${f}, ${t})`),a.insert(`rect`,`text`).attr(`class`,`cynefinItemOverflow`).attr(`x`,0).attr(`y`,0).attr(`width`,d).attr(`height`,26).attr(`rx`,4).attr(`ry`,4).attr(`fill`,x[e]).attr(`fill-opacity`,.6),c.attr(`x`,d/2).attr(`y`,13)}}if(s.length>0){let e=S.select(`defs`).empty()?S.append(`defs`):S.select(`defs`),n=`cynefin-arrow-${t}`;e.append(`marker`).attr(`id`,n).attr(`viewBox`,`0 0 10 10`).attr(`refX`,9).attr(`refY`,5).attr(`markerWidth`,6).attr(`markerHeight`,6).attr(`orient`,`auto-start-reverse`).append(`path`).attr(`d`,`M 0 0 L 10 5 L 0 10 z`).attr(`class`,`cynefinArrowHead`);let r=C.append(`g`).attr(`class`,`cynefin-arrows`);s.forEach(e=>{let t=T[e.from],i=T[e.to];if(!t||!i)return;if(e.from===e.to){o.warn(`Cynefin renderer: skipping self-loop on domain "${e.from}"`);return}let a=t.cx,s=t.cy,c=i.cx,l=i.cy,u=(a+c)/2,d=(s+l)/2,f=c-a,p=l-s,m=Math.sqrt(f*f+p*p),h=m*.15,g=-p/m,_=f/m,v=u+g*h,y=d+_*h;r.append(`path`).attr(`class`,`cynefinArrowLine`).attr(`d`,`M${a},${s} Q${v},${y} ${c},${l}`).attr(`fill`,`none`).attr(`marker-end`,`url(#${n})`),e.label&&r.append(`text`).attr(`class`,`cynefinArrowLabel`).attr(`x`,v).attr(`y`,y-6).attr(`text-anchor`,`middle`).attr(`dominant-baseline`,`auto`).text(e.label)})}c&&C.append(`text`).attr(`class`,`cynefinTitle`).attr(`x`,m/2).attr(`y`,-g/2).attr(`text-anchor`,`middle`).attr(`dominant-baseline`,`middle`).text(c)},`draw`)},H=r(()=>{let e=s(),t=d();return b(e,t.themeVariables).cynefin},`getCynefinTheme`),U={parser:I,db:P,renderer:V,styles:r(()=>{let e=H();return`
	.cynefinDomain {
		stroke: none;
	}
	.cynefinDomainLabel {
		font-size: ${e.domainFontSize}px;
		font-weight: bold;
		fill: ${e.labelColor};
	}
	.cynefinSubtitle {
		font-size: ${e.itemFontSize-1}px;
		fill: ${e.textColor};
		font-style: italic;
	}
	.cynefinItem {
		fill-opacity: 0.95;
		stroke: ${e.boundaryColor};
		stroke-width: 1;
	}
	.cynefinItemText {
		font-size: ${e.itemFontSize}px;
		fill: ${e.textColor};
	}
	.cynefinItemOverflow {
		fill-opacity: 0.6;
		stroke: ${e.boundaryColor};
		stroke-width: 1;
		stroke-dasharray: 3 2;
	}
	.cynefinBoundary {
		stroke: ${e.boundaryColor};
		stroke-width: ${e.boundaryWidth};
		stroke-dasharray: 6 3;
	}
	.cynefinCliff {
		stroke: ${e.cliffColor};
		stroke-width: ${e.cliffWidth};
	}
	.cynefinConfusion {
		stroke: ${e.boundaryColor};
		stroke-width: 1.5;
		stroke-dasharray: 4 2;
	}
	.cynefinArrowLine {
		stroke: ${e.arrowColor};
		stroke-width: ${e.arrowWidth};
		fill: none;
	}
	.cynefinArrowHead {
		fill: ${e.arrowColor};
		stroke: none;
	}
	.cynefinArrowLabel {
		font-size: ${e.itemFontSize-1}px;
		fill: ${e.textColor};
	}
	.cynefinTitle {
		font-size: ${e.domainFontSize+2}px;
		font-weight: bold;
		fill: ${e.labelColor};
	}
	`},`styles`)}})))()}W();export{U as diagram};