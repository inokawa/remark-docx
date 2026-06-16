import{i as e}from"./preload-helper-xPQekRTU.js";import{n as t,t as n}from"./mermaid-parser.core-BY3AD9j8.js";import{Bt as r,Ht as i,Vt as a}from"./src-BbDJI_sc.js";import{U as o,W as s,a as c,b as l,c as u,f as d,j as f,q as p,v as m,w as h,y as g}from"./chunk-CSCIHK7Q-Bz7jXthk.js";import{n as _,t as v}from"./chunk-WU5MYG2G-CpPfXbq8.js";import{d as y,i as b}from"./chunk-5ZQYHXKU-D_x5S51a.js";import{n as x,t as S}from"./chunk-4BX2VUAB-C-trUY8_.js";var C,w,T,E,D,O,k,A,j,M,N;e((()=>{v(),S(),y(),f(),a(),n(),C=d.packet,w=class{constructor(){this.packet=[],this.setAccTitle=s,this.getAccTitle=g,this.setDiagramTitle=p,this.getDiagramTitle=h,this.getAccDescription=m,this.setAccDescription=o}static{r(this,`PacketDB`)}getConfig(){let e=b({...C,...l().packet});return e.showBits&&(e.paddingY+=10),e}getPacket(){return this.packet}pushWord(e){e.length>0&&this.packet.push(e)}clear(){c(),this.packet=[]}},T=1e4,E=r((e,t)=>{x(e,t);let n=-1,r=[],a=1,{bitsPerRow:o}=t.getConfig();for(let{start:s,end:c,bits:l,label:u}of e.blocks){if(s!==void 0&&c!==void 0&&c<s)throw Error(`Packet block ${s} - ${c} is invalid. End must be greater than start.`);if(s??=n+1,s!==n+1)throw Error(`Packet block ${s} - ${c??s} is not contiguous. It should start from ${n+1}.`);if(l===0)throw Error(`Packet block ${s} is invalid. Cannot have a zero bit field.`);for(c??=s+(l??1)-1,l??=c-s+1,n=c,i.debug(`Packet block ${s} - ${n} with label ${u}`);r.length<=o+1&&t.getPacket().length<T;){let[e,n]=D({start:s,end:c,bits:l,label:u},a,o);if(r.push(e),e.end+1===a*o&&(t.pushWord(r),r=[],a++),!n)break;({start:s,end:c,bits:l,label:u}=n)}}t.pushWord(r)},`populate`),D=r((e,t,n)=>{if(e.start===void 0)throw Error(`start should have been set during first phase`);if(e.end===void 0)throw Error(`end should have been set during first phase`);if(e.start>e.end)throw Error(`Block start ${e.start} is greater than block end ${e.end}.`);if(e.end+1<=t*n)return[e,void 0];let r=t*n-1,i=t*n;return[{start:e.start,end:r,label:e.label,bits:r-e.start},{start:i,end:e.end,label:e.label,bits:e.end-i}]},`getNextFittingBlock`),O={parser:{yy:void 0},parse:r(async e=>{let n=await t(`packet`,e),r=O.parser?.yy;if(!(r instanceof w))throw Error(`parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.`);i.debug(n),E(n,r)},`parse`)},k=r((e,t,n,r)=>{let i=r.db,a=i.getConfig(),{rowHeight:o,paddingY:s,bitWidth:c,bitsPerRow:l}=a,d=i.getPacket(),f=i.getDiagramTitle(),p=o+s,m=p*(d.length+1)-(f?0:o),h=c*l+2,g=_(t);g.attr(`viewBox`,`0 0 ${h} ${m}`),u(g,m,h,a.useMaxWidth);for(let[e,t]of d.entries())A(g,t,e,a);g.append(`text`).text(f).attr(`x`,h/2).attr(`y`,m-p/2).attr(`dominant-baseline`,`middle`).attr(`text-anchor`,`middle`).attr(`class`,`packetTitle`)},`draw`),A=r((e,t,n,{rowHeight:r,paddingX:i,paddingY:a,bitWidth:o,bitsPerRow:s,showBits:c})=>{let l=e.append(`g`),u=n*(r+a)+a;for(let e of t){let t=e.start%s*o+1,n=(e.end-e.start+1)*o-i;if(l.append(`rect`).attr(`x`,t).attr(`y`,u).attr(`width`,n).attr(`height`,r).attr(`class`,`packetBlock`),l.append(`text`).attr(`x`,t+n/2).attr(`y`,u+r/2).attr(`class`,`packetLabel`).attr(`dominant-baseline`,`middle`).attr(`text-anchor`,`middle`).text(e.label),!c)continue;let a=e.end===e.start,d=u-2;l.append(`text`).attr(`x`,t+(a?n/2:0)).attr(`y`,d).attr(`class`,`packetByte start`).attr(`dominant-baseline`,`auto`).attr(`text-anchor`,a?`middle`:`start`).text(e.start),a||l.append(`text`).attr(`x`,t+n).attr(`y`,d).attr(`class`,`packetByte end`).attr(`dominant-baseline`,`auto`).attr(`text-anchor`,`end`).text(e.end)}},`drawWord`),j={draw:k},M={byteFontSize:`10px`,startByteColor:`black`,endByteColor:`black`,labelColor:`black`,labelFontSize:`12px`,titleColor:`black`,titleFontSize:`14px`,blockStrokeColor:`black`,blockStrokeWidth:`1`,blockFillColor:`#efefef`},N={parser:O,get db(){return new w},renderer:j,styles:r(({packet:e}={})=>{let t=b(M,e);return`
	.packetByte {
		font-size: ${t.byteFontSize};
	}
	.packetByte.start {
		fill: ${t.startByteColor};
	}
	.packetByte.end {
		fill: ${t.endByteColor};
	}
	.packetLabel {
		fill: ${t.labelColor};
		font-size: ${t.labelFontSize};
	}
	.packetTitle {
		fill: ${t.titleColor};
		font-size: ${t.titleFontSize};
	}
	.packetBlock {
		stroke: ${t.blockStrokeColor};
		stroke-width: ${t.blockStrokeWidth};
		fill: ${t.blockFillColor};
	}
	`},`styles`)}}))();export{N as diagram};