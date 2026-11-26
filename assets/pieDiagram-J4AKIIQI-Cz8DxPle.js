import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{n as t,r as n}from"./mermaid-parser.core-7hRK22wz.js";import{n as r,r as i}from"./chunk-Y2CYZVJY-BLgfQGNL.js";import{S as a,bt as o,n as s,rt as c,t as l,xt as u}from"./src-Be7NH1dx.js";import{A as d,C as f,J as p,U as m,W as h,_ as g,a as _,b as v,c as y,f as b,v as x}from"./chunk-BG4553SI-CxclfJBv.js";import{n as S,t as C}from"./chunk-JWPE2WC7-CUwS0ygC.js";import{f as w,h as T,i as E}from"./chunk-6MUBBAK2-Cfx7l_71.js";import{l as D,u as O}from"./playground.stories-DoA_RF4i.js";var k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{C(),D(),w(),d(),o(),i(),t(),l(),k=b.pie,A={sections:new Map,showData:!1,config:k},j=A.sections,M=A.showData,N=structuredClone(k),P={getConfig:r(()=>structuredClone(N),`getConfig`),clear:r(()=>{j=new Map,M=A.showData,_()},`clear`),setDiagramTitle:p,getDiagramTitle:f,setAccTitle:h,getAccTitle:x,setAccDescription:m,getAccDescription:g,addSection:r(({label:e,value:t})=>{if(t<0)throw Error(`"${e}" has invalid value: ${t}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);j.has(e)||(j.set(e,t),u.debug(`added new section: ${e}, with value: ${t}`))},`addSection`),getSections:r(()=>j,`getSections`),setShowData:r(e=>{M=e},`setShowData`),getShowData:r(()=>M,`getShowData`)},F=r((e,t)=>{S(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},`populateDb`),I={parse:r(async e=>{let t=await n(`pie`,e);u.debug(t),F(t,P)},`parse`)},L=r(e=>`
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
`,`getStyles`),R=r(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),n=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1);return a().value(e=>e.value).sort(null)(n)},`createPieArcs`),z={parser:I,db:P,renderer:{draw:r((e,t,n,r)=>{u.debug(`rendering pie chart
`+e);let i=r.db,a=v(),o=E(i.getConfig(),a.pie),l=O(t),d=l.append(`g`);d.attr(`transform`,`translate(225,225)`);let{themeVariables:f}=a,[p]=T(f.pieOuterStrokeWidth);p??=2;let m=o.legendPosition,h=o.textPosition,g=o.donutHole>0&&o.donutHole<=.9?o.donutHole:0,_=s().innerRadius(g*185).outerRadius(185),b=s().innerRadius(185*h).outerRadius(185*h),x=d.append(`g`);x.append(`circle`).attr(`cx`,0).attr(`cy`,0).attr(`r`,185+p/2).attr(`class`,`pieOuterCircle`);let S=i.getSections(),C=R(S),w=[f.pie1,f.pie2,f.pie3,f.pie4,f.pie5,f.pie6,f.pie7,f.pie8,f.pie9,f.pie10,f.pie11,f.pie12],D=0;S.forEach(e=>{D+=e});let k=C.filter(e=>(e.data.value/D*100).toFixed(0)!==`0`),A=c(w).domain([...S.keys()]);x.selectAll(`mySlices`).data(k).enter().append(`path`).attr(`d`,_).attr(`fill`,e=>A(e.data.label)).attr(`class`,e=>{let t=`pieCircle`;return o.highlightSlice===`hover`?t+=` highlightedOnHover`:o.highlightSlice===e.data.label&&(t+=` highlighted`),t}),x.selectAll(`mySlices`).data(k).enter().append(`text`).text(e=>(e.data.value/D*100).toFixed(0)+`%`).attr(`transform`,e=>`translate(`+b.centroid(e)+`)`).style(`text-anchor`,`middle`).attr(`class`,`slice`);let j=d.append(`text`).text(i.getDiagramTitle()).attr(`x`,0).attr(`y`,-200).attr(`class`,`pieTitleText`),M=[...S.entries()].map(([e,t])=>({label:e,value:t})),N=d.selectAll(`.legend`).data(M).enter().append(`g`).attr(`class`,`legend`);N.append(`rect`).attr(`width`,18).attr(`height`,18).style(`fill`,e=>A(e.label)).style(`stroke`,e=>A(e.label)),N.append(`text`).attr(`x`,22).attr(`y`,14).text(e=>i.getShowData()?`${e.label} [${e.value}]`:e.label);let P=Math.max(...N.selectAll(`text`).nodes().map(e=>e?.getBoundingClientRect().width??0)),F=450,I=490,L=M.length*22;switch(m){case`center`:N.attr(`transform`,(e,t)=>{let n=22*M.length/2,r=-P/2-22,i=t*22-n;return`translate(`+r+`,`+i+`)`});break;case`top`:F+=L,N.attr(`transform`,(e,t)=>`translate(${-P/2-22}, ${t*22-185})`),x.attr(`transform`,()=>`translate(0, ${L+22})`);break;case`bottom`:F+=L,N.attr(`transform`,(e,t)=>{let n=-P/2-22,r=t*22- -207;return`translate(`+n+`,`+r+`)`});break;case`left`:I+=22+P,N.attr(`transform`,(e,t)=>{let n=22*M.length/2;return`translate(-207,`+(t*22-n)+`)`}),x.attr(`transform`,()=>`translate(${P+18+4}, 0)`);break;default:I+=22+P,N.attr(`transform`,(e,t)=>{let n=22*M.length/2;return`translate(216,`+(t*22-n)+`)`})}let z=j.node()?.getBoundingClientRect().width??0,B=225-z/2,V=225+z/2,H=Math.min(0,B),U=Math.max(I,V)-H;l.attr(`viewBox`,`${H} 0 ${U} ${F}`),y(l,F,U,o.useMaxWidth)},`draw`)},styles:L}})))()}B();export{z as diagram};