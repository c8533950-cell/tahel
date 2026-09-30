export const uid=()=>Math.random().toString(36).slice(2,9)
export const iso=(d:Date)=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)
const at=(s:string|Date)=>typeof s==='string'?new Date(s+'T12:00:00'):new Date(s)
export const today=()=>iso(new Date())
export const addDays=(s:string|Date,n:number)=>{const d=at(s);d.setDate(d.getDate()+n);return iso(d)}
export const daysBetween=(a:string,b:string)=>Math.round((at(b).getTime()-at(a).getTime())/864e5)
export const schedule=(n:number,deadline:string,from=today())=>{
  const span=Math.max(1,daysBetween(from,deadline))
  return Array.from({length:n},(_,i)=>addDays(from,Math.floor(i*span/Math.max(n,1))))
}
export const fmt=(s:string)=>at(s).toLocaleDateString('he-IL',{day:'numeric',month:'short'})
