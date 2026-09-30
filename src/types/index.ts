export type Task={id:string;planId:string;title:string;min:number;due:string;done:boolean;remindAt?:string}
export type Msg={role:'user'|'ai';text:string}
export type Plan={id:string;title:string;deadline:string;msgs:Msg[]}
export type AppState={plans:Plan[];tasks:Task[]}
export type Draft={title:string;min:number}
export type Analysis={title:string;deadline:string;questions:string[]}
export type Patch={shiftDays?:number;deadline?:string;markDoneId?:string;replaceId?:string;split?:Draft[]}
export interface AIService{
  analyze(text:string):Promise<Analysis>
  plan(title:string):Promise<Draft[]>
  chat(plan:Plan,tasks:Task[],msg:string):Promise<{reply:string;patch?:Patch}>
}
