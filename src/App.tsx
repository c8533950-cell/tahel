import {useState} from 'react'
import {Provider,useApp} from './state/store'
import {ErrorBoundary} from './components/ErrorBoundary'
import {useReminders} from './hooks/useReminders'
import Home from './pages/Home'
import PlanPage from './pages/PlanPage'
import Today from './pages/Today'
import Tasks from './pages/Tasks'
import Profile from './pages/Profile'
type Tab='home'|'today'|'tasks'|'profile'
const tabs:[Tab,string][]=[['home','בית'],['today','היום'],['tasks','משימות'],['profile','פרופיל']]
function Shell(){
  const [tab,setTab]=useState<Tab>('home');const [planId,setPlanId]=useState<string|null>(null)
  const {storageError}=useApp();const remind=useReminders()
  return <div className="app">
    {storageError&&<div className="banner err">{storageError}</div>}
    {remind&&<div className="banner">⏰ תזכורת: {remind}</div>}
    <main>{planId?<PlanPage id={planId} back={()=>setPlanId(null)}/>
      :tab==='home'?<Home open={setPlanId}/>:tab==='today'?<Today open={setPlanId}/>
      :tab==='tasks'?<Tasks open={setPlanId}/>:<Profile/>}</main>
    <nav>{tabs.map(([k,l])=><button key={k} className={tab===k&&!planId?'on':''} onClick={()=>{setTab(k);setPlanId(null)}}>{l}</button>)}</nav>
  </div>
}
export default function App(){return <ErrorBoundary><Provider><Shell/></Provider></ErrorBoundary>}
