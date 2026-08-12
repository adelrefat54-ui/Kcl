const foods={
"أرز أبيض مطبوخ":{cal:130,p:2.7,c:28,f:.3},"مكرونة مطبوخة":{cal:158,p:5.8,c:30.9,f:.9},
"صدور فراخ مشوية":{cal:165,p:31,c:0,f:3.6},"لحمة بقري مطبوخة":{cal:250,p:26,c:0,f:16},
"بيض كامل":{cal:143,p:12.6,c:.7,f:9.5},"فول مدمس":{cal:110,p:7.6,c:19.7,f:.4},
"عيش بلدي":{cal:270,p:9,c:55,f:2.5},"بطاطس مسلوقة":{cal:87,p:1.9,c:20.1,f:.1},
"تونة مصفاة":{cal:132,p:28.7,c:0,f:1},"لبن كامل":{cal:61,p:3.2,c:4.8,f:3.3},
"زبادي":{cal:61,p:3.5,c:4.7,f:3.3},"موز":{cal:89,p:1.1,c:22.8,f:.3},
"تفاح":{cal:52,p:.3,c:13.8,f:.2},"شوفان":{cal:389,p:16.9,c:66.3,f:6.9},
"زبدة فول سوداني":{cal:588,p:25,c:20,f:50},"جبنة قريش":{cal:98,p:11.1,c:3.4,f:4.3}
};
let day=JSON.parse(localStorage.getItem("kcl_day")||"[]");
let targets=JSON.parse(localStorage.getItem("kcl_targets")||"null");
const $=id=>document.getElementById(id);
Object.keys(foods).forEach(n=>{let o=document.createElement("option");o.textContent=n;o.value=n;$("food").appendChild(o)});
function calc(){
 const w=+$("weight").value,h=+$("height").value,a=+$("age").value,sex=$("sex").value,act=+$("activity").value,g=$("goal").value;
 let bmr=10*w+6.25*h-5*a+(sex==="male"?5:-161), t=bmr*act;
 if(g==="bulk")t*=1.12;if(g==="cut")t*=.82;
 let p=Math.round(w*(g==="bulk"?2.2:2)), f=Math.round(w*.9), c=Math.max(0,Math.round((t-p*4-f*9)/4));
 targets={cal:Math.round(t),p,c,f};localStorage.setItem("kcl_targets",JSON.stringify(targets));
 $("target").textContent=`هدفك اليومي: ${targets.cal} سعرة — ${targets.p} بروتين — ${targets.c} كارب — ${targets.f} دهون`;
 render();
}
function add(){
 const f=foods[$("food").value], g=+$("grams").value;
 if(!g)return;
 day.push({meal:$("meal").value,food:$("food").value,grams:g,cal:f.cal*g/100,p:f.p*g/100,c:f.c*g/100,f:f.f*g/100});
 localStorage.setItem("kcl_day",JSON.stringify(day));render();
}
function render(){
 let t=day.reduce((x,y)=>({cal:x.cal+y.cal,p:x.p+y.p,c:x.c+y.c,f:x.f+y.f}),{cal:0,p:0,c:0,f:0});
 $("calories").textContent=Math.round(t.cal);$("protein").textContent=Math.round(t.p);$("carbs").textContent=Math.round(t.c);$("fat").textContent=Math.round(t.f);
 $("list").innerHTML=day.length?day.map((x,i)=>`<div class="item"><div><b>${x.food}</b><br><small>${x.meal} — ${x.grams} جم — ${Math.round(x.cal)} سعرة | P ${Math.round(x.p)} | C ${Math.round(x.c)} | F ${Math.round(x.f)}</small></div><button class="del" onclick="removeItem(${i})">حذف</button></div>`).join(""):"<div class='target'>لسه مفيش أكل مضاف النهارده.</div>";
 if(targets && $("target").textContent.includes("اضغط")) $("target").textContent=`هدفك اليومي: ${targets.cal} سعرة — ${targets.p} بروتين — ${targets.c} كارب — ${targets.f} دهون`;
}
function removeItem(i){day.splice(i,1);localStorage.setItem("kcl_day",JSON.stringify(day));render()}
$("calcBtn").onclick=calc;$("addBtn").onclick=add;
$("resetBtn").onclick=()=>{if(confirm("تصفّر أكل اليوم؟")){day=[];localStorage.removeItem("kcl_day");render()}};
if(targets)$("target").textContent=`هدفك اليومي: ${targets.cal} سعرة — ${targets.p} بروتين — ${targets.c} كارب — ${targets.f} دهون`;
render();