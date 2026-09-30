import type {Task} from '../types'
import {fmt} from '../utils'
export const Progress=({pct}:{pct:number})=><div className="bar"><i style={{width:pct+'%'}}/></div>
export const Empty=({text}:{text:string})=><div className="card mut center">{text}</div>
export function TaskRow({t,plan,onToggle,onOpen}:{t:Task;plan?:string;onToggle:()=>void;onOpen?:()=>void}){
  return <div className="row">
    <input type="checkbox" checked={t.done} onChange={onToggle} aria-label="סמן כהושלם"/>
    <div className={t.done?'done':''} onClick={onOpen} style={{flex:1,cursor:onOpen?'pointer':'default'}}>
      <div>{t.title}</div><small className="mut">{plan??'משימה עצמאית'} · {fmt(t.due)}{t.remindAt?' · ⏰':''}</small>
    </div></div>
}
