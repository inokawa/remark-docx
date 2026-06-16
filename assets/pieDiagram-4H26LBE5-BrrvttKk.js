import{i as e}from"./preload-helper-xPQekRTU.js";import{n as t,t as n}from"./mermaid-parser.core-BY3AD9j8.js";import{Bt as r,H as i,Ht as a,L as o,Vt as s,t as c,xt as l}from"./src-BbDJI_sc.js";import{U as u,W as d,a as f,c as p,f as m,j as h,q as g,v as _,w as v,x as y,y as b}from"./chunk-CSCIHK7Q-Bz7jXthk.js";import{n as x,t as S}from"./chunk-WU5MYG2G-CpPfXbq8.js";import{d as C,i as w,m as T}from"./chunk-5ZQYHXKU-D_x5S51a.js";import{n as E,t as D}from"./chunk-4BX2VUAB-C-trUY8_.js";var O,k,A,j,M,N,P,F,I,L,R;e((()=>{S(),D(),C(),h(),s(),n(),c(),O=m.pie,k={sections:new Map,showData:!1,config:O},A=k.sections,j=k.showData,M=structuredClone(O),N={getConfig:r(()=>structuredClone(M),`getConfig`),clear:r(()=>{A=new Map,j=k.showData,f()},`clear`),setDiagramTitle:g,getDiagramTitle:v,setAccTitle:d,getAccTitle:b,setAccDescription:u,getAccDescription:_,addSection:r(({label:e,value:t})=>{if(t<0)throw Error(`"${e}" has invalid value: ${t}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);A.has(e)||(A.set(e,t),a.debug(`added new section: ${e}, with value: ${t}`))},`addSection`),getSections:r(()=>A,`getSections`),setShowData:r(e=>{j=e},`setShowData`),getShowData:r(()=>j,`getShowData`)},P=r((e,t)=>{E(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},`populateDb`),F={parse:r(async e=>{let n=await t(`pie`,e);a.debug(n),P(n,N)},`parse`)},I=r(e=>`
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
`,`getStyles`),L=r(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),n=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1);return o().value(e=>e.value).sort(null)(n)},`createPieArcs`),R={parser:F,db:N,renderer:{draw:r((e,t,n,r)=>{a.debug(`rendering pie chart
`+e);let o=r.db,s=y(),c=w(o.getConfig(),s.pie),u=x(t),d=u.append(`g`);d.attr(`transform`,`translate(225,225)`);let{themeVariables:f}=s,[m]=T(f.pieOuterStrokeWidth);m??=2;let h=c.textPosition,g=i().innerRadius(0).outerRadius(185),_=i().innerRadius(185*h).outerRadius(185*h);d.append(`circle`).attr(`cx`,0).attr(`cy`,0).attr(`r`,185+m/2).attr(`class`,`pieOuterCircle`);let v=o.getSections(),b=L(v),S=[f.pie1,f.pie2,f.pie3,f.pie4,f.pie5,f.pie6,f.pie7,f.pie8,f.pie9,f.pie10,f.pie11,f.pie12],C=0;v.forEach(e=>{C+=e});let E=b.filter(e=>(e.data.value/C*100).toFixed(0)!==`0`),D=l(S).domain([...v.keys()]);d.selectAll(`mySlices`).data(E).enter().append(`path`).attr(`d`,g).attr(`fill`,e=>D(e.data.label)).attr(`class`,`pieCircle`),d.selectAll(`mySlices`).data(E).enter().append(`text`).text(e=>(e.data.value/C*100).toFixed(0)+`%`).attr(`transform`,e=>`translate(`+_.centroid(e)+`)`).style(`text-anchor`,`middle`).attr(`class`,`slice`);let O=d.append(`text`).text(o.getDiagramTitle()).attr(`x`,0).attr(`y`,-400/2).attr(`class`,`pieTitleText`),k=[...v.entries()].map(([e,t])=>({label:e,value:t})),A=d.selectAll(`.legend`).data(k).enter().append(`g`).attr(`class`,`legend`).attr(`transform`,(e,t)=>{let n=22*k.length/2;return`translate(216,`+(t*22-n)+`)`});A.append(`rect`).attr(`width`,18).attr(`height`,18).style(`fill`,e=>D(e.label)).style(`stroke`,e=>D(e.label)),A.append(`text`).attr(`x`,22).attr(`y`,14).text(e=>o.getShowData()?`${e.label} [${e.value}]`:e.label);let j=512+Math.max(...A.selectAll(`text`).nodes().map(e=>e?.getBoundingClientRect().width??0)),M=O.node()?.getBoundingClientRect().width??0,N=450/2-M/2,P=450/2+M/2,F=Math.min(0,N),I=Math.max(j,P)-F;u.attr(`viewBox`,`${F} 0 ${I} 450`),p(u,450,I,c.useMaxWidth)},`draw`)},styles:I}}))();export{R as diagram};