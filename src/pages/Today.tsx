import {useApp} from '../state/store'
import {today} from '../utils'
import {Empty,TaskRow} from '../components/ui'
export default function Today({open}:{open:(id:string)=>void}){
  const {state,update}=useApp()
  const list=state.tasks.filter(t=>!t.done&&t.due<=today())
  const toggle=(id:string)=>update(s=>({...s,tasks:s.tasks.map(t=>t.id===id?{...t,done:!t.done}:t)}))
  const h=new Date().getHours()
  return <><h1>{h<12?'בוקר טוב':h<18?'צהריים טובים':'ערב טוב'} 👋</h1><h3>היום שלך:</h3>
    {list.length===0?<Empty text="אין משימות להיום. אפשר לנוח, או להגדיר מטרה חדשה בבית."/>
    :<div className="card">{list.map(t=>{const p=state.plans.find(x=>x.id===t.planId)
      return <TaskRow key={t.id} t={t} plan={p?.title} onToggle={()=>toggle(t.id)} onOpen={p?()=>open(p.id):undefined}/>})}</div>}</>
}
