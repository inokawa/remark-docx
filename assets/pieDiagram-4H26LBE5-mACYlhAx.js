import{n as e}from"./chunk-BneVvdWh.js";import{U as t,et as n,nt as r,t as i,tt as a,w as o,x as s}from"./src-ganhjxLw.js";import{U as c,W as l,a as u,c as d,f,j as p,q as m,v as h,w as g,x as _,y as v}from"./chunk-CSCIHK7Q-BUZVqZbA.js";import{n as y,t as b}from"./chunk-WU5MYG2G-CokFe3vL.js";import{d as x,i as S,m as C}from"./chunk-5ZQYHXKU-Bidh-U40.js";import{n as w,t as T}from"./chunk-4BX2VUAB-kGpm8-bH.js";import{n as E,t as D}from"./mermaid-parser.core-DYh-oQz-.js";var O,k,A,j,M,N,P,F,I,L,R;e((()=>{b(),T(),x(),p(),a(),D(),i(),O=f.pie,k={sections:new Map,showData:!1,config:O},A=k.sections,j=k.showData,M=structuredClone(O),N={getConfig:n(()=>structuredClone(M),`getConfig`),clear:n(()=>{A=new Map,j=k.showData,u()},`clear`),setDiagramTitle:m,getDiagramTitle:g,setAccTitle:l,getAccTitle:v,setAccDescription:c,getAccDescription:h,addSection:n(({label:e,value:t})=>{if(t<0)throw Error(`"${e}" has invalid value: ${t}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);A.has(e)||(A.set(e,t),r.debug(`added new section: ${e}, with value: ${t}`))},`addSection`),getSections:n(()=>A,`getSections`),setShowData:n(e=>{j=e},`setShowData`),getShowData:n(()=>j,`getShowData`)},P=n((e,t)=>{w(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},`populateDb`),F={parse:n(async e=>{let t=await E(`pie`,e);r.debug(t),P(t,N)},`parse`)},I=n(e=>`
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
`,`getStyles`),L=n(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),n=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1);return s().value(e=>e.value).sort(null)(n)},`createPieArcs`),R={parser:F,db:N,renderer:{draw:n((e,n,i,a)=>{r.debug(`rendering pie chart
`+e);let s=a.db,c=_(),l=S(s.getConfig(),c.pie),u=y(n),f=u.append(`g`);f.attr(`transform`,`translate(225,225)`);let{themeVariables:p}=c,[m]=C(p.pieOuterStrokeWidth);m??=2;let h=l.textPosition,g=o().innerRadius(0).outerRadius(185),v=o().innerRadius(185*h).outerRadius(185*h);f.append(`circle`).attr(`cx`,0).attr(`cy`,0).attr(`r`,185+m/2).attr(`class`,`pieOuterCircle`);let b=s.getSections(),x=L(b),w=[p.pie1,p.pie2,p.pie3,p.pie4,p.pie5,p.pie6,p.pie7,p.pie8,p.pie9,p.pie10,p.pie11,p.pie12],T=0;b.forEach(e=>{T+=e});let E=x.filter(e=>(e.data.value/T*100).toFixed(0)!==`0`),D=t(w).domain([...b.keys()]);f.selectAll(`mySlices`).data(E).enter().append(`path`).attr(`d`,g).attr(`fill`,e=>D(e.data.label)).attr(`class`,`pieCircle`),f.selectAll(`mySlices`).data(E).enter().append(`text`).text(e=>(e.data.value/T*100).toFixed(0)+`%`).attr(`transform`,e=>`translate(`+v.centroid(e)+`)`).style(`text-anchor`,`middle`).attr(`class`,`slice`);let O=f.append(`text`).text(s.getDiagramTitle()).attr(`x`,0).attr(`y`,-400/2).attr(`class`,`pieTitleText`),k=[...b.entries()].map(([e,t])=>({label:e,value:t})),A=f.selectAll(`.legend`).data(k).enter().append(`g`).attr(`class`,`legend`).attr(`transform`,(e,t)=>{let n=22*k.length/2;return`translate(216,`+(t*22-n)+`)`});A.append(`rect`).attr(`width`,18).attr(`height`,18).style(`fill`,e=>D(e.label)).style(`stroke`,e=>D(e.label)),A.append(`text`).attr(`x`,22).attr(`y`,14).text(e=>s.getShowData()?`${e.label} [${e.value}]`:e.label);let j=512+Math.max(...A.selectAll(`text`).nodes().map(e=>e?.getBoundingClientRect().width??0)),M=O.node()?.getBoundingClientRect().width??0,N=450/2-M/2,P=450/2+M/2,F=Math.min(0,N),I=Math.max(j,P)-F;u.attr(`viewBox`,`${F} 0 ${I} 450`),d(u,450,I,l.useMaxWidth)},`draw`)},styles:I}}))();export{R as diagram};