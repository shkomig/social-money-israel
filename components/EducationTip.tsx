import React from 'react'

export interface EducationTipProps {
  type?: 'pension' | 'tax' | 'mortgage' | 'disability' | 'teacher' | 'general'
  title?: string
  customContent?: string
}

export const DisabilityTip: React.FC = () => <EducationTip type="disability" />

export const PensionTip: React.FC = () => <EducationTip type="pension" />

export const TaxTip: React.FC = () => <EducationTip type="tax" />

export const MortgageTip: React.FC = () => <EducationTip type="mortgage" />

export const TeacherTip: React.FC = () => <EducationTip type="teacher" />

export default function EducationTip({
  type = 'general',
  title,
  customContent,
}: EducationTipProps) {
  const getTipContent = () => {
    switch (type) {
      case 'pension':
        return {
          title: title || 'זכויות פנסיה וקופות גמל',
          content:
            customContent ||
            'ביטוח לאומי מאפשר הפקדה שנתית של עד 38,412₪ לקופת גמל להשלמת הכנסה עם הטבה מלאה. חשוב לוודא שאתם מנצלים את כל הזכויות הפנסיוניות שלכם.',
          color: 'blue',
          icon: '💰',
        }
      case 'tax':
        return {
          title: title || 'זכויות מס ונקודות זיכוי',
          content:
            customContent ||
            'בישראל קיימות זכויות מס רבות: זיכוי על ילדים (2.25 נקודות = 6,510₪), זיכוי נכות (עד 4.25 נקודות = 12,318₪), וזכויות נוספות. וודאו שאתם מנצלים את כל הזכויות.',
          color: 'green',
          icon: '📊',
        }
      case 'mortgage':
        return {
          title: title || 'מחזור משכנתא וחיסכון',
          content:
            customContent ||
            'מחזור משכנתא יכול לחסוך עשרות אלפי שקלים. כדאי לבחון מחזור כאשר הפער בין הריבית הנוכחית לחדשה הוא מעל 0.5%. התייעצו עם יועץ משכנתאות.',
          color: 'purple',
          icon: '🏠',
        }
      case 'disability':
        return {
          title: title || 'זכויות לאנשים עם נכות',
          content:
            customContent ||
            'אנשים עם נכות זכאים לזיכוי מס של עד 4.25 נקודות זיכוי (12,318₪ לשנה), הנחות בארנונה, הטבות בתחבורה ציבורית, ומענקים נוספים. חשוב לעדכן את מעמד הנכות במס הכנסה.',
          color: 'orange',
          icon: '♿',
        }
      case 'teacher':
        return {
          title: title || 'זכויות למורים ועובדי הוראה',
          content:
            customContent ||
            'מורים זכאים להטבות מיוחדות: זיכוי מס מיוחד, הטבות פנסיוניות משופרות, מענקי השתלמות, וזכויות נוספות. וודאו שאתם מנצלים את כל הזכויות המקצועיות.',
          color: 'indigo',
          icon: '🎓',
        }
      default:
        return {
          title: title || 'טיפ פיננסי',
          content:
            customContent ||
            'חשוב לעקוב אחר השינויים בחוקי המס והזכויות הסוציאליות בישראל. הקפידו על תיעוד נכון של הוצאות ובחינה תקופתית של הזכויות.',
          color: 'gray',
          icon: '💡',
        }
    }
  }

  const { title: tipTitle, content, color, icon } = getTipContent()

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    gray: 'bg-gray-50 border-gray-200 text-gray-800',
  }

  return (
    <div
      className={`p-4 rounded-lg border-2 ${colorClasses[color]} my-6`}
      dir="rtl"
    >
      <div className="flex items-start space-x-reverse space-x-3">
        <div className="text-2xl flex-shrink-0">{icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{tipTitle}</h3>
          <p className="text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  )
}
