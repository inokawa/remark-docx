import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,r as n}from"./mermaid-parser.core-Cn98guqZ.js";import{n as r,r as i}from"./chunk-Y2CYZVJY-C0ErJKbO.js";import{C as a,t as o,w as s}from"./src-1m_fn7jP.js";import{U as c,W as l,a as u,c as d,f,j as p,q as m,v as h,w as g,x as _,y as v}from"./chunk-DU6HZSFF-CJejS-tc.js";import{S as y,n as b}from"./dist-CztjYdyG.js";import{n as x}from"./ordinal-CEEvSnZv.js";import{n as S,t as C}from"./chunk-JWPE2WC7-fSzem9U5.js";import{d as w,i as T,m as E}from"./chunk-75Z2AOVW-Clap_Al3.js";import{_ as D,v as O}from"./playground.stories-RlHF1wFu.js";var k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{C(),D(),w(),p(),a(),i(),t(),o(),k=f.pie,A={sections:new Map,showData:!1,config:k},j=A.sections,M=A.showData,N=structuredClone(k),P={getConfig:r(()=>structuredClone(N),`getConfig`),clear:r(()=>{j=new Map,M=A.showData,u()},`clear`),setDiagramTitle:m,getDiagramTitle:g,setAccTitle:l,getAccTitle:v,setAccDescription:c,getAccDescription:h,addSection:r(({label:e,value:t})=>{if(t<0)throw Error(`"${e}" has invalid value: ${t}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);j.has(e)||(j.set(e,t),s.debug(`added new section: ${e}, with value: ${t}`))},`addSection`),getSections:r(()=>j,`getSections`),setShowData:r(e=>{M=e},`setShowData`),getShowData:r(()=>M,`getShowData`)},F=r((e,t)=>{S(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},`populateDb`),I={parse:r(async e=>{let t=await n(`pie`,e);s.debug(t),F(t,P)},`parse`)},L=r(e=>`
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
`,`getStyles`),R=r(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),n=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1);return y().value(e=>e.value).sort(null)(n)},`createPieArcs`),z={parser:I,db:P,renderer:{draw:r((e,t,n,r)=>{s.debug(`rendering pie chart
`+e);let i=r.db,a=_(),o=T(i.getConfig(),a.pie),c=O(t),l=c.append(`g`);l.attr(`transform`,`translate(225,225)`);let{themeVariables:u}=a,[f]=E(u.pieOuterStrokeWidth);f??=2;let p=o.legendPosition,m=o.textPosition,h=o.donutHole>0&&o.donutHole<=.9?o.donutHole:0,g=b().innerRadius(h*185).outerRadius(185),v=b().innerRadius(185*m).outerRadius(185*m),y=l.append(`g`);y.append(`circle`).attr(`cx`,0).attr(`cy`,0).attr(`r`,185+f/2).attr(`class`,`pieOuterCircle`);let S=i.getSections(),C=R(S),w=[u.pie1,u.pie2,u.pie3,u.pie4,u.pie5,u.pie6,u.pie7,u.pie8,u.pie9,u.pie10,u.pie11,u.pie12],D=0;S.forEach(e=>{D+=e});let k=C.filter(e=>(e.data.value/D*100).toFixed(0)!==`0`),A=x(w).domain([...S.keys()]);y.selectAll(`mySlices`).data(k).enter().append(`path`).attr(`d`,g).attr(`fill`,e=>A(e.data.label)).attr(`class`,e=>{let t=`pieCircle`;return o.highlightSlice===`hover`?t+=` highlightedOnHover`:o.highlightSlice===e.data.label&&(t+=` highlighted`),t}),y.selectAll(`mySlices`).data(k).enter().append(`text`).text(e=>(e.data.value/D*100).toFixed(0)+`%`).attr(`transform`,e=>`translate(`+v.centroid(e)+`)`).style(`text-anchor`,`middle`).attr(`class`,`slice`);let j=l.append(`text`).text(i.getDiagramTitle()).attr(`x`,0).attr(`y`,-200).attr(`class`,`pieTitleText`),M=[...S.entries()].map(([e,t])=>({label:e,value:t})),N=l.selectAll(`.legend`).data(M).enter().append(`g`).attr(`class`,`legend`);N.append(`rect`).attr(`width`,18).attr(`height`,18).style(`fill`,e=>A(e.label)).style(`stroke`,e=>A(e.label)),N.append(`text`).attr(`x`,22).attr(`y`,14).text(e=>i.getShowData()?`${e.label} [${e.value}]`:e.label);let P=Math.max(...N.selectAll(`text`).nodes().map(e=>e?.getBoundingClientRect().width??0)),F=450,I=490,L=M.length*22;switch(p){case`center`:N.attr(`transform`,(e,t)=>{let n=22*M.length/2,r=-P/2-22,i=t*22-n;return`translate(`+r+`,`+i+`)`});break;case`top`:F+=L,N.attr(`transform`,(e,t)=>`translate(${-P/2-22}, ${t*22-185})`),y.attr(`transform`,()=>`translate(0, ${L+22})`);break;case`bottom`:F+=L,N.attr(`transform`,(e,t)=>{let n=-P/2-22,r=t*22- -207;return`translate(`+n+`,`+r+`)`});break;case`left`:I+=22+P,N.attr(`transform`,(e,t)=>{let n=22*M.length/2;return`translate(-207,`+(t*22-n)+`)`}),y.attr(`transform`,()=>`translate(${P+18+4}, 0)`);break;default:I+=22+P,N.attr(`transform`,(e,t)=>{let n=22*M.length/2;return`translate(216,`+(t*22-n)+`)`})}let z=j.node()?.getBoundingClientRect().width??0,B=225-z/2,V=225+z/2,H=Math.min(0,B),U=Math.max(I,V)-H;c.attr(`viewBox`,`${H} 0 ${U} ${F}`),d(c,F,U,o.useMaxWidth)},`draw`)},styles:L}})))()}B();export{z as diagram};