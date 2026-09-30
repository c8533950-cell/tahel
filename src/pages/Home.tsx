import {useState} from 'react'
import {useApp} from '../state/store'
import {ai} from '../services/ai'
import {schedule,uid} from '../utils'
import {Progress} from '../components/ui'
const EX=['לעבור דירה','ללמוד למבחן','להתחיל להתאמן']
export default function Home({open}:{open:(id:string)=>void}){
  const {state,update}=useApp()
  const [text,setText]=useState('');const [busy,setBusy]=useState(false)
  const [err,setErr]=useState<string|null>(null)
  const [q,setQ]=useState<{title:string;deadline:string;question:string}|null>(null)
  const [ans,setAns]=useState('')
  const create=async(title:string,deadline:string)=>{
    const drafts=await ai.plan(title);const id=uid();const ds=schedule(drafts.length,deadline)
    update(s=>({plans:[{id,title,deadline,msgs:[]},...s.plans],
      tasks:[...s.tasks,...drafts.map((d,i)=>({id:uid(),planId:id,title:d.title,min:d.min,due:ds[i],done:false}))]}))
    setText('');setQ(null);setAns('');open(id)
  }
  const go=async()=>{
    if(!text.trim()||busy)return
    setBusy(true);setErr(null)
    try{
      const a=await ai.analyze(text)
      if(a.questions.length)setQ({title:a.title,deadline:a.deadline,question:a.questions[0]})
      else await create(a.title,a.deadline)
    }catch{setErr('לא הצלחנו לבנות תוכנית. הטקסט שלך נשמר, נסה שוב.')}
    setBusy(false)
  }
  const cont=async(skip=false)=>{
    if(!q||busy)return;setBusy(true);setErr(null)
    try{await create(!skip&&ans.trim()?`${q.title}: ${ans.trim()}`:q.title,q.deadline)}
    catch{setErr('לא הצלחנו לבנות תוכנית. נסה שוב.')}
    setBusy(false)
  }
  return <>
    <h1>מה עכשיו?</h1>
    <p className="mut">ספר לי מה אתה רוצה להשיג, ואני אעזור לך להבין מה הצעד הבא.</p>
    {q?<div className="card"><b>{q.question}</b>
      <textarea value={ans} onChange={e=>setAns(e.target.value)} rows={2} placeholder="התשובה שלך"/>
      <button className="btn" disabled={busy} onClick={()=>cont()}>{busy?'בונה תוכנית…':'המשך'}</button>
      <button className="link" disabled={busy} onClick={()=>cont(true)}>דלג</button></div>
    :<div className="card">
      <textarea value={text} onChange={e=>setText(e.target.value)} rows={4} placeholder="מה אתה רוצה לעשות?"/>
      <button className="btn" disabled={busy||!text.trim()} onClick={go}>{busy?'חושב על זה…':'יאללה, מתחילים'}</button>
      <div className="chips">{EX.map(x=><button key={x} className="chip" onClick={()=>setText(x)}>{x}</button>)}</div></div>}
    {err&&<div className="banner err">{err}</div>}
    {state.plans.length>0&&<><h3>התוכניות שלך</h3>
      {state.plans.map(p=>{const ts=state.tasks.filter(t=>t.planId===p.id);const d=ts.filter(t=>t.done).length
        const pct=ts.length?Math.round(d/ts.length*100):0
        return <div key={p.id} className="card click" onClick={()=>open(p.id)}><b>{p.title}</b><Progress pct={pct}/><small className="mut">{pct}% הושלם</small></div>})}</>}
  </>
}
