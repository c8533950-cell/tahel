import type {AppState} from '../types'
const KEY='ma-atah:v1'
export const empty:AppState={plans:[],tasks:[]}
// להחלפה ב-backend: ממשו אותו מבנה (load/save/clear) מול API.
export const storage={
  load():{state:AppState;error:string|null}{
    try{
      const r=localStorage.getItem(KEY)
      if(!r)return{state:empty,error:null}
      const p=JSON.parse(r)
      if(!Array.isArray(p.plans)||!Array.isArray(p.tasks))throw new Error('bad')
      return{state:p as AppState,error:null}
    }catch{return{state:empty,error:'לא הצלחנו לטעון את הנתונים השמורים, מתחילים מחדש.'}}
  },
  save(s:AppState):string|null{
    try{localStorage.setItem(KEY,JSON.stringify(s));return null}
    catch{return'לא ניתן לשמור נתונים בדפדפן. השינויים לא יישמרו.'}
  },
  clear(){try{localStorage.removeItem(KEY)}catch{/* ignore */}}
}
