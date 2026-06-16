import{i as e}from"./preload-helper-xPQekRTU.js";import{n as t,t as n}from"./mermaid-parser.core-BY3AD9j8.js";import{Bt as r,Ht as i,Vt as a}from"./src-BbDJI_sc.js";import{D as o,U as s,W as c,a as l,b as u,c as d,f,j as p,q as m,v as h,w as g,y as _}from"./chunk-CSCIHK7Q-Bz7jXthk.js";import{n as v,t as y}from"./chunk-WU5MYG2G-CpPfXbq8.js";import{d as b,i as x}from"./chunk-5ZQYHXKU-D_x5S51a.js";import{n as S,t as C}from"./chunk-4BX2VUAB-C-trUY8_.js";function w(e,t,n,r,i,a,o){let s=t.length,c=Math.min(o.width,o.height)/2;n.forEach((t,n)=>{if(t.entries.length!==s)return;let l=t.entries.map((e,t)=>{let n=2*Math.PI*t/s-Math.PI/2,a=T(e,r,i,c);return{x:a*Math.cos(n),y:a*Math.sin(n)}});a===`circle`?e.append(`path`).attr(`d`,E(l,o.curveTension)).attr(`class`,`radarCurve-${n}`):a===`polygon`&&e.append(`polygon`).attr(`points`,l.map(e=>`${e.x},${e.y}`).join(` `)).attr(`class`,`radarCurve-${n}`)})}function T(e,t,n,r){return r*(Math.min(Math.max(e,t),n)-t)/(n-t)}function E(e,t){let n=e.length,r=`M${e[0].x},${e[0].y}`;for(let i=0;i<n;i++){let a=e[(i-1+n)%n],o=e[i],s=e[(i+1)%n],c=e[(i+2)%n],l={x:o.x+(s.x-a.x)*t,y:o.y+(s.y-a.y)*t},u={x:s.x-(c.x-o.x)*t,y:s.y-(c.y-o.y)*t};r+=` C${l.x},${l.y} ${u.x},${u.y} ${s.x},${s.y}`}return`${r} Z`}function D(e,t,n,r){if(!n)return;let i=(r.width/2+r.marginRight)*3/4,a=-(r.height/2+r.marginTop)*3/4;t.forEach((t,n)=>{let r=e.append(`g`).attr(`transform`,`translate(${i}, ${a+n*20})`);r.append(`rect`).attr(`width`,12).attr(`height`,12).attr(`class`,`radarLegendBox-${n}`),r.append(`text`).attr(`x`,16).attr(`y`,0).attr(`class`,`radarLegendText`).text(t.label)})}var O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y;e((()=>{y(),C(),b(),p(),a(),n(),O={showLegend:!0,ticks:5,max:null,min:0,graticule:`circle`},k={axes:[],curves:[],options:O},A=structuredClone(k),j=f.radar,M=r(()=>x({...j,...u().radar}),`getConfig`),N=r(()=>A.axes,`getAxes`),P=r(()=>A.curves,`getCurves`),F=r(()=>A.options,`getOptions`),I=r(e=>{A.axes=e.map(e=>({name:e.name,label:e.label??e.name}))},`setAxes`),L=r(e=>{A.curves=e.map(e=>({name:e.name,label:e.label??e.name,entries:R(e.entries)}))},`setCurves`),R=r(e=>{if(e[0].axis==null)return e.map(e=>e.value);let t=N();if(t.length===0)throw Error(`Axes must be populated before curves for reference entries`);return t.map(t=>{let n=e.find(e=>e.axis?.$refText===t.name);if(n===void 0)throw Error(`Missing entry for axis `+t.label);return n.value})},`computeCurveEntries`),z={getAxes:N,getCurves:P,getOptions:F,setAxes:I,setCurves:L,setOptions:r(e=>{let t=e.reduce((e,t)=>(e[t.name]=t,e),{});A.options={showLegend:t.showLegend?.value??O.showLegend,ticks:t.ticks?.value??O.ticks,max:t.max?.value??O.max,min:t.min?.value??O.min,graticule:t.graticule?.value??O.graticule}},`setOptions`),getConfig:M,clear:r(()=>{l(),A=structuredClone(k)},`clear`),setAccTitle:c,getAccTitle:_,setDiagramTitle:m,getDiagramTitle:g,getAccDescription:h,setAccDescription:s},B=r(e=>{S(e,z);let{axes:t,curves:n,options:r}=e;z.setAxes(t),z.setCurves(n),z.setOptions(r)},`populate`),V={parse:r(async e=>{let n=await t(`radar`,e);i.debug(n),B(n)},`parse`)},H=r((e,t,n,r)=>{let i=r.db,a=i.getAxes(),o=i.getCurves(),s=i.getOptions(),c=i.getConfig(),l=i.getDiagramTitle(),u=U(v(t),c),d=s.max??Math.max(...o.map(e=>Math.max(...e.entries))),f=s.min,p=Math.min(c.width,c.height)/2;W(u,a,p,s.ticks,s.graticule),G(u,a,p,c),w(u,a,o,f,d,s.graticule,c),D(u,o,s.showLegend,c),u.append(`text`).attr(`class`,`radarTitle`).text(l).attr(`x`,0).attr(`y`,-c.height/2-c.marginTop)},`draw`),U=r((e,t)=>{let n=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,i={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return d(e,r,n,t.useMaxWidth??!0),e.attr(`viewBox`,`0 0 ${n} ${r}`),e.append(`g`).attr(`transform`,`translate(${i.x}, ${i.y})`)},`drawFrame`),W=r((e,t,n,r,i)=>{if(i===`circle`)for(let t=0;t<r;t++){let i=n*(t+1)/r;e.append(`circle`).attr(`r`,i).attr(`class`,`radarGraticule`)}else if(i===`polygon`){let i=t.length;for(let a=0;a<r;a++){let o=n*(a+1)/r,s=t.map((e,t)=>{let n=2*t*Math.PI/i-Math.PI/2;return`${o*Math.cos(n)},${o*Math.sin(n)}`}).join(` `);e.append(`polygon`).attr(`points`,s).attr(`class`,`radarGraticule`)}}},`drawGraticule`),G=r((e,t,n,r)=>{let i=t.length;for(let a=0;a<i;a++){let o=t[a].label,s=2*a*Math.PI/i-Math.PI/2;e.append(`line`).attr(`x1`,0).attr(`y1`,0).attr(`x2`,n*r.axisScaleFactor*Math.cos(s)).attr(`y2`,n*r.axisScaleFactor*Math.sin(s)).attr(`class`,`radarAxisLine`),e.append(`text`).text(o).attr(`x`,n*r.axisLabelFactor*Math.cos(s)).attr(`y`,n*r.axisLabelFactor*Math.sin(s)).attr(`class`,`radarAxisLabel`)}},`drawAxes`),r(w,`drawCurves`),r(T,`relativeRadius`),r(E,`closedRoundCurve`),r(D,`drawLegend`),K={draw:H},q=r((e,t)=>{let n=``;for(let r=0;r<e.THEME_COLOR_LIMIT;r++){let i=e[`cScale${r}`];n+=`
		.radarCurve-${r} {
			color: ${i};
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${i};
			fill-opacity: ${t.curveOpacity};
			stroke: ${i};
		}
		`}return n},`genIndexStyles`),J=r(e=>{let t=x(o(),u().themeVariables);return{themeVariables:t,radarOptions:x(t.radar,e)}},`buildRadarStyleOptions`),Y={parser:V,db:z,renderer:K,styles:r(({radar:e}={})=>{let{themeVariables:t,radarOptions:n}=J(e);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${n.axisColor};
		stroke-width: ${n.axisStrokeWidth};
	}
	.radarAxisLabel {
		dominant-baseline: middle;
		text-anchor: middle;
		font-size: ${n.axisLabelFontSize}px;
		color: ${n.axisColor};
	}
	.radarGraticule {
		fill: ${n.graticuleColor};
		fill-opacity: ${n.graticuleOpacity};
		stroke: ${n.graticuleColor};
		stroke-width: ${n.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${n.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${q(t,n)}
	`},`styles`)}}))();export{Y as diagram};