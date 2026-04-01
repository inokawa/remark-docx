import{n as e}from"./chunk-vNrZSFDR.js";import{U as t,et as n,nt as r,t as i,tt as a,w as o,x as s}from"./src-B3yZPiM9.js";import{B as c,C as l,V as u,W as d,_ as f,a as p,b as m,c as h,d as g,k as _,v}from"./chunk-ABZYJK2D-TN2mzGnY.js";import{n as y,t as b}from"./chunk-EXTU4WIE-CgFmAYRK.js";import{p as x,r as S,u as C}from"./chunk-S3R3BYOJ-BE2QJbl9.js";import{n as w,t as T}from"./chunk-4BX2VUAB-Vbq_Wyqe.js";import{n as E,t as D}from"./mermaid-parser.core-iLcz97_O.js";var O,k,A,j,M,N,P,F,I,L,R;e((()=>{b(),T(),C(),_(),a(),D(),i(),O=g.pie,k={sections:new Map,showData:!1,config:O},A=k.sections,j=k.showData,M=structuredClone(O),N={getConfig:n(()=>structuredClone(M),`getConfig`),clear:n(()=>{A=new Map,j=k.showData,p()},`clear`),setDiagramTitle:d,getDiagramTitle:l,setAccTitle:u,getAccTitle:v,setAccDescription:c,getAccDescription:f,addSection:n(({label:e,value:t})=>{if(t<0)throw Error(`"${e}" has invalid value: ${t}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);A.has(e)||(A.set(e,t),r.debug(`added new section: ${e}, with value: ${t}`))},`addSection`),getSections:n(()=>A,`getSections`),setShowData:n(e=>{j=e},`setShowData`),getShowData:n(()=>j,`getShowData`)},P=n((e,t)=>{w(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},`populateDb`),F={parse:n(async e=>{let t=await E(`pie`,e);r.debug(t),P(t,N)},`parse`)},I=n(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
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
`,`getStyles`),L=n(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),n=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1).sort((e,t)=>t.value-e.value);return s().value(e=>e.value)(n)},`createPieArcs`),R={parser:F,db:N,renderer:{draw:n((e,n,i,a)=>{r.debug(`rendering pie chart
`+e);let s=a.db,c=m(),l=S(s.getConfig(),c.pie),u=y(n),d=u.append(`g`);d.attr(`transform`,`translate(225,225)`);let{themeVariables:f}=c,[p]=x(f.pieOuterStrokeWidth);p??=2;let g=l.textPosition,_=o().innerRadius(0).outerRadius(185),v=o().innerRadius(185*g).outerRadius(185*g);d.append(`circle`).attr(`cx`,0).attr(`cy`,0).attr(`r`,185+p/2).attr(`class`,`pieOuterCircle`);let b=s.getSections(),C=L(b),w=[f.pie1,f.pie2,f.pie3,f.pie4,f.pie5,f.pie6,f.pie7,f.pie8,f.pie9,f.pie10,f.pie11,f.pie12],T=0;b.forEach(e=>{T+=e});let E=C.filter(e=>(e.data.value/T*100).toFixed(0)!==`0`),D=t(w);d.selectAll(`mySlices`).data(E).enter().append(`path`).attr(`d`,_).attr(`fill`,e=>D(e.data.label)).attr(`class`,`pieCircle`),d.selectAll(`mySlices`).data(E).enter().append(`text`).text(e=>(e.data.value/T*100).toFixed(0)+`%`).attr(`transform`,e=>`translate(`+v.centroid(e)+`)`).style(`text-anchor`,`middle`).attr(`class`,`slice`),d.append(`text`).text(s.getDiagramTitle()).attr(`x`,0).attr(`y`,-400/2).attr(`class`,`pieTitleText`);let O=[...b.entries()].map(([e,t])=>({label:e,value:t})),k=d.selectAll(`.legend`).data(O).enter().append(`g`).attr(`class`,`legend`).attr(`transform`,(e,t)=>{let n=22*O.length/2;return`translate(216,`+(t*22-n)+`)`});k.append(`rect`).attr(`width`,18).attr(`height`,18).style(`fill`,e=>D(e.label)).style(`stroke`,e=>D(e.label)),k.append(`text`).attr(`x`,22).attr(`y`,14).text(e=>s.getShowData()?`${e.label} [${e.value}]`:e.label);let A=512+Math.max(...k.selectAll(`text`).nodes().map(e=>e?.getBoundingClientRect().width??0));u.attr(`viewBox`,`0 0 ${A} 450`),h(u,450,A,l.useMaxWidth)},`draw`)},styles:I}}))();export{R as diagram};