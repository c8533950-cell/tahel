import {createContext,useCallback,useContext,useEffect,useState,ReactNode} from 'react'
import type {AppState} from '../types'
import {storage} from '../persistence/Storage'
type Ctx={state:AppState;update:(f:(s:AppState)=>AppState)=>void;storageError:string|null}
const C=createContext<Ctx|null>(null)
export function Provider({children}:{children:ReactNode}){
  const [init]=useState(()=>storage.load())
  const [state,setState]=useState<AppState>(init.state)
  const [storageError,setErr]=useState<string|null>(init.error)
  useEffect(()=>{const e=storage.save(state);if(e)setErr(e)},[state])
  const update=useCallback((f:(s:AppState)=>AppState)=>setState(f),[])
  return <C.Provider value={{state,update,storageError}}>{children}</C.Provider>
}
export const useApp=()=>{const c=useContext(C);if(!c)throw new Error('Provider missing');return c}
