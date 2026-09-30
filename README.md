# מה עכשיו?
1. **טכנולוגיה:** React 18 + TypeScript + Vite. אחסון ב-localStorage.
2. **התקנה:** `npm install`
3. **הרצה מקומית:** `npm run dev`
4. **Production build:** `npm run build` (הפלט ב-`dist/`, תצוגה מקדימה: `npm run preview`)
5. **קוד ה-AI:** `src/services/ai/` (הממשק `AIService` ב-`src/types/index.ts`, הדמו ב-`MockAIService.ts`)
6. **החלפה ב-API אמיתי:** צרו `RealAIService.ts` שמממש את `AIService` והחליפו שורה אחת ב-`src/services/ai/index.ts`. מומלץ לקרוא למודל דרך שרת שלכם ולא ישירות מהדפדפן, כדי לא לחשוף מפתח.
7. **Backend בעתיד:** ממשו `src/persistence/Storage.ts` מול API (אותם load/save/clear).
8. **Authentication בעתיד:** עטפו את `Provider` ב-`src/state/store.tsx` ב-AuthProvider ושייכו את הנתונים ל-userId.
