import type {AIService} from '../../types'
import {addDays} from '../../utils'
const wait=(ms=500)=>new Promise(r=>setTimeout(r,ms))
const U:Record<string,number>={'יום':1,'ימים':1,'יומיים':2,'שבוע':7,'שבועות':7,'שבועיים':14,'חודש':30,'חודשים':30,'חודשיים':60}
const RE=/בעוד\s+(\d+)?\s*(יומיים|שבועיים|חודשיים|ימים|יום|שבועות|שבוע|חודשים|חודש)/
export function parseDays(t:string):number|null{
  const m=t.match(RE);if(!m)return null
  return U[m[2]]*(m[1]?+m[1]:1)
}
const clean=(t:string)=>t.replace(RE,'').replace(/^\s*(אני\s+)?(רוצה|צריך|צריכה)\s+/,'').replace(/[.!?]+$/,'').trim()
// Mock: עובד על כל טקסט חופשי בעזרת תבנית תכנון כללית. להחלפה ב-RealAIService.
export class MockAIService implements AIService{
  async analyze(text:string){
    await wait(300)
    const title=clean(text)||text.trim()
    const words=title.split(/\s+/).length
    return{title,deadline:addDays(new Date(),parseDays(text)??30),
      questions:words<3?['תוכל לפרט קצת יותר: מה התוצאה שתרצה להשיג?']:[]}
  }
  async plan(t:string){
    await wait(700)
    return[
      {title:`להגדיר במדויק מה ייחשב הצלחה ב"${t}"`,min:10},
      {title:`לרשום מה כבר יש לך ומה חסר בשביל "${t}"`,min:20},
      {title:'לאסוף את המידע והמשאבים הנדרשים',min:40},
      {title:'לקבוע לוח זמנים ולסגור זמן ביומן',min:15},
      {title:'לבצע את החלק הראשון והגדול',min:60},
      {title:'להמשיך לבצע ולעדכן מה נשאר',min:60},
      {title:'לבדוק התקדמות ולתקן כיוון',min:20},
      {title:'לסיים ולסכם מה הושג',min:30}]
  }
  async chat(plan:import('../../types').Plan,tasks:import('../../types').Task[],msg:string){
    await wait(500)
    const cur=tasks.find(t=>t.planId===plan.id&&!t.done)
    if(!cur)return{reply:'סיימת את כל התוכנית! אפשר לחזור לבית ולהגדיר מטרה חדשה.'}
    if(/אין לי זמן|לא פנוי|עסוק/.test(msg))
      return{reply:`הבנתי. דחיתי את המשימות שנותרו בשבוע. כשיהיה זמן, הצעד הבא הוא "${cur.title}" ואפשר להתחיל בחלק קטן.`,patch:{shiftDays:7}}
    if(/כבר עשיתי|עשיתי את זה/.test(msg))
      return{reply:`מעולה, סימנתי את "${cur.title}" כהושלם.`,patch:{markDoneId:cur.id}}
    if(/דדליין|מועד|תאריך/.test(msg)){
      const d=parseDays(msg)
      return d?{reply:`עדכנתי את הדדליין לעוד ${d} ימים וסידרתי מחדש את המשימות.`,patch:{deadline:addDays(new Date(),d)}}
        :{reply:'כתוב לי את המועד החדש, למשל: "הדדליין עכשיו בעוד שבועיים".'}
    }
    if(/לא יכול|לא מצליח|קשה לי|תקוע/.test(msg))
      return{reply:`פירקתי את "${cur.title}" לשני צעדים קטנים יותר.`,patch:{replaceId:cur.id,split:[
        {title:`להתחיל בקטן: 10 דקות על "${cur.title}"`,min:10},{title:`להמשיך את "${cur.title}" אחרי ההתחלה`,min:cur.min}]}}
    return{reply:`אני איתך. המטרה: "${plan.title}". הצעד הנוכחי: "${cur.title}". אפשר לכתוב לי "אין לי זמן", "כבר עשיתי", "לא יכול", או שהדדליין השתנה, ואעדכן את התוכנית.`}
  }
}
