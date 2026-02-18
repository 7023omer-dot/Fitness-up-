// ==================== FITNESS UP - APP.JS ====================
// Personal Fitness Application - Hebrew RTL

// ==================== DATA ====================
const WORKOUTS = {
    push: {
        id: 'push',
        title: 'יום א\' - דחיפה (Push)',
        subtitle: 'חזה + ביי + בטן',
        duration: '~65 דקות',
        icon: '🏋️',
        warmup: [
            { name: 'הליכון / אופניים', sets: '5 דקות' },
            { name: 'סיבובי כתפיים עם גומייה', sets: '2x15' },
            { name: 'שכיבות סמיכה (משקל גוף)', sets: '2x10' }
        ],
        groups: [
            {
                name: 'חזה',
                icon: '💪',
                exercises: [
                    { id: 'flat_bench', name: 'לחיצת חזה שטוחה - מוט', eng: 'Flat Bench Press', sets: 4, reps: '8-10', rest: '90 שניות', note: 'תרגיל מוביל - העלה משקל כל שבוע' },
                    { id: 'incline_db', name: 'לחיצת חזה משופעת - דמבלים', eng: 'Incline DB Press', sets: 3, reps: '10-12', rest: '75 שניות', note: 'שיפוע 30 מעלות' },
                    { id: 'chest_dips', name: 'מכונת חזה / Dips', eng: 'Chest Dips', sets: 3, reps: '10-12', rest: '75 שניות', note: 'גוף נוטה קדימה' },
                    { id: 'cable_fly', name: 'פרפר בכבלים', eng: 'Cable Fly', sets: 3, reps: '12-15', rest: '60 שניות', note: 'סקוויז חזק באמצע' }
                ]
            },
            {
                name: 'ביי',
                icon: '💪',
                exercises: [
                    { id: 'barbell_curl', name: 'כפיפת מרפקים מוט ישר', eng: 'Barbell Curl', sets: 3, reps: '10-12', rest: '60 שניות', note: 'ללא נדנוד גוף' },
                    { id: 'incline_curl', name: 'כפיפת מרפקים דמבל בספסל משופע', eng: 'Incline DB Curl', sets: 3, reps: '10-12', rest: '60 שניות', note: 'מתיחה מלאה בתחתית' },
                    { id: 'cable_curl', name: 'כפיפת מרפקים בכבל', eng: 'Cable Curl', sets: 3, reps: '12-15', rest: '45 שניות', note: 'סקוויז בלחיצה העליונה' }
                ]
            }
        ],
        abs: [
            { name: 'כפיפות בטן עליונות', eng: 'Crunches', reps: '20' },
            { name: 'הרמות רגליים בתלייה', eng: 'Hanging Leg Raises', reps: '12-15' },
            { name: 'פלאנק', eng: 'Plank', reps: '45 שניות' }
        ]
    },
    pull: {
        id: 'pull',
        title: 'יום ג\' - משיכה (Pull)',
        subtitle: 'גב + טרייספס + בטן',
        duration: '~65 דקות',
        icon: '🔄',
        warmup: [
            { name: 'חתירה על ארגומטר / הליכון', sets: '5 דקות' },
            { name: 'Band Pull-Aparts', sets: '2x15' },
            { name: 'תלייה על מוט (Dead Hang)', sets: '2x20 שניות' }
        ],
        groups: [
            {
                name: 'גב',
                icon: '🔄',
                exercises: [
                    { id: 'lat_pulldown', name: 'מתח / Lat Pulldown', eng: 'Lat Pulldown', sets: 4, reps: '8-10', rest: '90 שניות', note: 'אחיזה רחבה, משוך אל החזה' },
                    { id: 'barbell_row', name: 'חתירה עם מוט', eng: 'Barbell Row', sets: 4, reps: '8-10', rest: '90 שניות', note: 'גב ישר, משוך לבטן' },
                    { id: 'seated_row', name: 'חתירה בכבל ישיבה', eng: 'Seated Cable Row', sets: 3, reps: '10-12', rest: '75 שניות', note: 'אחיזה צרה, סקוויז' },
                    { id: 'single_row', name: 'חתירה דמבל ביד אחת', eng: 'Single Arm DB Row', sets: 3, reps: '10-12', rest: '60 שניות', note: 'לכל צד' }
                ]
            },
            {
                name: 'טרייספס',
                icon: '💪',
                exercises: [
                    { id: 'tri_pushdown', name: 'לחיצות כבל - חבל', eng: 'Tricep Pushdown', sets: 3, reps: '10-12', rest: '60 שניות', note: 'מרפקים צמודים' },
                    { id: 'overhead_ext', name: 'פרנץ\' פרס דמבל ישיבה', eng: 'Overhead Extension', sets: 3, reps: '10-12', rest: '60 שניות', note: 'מתיחה מלאה למעלה' },
                    { id: 'skull_crush', name: 'Skull Crushers / Dips ספסל', eng: 'Skull Crushers', sets: 3, reps: '10-12', rest: '60 שניות', note: 'תנועה איטית ומבוקרת' }
                ]
            }
        ],
        abs: [
            { name: 'כפיפות בטן בכבל', eng: 'Cable Crunch', reps: '15-20' },
            { name: 'אופניים באוויר', eng: 'Bicycle Crunches', reps: '20 לכל צד' },
            { name: 'Mountain Climbers', eng: 'Mountain Climbers', reps: '30 שניות' }
        ]
    },
    legs: {
        id: 'legs',
        title: 'יום ה\' - רגליים (Legs)',
        subtitle: 'רגליים + כתפיים + בטן',
        duration: '~70 דקות',
        icon: '🦵',
        warmup: [
            { name: 'הליכון / אופניים', sets: '5 דקות' },
            { name: 'סקוואט משקל גוף', sets: '2x15' },
            { name: 'הפעלת עכוזים (Glute Bridge)', sets: '2x12' }
        ],
        groups: [
            {
                name: 'רגליים',
                icon: '🦵',
                exercises: [
                    { id: 'back_squat', name: 'סקוואט עם מוט', eng: 'Back Squat', sets: 4, reps: '6-8', rest: '2 דקות', note: 'תרגיל מוביל - עומק מלא' },
                    { id: 'leg_press', name: 'לחיצת רגליים', eng: 'Leg Press', sets: 3, reps: '10-12', rest: '90 שניות', note: 'רגליים ברוחב כתפיים' },
                    { id: 'rdl', name: 'מתים רומני', eng: 'Romanian Deadlift', sets: 4, reps: '8-10', rest: '90 שניות', note: 'מתיחה מלאה בהמסטרינג' },
                    { id: 'leg_curl', name: 'כפיפת רגליים שכיבה', eng: 'Lying Leg Curl', sets: 3, reps: '10-12', rest: '60 שניות', note: 'תנועה מבוקרת' },
                    { id: 'calf_raise', name: 'עליות על קצות אצבעות', eng: 'Calf Raises', sets: 4, reps: '15-20', rest: '45 שניות', note: 'מתיחה מלאה בתחתית' }
                ]
            },
            {
                name: 'כתפיים',
                icon: '🏋️',
                exercises: [
                    { id: 'shoulder_press', name: 'לחיצת כתפיים דמבלים', eng: 'Shoulder Press', sets: 3, reps: '8-10', rest: '90 שניות', note: 'ישיבה, גב נתמך' },
                    { id: 'lateral_raise', name: 'הרמות צד', eng: 'Lateral Raises', sets: 3, reps: '12-15', rest: '60 שניות', note: 'משקל קל, תנועה מבוקרת' },
                    { id: 'face_pull', name: 'Face Pulls בכבל', eng: 'Face Pulls', sets: 3, reps: '15-20', rest: '60 שניות', note: 'אחורי כתף + סיבוב חיצוני' }
                ]
            }
        ],
        abs: [
            { name: 'V-Ups', eng: 'V-Ups', reps: '15' },
            { name: 'Russian Twists (עם משקל)', eng: 'Russian Twists', reps: '20 לכל צד' },
            { name: 'פלאנק צידי', eng: 'Side Plank', reps: '30 שניות לכל צד' }
        ]
    },
    cardio: {
        id: 'cardio',
        title: 'שישי/שבת - קרדיו',
        subtitle: 'HIIT / הליכה בשיפוע / ריצה',
        duration: '~40-50 דקות',
        icon: '🏃',
        options: [
            {
                name: 'HIIT (מומלץ לחיטוב)',
                icon: '⚡',
                details: [
                    'חימום: 5 דקות הליכה מהירה → ריצה קלה',
                    'ספרינט: 30 שניות (85-90%)',
                    'הליכה: 60 שניות (40-50%)',
                    '10 סבבים = 15 דקות',
                    'שחרור: 5 דקות הליכה + מתיחות'
                ]
            },
            {
                name: 'הליכה בשיפוע (Incline Walk)',
                icon: '🚶',
                details: [
                    'שיפוע: 10-12%',
                    'מהירות: 5.5-6.5 קמ"ש',
                    'משך: 40 דקות',
                    'שריפה משוערת: 350-450 קק"ל',
                    'יתרון: לא מכביד על ההתאוששות'
                ]
            },
            {
                name: 'ריצה רציפה Zone 2',
                icon: '🏃',
                details: [
                    'קצב: 6:00-7:00 דק\'/ק"מ',
                    'משך: 30-40 דקות',
                    'דופק: 130-150',
                    'מתאים לשריפת שומן ובריאות לב'
                ]
            }
        ],
        recommendation: [
            { state: 'עייף מאימוני כוח', option: 'הליכה בשיפוע' },
            { state: 'מרגיש אנרגטי', option: 'HIIT' },
            { state: 'רוצה לנקות את הראש', option: 'ריצה רציפה' }
        ]
    }
};

const PROTEIN_SOURCES = {
    meat: [
        { name: 'חזה עוף', amount: '100g', protein: '31g', cal: '165' },
        { name: 'חזה הודו', amount: '100g', protein: '29g', cal: '135' },
        { name: 'שניצל אפוי', amount: '100g', protein: '28g', cal: '180' },
        { name: 'בשר בקר רזה', amount: '100g', protein: '26g', cal: '150' },
        { name: 'כבד עוף', amount: '100g', protein: '24g', cal: '170' }
    ],
    fish: [
        { name: 'טילאפיה', amount: '100g', protein: '26g', cal: '130' },
        { name: 'סלמון', amount: '100g', protein: '22g', cal: '155' },
        { name: 'דניס', amount: '100g', protein: '23g', cal: '140' },
        { name: 'טונה (בקופסה, במים)', amount: '100g', protein: '26g', cal: '116' },
        { name: 'נסיכה / בורי', amount: '100g', protein: '21g', cal: '120' }
    ],
    dairy: [
        { name: 'קוטג\' 5%', amount: '100g', protein: '11g', cal: '90' },
        { name: 'גבינה לבנה 5%', amount: '100g', protein: '10g', cal: '80' },
        { name: 'יוגורט יווני 0%', amount: '100g', protein: '10g', cal: '57' },
        { name: 'גבינה צהובה 9%', amount: '30g', protein: '9g', cal: '75' }
    ],
    parve: [
        { name: 'ביצה שלמה', amount: '1', protein: '6g', cal: '70' },
        { name: 'חלבון ביצה', amount: '1', protein: '3.5g', cal: '17' },
        { name: 'טופו', amount: '100g', protein: '17g', cal: '144' },
        { name: 'אבקת Whey (כשר)', amount: 'סקופ', protein: '25g', cal: '120' }
    ]
};

// ==================== STATE ====================
let currentPage = 'home';
let timerSeconds = 90;
let timerRemaining = 90;
let timerInterval = null;
let timerRunning = false;

// ==================== LOCAL STORAGE ====================
function getData(key, defaultVal) {
    try {
        const val = localStorage.getItem('fitnessup_' + key);
        return val ? JSON.parse(val) : defaultVal;
    } catch {
        return defaultVal;
    }
}

function setData(key, val) {
    localStorage.setItem('fitnessup_' + key, JSON.stringify(val));
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    // Splash screen
    setTimeout(() => {
        document.getElementById('splash').classList.add('hide');
        document.getElementById('app').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('splash').style.display = 'none';
        }, 500);
        initApp();
    }, 1500);
});

function initApp() {
    updateGreeting();
    updateTodayCard();
    markTodayInWeek();
    loadDailyChecklist();
    loadWeekDays();
    updateDashboardNutrition();
    showProteinTab('meat');
    updateWeightLog();
    drawWeightChart();
    loadStrengthBests();
    loadSettings();
}

// ==================== GREETING ====================
function updateGreeting() {
    const hour = new Date().getHours();
    const el = document.getElementById('greeting-time');
    if (hour < 12) el.textContent = 'בוקר טוב ☀️';
    else if (hour < 17) el.textContent = 'צהריים טובים 🌤️';
    else if (hour < 21) el.textContent = 'ערב טוב 🌆';
    else el.textContent = 'לילה טוב 🌙';
}

// ==================== TODAY'S WORKOUT ====================
function updateTodayCard() {
    const dayOfWeek = new Date().getDay(); // 0=Sun, 1=Mon...
    const dayMap = {
        0: { name: 'יום א\'', workout: 'חזה + ביי + בטן', type: 'push', badge: 'כוח', duration: '~65 דקות' },
        1: { name: 'יום ב\'', workout: 'יום מנוחה 😴', type: 'rest', badge: 'מנוחה', duration: 'מתיחות קלות' },
        2: { name: 'יום ג\'', workout: 'גב + טרייספס + בטן', type: 'pull', badge: 'כוח', duration: '~65 דקות' },
        3: { name: 'יום ד\'', workout: 'יום מנוחה 😴', type: 'rest', badge: 'מנוחה', duration: 'מתיחות קלות' },
        4: { name: 'יום ה\'', workout: 'רגליים + כתפיים + בטן', type: 'legs', badge: 'כוח', duration: '~70 דקות' },
        5: { name: 'יום ו\'', workout: 'מנוחה / מתיחות קלות', type: 'rest', badge: 'מנוחה', duration: '15-20 דקות' },
        6: { name: 'שבת', workout: 'קרדיו - HIIT / הליכה / ריצה', type: 'cardio', badge: 'אירובי', duration: '~45 דקות' }
    };

    const today = dayMap[dayOfWeek];
    document.getElementById('today-day-name').textContent = today.name;
    document.getElementById('today-badge').textContent = today.badge;
    document.getElementById('today-workout-name').textContent = today.workout;
    document.getElementById('today-workout-duration').textContent = today.duration;

    const btn = document.getElementById('btn-start-today');
    if (today.type === 'rest') {
        btn.textContent = 'יום מנוחה - נח!';
        btn.style.opacity = '0.5';
        btn.onclick = null;
    } else {
        btn.textContent = 'התחל אימון →';
        btn.style.opacity = '1';
        btn.onclick = () => goToTodayWorkout();
    }
}

function goToTodayWorkout() {
    const dayOfWeek = new Date().getDay();
    const typeMap = { 0: 'push', 2: 'pull', 4: 'legs', 6: 'cardio' };
    const type = typeMap[dayOfWeek];
    if (type) {
        switchPage('workouts');
        setTimeout(() => openWorkout(type), 300);
    }
}

// ==================== WEEK OVERVIEW ====================
function markTodayInWeek() {
    const dayOfWeek = new Date().getDay(); // 0=Sun
    for (let i = 0; i < 7; i++) {
        const el = document.getElementById(`week-day-${i}`);
        if (el) {
            el.classList.remove('today');
            if (i === dayOfWeek) el.classList.add('today');
        }
    }
}

function loadWeekDays() {
    const weekKey = getWeekKey();
    const weekData = getData(`week_${weekKey}`, {});
    for (let i = 0; i < 7; i++) {
        const el = document.getElementById(`week-day-${i}`);
        if (el && weekData[i]) {
            el.classList.add('done');
        }
    }
}

function getWeekKey() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
    return `${now.getFullYear()}_w${weekNum}`;
}

// ==================== PAGE NAVIGATION ====================
function switchPage(pageName) {
    // Handle workout detail back navigation
    if (currentPage === 'workout-detail' && pageName !== 'workout-detail') {
        document.getElementById('page-workout-detail').classList.remove('active');
    }

    currentPage = pageName;
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));

    document.getElementById(`page-${pageName}`).classList.add('active');

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) item.classList.add('active');
    });

    const titles = {
        home: 'דשבורד',
        workouts: 'אימונים',
        nutrition: 'תזונה',
        progress: 'התקדמות'
    };
    document.getElementById('page-title').textContent = titles[pageName] || 'Fitness Up';

    if (pageName === 'progress') {
        setTimeout(() => drawWeightChart(), 100);
    }
}

// ==================== WORKOUT DETAIL ====================
function openWorkout(type) {
    const workout = WORKOUTS[type];
    const container = document.getElementById('workout-detail-content');

    if (type === 'cardio') {
        container.innerHTML = renderCardioDetail(workout);
    } else {
        container.innerHTML = renderWorkoutDetail(workout);
    }

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-workout-detail').classList.add('active');
    document.getElementById('page-title').textContent = workout.title;
    currentPage = 'workout-detail';

    // Load saved data
    loadWorkoutData(type);
}

function renderWorkoutDetail(workout) {
    let html = `
        <div class="workout-detail-header" style="margin-bottom:20px;">
            <h2 style="font-size:1.3rem;margin-bottom:4px;">${workout.title}</h2>
            <p style="color:var(--text-secondary);font-size:0.9rem;">${workout.subtitle} | ${workout.duration}</p>
        </div>
    `;

    // Warmup
    html += `<div class="exercise-group">
        <div class="exercise-group-title">🔥 חימום <span class="badge">10 דק'</span></div>`;
    workout.warmup.forEach(w => {
        html += `<div class="exercise-item" style="padding:10px 14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:0.9rem;">${w.name}</span>
                <span style="font-size:0.8rem;color:var(--text-secondary);">${w.sets}</span>
            </div>
        </div>`;
    });
    html += `</div>`;

    // Exercise groups
    workout.groups.forEach(group => {
        html += `<div class="exercise-group">
            <div class="exercise-group-title">${group.icon} ${group.name} <span class="badge">${group.exercises.length} תרגילים</span></div>`;

        group.exercises.forEach(ex => {
            html += `<div class="exercise-item">
                <div class="exercise-name">${ex.name}</div>
                <div class="exercise-eng">${ex.eng}</div>
                <div class="exercise-details">
                    <span class="exercise-detail">${ex.sets}x${ex.reps}</span>
                    <span class="exercise-detail">⏱️ ${ex.rest}</span>
                </div>
                <div class="exercise-note">${ex.note}</div>
                <div class="exercise-sets-row">`;

            for (let s = 1; s <= ex.sets; s++) {
                html += `<div class="set-input-group">
                    <span class="set-label">סט ${s}</span>
                    <input class="set-input" type="text" placeholder="kg×reps"
                           data-workout="${workout.id}" data-exercise="${ex.id}" data-set="${s}"
                           onchange="saveSetData(this)">
                </div>`;
            }

            html += `</div></div>`;
        });

        html += `</div>`;
    });

    // Abs
    html += `<div class="exercise-group">
        <div class="exercise-group-title">🔥 בטן - סופר סט <span class="badge">3 סבבים</span></div>
        <div class="ab-circuit">`;

    workout.abs.forEach(ab => {
        html += `<div class="ab-exercise">
            <span>${ab.name}</span>
            <span style="color:var(--text-secondary);font-size:0.8rem;">${ab.reps}</span>
        </div>`;
    });

    html += `<div class="ab-rounds">`;
    for (let r = 1; r <= 3; r++) {
        html += `<button class="ab-round-btn" data-workout="${workout.id}" data-round="${r}"
                         onclick="toggleAbRound(this)">R${r}</button>`;
    }
    html += `</div></div></div>`;

    // Complete button
    html += `<button class="btn-primary workout-complete-btn" onclick="completeWorkout('${workout.id}')">✅ סיימתי את האימון!</button>`;

    return html;
}

function renderCardioDetail(workout) {
    let html = `
        <div class="workout-detail-header" style="margin-bottom:20px;">
            <h2 style="font-size:1.3rem;margin-bottom:4px;">${workout.title}</h2>
            <p style="color:var(--text-secondary);font-size:0.9rem;">${workout.subtitle} | ${workout.duration}</p>
        </div>
    `;

    workout.options.forEach((opt, idx) => {
        html += `<div class="exercise-group">
            <div class="exercise-group-title">${opt.icon} ${opt.name}</div>
            <div class="exercise-item">`;

        opt.details.forEach(d => {
            html += `<div style="padding:4px 0;font-size:0.85rem;color:var(--text-secondary);">• ${d}</div>`;
        });

        html += `</div></div>`;
    });

    // Recommendation
    html += `<div class="section-title">מה לבחור?</div>
        <div class="tips-card">`;
    workout.recommendation.forEach(r => {
        html += `<div class="tip-item info">
            <span class="tip-icon">💡</span>
            <div>
                <strong>${r.state}</strong>
                <p>→ ${r.option}</p>
            </div>
        </div>`;
    });
    html += `</div>`;

    // Cardio logging
    html += `<div class="section-title">רישום אימון</div>
        <div class="measurements-card">
            <div class="measurement-row">
                <label>סוג אימון</label>
                <select style="padding:8px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:inherit;"
                        id="cardio-type" onchange="saveCardioData()">
                    <option value="hiit">HIIT</option>
                    <option value="walk">הליכה בשיפוע</option>
                    <option value="run">ריצה</option>
                </select>
                <span></span>
            </div>
            <div class="measurement-row">
                <label>משך (דק')</label>
                <input type="number" class="measure-input" id="cardio-duration" placeholder="--" onchange="saveCardioData()">
                <span>דק'</span>
            </div>
            <div class="measurement-row">
                <label>מרחק</label>
                <input type="number" step="0.1" class="measure-input" id="cardio-distance" placeholder="--" onchange="saveCardioData()">
                <span>ק"מ</span>
            </div>
            <button class="btn-primary" onclick="completeWorkout('cardio')" style="margin-top:12px;">✅ סיימתי קרדיו!</button>
        </div>`;

    return html;
}

function closeWorkoutDetail() {
    switchPage('workouts');
}

// ==================== WORKOUT DATA SAVE/LOAD ====================
function saveSetData(input) {
    const workout = input.dataset.workout;
    const exercise = input.dataset.exercise;
    const set = input.dataset.set;
    const dateKey = getTodayKey();
    const key = `workout_${dateKey}_${workout}`;
    const data = getData(key, {});
    if (!data[exercise]) data[exercise] = {};
    data[exercise][`set${set}`] = input.value;
    setData(key, data);
}

function loadWorkoutData(type) {
    const dateKey = getTodayKey();
    const key = `workout_${dateKey}_${type}`;
    const data = getData(key, {});

    document.querySelectorAll(`[data-workout="${type}"].set-input`).forEach(input => {
        const exercise = input.dataset.exercise;
        const set = input.dataset.set;
        if (data[exercise] && data[exercise][`set${set}`]) {
            input.value = data[exercise][`set${set}`];
        }
    });

    // Load ab rounds
    const abData = getData(`abs_${dateKey}_${type}`, {});
    document.querySelectorAll(`[data-workout="${type}"].ab-round-btn`).forEach(btn => {
        const round = btn.dataset.round;
        if (abData[round]) btn.classList.add('done');
    });
}

function toggleAbRound(btn) {
    btn.classList.toggle('done');
    const workout = btn.dataset.workout;
    const round = btn.dataset.round;
    const dateKey = getTodayKey();
    const data = getData(`abs_${dateKey}_${workout}`, {});
    data[round] = btn.classList.contains('done');
    setData(`abs_${dateKey}_${workout}`, data);
}

function completeWorkout(type) {
    const weekKey = getWeekKey();
    const weekData = getData(`week_${weekKey}`, {});
    const dayOfWeek = new Date().getDay();
    weekData[dayOfWeek] = true;
    setData(`week_${weekKey}`, weekData);

    const el = document.getElementById(`week-day-${dayOfWeek}`);
    if (el) el.classList.add('done');

    showToast('🎉 כל הכבוד! אימון הושלם!');
    setTimeout(() => switchPage('home'), 1000);
}

function saveCardioData() {
    const dateKey = getTodayKey();
    const data = {
        type: document.getElementById('cardio-type')?.value,
        duration: document.getElementById('cardio-duration')?.value,
        distance: document.getElementById('cardio-distance')?.value
    };
    setData(`cardio_${dateKey}`, data);
}

// ==================== TIMER ====================
function setTimer(seconds) {
    timerSeconds = seconds;
    timerRemaining = seconds;
    timerRunning = false;
    clearInterval(timerInterval);
    updateTimerDisplay();

    document.querySelectorAll('.timer-preset').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.textContent) === seconds || btn.textContent === seconds + 's') {
            btn.classList.add('active');
        }
    });

    document.getElementById('btn-timer-start').textContent = '▶ התחל';
    document.getElementById('btn-timer-start').classList.remove('running');
    document.getElementById('timer-display').classList.remove('running', 'done');
}

function toggleTimer() {
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
        document.getElementById('btn-timer-start').textContent = '▶ המשך';
        document.getElementById('btn-timer-start').classList.remove('running');
        document.getElementById('timer-display').classList.remove('running');
    } else {
        timerRunning = true;
        document.getElementById('btn-timer-start').textContent = '⏸ עצור';
        document.getElementById('btn-timer-start').classList.add('running');
        document.getElementById('timer-display').classList.add('running');
        document.getElementById('timer-display').classList.remove('done');

        timerInterval = setInterval(() => {
            timerRemaining--;
            updateTimerDisplay();
            if (timerRemaining <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                document.getElementById('btn-timer-start').textContent = '▶ התחל';
                document.getElementById('btn-timer-start').classList.remove('running');
                document.getElementById('timer-display').classList.remove('running');
                document.getElementById('timer-display').classList.add('done');
                timerRemaining = timerSeconds;
                updateTimerDisplay();

                // Try to vibrate
                if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
                showToast('⏰ נגמרה המנוחה! קדימה סט הבא! 💪');
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerRemaining = timerSeconds;
    updateTimerDisplay();
    document.getElementById('btn-timer-start').textContent = '▶ התחל';
    document.getElementById('btn-timer-start').classList.remove('running');
    document.getElementById('timer-display').classList.remove('running', 'done');
}

function updateTimerDisplay() {
    const min = Math.floor(timerRemaining / 60);
    const sec = timerRemaining % 60;
    document.getElementById('timer-display').textContent =
        `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

// ==================== DAILY CHECKLIST ====================
function saveDailyCheck(checkbox, key) {
    const dateKey = getTodayKey();
    const data = getData(`checklist_${dateKey}`, {});
    data[key] = checkbox.checked;
    setData(`checklist_${dateKey}`, data);
}

function loadDailyChecklist() {
    const dateKey = getTodayKey();
    const data = getData(`checklist_${dateKey}`, {});
    document.querySelectorAll('.check-item').forEach(item => {
        const key = item.dataset.key;
        const cb = item.querySelector('input[type="checkbox"]');
        if (data[key]) cb.checked = true;
    });
}

// ==================== NUTRITION ====================
function toggleMeal(header) {
    const card = header.closest('.meal-card');
    card.classList.toggle('open');
}

function toggleMealDay(type) {
    document.getElementById('toggle-training').classList.toggle('active', type === 'training');
    document.getElementById('toggle-rest').classList.toggle('active', type === 'rest');

    const meal3Rice = document.getElementById('meal3-rice');
    const meal4Oats = document.getElementById('meal4-oats');
    const meal5Potato = document.getElementById('meal5-potato');

    if (type === 'rest') {
        if (meal3Rice) meal3Rice.querySelector('.meal-amount').textContent = '120g | 139 קק"ל | 3g';
        if (meal4Oats) meal4Oats.style.display = 'none';
        if (meal5Potato) meal5Potato.innerHTML = '<span>ירקות נוספים</span><span class="meal-amount">כוס | 40 קק"ל | 2g</span>';
    } else {
        if (meal3Rice) meal3Rice.querySelector('.meal-amount').textContent = '160g | 185 קק"ל | 4g';
        if (meal4Oats) meal4Oats.style.display = 'flex';
        if (meal5Potato) meal5Potato.innerHTML = '<span>בטטה אפויה</span><span class="meal-amount">150g | 135 קק"ל | 2g</span>';
    }
}

function showProteinTab(type) {
    document.querySelectorAll('.protein-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.protein-tab[onclick="showProteinTab('${type}')"]`).classList.add('active');

    const list = document.getElementById('protein-list');
    const sources = PROTEIN_SOURCES[type];

    list.innerHTML = sources.map(s => `
        <div class="protein-row">
            <span>${s.name}</span>
            <div class="protein-row-values">
                <span>${s.amount}</span>
                <span style="color:var(--protein-color);font-weight:600;">${s.protein}</span>
                <span>${s.cal} קק"ל</span>
            </div>
        </div>
    `).join('');
}

// ==================== DASHBOARD NUTRITION ====================
function updateDashboardNutrition() {
    const dateKey = getTodayKey();
    const nutrition = getData(`nutrition_${dateKey}`, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    document.getElementById('cal-consumed').textContent = nutrition.calories;
    document.getElementById('protein-value').textContent = `${nutrition.protein} / 187g`;
    document.getElementById('carbs-value').textContent = `${nutrition.carbs} / 250g`;
    document.getElementById('fat-value').textContent = `${nutrition.fat} / 72g`;

    document.getElementById('protein-bar').style.width = `${Math.min(100, (nutrition.protein / 187) * 100)}%`;
    document.getElementById('carbs-bar').style.width = `${Math.min(100, (nutrition.carbs / 250) * 100)}%`;
    document.getElementById('fat-bar').style.width = `${Math.min(100, (nutrition.fat / 72) * 100)}%`;

    drawCalorieRing(nutrition.calories, 2400);
}

function drawCalorieRing(consumed, target) {
    const canvas = document.getElementById('calorie-ring');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 120;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 48;
    const lineWidth = 8;
    const pct = Math.min(1, consumed / target);

    // Background ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#2a2a3e';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Progress ring
    if (pct > 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * pct));
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, '#FF6B35');
        gradient.addColorStop(1, '#ff8c5c');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}

// ==================== PROGRESS - WEIGHT ====================
function saveWeight() {
    const input = document.getElementById('weight-input');
    const weight = parseFloat(input.value);
    if (!weight || weight < 40 || weight > 200) {
        showToast('❌ הכנס משקל תקין');
        return;
    }

    const dateKey = getTodayKey();
    const log = getData('weight_log', []);

    // Check if today already has an entry
    const existingIdx = log.findIndex(e => e.date === dateKey);
    if (existingIdx >= 0) {
        log[existingIdx].weight = weight;
    } else {
        log.push({ date: dateKey, weight });
    }

    setData('weight_log', log);
    input.value = '';

    document.getElementById('current-weight').textContent = weight.toFixed(1);
    updateWeightLog();
    drawWeightChart();
    showToast(`✅ משקל ${weight} ק"ג נשמר!`);
}

function updateWeightLog() {
    const log = getData('weight_log', []);
    const container = document.getElementById('weight-log');

    if (log.length === 0) {
        container.innerHTML = '<div class="weight-log-empty">עדיין אין נתוני משקל. הכנס את המשקל הראשון שלך!</div>';
        return;
    }

    const sorted = [...log].sort((a, b) => b.date.localeCompare(a.date));
    container.innerHTML = sorted.map((entry, idx) => {
        const prev = sorted[idx + 1];
        let changeHtml = '';
        if (prev) {
            const diff = (entry.weight - prev.weight).toFixed(1);
            const cls = diff < 0 ? 'down' : diff > 0 ? 'up' : 'same';
            const sign = diff > 0 ? '+' : '';
            changeHtml = `<span class="weight-log-change ${cls}">${sign}${diff}</span>`;
        }

        return `<div class="weight-log-item">
            <span class="weight-log-date">${formatDate(entry.date)}</span>
            <span class="weight-log-value">${entry.weight.toFixed(1)} ק"ג</span>
            ${changeHtml}
        </div>`;
    }).join('');

    // Update current weight on dashboard
    if (sorted.length > 0) {
        document.getElementById('current-weight').textContent = sorted[0].weight.toFixed(1);
    }
}

function drawWeightChart() {
    const canvas = document.getElementById('weight-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.parentElement.getBoundingClientRect();
    const width = rect.width - 40;
    const height = 200;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    const log = getData('weight_log', []);
    const sorted = [...log].sort((a, b) => a.date.localeCompare(b.date));

    // Clear
    ctx.clearRect(0, 0, width, height);

    if (sorted.length === 0) {
        ctx.fillStyle = '#5a5a72';
        ctx.font = '14px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('הכנס נתוני משקל לראות גרף', width / 2, height / 2);
        return;
    }

    const padding = { top: 20, bottom: 30, left: 10, right: 10 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const weights = sorted.map(e => e.weight);
    const minW = Math.min(...weights, 77) - 1;
    const maxW = Math.max(...weights, 85) + 1;
    const range = maxW - minW;

    // Target line
    const targetY = padding.top + chartH - ((78 - minW) / range) * chartH;
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(0, 212, 170, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, targetY);
    ctx.lineTo(width - padding.right, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(0, 212, 170, 0.5)';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('78 (יעד)', padding.left, targetY - 5);

    if (sorted.length === 1) {
        // Single point
        const x = width / 2;
        const y = padding.top + chartH - ((sorted[0].weight - minW) / range) * chartH;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#FF6B35';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '12px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(sorted[0].weight.toFixed(1), x, y - 12);
        return;
    }

    // Draw line
    const points = sorted.map((entry, i) => ({
        x: padding.left + (i / (sorted.length - 1)) * chartW,
        y: padding.top + chartH - ((entry.weight - minW) / range) * chartH
    }));

    // Area fill
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartH);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 107, 53, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 107, 53, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Points
    points.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#FF6B35';
        ctx.fill();
        ctx.strokeStyle = '#0a0a0f';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Labels
    ctx.fillStyle = '#8b8ba3';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.textAlign = 'center';

    const step = Math.max(1, Math.floor(sorted.length / 6));
    sorted.forEach((entry, i) => {
        if (i % step === 0 || i === sorted.length - 1) {
            const x = padding.left + (i / (sorted.length - 1)) * chartW;
            const parts = entry.date.split('-');
            ctx.fillText(`${parts[2]}/${parts[1]}`, x, height - 5);
        }
    });
}

// ==================== MEASUREMENTS ====================
function saveMeasurements() {
    const dateKey = getTodayKey();
    const data = {};
    document.querySelectorAll('.measure-input').forEach(input => {
        data[input.dataset.measure] = input.value;
    });
    setData(`measurements_${dateKey}`, data);
    showToast('✅ מדידות נשמרו!');
}

// ==================== STRENGTH ====================
function saveStrength(exercise) {
    const kg = document.getElementById(`${exercise}-kg`).value;
    const reps = document.getElementById(`${exercise}-reps`).value;
    if (!kg || !reps) {
        showToast('❌ הכנס משקל וחזרות');
        return;
    }

    const dateKey = getTodayKey();
    const log = getData(`strength_${exercise}`, []);
    log.push({ date: dateKey, kg: parseFloat(kg), reps: parseInt(reps) });
    setData(`strength_${exercise}`, log);

    document.getElementById(`${exercise}-kg`).value = '';
    document.getElementById(`${exercise}-reps`).value = '';

    loadStrengthBests();
    showToast(`✅ ${kg}kg × ${reps} נשמר!`);
}

function loadStrengthBests() {
    ['bench', 'squat', 'row', 'rdl', 'ohp'].forEach(ex => {
        const log = getData(`strength_${ex}`, []);
        const el = document.getElementById(`${ex}-best`);
        if (log.length > 0) {
            const best = log.reduce((max, entry) => (entry.kg > max.kg ? entry : max), log[0]);
            el.textContent = `שיא: ${best.kg}kg × ${best.reps}`;
        }
    });
}

// ==================== SETTINGS ====================
function showSettings() {
    document.getElementById('settings-modal').classList.add('show');
}

function closeSettings(event) {
    if (!event || event.target.id === 'settings-modal' || event.target.classList.contains('modal-close')) {
        document.getElementById('settings-modal').classList.remove('show');
    }
}

function saveSettings() {
    const settings = {
        startWeight: parseFloat(document.getElementById('setting-start-weight').value),
        height: parseFloat(document.getElementById('setting-height').value),
        week: parseInt(document.getElementById('setting-week').value),
        calTrain: parseInt(document.getElementById('setting-cal-train').value),
        calRest: parseInt(document.getElementById('setting-cal-rest').value),
        protein: parseInt(document.getElementById('setting-protein').value)
    };
    setData('settings', settings);

    document.getElementById('current-week').textContent = settings.week;
    closeSettings();
    showToast('✅ הגדרות נשמרו!');
}

function loadSettings() {
    const settings = getData('settings', {
        startWeight: 85,
        height: 1.82,
        week: 1,
        calTrain: 2400,
        calRest: 2200,
        protein: 187
    });

    document.getElementById('setting-start-weight').value = settings.startWeight;
    document.getElementById('setting-height').value = settings.height;
    document.getElementById('setting-week').value = settings.week;
    document.getElementById('setting-cal-train').value = settings.calTrain;
    document.getElementById('setting-cal-rest').value = settings.calRest;
    document.getElementById('setting-protein').value = settings.protein;

    document.getElementById('current-week').textContent = settings.week;
}

function resetAllData() {
    if (confirm('בטוח שאתה רוצה למחוק את כל הנתונים? אי אפשר לשחזר!')) {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('fitnessup_')) keys.push(key);
        }
        keys.forEach(k => localStorage.removeItem(k));
        closeSettings();
        showToast('🗑️ כל הנתונים נמחקו');
        setTimeout(() => location.reload(), 500);
    }
}

// ==================== UTILS ====================
function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDate(dateStr) {
    const parts = dateStr.split('-');
    const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
    return `${parseInt(parts[2])} ${months[parseInt(parts[1]) - 1]}`;
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}
