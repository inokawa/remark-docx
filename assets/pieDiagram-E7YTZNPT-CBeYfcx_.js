import{n as e,r as t}from"./rolldown-runtime-DkW27tQK.js";import{n,r}from"./mermaid-parser.core-Cn98guqZ.js";import{n as i,r as a}from"./chunk-Y2CYZVJY-C0ErJKbO.js";import{C as o,t as s,w as c}from"./src-CcHa7DV-.js";import{U as l,W as u,a as d,c as f,f as p,j as m,q as h,v as g,w as _,x as v,y}from"./chunk-DU6HZSFF-Czhxwst6.js";import{n as b}from"./ordinal-qriLbjob.js";import{r as x}from"./path-C95kSpS_.js";import{h as S,l as C}from"./dist-DU5ps2nx.js";import{t as w}from"./arc-C8HEbjjL.js";import{n as T,t as E}from"./array-BR3Mv2AW.js";import{d as D,i as O,m as k}from"./chunk-75Z2AOVW-DHfGUNkD.js";import{n as A,t as j}from"./chunk-JWPE2WC7-fSzem9U5.js";import{_ as M,v as N}from"./playground.stories-DsF89XGQ.js";function P(e,t){return t<e?-1:t>e?1:t>=e?0:NaN}function F(e){return e}function I(){var e=F,t=P,n=null,r=x(0),i=x(S),a=x(0);function o(o){var s,c=(o=E(o)).length,l,u,d=0,f=Array(c),p=Array(c),m=+r.apply(this,arguments),h=Math.min(S,Math.max(-S,i.apply(this,arguments)-m)),g,_=Math.min(Math.abs(h)/c,a.apply(this,arguments)),v=_*(h<0?-1:1),y;for(s=0;s<c;++s)(y=p[f[s]=s]=+e(o[s],s,o))>0&&(d+=y);for(t==null?n!=null&&f.sort(function(e,t){return n(o[e],o[t])}):f.sort(function(e,n){return t(p[e],p[n])}),s=0,u=d?(h-c*v)/d:0;s<c;++s,m=g)l=f[s],y=p[l],g=m+(y>0?y*u:0)+v,p[l]={data:o[l],index:s,value:y,startAngle:m,endAngle:g,padAngle:_};return p}return o.value=function(t){return arguments.length?(e=typeof t==`function`?t:x(+t),o):e},o.sortValues=function(e){return arguments.length?(t=e,n=null,o):t},o.sort=function(e){return arguments.length?(n=e,t=null,o):n},o.startAngle=function(e){return arguments.length?(r=typeof e==`function`?e:x(+e),o):r},o.endAngle=function(e){return arguments.length?(i=typeof e==`function`?e:x(+e),o):i},o.padAngle=function(e){return arguments.length?(a=typeof e==`function`?e:x(+e),o):a},o}function L(){return(L=e((()=>{T(),C()})))()}var R=t({diagram:()=>Y}),z,B,V,H,U,W,G,K,q,J,Y;function X(){return(X=e((()=>{j(),M(),D(),m(),o(),a(),n(),s(),z=p.pie,B={sections:new Map,showData:!1,config:z},V=B.sections,H=B.showData,U=structuredClone(z),W={getConfig:i(()=>structuredClone(U),`getConfig`),clear:i(()=>{V=new Map,H=B.showData,d()},`clear`),setDiagramTitle:h,getDiagramTitle:_,setAccTitle:u,getAccTitle:y,setAccDescription:l,getAccDescription:g,addSection:i(({label:e,value:t})=>{if(t<0)throw Error(`"${e}" has invalid value: ${t}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);V.has(e)||(V.set(e,t),c.debug(`added new section: ${e}, with value: ${t}`))},`addSection`),getSections:i(()=>V,`getSections`),setShowData:i(e=>{H=e},`setShowData`),getShowData:i(()=>H,`getShowData`)},G=i((e,t)=>{A(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},`populateDb`),K={parse:i(async e=>{let t=await r(`pie`,e);c.debug(t),G(t,W)},`parse`)},q=i(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,`getStyles`),J=i(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),n=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1);return I().value(e=>e.value).sort(null)(n)},`createPieArcs`),Y={parser:K,db:W,renderer:{draw:i((e,t,n,r)=>{c.debug(`rendering pie chart
`+e);let i=r.db,a=v(),o=O(i.getConfig(),a.pie),s=N(t),l=s.append(`g`);l.attr(`transform`,`translate(225,225)`);let{themeVariables:u}=a,[d]=k(u.pieOuterStrokeWidth);d??=2;let p=o.legendPosition,m=o.textPosition,h=o.donutHole>0&&o.donutHole<=.9?o.donutHole:0,g=w().innerRadius(h*185).outerRadius(185),_=w().innerRadius(185*m).outerRadius(185*m),y=l.append(`g`);y.append(`circle`).attr(`cx`,0).attr(`cy`,0).attr(`r`,185+d/2).attr(`class`,`pieOuterCircle`);let x=i.getSections(),S=J(x),C=[u.pie1,u.pie2,u.pie3,u.pie4,u.pie5,u.pie6,u.pie7,u.pie8,u.pie9,u.pie10,u.pie11,u.pie12],T=0;x.forEach(e=>{T+=e});let E=S.filter(e=>(e.data.value/T*100).toFixed(0)!==`0`),D=b(C).domain([...x.keys()]);y.selectAll(`mySlices`).data(E).enter().append(`path`).attr(`d`,g).attr(`fill`,e=>D(e.data.label)).attr(`class`,e=>{let t=`pieCircle`;return o.highlightSlice===`hover`?t+=` highlightedOnHover`:o.highlightSlice===e.data.label&&(t+=` highlighted`),t}),y.selectAll(`mySlices`).data(E).enter().append(`text`).text(e=>(e.data.value/T*100).toFixed(0)+`%`).attr(`transform`,e=>`translate(`+_.centroid(e)+`)`).style(`text-anchor`,`middle`).attr(`class`,`slice`);let A=l.append(`text`).text(i.getDiagramTitle()).attr(`x`,0).attr(`y`,-200).attr(`class`,`pieTitleText`),j=[...x.entries()].map(([e,t])=>({label:e,value:t})),M=l.selectAll(`.legend`).data(j).enter().append(`g`).attr(`class`,`legend`);M.append(`rect`).attr(`width`,18).attr(`height`,18).style(`fill`,e=>D(e.label)).style(`stroke`,e=>D(e.label)),M.append(`text`).attr(`x`,22).attr(`y`,14).text(e=>i.getShowData()?`${e.label} [${e.value}]`:e.label);let P=Math.max(...M.selectAll(`text`).nodes().map(e=>e?.getBoundingClientRect().width??0)),F=450,I=490,L=j.length*22;switch(p){case`center`:M.attr(`transform`,(e,t)=>{let n=22*j.length/2,r=-P/2-22,i=t*22-n;return`translate(`+r+`,`+i+`)`});break;case`top`:F+=L,M.attr(`transform`,(e,t)=>`translate(${-P/2-22}, ${t*22-185})`),y.attr(`transform`,()=>`translate(0, ${L+22})`);break;case`bottom`:F+=L,M.attr(`transform`,(e,t)=>{let n=-P/2-22,r=t*22- -207;return`translate(`+n+`,`+r+`)`});break;case`left`:I+=22+P,M.attr(`transform`,(e,t)=>{let n=22*j.length/2;return`translate(-207,`+(t*22-n)+`)`}),y.attr(`transform`,()=>`translate(${P+18+4}, 0)`);break;default:I+=22+P,M.attr(`transform`,(e,t)=>{let n=22*j.length/2;return`translate(216,`+(t*22-n)+`)`})}let R=A.node()?.getBoundingClientRect().width??0,z=225-R/2,B=225+R/2,V=Math.min(0,z),H=Math.max(I,B)-V;s.attr(`viewBox`,`${V} 0 ${H} ${F}`),f(s,F,H,o.useMaxWidth)},`draw`)},styles:q}})))()}export{R as n,L as r,X as t};