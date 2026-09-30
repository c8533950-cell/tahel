import {useEffect,useState} from 'react'
import {useApp} from '../state/store'
// תשתית תזכורות: כשהאפליקציה פתוחה. להחלפה ב-Push אמיתי דרך Service Worker.
export function useReminders(){
  const {state,update}=useApp()
  const [msg,setMsg]=useState<string|null>(null)
  useEffect(()=>{
    const id=setInterval(()=>{
      const now=new Date().toISOString()
      const due=state.tasks.filter(t=>t.remindAt&&t.remindAt<=now&&!t.done)
      if(!due.length)return
      due.forEach(t=>{if('Notification' in window&&Notification.permission==='granted')new Notification('מה עכשיו?',{body:t.title})})
      setMsg(due.map(t=>t.title).join(' · '))
      update(s=>({...s,tasks:s.tasks.map(t=>due.some(d=>d.id===t.id)?{...t,remindAt:undefined}:t)}))
      setTimeout(()=>setMsg(null),10000)
    },15000)
    return()=>clearInterval(id)
  },[state,update])
  return msg
}
