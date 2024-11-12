"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[499],{89194:function(e,t,r){r.d(t,{K:function(){return s}});var o=r(28294);class n{constructor(){this._requestMessageId=0,this._requestHandlers=new Map,this._notificationHandlers=new Map,this._responseHandlers=new Map,this._progressHandlers=new Map,this.setNotificationHandler(o.gD,e=>{this._onprogress(e)}),this.setRequestHandler(o.EO,e=>({}))}async connect(e){this._transport=e,this._transport.onclose=()=>{this._onclose()},this._transport.onerror=e=>{this._onerror(e)},this._transport.onmessage=e=>{"method"in e?"id"in e?this._onrequest(e):this._onnotification(e):this._onresponse(e)},await this._transport.start()}_onclose(){var e;let t=this._responseHandlers;this._responseHandlers=new Map,this._progressHandlers.clear(),this._transport=void 0,null===(e=this.onclose)||void 0===e||e.call(this);let r=new o.yp(o.jK.ConnectionClosed,"Connection closed");for(let e of t.values())e(r)}_onerror(e){var t;null===(t=this.onerror)||void 0===t||t.call(this,e)}_onnotification(e){var t;let r=null!==(t=this._notificationHandlers.get(e.method))&&void 0!==t?t:this.fallbackNotificationHandler;void 0!==r&&r(e).catch(e=>this._onerror(Error(`Uncaught error in notification handler: ${e}`)))}_onrequest(e){var t,r;let n=null!==(t=this._requestHandlers.get(e.method))&&void 0!==t?t:this.fallbackRequestHandler;if(void 0===n){null===(r=this._transport)||void 0===r||r.send({jsonrpc:"2.0",id:e.id,error:{code:o.jK.MethodNotFound,message:"Method not found"}}).catch(e=>this._onerror(Error(`Failed to send an error response: ${e}`)));return}n(e).then(t=>{var r;null===(r=this._transport)||void 0===r||r.send({result:t,jsonrpc:"2.0",id:e.id})},t=>{var r,n;return null===(r=this._transport)||void 0===r?void 0:r.send({jsonrpc:"2.0",id:e.id,error:{code:Number.isSafeInteger(t.code)?t.code:o.jK.InternalError,message:null!==(n=t.message)&&void 0!==n?n:"Internal error"}})}).catch(e=>this._onerror(Error(`Failed to send response: ${e}`)))}_onprogress(e){let{progress:t,total:r,progressToken:o}=e.params,n=this._progressHandlers.get(Number(o));if(void 0===n){this._onerror(Error(`Received a progress notification for an unknown token: ${JSON.stringify(e)}`));return}n({progress:t,total:r})}_onresponse(e){let t=e.id,r=this._responseHandlers.get(Number(t));if(void 0===r){this._onerror(Error(`Received a response for an unknown message ID: ${JSON.stringify(e)}`));return}this._responseHandlers.delete(Number(t)),this._progressHandlers.delete(Number(t)),r("result"in e?e:new o.yp(e.error.code,e.error.message,e.error.data))}get transport(){return this._transport}async close(){var e;await (null===(e=this._transport)||void 0===e?void 0:e.close())}request(e,t,r){return new Promise((o,n)=>{if(!this._transport){n(Error("Not connected"));return}let s=this._requestMessageId++,i={...e,jsonrpc:"2.0",id:s};r&&(this._progressHandlers.set(s,r),i.params={...e.params,_meta:{progressToken:s}}),this._responseHandlers.set(s,e=>{if(e instanceof Error)return n(e);try{let r=t.parse(e.result);o(r)}catch(e){n(e)}}),this._transport.send(i).catch(n)})}async notification(e){if(!this._transport)throw Error("Not connected");let t={...e,jsonrpc:"2.0"};await this._transport.send(t)}setRequestHandler(e,t){this._requestHandlers.set(e.shape.method.value,r=>Promise.resolve(t(e.parse(r))))}removeRequestHandler(e){this._requestHandlers.delete(e)}setNotificationHandler(e,t){this._notificationHandlers.set(e.shape.method.value,r=>Promise.resolve(t(e.parse(r))))}removeNotificationHandler(e){this._notificationHandlers.delete(e)}}class s extends n{constructor(e){super(),this._clientInfo=e}async connect(e){await super.connect(e);let t=await this.request({method:"initialize",params:{protocolVersion:o.P7,capabilities:{},clientInfo:this._clientInfo}},o.EE);if(void 0===t)throw Error(`Server sent invalid initialize result: ${t}`);if(!o.e5.includes(t.protocolVersion))throw Error(`Server's protocol version is not supported: ${t.protocolVersion}`);this._serverCapabilities=t.capabilities,this._serverVersion=t.serverInfo,await this.notification({method:"notifications/initialized"})}getServerCapabilities(){return this._serverCapabilities}getServerVersion(){return this._serverVersion}async ping(){return this.request({method:"ping"},o.Zs)}async complete(e,t){return this.request({method:"completion/complete",params:e},o.Bi,t)}async setLoggingLevel(e){return this.request({method:"logging/setLevel",params:{level:e}},o.Zs)}async getPrompt(e,t){return this.request({method:"prompts/get",params:e},o.Go,t)}async listPrompts(e,t){return this.request({method:"prompts/list",params:e},o.ev,t)}async listResources(e,t){return this.request({method:"resources/list",params:e},o.Ol,t)}async listResourceTemplates(e,t){return this.request({method:"resources/templates/list",params:e},o.CD,t)}async readResource(e,t){return this.request({method:"resources/read",params:e},o.vg,t)}async subscribeResource(e){return this.request({method:"resources/subscribe",params:e},o.Zs)}async unsubscribeResource(e){return this.request({method:"resources/unsubscribe",params:e},o.Zs)}async callTool(e,t=o.GR,r){return this.request({method:"tools/call",params:e},t,r)}async listTools(e,t){return this.request({method:"tools/list",params:e},o.Gd,t)}async sendRootsListChanged(){return this.notification({method:"notifications/roots/list_changed"})}}},28294:function(e,t,r){r.d(t,{Bi:function(){return ev},CD:function(){return F},EE:function(){return Z},EO:function(){return A},GR:function(){return ei},Gd:function(){return es},Go:function(){return et},M$:function(){return ea},Ol:function(){return R},P7:function(){return i},Zs:function(){return f},b5:function(){return ed},e5:function(){return a},ev:function(){return U},gD:function(){return q},jK:function(){return n},kO:function(){return eg},vg:function(){return S},yp:function(){return eA}});var o,n,s=r(97712);let i="2024-11-05",a=[i,"2024-10-07"],l=s.z.union([s.z.string(),s.z.number().int()]),c=s.z.string(),p=s.z.object({_meta:s.z.optional(s.z.object({progressToken:s.z.optional(l)}).passthrough())}).passthrough(),u=s.z.object({method:s.z.string(),params:s.z.optional(p)}),d=s.z.object({method:s.z.string(),params:s.z.optional(s.z.object({_meta:s.z.optional(s.z.object({}).passthrough())}).passthrough())}),h=s.z.object({_meta:s.z.optional(s.z.object({}).passthrough())}).passthrough(),z=s.z.union([s.z.string(),s.z.number().int()]),m=s.z.object({jsonrpc:s.z.literal("2.0"),id:z}).merge(u).strict(),g=s.z.object({jsonrpc:s.z.literal("2.0")}).merge(d).strict(),j=s.z.object({jsonrpc:s.z.literal("2.0"),id:z,result:h}).strict();(o=n||(n={}))[o.ConnectionClosed=-1]="ConnectionClosed",o[o.ParseError=-32700]="ParseError",o[o.InvalidRequest=-32600]="InvalidRequest",o[o.MethodNotFound=-32601]="MethodNotFound",o[o.InvalidParams=-32602]="InvalidParams",o[o.InternalError=-32603]="InternalError";let b=s.z.object({jsonrpc:s.z.literal("2.0"),id:z,error:s.z.object({code:s.z.number().int(),message:s.z.string(),data:s.z.optional(s.z.unknown())})}).strict();s.z.union([m,g,j,b]);let f=h.strict(),x=s.z.object({name:s.z.string(),version:s.z.string()}).passthrough(),v=s.z.object({experimental:s.z.optional(s.z.object({}).passthrough()),sampling:s.z.optional(s.z.object({}).passthrough()),roots:s.z.optional(s.z.object({listChanged:s.z.optional(s.z.boolean())}).passthrough())}).passthrough(),y=u.extend({method:s.z.literal("initialize"),params:p.extend({protocolVersion:s.z.string(),capabilities:v,clientInfo:x})}),_=s.z.object({experimental:s.z.optional(s.z.object({}).passthrough()),logging:s.z.optional(s.z.object({}).passthrough()),prompts:s.z.optional(s.z.object({listChanged:s.z.optional(s.z.boolean())}).passthrough()),resources:s.z.optional(s.z.object({subscribe:s.z.optional(s.z.boolean()),listChanged:s.z.optional(s.z.boolean())}).passthrough()),tools:s.z.optional(s.z.object({listChanged:s.z.optional(s.z.boolean())}).passthrough())}).passthrough(),Z=h.extend({protocolVersion:s.z.string(),capabilities:_,serverInfo:x}),w=d.extend({method:s.z.literal("notifications/initialized")}),A=u.extend({method:s.z.literal("ping")}),M=s.z.object({progress:s.z.number(),total:s.z.optional(s.z.number())}).passthrough(),q=d.extend({method:s.z.literal("notifications/progress"),params:M.extend({progressToken:l})}),E=u.extend({params:p.extend({cursor:s.z.optional(c)}).optional()}),H=h.extend({nextCursor:s.z.optional(c)}),P=s.z.object({uri:s.z.string(),mimeType:s.z.optional(s.z.string())}).passthrough(),O=P.extend({text:s.z.string()}),C=P.extend({blob:s.z.string().base64()}),I=s.z.object({uri:s.z.string(),name:s.z.string(),description:s.z.optional(s.z.string()),mimeType:s.z.optional(s.z.string())}).passthrough(),k=s.z.object({uriTemplate:s.z.string(),name:s.z.string(),description:s.z.optional(s.z.string()),mimeType:s.z.optional(s.z.string())}).passthrough(),N=E.extend({method:s.z.literal("resources/list")}),R=H.extend({resources:s.z.array(I)}),V=E.extend({method:s.z.literal("resources/templates/list")}),F=H.extend({resourceTemplates:s.z.array(k)}),T=u.extend({method:s.z.literal("resources/read"),params:p.extend({uri:s.z.string()})}),S=h.extend({contents:s.z.array(s.z.union([O,C]))}),$=d.extend({method:s.z.literal("notifications/resources/list_changed")}),D=u.extend({method:s.z.literal("resources/subscribe"),params:p.extend({uri:s.z.string()})}),G=u.extend({method:s.z.literal("resources/unsubscribe"),params:p.extend({uri:s.z.string()})}),K=d.extend({method:s.z.literal("notifications/resources/updated"),params:s.z.object({uri:s.z.string()}).passthrough()}),L=s.z.object({name:s.z.string(),description:s.z.optional(s.z.string()),required:s.z.optional(s.z.boolean())}).passthrough(),B=s.z.object({name:s.z.string(),description:s.z.optional(s.z.string()),arguments:s.z.optional(s.z.array(L))}).passthrough(),J=E.extend({method:s.z.literal("prompts/list")}),U=H.extend({prompts:s.z.array(B)}),W=u.extend({method:s.z.literal("prompts/get"),params:p.extend({name:s.z.string(),arguments:s.z.optional(s.z.record(s.z.string()))})}),Q=s.z.object({type:s.z.literal("text"),text:s.z.string()}).passthrough(),X=s.z.object({type:s.z.literal("image"),data:s.z.string().base64(),mimeType:s.z.string()}).passthrough(),Y=s.z.object({type:s.z.literal("resource"),resource:s.z.union([O,C])}).passthrough(),ee=s.z.object({role:s.z.enum(["user","assistant"]),content:s.z.union([Q,X,Y])}).passthrough(),et=h.extend({description:s.z.optional(s.z.string()),messages:s.z.array(ee)}),er=d.extend({method:s.z.literal("notifications/prompts/list_changed")}),eo=s.z.object({name:s.z.string(),description:s.z.optional(s.z.string()),inputSchema:s.z.object({type:s.z.literal("object"),properties:s.z.optional(s.z.object({}).passthrough())}).passthrough()}).passthrough(),en=E.extend({method:s.z.literal("tools/list")}),es=H.extend({tools:s.z.array(eo)}),ei=h.extend({content:s.z.array(s.z.union([Q,X,Y])),isError:s.z.boolean().default(!1)}),ea=ei.or(h.extend({toolResult:s.z.unknown()})),el=u.extend({method:s.z.literal("tools/call"),params:p.extend({name:s.z.string(),arguments:s.z.optional(s.z.record(s.z.unknown()))})}),ec=d.extend({method:s.z.literal("notifications/tools/list_changed")}),ep=s.z.enum(["debug","info","notice","warning","error","critical","alert","emergency"]),eu=u.extend({method:s.z.literal("logging/setLevel"),params:p.extend({level:ep})}),ed=d.extend({method:s.z.literal("notifications/message"),params:s.z.object({level:ep,logger:s.z.optional(s.z.string()),data:s.z.unknown()}).passthrough()}),eh=s.z.object({name:s.z.string().optional()}).passthrough(),ez=s.z.object({hints:s.z.optional(s.z.array(eh)),costPriority:s.z.optional(s.z.number().min(0).max(1)),speedPriority:s.z.optional(s.z.number().min(0).max(1)),intelligencePriority:s.z.optional(s.z.number().min(0).max(1))}).passthrough(),em=s.z.object({role:s.z.enum(["user","assistant"]),content:s.z.union([Q,X])}).passthrough(),eg=u.extend({method:s.z.literal("sampling/createMessage"),params:p.extend({messages:s.z.array(em),systemPrompt:s.z.optional(s.z.string()),includeContext:s.z.optional(s.z.enum(["none","thisServer","allServers"])),temperature:s.z.optional(s.z.number()),maxTokens:s.z.number().int(),stopSequences:s.z.optional(s.z.array(s.z.string())),metadata:s.z.optional(s.z.object({}).passthrough()),modelPreferences:s.z.optional(ez)})}),ej=h.extend({model:s.z.string(),stopReason:s.z.optional(s.z.enum(["endTurn","stopSequence","maxTokens"]).or(s.z.string())),role:s.z.enum(["user","assistant"]),content:s.z.discriminatedUnion("type",[Q,X])}),eb=s.z.object({type:s.z.literal("ref/resource"),uri:s.z.string()}).passthrough(),ef=s.z.object({type:s.z.literal("ref/prompt"),name:s.z.string()}).passthrough(),ex=u.extend({method:s.z.literal("completion/complete"),params:p.extend({ref:s.z.union([ef,eb]),argument:s.z.object({name:s.z.string(),value:s.z.string()}).passthrough()})}),ev=h.extend({completion:s.z.object({values:s.z.array(s.z.string()).max(100),total:s.z.optional(s.z.number().int()),hasMore:s.z.optional(s.z.boolean())}).passthrough()}),ey=s.z.object({uri:s.z.string().startsWith("file://"),name:s.z.optional(s.z.string())}).passthrough(),e_=u.extend({method:s.z.literal("roots/list")}),eZ=h.extend({roots:s.z.array(ey)}),ew=d.extend({method:s.z.literal("notifications/roots/list_changed")});s.z.union([A,y,ex,eu,W,J,N,V,T,D,G,el,en]),s.z.union([q,w,ew]),s.z.union([f,ej,eZ]),s.z.union([A,eg,e_]),s.z.union([q,ed,K,$,ec,er]),s.z.union([f,Z,ev,et,U,R,F,S,ei,es]);class eA extends Error{constructor(e,t,r){super(`MCP error ${e}: ${t}`),this.code=e,this.data=r}}},26169:function(e,t,r){r.d(t,{k:function(){return g}});var o=r(29758),n=r(7653),s=r(64864),i=r(95975),a=Object.defineProperty,l=Object.defineProperties,c=Object.getOwnPropertyDescriptors,p=Object.getOwnPropertySymbols,u=Object.prototype.hasOwnProperty,d=Object.prototype.propertyIsEnumerable,h=(e,t,r)=>t in e?a(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,z=(e,t)=>{for(var r in t||(t={}))u.call(t,r)&&h(e,r,t[r]);if(p)for(var r of p(t))d.call(t,r)&&h(e,r,t[r]);return e},m=(e,t)=>l(e,c(t));let g=(0,n.forwardRef)((e,t)=>o.j.jsx(s.Z,m(z({ref:t},e),{weights:i.Z})));g.displayName="Info"},1401:function(e,t,r){r.d(t,{Q:function(){return g}});var o=r(29758),n=r(7653),s=r(64864);let i=new Map([["bold",o.j.jsx(o.j.Fragment,{children:o.j.jsx("path",{d:"M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z"})})],["duotone",o.j.jsxs(o.j.Fragment,{children:[o.j.jsx("path",{d:"M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z",opacity:"0.2"}),o.j.jsx("path",{d:"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"})]})],["fill",o.j.jsx(o.j.Fragment,{children:o.j.jsx("path",{d:"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"})})],["light",o.j.jsx(o.j.Fragment,{children:o.j.jsx("path",{d:"M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Zm-6-82V80a6,6,0,0,1,12,0v56a6,6,0,0,1-12,0Zm16,36a10,10,0,1,1-10-10A10,10,0,0,1,138,172Z"})})],["regular",o.j.jsx(o.j.Fragment,{children:o.j.jsx("path",{d:"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"})})],["thin",o.j.jsx(o.j.Fragment,{children:o.j.jsx("path",{d:"M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.1,92.1,0,0,1,128,220Zm-4-84V80a4,4,0,0,1,8,0v56a4,4,0,0,1-8,0Zm12,36a8,8,0,1,1-8-8A8,8,0,0,1,136,172Z"})})]]);var a=Object.defineProperty,l=Object.defineProperties,c=Object.getOwnPropertyDescriptors,p=Object.getOwnPropertySymbols,u=Object.prototype.hasOwnProperty,d=Object.prototype.propertyIsEnumerable,h=(e,t,r)=>t in e?a(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,z=(e,t)=>{for(var r in t||(t={}))u.call(t,r)&&h(e,r,t[r]);if(p)for(var r of p(t))d.call(t,r)&&h(e,r,t[r]);return e},m=(e,t)=>l(e,c(t));let g=(0,n.forwardRef)((e,t)=>o.j.jsx(s.Z,m(z({ref:t},e),{weights:i})));g.displayName="WarningCircle"},95975:function(e,t,r){r.d(t,{Z:function(){return n}});var o=r(29758);let n=new Map([["bold",o.j.jsx(o.j.Fragment,{children:o.j.jsx("path",{d:"M108,84a16,16,0,1,1,16,16A16,16,0,0,1,108,84Zm128,44A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Zm-72,36.68V132a20,20,0,0,0-20-20,12,12,0,0,0-4,23.32V168a20,20,0,0,0,20,20,12,12,0,0,0,4-23.32Z"})})],["duotone",o.j.jsxs(o.j.Fragment,{children:[o.j.jsx("path",{d:"M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z",opacity:"0.2"}),o.j.jsx("path",{d:"M144,176a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176Zm88-48A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128ZM124,96a12,12,0,1,0-12-12A12,12,0,0,0,124,96Z"})]})],["fill",o.j.jsx(o.j.Fragment,{children:o.j.jsx("path",{d:"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-4,48a12,12,0,1,1-12,12A12,12,0,0,1,124,72Zm12,112a16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40a8,8,0,0,1,0,16Z"})})],["light",o.j.jsx(o.j.Fragment,{children:o.j.jsx("path",{d:"M142,176a6,6,0,0,1-6,6,14,14,0,0,1-14-14V128a2,2,0,0,0-2-2,6,6,0,0,1,0-12,14,14,0,0,1,14,14v40a2,2,0,0,0,2,2A6,6,0,0,1,142,176ZM124,94a10,10,0,1,0-10-10A10,10,0,0,0,124,94Zm106,34A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z"})})],["regular",o.j.jsx(o.j.Fragment,{children:o.j.jsx("path",{d:"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"})})],["thin",o.j.jsx(o.j.Fragment,{children:o.j.jsx("path",{d:"M140,176a4,4,0,0,1-4,4,12,12,0,0,1-12-12V128a4,4,0,0,0-4-4,4,4,0,0,1,0-8,12,12,0,0,1,12,12v40a4,4,0,0,0,4,4A4,4,0,0,1,140,176ZM124,92a8,8,0,1,0-8-8A8,8,0,0,0,124,92Zm104,36A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z"})})]])}}]);