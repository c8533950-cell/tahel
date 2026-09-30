import type {AppState,Msg,Patch} from '../types'
import {addDays,schedule,uid} from '../utils'
export const addMsg=(s:AppState,planId:string,m:Msg):AppState=>({...s,plans:s.plans.map(p=>p.id===planId?{...p,msgs:[...p.msgs,m]}:p)})
export function applyPatch(s:AppState,planId:string,p:Patch):AppState{
  let {tasks,plans}=s
  if(p.markDoneId)tasks=tasks.map(t=>t.id===p.markDoneId?{...t,done:true}:t)
  if(p.split&&p.replaceId){
    const i=tasks.findIndex(t=>t.id===p.replaceId)
    if(i>=0){const o=tasks[i];tasks=[...tasks.slice(0,i),...p.split.map(d=>({id:uid(),planId,title:d.title,min:d.min,due:o.due,done:false})),...tasks.slice(i+1)]}
  }
  if(p.shiftDays){
    const n=p.shiftDays
    tasks=tasks.map(t=>t.planId===planId&&!t.done?{...t,due:addDays(t.due,n)}:t)
    plans=plans.map(x=>x.id===planId?{...x,deadline:addDays(x.deadline,n)}:x)
  }
  if(p.deadline){
    const dl=p.deadline
    const ids=tasks.filter(t=>t.planId===planId&&!t.done).map(t=>t.id)
    const ds=schedule(ids.length,dl)
    tasks=tasks.map(t=>{const i=ids.indexOf(t.id);return i<0?t:{...t,due:ds[i]}})
    plans=plans.map(x=>x.id===planId?{...x,deadline:dl}:x)
  }
  return{plans,tasks}
}
