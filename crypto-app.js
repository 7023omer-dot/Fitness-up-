// ==================== CRYPTOEDGE - APP.JS ====================
// Professional Crypto Trading Platform - Hebrew RTL

// ==================== STATE ====================
let currentPage = 'dashboard';
let trades = [];
let tradeDirection = 'long';
let riskPct = 2;
let journalFilter = 'all';

// ==================== LOCAL STORAGE ====================
function getData(key, def) {
    try {
        const v = localStorage.getItem('cryptoedge_' + key);
        return v ? JSON.parse(v) : def;
    } catch { return def; }
}
function setData(key, val) {
    localStorage.setItem('cryptoedge_' + key, JSON.stringify(val));
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('splash').classList.add('hide');
        document.getElementById('app').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('splash').style.display = 'none';
        }, 600);
        initApp();
    }, 1800);
});

function initApp() {
    trades = getData('trades', []);
    fetchFearGreed();
    showProfile('day');
    renderTradesList();
    updateDashboardStats();
    setDefaultDate();
    calculateRisk();
}

// ==================== FEAR & GREED INDEX ====================
async function fetchFearGreed() {
    try {
        const res = await fetch('https://api.alternative.me/fng/?limit=1&format=json');
        const data = await res.json();
        if (data && data.data && data.data[0]) {
            const fng = data.data[0];
            updateFearGreedUI(parseInt(fng.value), fng.value_classification);
        }
    } catch (e) {
        // Fallback: show cached or static
        document.getElementById('fng-value').textContent = '--';
        document.getElementById('fng-label').textContent = 'לא ניתן לטעון';
        document.getElementById('fng-update').textContent = 'בדוק חיבור לאינטרנט';
    }
}

function updateFearGreedUI(value, classification) {
    const card = document.getElementById('fng-card');
    const valEl = document.getElementById('fng-value');
    const labelEl = document.getElementById('fng-label');
    const updateEl = document.getElementById('fng-update');
    const headerBadge = document.getElementById('fng-header-badge');

    valEl.textContent = value;

    const labels = {
        'Extreme Fear': 'פחד קיצוני',
        'Fear': 'פחד',
        'Neutral': 'ניטרלי',
        'Greed': 'תאוות בצע',
        'Extreme Greed': 'תאוות בצע קיצונית'
    };
    const classes = {
        'Extreme Fear': 'extreme-fear',
        'Fear': 'fear',
        'Neutral': 'neutral',
        'Greed': 'greed',
        'Extreme Greed': 'extreme-greed'
    };

    const hebrewLabel = labels[classification] || classification;
    const cssClass = classes[classification] || 'neutral';

    labelEl.textContent = hebrewLabel;
    card.className = 'fng-card fng-' + cssClass;
    updateEl.textContent = `עודכן: ${new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`;

    // Update header badge
    headerBadge.textContent = `${value} - ${hebrewLabel}`;
    headerBadge.className = 'header-badge ' + cssClass;

    // Draw gauge
    drawFearGreedGauge(value);

    // Cache it
    setData('last_fng', { value, classification, time: Date.now() });
}

function drawFearGreedGauge(value) {
    const canvas = document.getElementById('fng-gauge');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 140;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2 + 10;
    const r = 55;
    const startAngle = Math.PI;
    const endAngle = 0;
    const pct = value / 100;
    const currentAngle = Math.PI + (Math.PI * pct);

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle, false);
    ctx.strokeStyle = '#1a1a30';
    ctx.lineWidth = 12;
    ctx.stroke();

    // Colored arc - gradient from red to green
    const segments = [
        { start: Math.PI, end: Math.PI + 0.4, color: '#ef4444' },
        { start: Math.PI + 0.4, end: Math.PI + 0.8, color: '#f97316' },
        { start: Math.PI + 0.8, end: Math.PI + 1.2, color: '#f59e0b' },
        { start: Math.PI + 1.2, end: Math.PI + 1.6, color: '#84cc16' },
        { start: Math.PI + 1.6, end: Math.PI + Math.PI, color: '#10b981' }
    ];

    segments.forEach(seg => {
        const segEnd = Math.min(seg.end, currentAngle);
        if (segEnd <= seg.start) return;
        ctx.beginPath();
        ctx.arc(cx, cy, r, seg.start, segEnd, false);
        ctx.strokeStyle = seg.color;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.stroke();
    });

    // Needle
    const needleAngle = Math.PI + (Math.PI * pct);
    const nx = cx + Math.cos(needleAngle) * (r - 5);
    const ny = cy + Math.sin(needleAngle) * (r - 5);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Labels
    ctx.fillStyle = '#ef4444';
    ctx.font = `bold ${9 * dpr / dpr}px -apple-system, sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText('פחד', cx - r - 2, cy + 16);

    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'left';
    ctx.fillText('בצע', cx + r + 2, cy + 16);
}

// ==================== PAGE NAVIGATION ====================
function switchPage(pageName) {
    currentPage = pageName;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${pageName}`)?.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) item.classList.add('active');
    });

    const titles = {
        dashboard: 'דשבורד',
        journal: 'יומן מסחר',
        strategies: 'אסטרטגיות',
        risk: 'ניהול סיכונים',
        whales: 'מעקב לווייתנים',
        charts: 'גרפים היסטוריים'
    };
    document.getElementById('page-title').textContent = titles[pageName] || 'CryptoEdge';
}

// ==================== DASHBOARD STATS ====================
function updateDashboardStats() {
    const closedTrades = trades.filter(t => t.status !== 'open');
    const wins = trades.filter(t => t.status === 'win');
    const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const winRate = closedTrades.length > 0 ? Math.round((wins.length / closedTrades.length) * 100) : 0;

    document.getElementById('total-trades-val').textContent = trades.length;
    document.getElementById('win-rate-val').textContent = winRate + '%';

    const pnlEl = document.getElementById('total-pnl-val');
    pnlEl.textContent = (totalPnl >= 0 ? '+' : '') + '$' + Math.abs(totalPnl).toFixed(0);
    pnlEl.style.color = totalPnl >= 0 ? 'var(--green)' : 'var(--red)';

    const pnlCard = document.getElementById('stat-pnl');
    pnlCard.style.borderColor = totalPnl >= 0 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)';
}

// ==================== TRADING JOURNAL ====================
function setDefaultDate() {
    const dateInput = document.getElementById('trade-date');
    if (dateInput) {
        const d = new Date();
        dateInput.value = d.toISOString().split('T')[0];
    }
}

function openAddTrade() {
    document.getElementById('trade-edit-id').value = '';
    document.getElementById('modal-title').textContent = 'עסקה חדשה';
    document.getElementById('trade-pair').value = '';
    document.getElementById('trade-entry').value = '';
    document.getElementById('trade-stop').value = '';
    document.getElementById('trade-target').value = '';
    document.getElementById('trade-exit').value = '';
    document.getElementById('trade-size').value = '';
    document.getElementById('trade-notes').value = '';
    document.getElementById('trade-leverage').value = '1';
    document.getElementById('trade-strategy').value = 'swing';
    document.getElementById('trade-status').value = 'open';
    setDirection('long');
    setDefaultDate();
    document.getElementById('trade-modal').classList.add('show');
}

function closeTradeModal(event) {
    if (!event || event.target.id === 'trade-modal' || event.target.classList.contains('modal-close')) {
        document.getElementById('trade-modal').classList.remove('show');
    }
}

function setDirection(dir) {
    tradeDirection = dir;
    document.getElementById('dir-long').classList.toggle('active', dir === 'long');
    document.getElementById('dir-short').classList.toggle('active', dir === 'short');
}

function saveTrade() {
    const pair = document.getElementById('trade-pair').value.trim().toUpperCase();
    if (!pair) { showToast('❌ הכנס זוג מסחר'); return; }

    const entry = parseFloat(document.getElementById('trade-entry').value);
    const stop = parseFloat(document.getElementById('trade-stop').value);
    const target = parseFloat(document.getElementById('trade-target').value);
    const exit = parseFloat(document.getElementById('trade-exit').value);
    const size = parseFloat(document.getElementById('trade-size').value);
    const leverage = parseInt(document.getElementById('trade-leverage').value);
    const status = document.getElementById('trade-status').value;
    const notes = document.getElementById('trade-notes').value.trim();
    const date = document.getElementById('trade-date').value;
    const strategy = document.getElementById('trade-strategy').value;

    // Calculate P&L
    let pnl = 0;
    if (!isNaN(exit) && !isNaN(entry) && !isNaN(size) && exit > 0) {
        const priceChange = tradeDirection === 'long'
            ? (exit - entry) / entry
            : (entry - exit) / entry;
        pnl = size * priceChange * leverage;
    }

    // Calculate R:R
    let rr = 0;
    if (!isNaN(entry) && !isNaN(stop) && !isNaN(target) && stop !== entry) {
        const risk = Math.abs(entry - stop);
        const reward = Math.abs(target - entry);
        rr = reward / risk;
    }

    const editId = document.getElementById('trade-edit-id').value;
    const trade = {
        id: editId || Date.now().toString(),
        pair, direction: tradeDirection, entry, stop, target, exit: isNaN(exit) ? null : exit,
        size: isNaN(size) ? null : size, leverage, status, notes, date, strategy,
        pnl: Math.round(pnl * 100) / 100, rr: Math.round(rr * 100) / 100
    };

    if (editId) {
        const idx = trades.findIndex(t => t.id === editId);
        if (idx >= 0) trades[idx] = trade;
    } else {
        trades.unshift(trade);
    }

    setData('trades', trades);
    closeTradeModal();
    renderTradesList();
    updateDashboardStats();
    showToast('✅ עסקה נשמרה!');
}

function editTrade(id) {
    const trade = trades.find(t => t.id === id);
    if (!trade) return;

    document.getElementById('trade-edit-id').value = id;
    document.getElementById('modal-title').textContent = 'עריכת עסקה';
    document.getElementById('trade-pair').value = trade.pair;
    document.getElementById('trade-entry').value = trade.entry || '';
    document.getElementById('trade-stop').value = trade.stop || '';
    document.getElementById('trade-target').value = trade.target || '';
    document.getElementById('trade-exit').value = trade.exit || '';
    document.getElementById('trade-size').value = trade.size || '';
    document.getElementById('trade-leverage').value = trade.leverage || '1';
    document.getElementById('trade-strategy').value = trade.strategy || 'swing';
    document.getElementById('trade-status').value = trade.status || 'open';
    document.getElementById('trade-notes').value = trade.notes || '';
    document.getElementById('trade-date').value = trade.date || '';
    setDirection(trade.direction || 'long');
    document.getElementById('trade-modal').classList.add('show');
}

function deleteTrade(id) {
    if (!confirm('למחוק את העסקה?')) return;
    trades = trades.filter(t => t.id !== id);
    setData('trades', trades);
    renderTradesList();
    updateDashboardStats();
    showToast('🗑️ עסקה נמחקה');
}

function filterJournal(filter, btn) {
    journalFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTradesList();
}

function renderTradesList() {
    const container = document.getElementById('trades-list');
    let filtered = [...trades];

    if (journalFilter !== 'all') {
        filtered = filtered.filter(t => t.status === journalFilter);
    }

    if (filtered.length === 0) {
        const msg = journalFilter === 'all'
            ? 'עדיין אין עסקאות. הוסף את העסקה הראשונה שלך!'
            : 'אין עסקאות בקטגוריה זו';
        container.innerHTML = `<div class="empty-state"><div class="empty-icon">📓</div><p>${msg}</p></div>`;
        return;
    }

    const strategyLabels = { day: 'יומי ⚡', swing: 'סווינג 📈', investor: 'השקעה 💎' };
    const statusLabels = { win: '✅ רווח', loss: '❌ הפסד', open: '🔄 פתוח', breakeven: '➖ BEP' };

    container.innerHTML = filtered.map(trade => {
        const pnlClass = trade.status === 'open' ? 'neutral' : (trade.pnl > 0 ? 'positive' : trade.pnl < 0 ? 'negative' : 'neutral');
        const pnlText = trade.status === 'open' ? 'פתוח' : (trade.pnl !== 0 ? (trade.pnl > 0 ? '+$' : '-$') + Math.abs(trade.pnl).toFixed(0) : '$0');
        const formatPrice = p => p ? '$' + Number(p).toLocaleString() : '--';

        return `<div class="trade-card ${trade.status}">
            <div class="tc-header">
                <div style="display:flex;align-items:center;gap:8px;">
                    <div class="tc-pair">${trade.pair}</div>
                    <div class="tc-badge ${trade.direction}">${trade.direction === 'long' ? '📈 לונג' : '📉 שורט'}</div>
                    ${trade.leverage > 1 ? `<div class="tc-badge" style="background:rgba(245,158,11,0.15);color:#f59e0b;">${trade.leverage}x</div>` : ''}
                </div>
                <div class="tc-status ${trade.status}">${statusLabels[trade.status] || trade.status}</div>
            </div>
            <div class="tc-prices">
                <div class="tc-price">
                    <div class="tc-price-label">כניסה</div>
                    <div class="tc-price-val">${formatPrice(trade.entry)}</div>
                </div>
                <div class="tc-price">
                    <div class="tc-price-label">סטופ</div>
                    <div class="tc-price-val stop">${formatPrice(trade.stop)}</div>
                </div>
                <div class="tc-price">
                    <div class="tc-price-label">יעד</div>
                    <div class="tc-price-val target">${formatPrice(trade.target)}</div>
                </div>
            </div>
            <div class="tc-pnl">
                <div>
                    <div class="tc-meta">${trade.date || ''} | ${strategyLabels[trade.strategy] || ''} | R:R ${trade.rr || 0}:1</div>
                    ${trade.size ? `<div class="tc-meta">גודל: $${trade.size.toLocaleString()}</div>` : ''}
                </div>
                <div class="tc-pnl-val ${pnlClass}">${pnlText}</div>
            </div>
            ${trade.notes ? `<div class="tc-notes">📝 ${trade.notes}</div>` : ''}
            <div class="tc-actions">
                <button class="tc-btn edit" onclick="editTrade('${trade.id}')">✏️ ערוך</button>
                <button class="tc-btn delete" onclick="deleteTrade('${trade.id}')">🗑️ מחק</button>
            </div>
        </div>`;
    }).join('');
}

// ==================== STRATEGIES ====================
const PROFILES = {
    day: {
        icon: '⚡',
        title: 'סוחר יומי',
        subtitle: 'מסחר מהיר | פוזיציות נסגרות תוך יום | דורש ניסיון וריכוז',
        timeframe: 'גרף 1M / 5M / 15M',
        blocks: [
            {
                title: 'עקרונות בסיסיים',
                rules: [
                    { icon: '⏰', title: 'שעות מסחר קבועות', desc: 'מסחר רק ב-3-4 שעות ספציפיות (למשל 09:00-12:00). אין לסחור בכל שעה!' },
                    { icon: '🎯', title: 'מקסימום 3 עסקאות ביום', desc: 'פחות עסקאות = יותר בחירתיות = יותר רווחיות. אל תכנס לכל סיגנל' },
                    { icon: '🛑', title: 'הפסד יומי מקסימלי 3%', desc: 'אם הפסדת 3% מהתיק ביום - סגור הכל ועצור. חלקה גרועה קורית לכולם' },
                    { icon: '📵', title: 'ללא עסקאות פתוחות לילה', desc: 'כל הפוזיציות נסגרות לפני סוף יום המסחר. אין לישון עם פוזיציות לא מנוהלות' }
                ]
            },
            {
                title: 'כניסה ויציאה',
                rules: [
                    { icon: '📊', title: 'רק בכיוון הטרנד', desc: 'זהה טרנד ב-1H ואז כנס נגד רעש ב-5M. מסחר עם הרוח - לא נגדה' },
                    { icon: '⚖️', title: 'R:R מינימלי 1:1.5', desc: 'לסחר יומי יחס 1:1.5 מספיק בגלל כמות הסטאפים הגבוהה' },
                    { icon: '🔑', title: 'סטופ מתחת ל-S/R', desc: 'תמיד תן סטופ מתחת/מעל support/resistance ולא בגודל שרירותי' },
                    { icon: '💸', title: 'Scale out בחצי', desc: 'מכור חצי ביעד הראשון, הזז סטופ ל-breakeven, תן לחצי השני לרוץ' }
                ]
            },
            {
                title: 'פסיכולוגיה',
                rules: [
                    { icon: '🧠', title: 'אל תנקום בשוק', desc: 'אחרי הפסד - הפסקה של 30 דק\' לפחות. הרגש הוא האויב הגדול ביותר' },
                    { icon: '📓', title: 'רשום כל עסקה', desc: 'למה נכנסת, מה הרגשת, מה קרה. זה הכלי החשוב ביותר לשיפור' },
                    { icon: '✅', title: 'אל תשנה סטופ לוס', desc: 'אם נגדת את הסטופ שלך - חרית את הקבר שלך. כבד את ה-plan שלך' }
                ]
            },
            {
                title: 'אינדיקטורים מומלצים',
                rules: [
                    { icon: '📈', title: 'EMA 8/21/50', desc: 'ממוצעים נעים לזיהוי כיוון מסחר וקרוס-אובר' },
                    { icon: '🌊', title: 'RSI + MACD', desc: 'זיהוי אזורי קנה מכירה יתר וחיזוק כיוון' },
                    { icon: '📊', title: 'Volume Profile', desc: 'זיהוי אזורי מחיר חשובים לפי נפח מסחר' },
                    { icon: '💧', title: 'Liquidity Zones', desc: 'זיהוי מלכודות Bull/Bear ו-Stop Hunt zones' }
                ]
            }
        ]
    },
    swing: {
        icon: '📈',
        title: 'סוחר סווינג',
        subtitle: 'עסקאות 3-14 ימים | פחות לחץ | ניתוח טכני מעמיק',
        timeframe: 'גרף 4H / 1D',
        blocks: [
            {
                title: 'עקרונות בסיסיים',
                rules: [
                    { icon: '📅', title: 'ניתוח יומי - לא שעתי', desc: 'בדוק פוזיציות פעם-פעמיים ביום. מסחר סווינג לא צריך מעקב רציף' },
                    { icon: '🔍', title: 'כנס רק ל-High Probability', desc: 'חכה לסטאפ מושלם. עדיף 3 עסקאות מוצלחות מ-10 ממוצעות' },
                    { icon: '⏳', title: 'קביעת זמן לעסקה', desc: 'אם אחרי 7 ימים העסקה לא זזה - שקול לסגור. כסף תקוע = הפסד' },
                    { icon: '🌙', title: 'עסקאות לילה בסדר', desc: 'סטופ ויעד מוגדרים מראש - ניתן לישון בלי דאגה' }
                ]
            },
            {
                title: 'סטאפ אופטימלי',
                rules: [
                    { icon: '📊', title: 'Trend Continuation', desc: 'פוקס על pull-back לאחר break of structure בטרנד חזק' },
                    { icon: '🔄', title: 'Range Breakout', desc: 'כניסה אחרי פריצת תחום תנודה עם volume גבוה' },
                    { icon: '🎯', title: 'R:R מינימלי 1:3', desc: 'לסווינג, הסיכון גבוה יותר לכן הפוטנציאל צריך להיות פי 3 לפחות' },
                    { icon: '📉', title: 'סטופ מעל/מתחת swing point', desc: 'הצב סטופ מעל/מתחת לנקודת הקיצון האחרונה + 0.5-1% buffer' }
                ]
            },
            {
                title: 'ניהול פוזיציה פעילה',
                rules: [
                    { icon: '🚶', title: 'Trailing Stop', desc: 'כשעסקה ברווח, הזז סטופ לנקודת כניסה ואז הוסף trailing' },
                    { icon: '✂️', title: 'Partial Profit Taking', desc: 'מכור 30-50% ביעד הראשון, החזק שארית לתנועה הגדולה' },
                    { icon: '📰', title: 'שמור על חדשות', desc: 'בדוק אם יש אירועים כלכליים/קריפטו שיכולים להשפיע על הפוזיציה' }
                ]
            },
            {
                title: 'זיהוי אזורים חשובים',
                rules: [
                    { icon: '🏔️', title: 'Support & Resistance', desc: 'זהה רמות S&R שבועיות וחודשיות לפני כניסה לעסקה' },
                    { icon: '🔢', title: 'Fibonacci Retracements', desc: '38.2%, 50%, 61.8% - אזורי כניסה אידיאליים בפולבק' },
                    { icon: '📦', title: 'Order Blocks', desc: 'זהה אזורי ביקוש/היצע מוסדיים בגרף 4H ו-Daily' }
                ]
            }
        ]
    },
    investor: {
        icon: '💎',
        title: 'משקיע לטווח ארוך',
        subtitle: 'HODL חכם | DCA | שמירה על עושר לאורך הסייקל',
        timeframe: 'גרף שבועי / חודשי',
        blocks: [
            {
                title: 'אסטרטגיית כניסה',
                rules: [
                    { icon: '📆', title: 'DCA - Dollar Cost Averaging', desc: 'קנה סכום קבוע כל שבוע/חודש ללא קשר למחיר. מנטרל טיימינג גרוע' },
                    { icon: '😱', title: 'קנה בפחד קיצוני', desc: 'כש-FNG מתחת ל-20 - זה זמן להגדיל פוזיציות. "Be greedy when others are fearful"' },
                    { icon: '💰', title: 'הקצה 70/30', desc: '70% ביטקוין ואת\'ריום, 30% אלטקוין עם fundamentals חזקים' },
                    { icon: '🏦', title: 'Stablecoins ברזרבה', desc: 'שמור 20-30% USDT/USDC לקניות בירידות' }
                ]
            },
            {
                title: 'אסטרטגיית יציאה',
                rules: [
                    { icon: '📊', title: 'מכור לפי מדדים', desc: 'NUPL באופוריה + Pi Cycle Top + FNG מעל 80 - שקול מכירה הדרגתית' },
                    { icon: '🎯', title: 'יעדי מחיר מראש', desc: 'קבע מראש: 25% אוכר ב-X, עוד 25% ב-Y. בצע מכנית - ללא רגשות' },
                    { icon: '🔄', title: 'Rotate לStables בשיא', desc: 'בשיאי הסייקל - עבור ל-Stablecoins, לא לדולרים. שמור בקריפטו' }
                ]
            },
            {
                title: 'בחירת נכסים',
                rules: [
                    { icon: '₿', title: 'Bitcoin - Reserve Asset', desc: 'BTC הוא "זהב דיגיטלי". 40-60% מהתיק. הכי בטוח יחסית' },
                    { icon: 'Ξ', title: 'Ethereum - Infrastructure', desc: 'ETH הוא "שמן הכלכלה הדיגיטלית". 20-30% מהתיק' },
                    { icon: '⭐', title: 'Blue Chip Alts', desc: 'SOL, BNB, AVAX - לא ממש "alts". 10-20% בתיק' },
                    { icon: '🚀', title: 'High Risk Alts - מקסימום 10%', desc: 'אלטקוינים קטנים - פוטנציאל גבוה = סיכון גבוה. לא יותר מ-10%' }
                ]
            },
            {
                title: 'שמירת נכסים',
                rules: [
                    { icon: '🔐', title: 'Hardware Wallet חובה', desc: 'Ledger/Trezor לסכומים מעל $1,000. "Not your keys, not your coins"' },
                    { icon: '🌱', title: 'Seed Phrase גיבוי', desc: 'גבה את ה-seed phrase ב-3 מקומות שונים. אל תצלם, אל תשמור בענן' },
                    { icon: '📋', title: 'תיעוד לצרכי מס', desc: 'שמור רישום של כל קנייה ומכירה. בישראל - מס רווחי הון 25%' }
                ]
            }
        ]
    }
};

function showProfile(type) {
    document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
    const activeIdx = { day: 0, swing: 1, investor: 2 }[type];
    document.querySelectorAll('.profile-tab')[activeIdx]?.classList.add('active');

    const profile = PROFILES[type];
    const container = document.getElementById('profile-content');

    let html = `<div class="profile-section">
        <div class="profile-header">
            <div class="profile-header-icon">${profile.icon}</div>
            <h2>${profile.title}</h2>
            <p>${profile.subtitle}</p>
            <div class="timeframe">${profile.timeframe}</div>
        </div>`;

    profile.blocks.forEach(block => {
        html += `<div class="strategy-block">
            <div class="strategy-block-title">${block.title}</div>`;

        block.rules.forEach(rule => {
            html += `<div class="strategy-rule">
                <div class="sr-icon">${rule.icon}</div>
                <div class="sr-text">
                    <strong>${rule.title}</strong>
                    <span>${rule.desc}</span>
                </div>
            </div>`;
        });

        html += `</div>`;
    });

    html += `</div>`;
    container.innerHTML = html;
}

// ==================== RISK CALCULATOR ====================
function setRiskPct(pct) {
    riskPct = pct;
    document.getElementById('calc-risk-pct').value = pct;
    document.querySelectorAll('.calc-preset').forEach(b => {
        b.classList.toggle('active', parseInt(b.textContent) === pct);
    });
    calculateRisk();
}

function calculateRisk() {
    const portfolio = parseFloat(document.getElementById('calc-portfolio')?.value) || 0;
    const riskPctVal = parseFloat(document.getElementById('calc-risk-pct')?.value) || 2;
    const entry = parseFloat(document.getElementById('calc-entry')?.value) || 0;
    const stop = parseFloat(document.getElementById('calc-stop')?.value) || 0;
    const target = parseFloat(document.getElementById('calc-target')?.value) || 0;

    if (!portfolio || !entry || !stop) {
        return;
    }

    const riskAmount = portfolio * (riskPctVal / 100);
    const stopDistance = Math.abs(entry - stop);
    const stopPct = (stopDistance / entry) * 100;
    const positionSize = stopDistance > 0 ? riskAmount / stopDistance * entry : 0;
    const coins = stopDistance > 0 ? riskAmount / stopDistance : 0;
    const profitPotential = target > 0 && coins > 0 ? Math.abs(target - entry) * coins : 0;
    const rr = stopDistance > 0 && target > 0 ? Math.abs(target - entry) / stopDistance : 0;

    document.getElementById('res-risk-amount').textContent = '$' + riskAmount.toFixed(0);
    document.getElementById('res-position').textContent = '$' + positionSize.toFixed(0);
    document.getElementById('res-coins').textContent = coins.toFixed(4);
    document.getElementById('res-rr').textContent = rr.toFixed(1) + ':1';
    document.getElementById('res-profit').textContent = '+$' + profitPotential.toFixed(0);
    document.getElementById('res-stop-pct').textContent = stopPct.toFixed(1) + '%';

    const rrEl = document.getElementById('res-rr');
    if (rr >= 2) {
        rrEl.style.color = 'var(--green)';
    } else if (rr >= 1) {
        rrEl.style.color = 'var(--yellow)';
    } else {
        rrEl.style.color = 'var(--red)';
    }
}

// ==================== UTILS ====================
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}
