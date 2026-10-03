const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({limit:'1mb'}));
app.use(express.static(path.join(__dirname,'public')));
const results=[]; const rooms=new Map();
function maskEmail(e=''){const [u,d]=String(e).split('@'); if(!d)return ''; return (u?u.slice(0,2)+'***':'***')+'@'+d;}
app.get('/api/health',(req,res)=>res.json({ok:true}));
app.get('/api/ranking',(req,res)=>{const top=[...results].sort((a,b)=>b.score-a.score).slice(0,10); const recentGood=[...results].filter(x=>x.score>0).sort((a,b)=>b.finishedAt-a.finishedAt).slice(0,10); res.json({top,recentGood});});
app.post('/api/results',(req,res)=>{const x=req.body||{}; const item={...x,email:maskEmail(x.email),finishedAt:Date.now()}; results.push(item); res.json({ok:true,item});});
app.post('/api/room',(req,res)=>{const code=String(Math.floor(100000+Math.random()*900000)); rooms.set(code,{code,settings:req.body||{},createdAt:Date.now()}); res.json({ok:true,code});});
app.get('/api/room',(req,res)=>{const room=rooms.get(String(req.query.code||'')); if(!room)return res.status(404).json({error:'room_not_found'}); res.json(room);});
app.post('/api/ai',(req,res)=>res.json({ok:false,error:'AI_API_NOT_CONFIGURED',message:'Nexa AI backend belum dikonfigurasi.'}));
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.listen(PORT,()=>console.log(`CerdasIn running on ${PORT}`));
