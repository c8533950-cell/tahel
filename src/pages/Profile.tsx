import {useState} from 'react'
import {useApp} from '../state/store'
import {storage} from '../persistence/Storage'
export default function Profile(){
  const {state}=useApp()
  const [perm,setPerm]=useState<string>('Notification' in window?Notification.permission:'unsupported')
  const ask=async()=>{if('Notification' in window)setPerm(await Notification.requestPermission())}
  const exp=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.download='ma-atah.json';a.click()}
  const wipe=()=>{if(window.confirm('למחוק את כל התוכניות והמשימות?')){storage.clear();location.reload()}}
  return <><h1>פרופיל</h1>
    <div className="card"><b>התראות</b>
      <p className="mut">{perm==='unsupported'?'הדפדפן לא תומך בהתראות. תזכורות יוצגו בתוך האפליקציה.':perm==='granted'?'התראות מופעלות.':'לא אושרו התראות. תזכורות יוצגו בתוך האפליקציה.'}</p>
      {perm==='default'&&<button className="btn" onClick={ask}>אפשר התראות</button>}</div>
    <div className="card"><b>הנתונים שלך</b><p className="mut">{state.plans.length} תוכניות · {state.tasks.length} משימות, שמורות במכשיר.</p>
      <button className="btn" onClick={exp}>ייצוא JSON</button> <button className="link" onClick={wipe}>מחיקת כל הנתונים</button></div></>
}
