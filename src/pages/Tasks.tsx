import {useState} from 'react'
import {useApp} from '../state/store'
import {today,uid} from '../utils'
import {Empty,TaskRow} from '../components/ui'
type F='open'|'future'|'done'
export default function Tasks({open}:{open:(id:string)=>void}){
  const {state,update}=useApp()
  const [f,setF]=useState<F>('open')
  const [title,setTitle]=useState('');const [planId,setPlanId]=useState('');const [due,setDue]=useState(today());const [rem,setRem]=useState('')
  const toggle=(id:string)=>update(s=>({...s,tasks:s.tasks.map(t=>t.id===id?{...t,done:!t.done}:t)}))
  const add=()=>{
    if(!title.trim())return
    update(s=>({...s,tasks:[...s.tasks,{id:uid(),planId,title:title.trim(),min:15,due,done:false,remindAt:rem?new Date(rem).toISOString():undefined}]}))
    setTitle('');setRem('')
  }
  const list=state.tasks.filter(t=>f==='done'?t.done:f==='open'?!t.done&&t.due<=today():!t.done&&t.due>today())
  return <><h1>המשימות שלי</h1>
    <div className="chips">{([['open','פתוחות'],['future','עתידיות'],['done','הושלמו']] as [F,string][]).map(([k,l])=>
      <button key={k} className={'chip'+(f===k?' on':'')} onClick={()=>setF(k)}>{l}</button>)}</div>
    {list.length===0?<Empty text="אין כאן משימות."/>:<div className="card">{list.map(t=>{const p=state.plans.find(x=>x.id===t.planId)
      return <TaskRow key={t.id} t={t} plan={p?.title} onToggle={()=>toggle(t.id)} onOpen={p?()=>open(p.id):undefined}/>})}</div>}
    <h3>משימה חדשה</h3>
    <div className="card"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="למשל: להתקשר למוביל"/>
      <select value={planId} onChange={e=>setPlanId(e.target.value)}><option value="">ללא תוכנית</option>{state.plans.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select>
      <label className="mut">תאריך<input type="date" value={due} onChange={e=>setDue(e.target.value)}/></label>
      <label className="mut">תזכורת (אופציונלי)<input type="datetime-local" value={rem} onChange={e=>setRem(e.target.value)}/></label>
      <button className="btn" disabled={!title.trim()} onClick={add}>הוסף משימה</button></div></>
}
