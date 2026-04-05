import{n as e}from"./chunk-Bj-mKKzh.js";import{et as t,nt as n,tt as r}from"./src-BJLM0Ahk.js";import{A as i,C as a,E as o,G as s,H as c,V as l,_ as u,a as d,c as f,d as p,v as m,y as h}from"./chunk-ICPOFSXX-B_bjNthI.js";import{n as g,t as _}from"./chunk-426QAEUC-DRCJxQmD.js";import{r as v,u as y}from"./chunk-5PVQY5BW-B-gMh7yE.js";import{n as b,t as x}from"./chunk-4BX2VUAB-oM1XzjL9.js";import{n as S,t as C}from"./mermaid-parser.core-BUzFhbql.js";function w(e,t,n,r,i,a,o){let s=t.length,c=Math.min(o.width,o.height)/2;n.forEach((t,n)=>{if(t.entries.length!==s)return;let l=t.entries.map((e,t)=>{let n=2*Math.PI*t/s-Math.PI/2,a=T(e,r,i,c);return{x:a*Math.cos(n),y:a*Math.sin(n)}});a===`circle`?e.append(`path`).attr(`d`,E(l,o.curveTension)).attr(`class`,`radarCurve-${n}`):a===`polygon`&&e.append(`polygon`).attr(`points`,l.map(e=>`${e.x},${e.y}`).join(` `)).attr(`class`,`radarCurve-${n}`)})}function T(e,t,n,r){return r*(Math.min(Math.max(e,t),n)-t)/(n-t)}function E(e,t){let n=e.length,r=`M${e[0].x},${e[0].y}`;for(let i=0;i<n;i++){let a=e[(i-1+n)%n],o=e[i],s=e[(i+1)%n],c=e[(i+2)%n],l={x:o.x+(s.x-a.x)*t,y:o.y+(s.y-a.y)*t},u={x:s.x-(c.x-o.x)*t,y:s.y-(c.y-o.y)*t};r+=` C${l.x},${l.y} ${u.x},${u.y} ${s.x},${s.y}`}return`${r} Z`}function D(e,t,n,r){if(!n)return;let i=(r.width/2+r.marginRight)*3/4,a=-(r.height/2+r.marginTop)*3/4;t.forEach((t,n)=>{let r=e.append(`g`).attr(`transform`,`translate(${i}, ${a+n*20})`);r.append(`rect`).attr(`width`,12).attr(`height`,12).attr(`class`,`radarLegendBox-${n}`),r.append(`text`).attr(`x`,16).attr(`y`,0).attr(`class`,`radarLegendText`).text(t.label)})}var O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y;e((()=>{_(),x(),y(),i(),r(),C(),O={showLegend:!0,ticks:5,max:null,min:0,graticule:`circle`},k={axes:[],curves:[],options:O},A=structuredClone(k),j=p.radar,M=t(()=>v({...j,...h().radar}),`getConfig`),N=t(()=>A.axes,`getAxes`),P=t(()=>A.curves,`getCurves`),F=t(()=>A.options,`getOptions`),I=t(e=>{A.axes=e.map(e=>({name:e.name,label:e.label??e.name}))},`setAxes`),L=t(e=>{A.curves=e.map(e=>({name:e.name,label:e.label??e.name,entries:R(e.entries)}))},`setCurves`),R=t(e=>{if(e[0].axis==null)return e.map(e=>e.value);let t=N();if(t.length===0)throw Error(`Axes must be populated before curves for reference entries`);return t.map(t=>{let n=e.find(e=>e.axis?.$refText===t.name);if(n===void 0)throw Error(`Missing entry for axis `+t.label);return n.value})},`computeCurveEntries`),z={getAxes:N,getCurves:P,getOptions:F,setAxes:I,setCurves:L,setOptions:t(e=>{let t=e.reduce((e,t)=>(e[t.name]=t,e),{});A.options={showLegend:t.showLegend?.value??O.showLegend,ticks:t.ticks?.value??O.ticks,max:t.max?.value??O.max,min:t.min?.value??O.min,graticule:t.graticule?.value??O.graticule}},`setOptions`),getConfig:M,clear:t(()=>{d(),A=structuredClone(k)},`clear`),setAccTitle:c,getAccTitle:m,setDiagramTitle:s,getDiagramTitle:a,getAccDescription:u,setAccDescription:l},B=t(e=>{b(e,z);let{axes:t,curves:n,options:r}=e;z.setAxes(t),z.setCurves(n),z.setOptions(r)},`populate`),V={parse:t(async e=>{let t=await S(`radar`,e);n.debug(t),B(t)},`parse`)},H=t((e,t,n,r)=>{let i=r.db,a=i.getAxes(),o=i.getCurves(),s=i.getOptions(),c=i.getConfig(),l=i.getDiagramTitle(),u=U(g(t),c),d=s.max??Math.max(...o.map(e=>Math.max(...e.entries))),f=s.min,p=Math.min(c.width,c.height)/2;W(u,a,p,s.ticks,s.graticule),G(u,a,p,c),w(u,a,o,f,d,s.graticule,c),D(u,o,s.showLegend,c),u.append(`text`).attr(`class`,`radarTitle`).text(l).attr(`x`,0).attr(`y`,-c.height/2-c.marginTop)},`draw`),U=t((e,t)=>{let n=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,i={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return f(e,r,n,t.useMaxWidth??!0),e.attr(`viewBox`,`0 0 ${n} ${r}`),e.append(`g`).attr(`transform`,`translate(${i.x}, ${i.y})`)},`drawFrame`),W=t((e,t,n,r,i)=>{if(i===`circle`)for(let t=0;t<r;t++){let i=n*(t+1)/r;e.append(`circle`).attr(`r`,i).attr(`class`,`radarGraticule`)}else if(i===`polygon`){let i=t.length;for(let a=0;a<r;a++){let o=n*(a+1)/r,s=t.map((e,t)=>{let n=2*t*Math.PI/i-Math.PI/2;return`${o*Math.cos(n)},${o*Math.sin(n)}`}).join(` `);e.append(`polygon`).attr(`points`,s).attr(`class`,`radarGraticule`)}}},`drawGraticule`),G=t((e,t,n,r)=>{let i=t.length;for(let a=0;a<i;a++){let o=t[a].label,s=2*a*Math.PI/i-Math.PI/2;e.append(`line`).attr(`x1`,0).attr(`y1`,0).attr(`x2`,n*r.axisScaleFactor*Math.cos(s)).attr(`y2`,n*r.axisScaleFactor*Math.sin(s)).attr(`class`,`radarAxisLine`),e.append(`text`).text(o).attr(`x`,n*r.axisLabelFactor*Math.cos(s)).attr(`y`,n*r.axisLabelFactor*Math.sin(s)).attr(`class`,`radarAxisLabel`)}},`drawAxes`),t(w,`drawCurves`),t(T,`relativeRadius`),t(E,`closedRoundCurve`),t(D,`drawLegend`),K={draw:H},q=t((e,t)=>{let n=``;for(let r=0;r<e.THEME_COLOR_LIMIT;r++){let i=e[`cScale${r}`];n+=`
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
		`}return n},`genIndexStyles`),J=t(e=>{let t=v(o(),h().themeVariables);return{themeVariables:t,radarOptions:v(t.radar,e)}},`buildRadarStyleOptions`),Y={parser:V,db:z,renderer:K,styles:t(({radar:e}={})=>{let{themeVariables:t,radarOptions:n}=J(e);return`
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