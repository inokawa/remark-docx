import{i as e}from"./preload-helper-BdFrVu1K.js";import{n as t,r as n}from"./chunk-Y2CYZVJY-CieNGKXb.js";import{Bt as r,zt as i}from"./src-CKL93QEn.js";import{B as a,D as o,a as s,b as c,c as l,j as u,x as d}from"./chunk-WYO6CB5R-DGabAujk.js";import{n as f,t as p}from"./chunk-VAUOI2AC-D-p8ddxD.js";var m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U=e((()=>{p(),u(),i(),n(),m=``,h=``,g=``,_=[],v=new Map,y=t(e=>a(e,d()),`sanitizeText`),b=t(e=>{switch(e.type){case`terminal`:return{...e,value:y(e.value)};case`nonterminal`:return{...e,name:y(e.name)};case`sequence`:return{...e,elements:e.elements.map(b)};case`choice`:return{...e,alternatives:e.alternatives.map(b)};case`optional`:return{...e,element:b(e.element)};case`repetition`:return{...e,element:b(e.element),separator:e.separator?b(e.separator):void 0};case`special`:return{...e,text:y(e.text)}}},`sanitizeAstNode`),x=t(()=>{m=``,h=``,g=``,_.length=0,v.clear(),s(),r.debug(`[Railroad] Database cleared`)},`clear`),S=t(e=>{m=y(e),r.debug(`[Railroad] Title set:`,e)},`setTitle`),C=t(()=>m,`getTitle`),w={clear:x,setTitle:S,getTitle:C,addRule:t(e=>{let t={...e,name:y(e.name),definition:b(e.definition),comment:e.comment?y(e.comment):void 0};r.debug(`[Railroad] Adding rule:`,t.name),v.has(t.name)&&r.warn(`[Railroad] Rule '${t.name}' is already defined. Overwriting.`),_.push(t),v.set(t.name,t)},`addRule`),getRules:t(()=>_,`getRules`),getRule:t(e=>v.get(e),`getRule`),setAccTitle:t(e=>{h=y(e).replace(/^\s+/g,``),r.debug(`[Railroad] Accessibility title set:`,e)},`setAccTitle`),getAccTitle:t(()=>h,`getAccTitle`),setAccDescription:t(e=>{g=y(e).replace(/\n\s+/g,`
`),r.debug(`[Railroad] Accessibility description set:`,e)},`setAccDescription`),getAccDescription:t(()=>g,`getAccDescription`),setDiagramTitle:S,getDiagramTitle:C},T={compactMode:!1,padding:10,verticalSeparation:8,horizontalSeparation:10,arcRadius:10,fontSize:14,fontFamily:`monospace`,terminalFill:`#FFFFC0`,terminalStroke:`#000000`,terminalTextColor:`#000000`,nonTerminalFill:`#FFFFFF`,nonTerminalStroke:`#000000`,nonTerminalTextColor:`#000000`,lineColor:`#000000`,strokeWidth:2,markerFill:`#000000`,commentFill:`#E8E8E8`,commentStroke:`#888888`,commentTextColor:`#666666`,specialFill:`#F0E0FF`,specialStroke:`#8800CC`,ruleNameColor:`#000066`,showMarkers:!0,markerRadius:5},E=/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$|^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s%+,./-]+\)$|^[a-z]+$/i,D=/^[\w "',.-]+$/,O=new Set([`compactMode`,`padding`,`verticalSeparation`,`horizontalSeparation`,`arcRadius`,`fontSize`,`fontFamily`,`terminalFill`,`terminalStroke`,`terminalTextColor`,`nonTerminalFill`,`nonTerminalStroke`,`nonTerminalTextColor`,`lineColor`,`strokeWidth`,`markerFill`,`commentFill`,`commentStroke`,`commentTextColor`,`specialFill`,`specialStroke`,`ruleNameColor`,`showMarkers`,`markerRadius`]),k=t(e=>e?Object.keys(e).every(e=>e===`railroad`||O.has(e)):!1,`isRailroadStyleOptions`),A=t(e=>e?`railroad`in e&&e.railroad?e.railroad:k(e)?e:{}:{},`extractRailroadOverrides`),j=t(e=>{if(!e||k(e))return{};let{railroad:t,svgId:n,theme:r,look:i,...a}=e;return a},`extractThemeOverrides`),M=t((e,t)=>{if(typeof e!=`string`)return t;let n=e.trim();return E.test(n)?n:t},`sanitizeColorValue`),N=t((e,t)=>{if(typeof e!=`string`)return t;let n=e.trim();return D.test(n)?n:t},`sanitizeFontFamilyValue`),P=t((e,t)=>{let n=typeof e==`number`?e:typeof e==`string`?Number.parseFloat(e):NaN;return Number.isFinite(n)&&n>=0?n:t},`sanitizeNumberValue`),F=t(e=>{let t=typeof e==`number`?e:typeof e==`string`?Number.parseFloat(e):NaN;return Number.isFinite(t)&&t>0?t:void 0},`parseThemeFontSize`),I=t(e=>{let t=N(e.fontFamily,T.fontFamily),n=F(e.fontSize)??T.fontSize;return{...T,fontFamily:t,fontSize:n,terminalFill:M(e.secondBkg??e.secondaryColor,T.terminalFill),terminalStroke:M(e.secondaryBorderColor??e.lineColor,T.terminalStroke),terminalTextColor:M(e.secondaryTextColor??e.textColor,T.terminalTextColor),nonTerminalFill:M(e.mainBkg??e.background,T.nonTerminalFill),nonTerminalStroke:M(e.primaryBorderColor??e.lineColor,T.nonTerminalStroke),nonTerminalTextColor:M(e.primaryTextColor??e.textColor,T.nonTerminalTextColor),lineColor:M(e.lineColor,T.lineColor),markerFill:M(e.lineColor,T.markerFill),commentFill:M(e.labelBackground??e.tertiaryColor,T.commentFill),commentStroke:M(e.tertiaryBorderColor??e.lineColor,T.commentStroke),commentTextColor:M(e.tertiaryTextColor??e.textColor,T.commentTextColor),specialFill:M(e.tertiaryColor??e.secondaryColor,T.specialFill),specialStroke:M(e.tertiaryBorderColor??e.secondaryBorderColor,T.specialStroke),ruleNameColor:M(e.titleColor??e.textColor,T.ruleNameColor)}},`buildThemeDefaults`),L=t(e=>{let t=c(),n=I({...o(),...t.themeVariables??{},...j(e)}),r={...t.railroad??{},...A(e)};return{compactMode:r.compactMode??n.compactMode,padding:P(r.padding,n.padding),verticalSeparation:P(r.verticalSeparation,n.verticalSeparation),horizontalSeparation:P(r.horizontalSeparation,n.horizontalSeparation),arcRadius:P(r.arcRadius,n.arcRadius),fontSize:P(r.fontSize,n.fontSize),fontFamily:N(r.fontFamily,n.fontFamily),terminalFill:M(r.terminalFill,n.terminalFill),terminalStroke:M(r.terminalStroke,n.terminalStroke),terminalTextColor:M(r.terminalTextColor,n.terminalTextColor),nonTerminalFill:M(r.nonTerminalFill,n.nonTerminalFill),nonTerminalStroke:M(r.nonTerminalStroke,n.nonTerminalStroke),nonTerminalTextColor:M(r.nonTerminalTextColor,n.nonTerminalTextColor),lineColor:M(r.lineColor,n.lineColor),strokeWidth:P(r.strokeWidth,n.strokeWidth),markerFill:M(r.markerFill,n.markerFill),commentFill:M(r.commentFill,n.commentFill),commentStroke:M(r.commentStroke,n.commentStroke),commentTextColor:M(r.commentTextColor,n.commentTextColor),specialFill:M(r.specialFill,n.specialFill),specialStroke:M(r.specialStroke,n.specialStroke),ruleNameColor:M(r.ruleNameColor,n.ruleNameColor),showMarkers:r.showMarkers??n.showMarkers,markerRadius:P(r.markerRadius,n.markerRadius)}},`buildRailroadStyleOptions`),R=t(e=>{let{fontFamily:t,fontSize:n,terminalFill:r,terminalStroke:i,terminalTextColor:a,nonTerminalFill:o,nonTerminalStroke:s,nonTerminalTextColor:c,lineColor:l,strokeWidth:u,markerFill:d,commentFill:f,commentStroke:p,commentTextColor:m,specialFill:h,specialStroke:g,ruleNameColor:_}=L(e);return`
  .railroad-diagram {
    font-family: ${t};
    font-size: ${n}px;
  }

  .railroad-terminal rect {
    fill: ${r};
    stroke: ${i};
    stroke-width: ${u}px;
  }

  .railroad-terminal text {
    fill: ${a};
    font-family: ${t};
    font-size: ${n}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-nonterminal rect {
    fill: ${o};
    stroke: ${s};
    stroke-width: ${u}px;
  }

  .railroad-nonterminal text {
    fill: ${c};
    font-family: ${t};
    font-size: ${n}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-line {
    stroke: ${l};
    stroke-width: ${u}px;
    fill: none;
  }

  .railroad-start circle,
  .railroad-end circle {
    fill: ${d};
  }

  .railroad-comment ellipse {
    fill: ${f};
    stroke: ${p};
    stroke-width: ${u}px;
  }

  .railroad-comment text {
    fill: ${m};
    font-style: italic;
    font-family: ${t};
    font-size: ${n}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-special rect {
    fill: ${h};
    stroke: ${g};
    stroke-width: ${u}px;
    stroke-dasharray: 5,3;
  }

  .railroad-special text {
    fill: ${c};
    font-family: ${t};
    font-size: ${n}px;
    text-anchor: middle;
    dominant-baseline: middle;
  }

  .railroad-rule-name {
    font-weight: bold;
    fill: ${_};
    font-family: ${t};
    font-size: ${n}px;
  }

  .railroad-group {
    /* Grouping container, no specific styles */
  }
`},`getStyles`),z=class{constructor(){this.d=``}static{t(this,`PathBuilder`)}moveTo(e,t){return this.d+=`M ${e} ${t} `,this}lineTo(e,t){return this.d+=`L ${e} ${t} `,this}horizontalTo(e){return this.d+=`H ${e} `,this}verticalTo(e){return this.d+=`V ${e} `,this}arcTo(e,t,n,r,i,a,o){return this.d+=`A ${e} ${t} ${n} ${+!!r} ${+!!i} ${a} ${o} `,this}build(){return this.d.trim()}},B=class{constructor(e,t=L()){this.textCache=new Map,this.svg=e,this.config=t}static{t(this,`RailroadRenderer`)}measureText(e){if(this.textCache.has(e))return this.textCache.get(e);let t=this.svg.append(`text`).attr(`font-family`,this.config.fontFamily).attr(`font-size`,this.config.fontSize).text(e),n=t.node().getBBox(),r={width:n.width,height:n.height};return t.remove(),this.textCache.set(e,r),r}renderTerminal(e,t){let n=this.measureText(t),r=n.width+this.config.padding*2,i=n.height+this.config.padding*2,a=e.append(`g`).attr(`class`,`railroad-terminal`);return a.append(`rect`).attr(`x`,0).attr(`y`,0).attr(`width`,r).attr(`height`,i).attr(`rx`,10).attr(`ry`,10),a.append(`text`).attr(`x`,r/2).attr(`y`,i/2).text(t),{element:a.node(),dimensions:{width:r,height:i,up:i/2,down:i/2}}}renderNonTerminal(e,t){let n=this.measureText(t),r=n.width+this.config.padding*2,i=n.height+this.config.padding*2,a=e.append(`g`).attr(`class`,`railroad-nonterminal`);return a.append(`rect`).attr(`x`,0).attr(`y`,0).attr(`width`,r).attr(`height`,i),a.append(`text`).attr(`x`,r/2).attr(`y`,i/2).text(t),{element:a.node(),dimensions:{width:r,height:i,up:i/2,down:i/2}}}renderSequence(e,t){let n=t.map(t=>this.renderExpression(e,t)),r=0,i=0,a=0;for(let e of n)r+=e.dimensions.width,i=Math.max(i,e.dimensions.up),a=Math.max(a,e.dimensions.down);r+=(n.length-1)*this.config.horizontalSeparation;let o=e.append(`g`).attr(`class`,`railroad-sequence`),s=0;for(let e=0;e<n.length;e++){let t=n[e],r=i-t.dimensions.up;if(o.node().appendChild(t.element).setAttribute(`transform`,`translate(${s}, ${r})`),e<n.length-1){let e=s+t.dimensions.width,n=e+this.config.horizontalSeparation,r=i;o.append(`path`).attr(`class`,`railroad-line`).attr(`d`,new z().moveTo(e,r).lineTo(n,r).build())}s+=t.dimensions.width+this.config.horizontalSeparation}return{element:o.node(),dimensions:{width:r,height:i+a,up:i,down:a}}}renderChoice(e,t){let n=t.map(t=>this.renderExpression(e,t)),r=0,i=0;for(let e of n)r=Math.max(r,e.dimensions.width),i+=e.dimensions.height;i+=(n.length-1)*this.config.verticalSeparation;let a=this.config.arcRadius,o=a*4,s=r+o,c=e.append(`g`).attr(`class`,`railroad-choice`),l=0,u=i/2;for(let e of n){let t=l,n=t+e.dimensions.up,i=a*2+(r-e.dimensions.width)/2;c.node().appendChild(e.element).setAttribute(`transform`,`translate(${i}, ${t})`);let o=new z,d=n>u;n===u?o.moveTo(0,u).lineTo(i,n):o.moveTo(0,u).arcTo(a,a,0,!1,d,a,u+(d?a:-a)).lineTo(a,n-(d?a:-a)).arcTo(a,a,0,!1,!d,a*2,n).lineTo(i,n),c.append(`path`).attr(`class`,`railroad-line`).attr(`d`,o.build());let f=new z,p=i+e.dimensions.width,m=s-a*2;n===u?f.moveTo(p,n).lineTo(s,u):f.moveTo(p,n).lineTo(m,n).arcTo(a,a,0,!1,!d,s-a,n+(d?-a:a)).lineTo(s-a,u+(d?a:-a)).arcTo(a,a,0,!1,d,s,u),c.append(`path`).attr(`class`,`railroad-line`).attr(`d`,f.build()),l+=e.dimensions.height+this.config.verticalSeparation}return{element:c.node(),dimensions:{width:s,height:i,up:u,down:i-u}}}renderOptional(e,t){let n=this.renderExpression(e,t),r=this.config.arcRadius,i=r*2,a=n.dimensions.width+r*4,o=n.dimensions.height+i,s=e.append(`g`).attr(`class`,`railroad-optional`),c=r*2,l=i;s.node().appendChild(n.element).setAttribute(`transform`,`translate(${c}, ${l})`);let u=l+n.dimensions.up,d=new z().moveTo(0,u).lineTo(r*2,u);s.append(`path`).attr(`class`,`railroad-line`).attr(`d`,d.build());let f=new z().moveTo(c+n.dimensions.width,u).lineTo(a,u);s.append(`path`).attr(`class`,`railroad-line`).attr(`d`,f.build());let p=new z().moveTo(0,u).arcTo(r,r,0,!1,!1,r,u-r).lineTo(r,r).arcTo(r,r,0,!1,!0,r*2,0).lineTo(a-r*2,0).arcTo(r,r,0,!1,!0,a-r,r).lineTo(a-r,u-r).arcTo(r,r,0,!1,!1,a,u);return s.append(`path`).attr(`class`,`railroad-line`).attr(`d`,p.build()),{element:s.node(),dimensions:{width:a,height:o,up:u,down:o-u}}}renderRepetition(e,t,n){let r=this.renderExpression(e,t),i=this.config.arcRadius,a=i*2,o=r.dimensions.width+i*4,s=n===0,c=r.dimensions.height+a+(s?a:0),l=e.append(`g`).attr(`class`,`railroad-repetition`),u=i*2,d=s?a:0;l.node().appendChild(r.element).setAttribute(`transform`,`translate(${u}, ${d})`);let f=d+r.dimensions.up;l.append(`path`).attr(`class`,`railroad-line`).attr(`d`,new z().moveTo(0,f).lineTo(i*2,f).build()),l.append(`path`).attr(`class`,`railroad-line`).attr(`d`,new z().moveTo(u+r.dimensions.width,f).lineTo(o,f).build());let p=d+r.dimensions.height+i,m=new z().moveTo(u+r.dimensions.width,f).arcTo(i,i,0,!1,!0,u+r.dimensions.width+i,f+i).lineTo(u+r.dimensions.width+i,p).arcTo(i,i,0,!1,!0,u+r.dimensions.width,p+i).lineTo(i*2,p+i).arcTo(i,i,0,!1,!0,i,p).lineTo(i,f+i).arcTo(i,i,0,!1,!0,i*2,f);if(l.append(`path`).attr(`class`,`railroad-line`).attr(`d`,m.build()),s){let e=new z().moveTo(0,f).arcTo(i,i,0,!1,!1,i,f-i).lineTo(i,i).arcTo(i,i,0,!1,!0,i*2,0).lineTo(o-i*2,0).arcTo(i,i,0,!1,!0,o-i,i).lineTo(o-i,f-i).arcTo(i,i,0,!1,!1,o,f);l.append(`path`).attr(`class`,`railroad-line`).attr(`d`,e.build())}return{element:l.node(),dimensions:{width:o,height:c,up:f,down:c-f}}}renderSpecial(e,t){let n=this.measureText(`? `+t+` ?`),r=n.width+this.config.padding*2,i=n.height+this.config.padding*2,a=e.append(`g`).attr(`class`,`railroad-special`);return a.append(`rect`).attr(`x`,0).attr(`y`,0).attr(`width`,r).attr(`height`,i),a.append(`text`).attr(`x`,r/2).attr(`y`,i/2).text(`? `+t+` ?`),{element:a.node(),dimensions:{width:r,height:i,up:i/2,down:i/2}}}renderExpression(e,t){switch(t.type){case`terminal`:return this.renderTerminal(e,t.value);case`nonterminal`:return this.renderNonTerminal(e,t.name);case`sequence`:return this.renderSequence(e,t.elements);case`choice`:return this.renderChoice(e,t.alternatives);case`optional`:return this.renderOptional(e,t.element);case`repetition`:return this.renderRepetition(e,t.element,t.min);case`special`:return this.renderSpecial(e,t.text);default:throw Error(`Unknown node type: ${t.type}`)}}renderRule(e,t){let n=this.svg.append(`g`).attr(`class`,`railroad-rule`).attr(`transform`,`translate(0, ${t})`),r=e.name+` =`,i=this.measureText(r).width+20,a=i+20,o=n.append(`g`),s=this.renderExpression(o,e.definition),c=Math.max(20,s.dimensions.up),l=c-s.dimensions.up;return o.attr(`transform`,`translate(${a}, ${l})`),n.append(`g`).attr(`class`,`railroad-rule-name-group`).append(`text`).attr(`class`,`railroad-rule-name`).attr(`x`,0).attr(`y`,c).text(r),n.append(`g`).attr(`class`,`railroad-start`).append(`circle`).attr(`cx`,i).attr(`cy`,c).attr(`r`,this.config.markerRadius),n.append(`g`).attr(`class`,`railroad-end`).append(`circle`).attr(`cx`,a+s.dimensions.width+10).attr(`cy`,c).attr(`r`,this.config.markerRadius),n.append(`path`).attr(`class`,`railroad-line`).attr(`d`,new z().moveTo(i+this.config.markerRadius,c).lineTo(a,c).build()),n.append(`path`).attr(`class`,`railroad-line`).attr(`d`,new z().moveTo(a+s.dimensions.width,c).lineTo(a+s.dimensions.width+10-this.config.markerRadius,c).build()),{height:Math.max(40,l+s.dimensions.height+this.config.padding*2),width:a+s.dimensions.width+10+this.config.markerRadius}}renderDiagram(e){let t=this.config.padding,n=0;for(let r of e){let e=this.renderRule(r,t);t+=e.height+this.config.verticalSeparation,n=Math.max(n,e.width)}return{width:n+this.config.padding*2,height:t+this.config.padding}}},V=t((e,t,n)=>{l(e,t.height,t.width,n),e.attr(`viewBox`,`0 0 ${t.width} ${t.height}`)},`configureRailroadSvgSize`),H={draw:t((e,t,n)=>{r.debug(`[Railroad] Rendering diagram
`+e);try{let e=f(t);e.attr(`class`,`railroad-diagram`);let n=c().railroad?.useMaxWidth??!0,i=w.getRules();if(r.debug(`[Railroad] Rendering ${i.length} rules`),i.length===0){r.warn(`[Railroad] No rules to render`),V(e,{height:100,width:200},n);return}V(e,new B(e,L()).renderDiagram(i),n),r.debug(`[Railroad] Render complete`)}catch(e){throw r.error(`[Railroad] Render error:`,e),e}},`draw`)}}));export{H as i,R as n,U as r,w as t};