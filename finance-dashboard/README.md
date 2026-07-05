# צומחים מחדש — ניהול פיננסי + מדריך דרופשיפינג

דשבורד לניהול הכנסות/הוצאות/רווח לעסק דרופשיפינג, עם מדריך דרופשיפינג מובנה. Next.js + Supabase + Tailwind, עברית RTL מלא.

## הרצה מקומית

```bash
npm install
npm run dev
```

האפליקציה תרוץ על http://localhost:3000 ותפנה אוטומטית ל-`/login`.

## הקמה (חובה לפני שימוש)

### 1. פרויקט Supabase

1. פתחו פרויקט חדש ב-[supabase.com](https://supabase.com).
2. Project Settings → API → העתיקו את **Project URL** ואת **anon public key**.
3. SQL Editor → הדביקו והריצו את `supabase/schema.sql` (יוצר את הטבלאות `products`, `transactions`, `ad_campaigns` + הרשאות RLS).
4. Authentication → Users → Add user — פעמיים (עומר + ברקאי), עם אימייל וסיסמה. שני המשתמשים רואים את אותם הנתונים המשותפים.

### 2. משתני סביבה

העתיקו את `.env.example` ל-`.env.local` ומלאו:

```bash
cp .env.example .env.local
```

| משתנה | מאיפה |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `RESEND_API_KEY`, `EMAIL_FROM` | [resend.com](https://resend.com) (יש תוכנית חינמית) — נדרש לכפתור "שליחת ייצוא למייל" בעמוד העסקאות |
| `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_API_TOKEN` | Shopify Admin → Settings → Apps and sales channels → Develop apps → צרו אפליקציה פרטית עם הרשאת קריאה ל-`read_orders`, וקחו את ה-Admin API access token — נדרש לכפתור "ייבוא מ-Shopify" |

בלי `RESEND_API_KEY` / `SHOPIFY_ADMIN_API_TOKEN` שאר האפליקציה עובדת רגיל — רק הכפתורים הספציפיים האלה יחזירו הודעת שגיאה ברורה.

## מבנה העמודים

- **/dashboard** — KPIs, גרף הכנסות/הוצאות, פילוח הוצאות, 5 מוצרים רווחיים, התראת פרסום.
- **/transactions** — הזנת עסקאות, טבלה עם סינון/מיון, ייצוא/ייבוא CSV, שליחת ייצוא למייל, ייבוא מ-Shopify.
- **/products** — רווח נקי לפי מוצר (הכנסה − עלות מוצר − פרסום − עמלות/משלוח).
- **/ads** — קמפיינים ו-ROAS (אזהרה מתחת ל-2).
- **/cashflow** — כסף בפועל, התחייבויות פתוחות (הוצאות שסומנו "טרם שולם"), יתרה נטו.
- **/guide** — מדריך דרופשיפינג מלא (10 פרקים).

## הערות טכניות

- **שיתוף נתונים**: כל משתמש מחובר רואה ועורך את כל הנתונים (RLS פתוח לכל `authenticated`), בהתאם לכך ששני הבעלים עובדים על אותו עסק.
- **ייבוא מ-Shopify**: מושך עד 250 הזמנות אחרונות (`orders.json`), יוצר מוצרים חסרים לפי שם הפריט, ומונע כפילויות דרך `unique(source, external_id)`. להזמנות ישנות יותר יש להריץ שוב מאוחר יותר או להרחיב את ה-route לפי `since_id`/pagination.
- **ייצוא/ייבוא CSV**: הייצוא רץ לגמרי בצד לקוח (כולל שליחה למייל דרך Resend). הייבוא מזהה עמודות לפי הכותרות העבריות שהייצוא מייצר (תאריך, סוג, קטגוריה, מוצר, סכום, כמות, למי שולם, הערה, שולם).
- גרסת Next.js זו (16) משתמשת ב-`proxy.ts` במקום `middleware.ts` — פונקציונלית זהה, שם חדש בלבד.

## הערה משפטית

המדריך והחישובים בעמוד `/guide` כלליים. נתוני מכס/מע"מ/רישום עוסק — יש לאמת מול רו"ח ואתר רשות המסים לפני השקה מסחרית.
