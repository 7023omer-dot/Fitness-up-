import { GUIDE_CHAPTERS } from "./chapters";

export default function GuidePage() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row-reverse">
      <aside className="card h-fit lg:sticky lg:top-6 lg:w-56 lg:shrink-0">
        <h2 className="mb-3 text-sm font-semibold text-slate-500">פרקים</h2>
        <ul className="space-y-1 text-sm">
          {GUIDE_CHAPTERS.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`} className="block rounded-lg px-2 py-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                {c.title}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1 space-y-6">
        <h1 className="text-xl font-bold">מדריך דרופשיפינג</h1>
        {GUIDE_CHAPTERS.map((chapter) => (
          <section key={chapter.id} id={chapter.id} className="card scroll-mt-6">
            <h2 className="mb-3 text-lg font-bold">{chapter.title}</h2>
            <div className="space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {chapter.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}

        <p className="text-xs text-slate-400">
          המדריך והחישובים הם כלליים ומותאמים לעסק דרופשיפינג בישראל. נתוני מכס/מע&quot;מ/רישום עוסק —
          אמת מול רו&quot;ח ואתר רשות המסים לפני השקה מסחרית.
        </p>
      </div>
    </div>
  );
}
