import {useState} from 'react'
import {useApp} from '../state/store'
import {ai} from '../services/ai'
import {addMsg,applyPatch} from '../state/patch'
import {Progress,Empty} from '../components/ui'
export default function PlanPage({id,back}:{id:string;back:()=>void}){
  const {state,update}=useApp()
  const plan=state.plans.find(p=>p.id===id)
  const [text,setText]=useState('');const [busy,setBusy]=useState(false);const [err,setErr]=useState<string|null>(null)
  if(!plan)return <><button className="link" onClick={back}>← חזרה</button><Empty text="התוכנית לא נמצאה."/></>
  const tasks=state.tasks.filter(t=>t.planId===id)
  const cur=tasks.find(t=>!t.done)
  const pct=tasks.length?Math.round(tasks.filter(t=>t.done).length/tasks.length*100):0
  const finish=(tid:string)=>update(s=>({...s,tasks:s.tasks.map(t=>t.id===tid?{...t,done:true}:t)}))
  const send=async(m:string)=>{
    m=m.trim();if(!m||busy)return;setText('');setBusy(true);setErr(null)
    update(s=>addMsg(s,id,{role:'user',text:m}))
    try{
      const r=await ai.chat(plan,tasks,m)
      update(s=>addMsg(r.patch?applyPatch(s,id,r.patch):s,id,{role:'ai',text:r.reply}))
    }catch{setErr('משהו השתבש בצ׳אט. נסה שוב.')}
    setBusy(false)
  }
  return <>
    <button className="link" onClick={back}>← חזרה</button>
    <h2>{plan.title}</h2><Progress pct={pct}/><small className="mut">{pct}% הושלם</small>
    {cur?<div className="card next"><small>הצעד הבא שלך</small><h3>{cur.title}</h3>
      <p className="mut">⏱ כ-{cur.min} דקות</p>
      <button className="btn" onClick={()=>finish(cur.id)}>סיימתי</button>
      <button className="link" onClick={()=>send('אין לי זמן השבוע')}>אין לי זמן</button>
      <button className="link" onClick={()=>send('לא יכול לבצע את זה')}>לא מסוגל</button></div>
    :<div className="card next"><h3>🎉 סיימת את התוכנית</h3></div>}
    <h3>התוכנית המלאה</h3>
    <div className="card">{tasks.map(t=><div key={t.id} className={'step '+(t.done?'done':t.id===cur?.id?'now':'')}>
      {t.done?'✓':t.id===cur?.id?'→':'○'} {t.title}</div>)}</div>
    <h3>צ׳אט עם ה-AI</h3>
    <div className="card">{plan.msgs.length===0&&<p className="mut">כתוב למשל: "אין לי זמן השבוע", "כבר עשיתי את זה" או "הדדליין עכשיו בעוד שבועיים".</p>}
      {plan.msgs.map((m,i)=><div key={i} className={'msg '+m.role}>{m.text}</div>)}
      {busy&&<div className="msg ai mut">חושב…</div>}{err&&<div className="banner err">{err}</div>}
      <div className="send"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(text)} placeholder="כתוב הודעה"/>
        <button className="btn" disabled={busy||!text.trim()} onClick={()=>send(text)}>שלח</button></div></div>
  </>
}
