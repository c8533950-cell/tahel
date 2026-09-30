import type {AIService} from '../../types'
import {MockAIService} from './MockAIService'
// כאן מחליפים ל-RealAIService שמממש את AIService מול API אמיתי.
export const ai:AIService=new MockAIService()
