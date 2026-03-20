import{n as e}from"./chunk-vNrZSFDR.js";import{et as t,nt as n,tt as r}from"./src-BkJa-o8q.js";import{B as i,C as a,T as o,V as s,W as c,_ as l,a as u,d,k as f,v as p,y as m}from"./chunk-ABZYJK2D-Bghskf3m.js";import{n as h,t as g}from"./chunk-EXTU4WIE-BZE8rNI0.js";import{r as _,u as v}from"./chunk-S3R3BYOJ-D35EUNO0.js";import{n as y,t as b}from"./chunk-4BX2VUAB-DgpfSqax.js";import{n as x,t as S}from"./mermaid-parser.core-j3vczj2n.js";function C(e,t,n,r,i,a,o){let s=t.length,c=Math.min(o.width,o.height)/2;n.forEach((t,n)=>{if(t.entries.length!==s)return;let l=t.entries.map((e,t)=>{let n=2*Math.PI*t/s-Math.PI/2,a=w(e,r,i,c);return{x:a*Math.cos(n),y:a*Math.sin(n)}});a===`circle`?e.append(`path`).attr(`d`,T(l,o.curveTension)).attr(`class`,`radarCurve-${n}`):a===`polygon`&&e.append(`polygon`).attr(`points`,l.map(e=>`${e.x},${e.y}`).join(` `)).attr(`class`,`radarCurve-${n}`)})}function w(e,t,n,r){return r*(Math.min(Math.max(e,t),n)-t)/(n-t)}function T(e,t){let n=e.length,r=`M${e[0].x},${e[0].y}`;for(let i=0;i<n;i++){let a=e[(i-1+n)%n],o=e[i],s=e[(i+1)%n],c=e[(i+2)%n],l={x:o.x+(s.x-a.x)*t,y:o.y+(s.y-a.y)*t},u={x:s.x-(c.x-o.x)*t,y:s.y-(c.y-o.y)*t};r+=` C${l.x},${l.y} ${u.x},${u.y} ${s.x},${s.y}`}return`${r} Z`}function E(e,t,n,r){if(!n)return;let i=(r.width/2+r.marginRight)*3/4,a=-(r.height/2+r.marginTop)*3/4;t.forEach((t,n)=>{let r=e.append(`g`).attr(`transform`,`translate(${i}, ${a+n*20})`);r.append(`rect`).attr(`width`,12).attr(`height`,12).attr(`class`,`radarLegendBox-${n}`),r.append(`text`).attr(`x`,16).attr(`y`,0).attr(`class`,`radarLegendText`).text(t.label)})}var D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J;e((()=>{g(),b(),v(),f(),r(),S(),D={showLegend:!0,ticks:5,max:null,min:0,graticule:`circle`},O={axes:[],curves:[],options:D},k=structuredClone(O),A=d.radar,j=t(()=>_({...A,...m().radar}),`getConfig`),M=t(()=>k.axes,`getAxes`),N=t(()=>k.curves,`getCurves`),P=t(()=>k.options,`getOptions`),F=t(e=>{k.axes=e.map(e=>({name:e.name,label:e.label??e.name}))},`setAxes`),I=t(e=>{k.curves=e.map(e=>({name:e.name,label:e.label??e.name,entries:L(e.entries)}))},`setCurves`),L=t(e=>{if(e[0].axis==null)return e.map(e=>e.value);let t=M();if(t.length===0)throw Error(`Axes must be populated before curves for reference entries`);return t.map(t=>{let n=e.find(e=>e.axis?.$refText===t.name);if(n===void 0)throw Error(`Missing entry for axis `+t.label);return n.value})},`computeCurveEntries`),R={getAxes:M,getCurves:N,getOptions:P,setAxes:F,setCurves:I,setOptions:t(e=>{let t=e.reduce((e,t)=>(e[t.name]=t,e),{});k.options={showLegend:t.showLegend?.value??D.showLegend,ticks:t.ticks?.value??D.ticks,max:t.max?.value??D.max,min:t.min?.value??D.min,graticule:t.graticule?.value??D.graticule}},`setOptions`),getConfig:j,clear:t(()=>{u(),k=structuredClone(O)},`clear`),setAccTitle:s,getAccTitle:p,setDiagramTitle:c,getDiagramTitle:a,getAccDescription:l,setAccDescription:i},z=t(e=>{y(e,R);let{axes:t,curves:n,options:r}=e;R.setAxes(t),R.setCurves(n),R.setOptions(r)},`populate`),B={parse:t(async e=>{let t=await x(`radar`,e);n.debug(t),z(t)},`parse`)},V=t((e,t,n,r)=>{let i=r.db,a=i.getAxes(),o=i.getCurves(),s=i.getOptions(),c=i.getConfig(),l=i.getDiagramTitle(),u=H(h(t),c),d=s.max??Math.max(...o.map(e=>Math.max(...e.entries))),f=s.min,p=Math.min(c.width,c.height)/2;U(u,a,p,s.ticks,s.graticule),W(u,a,p,c),C(u,a,o,f,d,s.graticule,c),E(u,o,s.showLegend,c),u.append(`text`).attr(`class`,`radarTitle`).text(l).attr(`x`,0).attr(`y`,-c.height/2-c.marginTop)},`draw`),H=t((e,t)=>{let n=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,i={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return e.attr(`viewbox`,`0 0 ${n} ${r}`).attr(`width`,n).attr(`height`,r),e.append(`g`).attr(`transform`,`translate(${i.x}, ${i.y})`)},`drawFrame`),U=t((e,t,n,r,i)=>{if(i===`circle`)for(let t=0;t<r;t++){let i=n*(t+1)/r;e.append(`circle`).attr(`r`,i).attr(`class`,`radarGraticule`)}else if(i===`polygon`){let i=t.length;for(let a=0;a<r;a++){let o=n*(a+1)/r,s=t.map((e,t)=>{let n=2*t*Math.PI/i-Math.PI/2;return`${o*Math.cos(n)},${o*Math.sin(n)}`}).join(` `);e.append(`polygon`).attr(`points`,s).attr(`class`,`radarGraticule`)}}},`drawGraticule`),W=t((e,t,n,r)=>{let i=t.length;for(let a=0;a<i;a++){let o=t[a].label,s=2*a*Math.PI/i-Math.PI/2;e.append(`line`).attr(`x1`,0).attr(`y1`,0).attr(`x2`,n*r.axisScaleFactor*Math.cos(s)).attr(`y2`,n*r.axisScaleFactor*Math.sin(s)).attr(`class`,`radarAxisLine`),e.append(`text`).text(o).attr(`x`,n*r.axisLabelFactor*Math.cos(s)).attr(`y`,n*r.axisLabelFactor*Math.sin(s)).attr(`class`,`radarAxisLabel`)}},`drawAxes`),t(C,`drawCurves`),t(w,`relativeRadius`),t(T,`closedRoundCurve`),t(E,`drawLegend`),G={draw:V},K=t((e,t)=>{let n=``;for(let r=0;r<e.THEME_COLOR_LIMIT;r++){let i=e[`cScale${r}`];n+=`
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
		`}return n},`genIndexStyles`),q=t(e=>{let t=_(o(),m().themeVariables);return{themeVariables:t,radarOptions:_(t.radar,e)}},`buildRadarStyleOptions`),J={parser:B,db:R,renderer:G,styles:t(({radar:e}={})=>{let{themeVariables:t,radarOptions:n}=q(e);return`
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
	${K(t,n)}
	`},`styles`)}}))();export{J as diagram};