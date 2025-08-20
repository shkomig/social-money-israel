import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'מי אנחנו — כסף חברתי',
  description:
    'מיזם חינמי שמרכז מחשבונים חכמים, אשף זכאות ומידע רשמי—כדי לא להשאיר כסף על השולחן.',
  alternates: {
    canonical: 'https://social-money-israel.netlify.app/about',
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    title: 'מי אנחנו — כסף חברתי',
    description:
      'מיזם חינמי שמרכז מחשבונים חכמים, אשף זכאות ומידע רשמי—כדי לא להשאיר כסף על השולחן.',
    url: 'https://social-money-israel.netlify.app/about',
  },
}

export default function AboutPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-screen-md px-4 py-10 space-y-6 text-slate-700">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">כסף חברתי — מי אנחנו</h1>
      </header>

      <section className="space-y-3">
        <p className="leading-8">
          <strong>כסף חברתי — מתחילים לחסוך</strong>
        </p>
        <p className="leading-8">
          אנחנו מנגישים לציבור בישראל כלים ומידע אמינים לחיסכון בכסף: מחשבונים חכמים, אשף זכאות ומדריכים קצרים שמבוססים על מקורות רשמיים—הכול בחינם,
          בעברית וב-RTL.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">המשימה שלנו</h2>
        <p className="leading-8">לא להשאיר כסף על השולחן. לעזור לכל אחד להבין במהירות אם הוא זכאי להטבה/החזר, ומה בדיוק עושים כדי לממש אותה.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">מה תמצאו אצלנו</h2>
        <ul className="list-disc pr-5 space-y-1">
          <li>מחשבונים חכמים: מחזור משכנתה, החזר מס, מענק עבודה ועוד.</li>
          <li>אשף זכאות אישי: מענה על כמה שאלות קצרות ומקבלים כיוונים רלוונטיים.</li>
          <li>הסברים צעד-אחר-צעד: מדריכים תכל’ס—בלי ז’רגון.</li>
          <li>משאבים רשמיים: קישורים ישירים לאתרים ממשלתיים ולמידע מאומת.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">איך זה עובד (3 צעדים)</h2>
        <ol className="list-decimal pr-5 space-y-1">
          <li>בוחרים נושא וממלאים נתונים בסיסיים (ללא פרטים מזהים).</li>
          <li>מקבלים תוצאה/הערכה + הסבר קצר מה עושים הלאה.</li>
          <li>עוברים לקישור הרשמי ומבצעים—עם צ’ק-ליסט מסודר.</li>
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">למה לסמוך עלינו</h2>
        <ul className="list-disc pr-5 space-y-1">
          <li>אמינות: נשענים על מקורות רשמיים ומתעדכנים תדיר.</li>
          <li>שקיפות: הסבר ברור של חישובים והנחות.</li>
          <li>פרטיות: לא מבקשים ת״ז/פרטי בנק; עובדים בלי מידע רגיש.</li>
          <li>חינם ופשוט: בלי אותיות קטנות, בעברית ידידותית ו-RTL.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">למי זה מתאים</h2>
        <p className="leading-8">משפחות, סטודנטים, גמלאים, שכירים ועצמאים—כל מי שרוצה לבדוק במהירות מה מגיע לו וכמה אפשר לחסוך.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">מה אנחנו לא</h2>
        <p className="leading-8">אנחנו לא יועצים פיננסיים. המידע כללי ואינו תחליף לייעוץ אישי. ההכרעה הסופית תמיד אצל הגורמים הרשמיים.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">שאלות ופידבק</h2>
        <p className="leading-8">
          נתקלתם בשאלה? יש רעיון לשיפור? נשמח לשמוע!{' '}
          <Link href="/calculators" className="text-blue-700 hover:text-blue-800 underline underline-offset-4">
            למחשבונים
          </Link>{' '}
          •{' '}
          <Link href="/resources" className="text-blue-700 hover:text-blue-800 underline underline-offset-4">
            משאבים רשמיים
          </Link>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">מדיניות קצרה</h2>
        <p className="leading-8">המידע באתר כללי ואינו ייעוץ אישי; אין למסור פרטים מזהים; קישורים ומספרים (אם מופיעים) מתבססים על מקורות רשמיים.</p>
      </section>
    </main>
  )
}
import React from 'react'
import styles from './about.module.css'

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <h1>מי אנחנו</h1>
      <p>
        כסף חברתי — מתחילים לחסוך
        <br />
        אנחנו מנגישים לציבור בישראל כלים ומידע אמינים לחיסכון בכסף: מחשבונים חכמים, אשף זכאות
        ומדריכים קצרים שמבוססים על מקורות רשמיים—הכול בחינם, בעברית וב-RTL.
      </p>
      <h2>המשימה שלנו</h2>
      <p>
        לא להשאיר כסף על השולחן. לעזור לכל אחד להבין במהירות אם הוא זכאי להטבה/החזר, ומה בדיוק עושים
        כדי לממש אותה.
      </p>
      <h2>מה תמצאו אצלנו</h2>
      <ul>
        <li>מחשבונים חכמים: מחזור משכנתה, החזר מס, מענק עבודה ועוד.</li>
        <li>אשף זכאות אישי: מענה על כמה שאלות קצרות ומקבלים כיוונים רלוונטיים.</li>
        <li>הסברים צעד-אחר-צעד: מדריכים תכל’ס—בלי ז’רגון.</li>
        <li>משאבים רשמיים: קישורים ישירים לאתרים ממשלתיים ולמידע מאומת.</li>
      </ul>
      <h2>איך זה עובד (3 צעדים)</h2>
      <ol>
        <li>בוחרים נושא וממלאים נתונים בסיסיים (ללא פרטים מזהים).</li>
        <li>מקבלים תוצאה/הערכה + הסבר קצר מה עושים הלאה.</li>
        <li>עוברים לקישור הרשמי ומבצעים—עם צ’ק-ליסט מסודר.</li>
      </ol>
      <h2>למה לסמוך עלינו</h2>
      <ul>
        <li>אמינות: נשענים על מקורות רשמיים ומתעדכנים תדיר.</li>
        <li>שקיפות: הסבר ברור של חישובים והנחות.</li>
        <li>פרטיות: לא מבקשים ת״ז/פרטי בנק; עובדים בלי מידע רגיש.</li>
        <li>חינם ופשוט: בלי אותיות קטנות, בעברית ידידותית ו-RTL.</li>
      </ul>
      <h2>למי זה מתאים</h2>
      <p>
        משפחות, סטודנטים, גמלאים, שכירים ועצמאים—כל מי שרוצה לבדוק במהירות מה מגיע לו וכמה אפשר
        לחסוך.
      </p>
      <h2>מה אנחנו לא</h2>
      <p>
        אנחנו לא יועצים פיננסיים. המידע כללי ואינו תחליף לייעוץ אישי. ההכרעה הסופית תמיד אצל הגורמים
        הרשמיים.
      </p>
      <h2>שאלות ופידבק</h2>
      <p>
        נתקלתם בשאלה? יש רעיון לשיפור? נשמח לשמוע!
        <br />
        למחשבונים: /calculators • משאבים רשמיים: /resources • שליחת פידבק: קישור וואטסאפ
        <a href="https://whatsapp.com/channel/0029VbB55jdIHphIbc9Jyl3C/טופס לבחירתך">לחצו כאן</a>.
      </p>
      <h2>מדיניות קצרה</h2>
      <p>
        המידע באתר כללי ואינו ייעוץ אישי; אין למסור פרטים מזהים; קישורים ומספרים (אם מופיעים)
        מתבססים על מקורות רשמיים.
      </p>
    </div>
  )
}

export default AboutPage
