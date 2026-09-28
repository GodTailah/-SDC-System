// --- CHARTS ---
const charts = { type: null, loc: null, time: null };

function initCharts() {
    Chart.defaults.color = '#64748b';
    Chart.defaults.borderColor = '#f1f5f9';
    Chart.defaults.font.family = "'Plus Jakarta Sans', 'Prompt', system-ui, sans-serif";
    Chart.defaults.font.size = 12;

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#ffffff',
                titleColor: '#0f172a',
                bodyColor: '#334155',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 10,
                boxPadding: 4,
                cornerRadius: 8,
                usePointStyle: true
            }
        },
        scales: {
            x: {
                grid: { color: '#f1f5f9' },
                ticks: { color: '#64748b' }
            },
            y: {
                grid: { color: '#f1f5f9' },
                ticks: { color: '#64748b', precision: 0 }
            }
        }
    };

    const ctxType = document.getElementById('chart-type').getContext('2d');
    charts.type = new Chart(ctxType, {
        type: 'bar',
        data: { labels: [], datasets: [{ data: [], backgroundColor: '#2563eb', borderRadius: 6, maxBarThickness: 28 }] },
        options: { ...commonOptions, indexAxis: 'y' }
    });

    const ctxLoc = document.getElementById('chart-loc').getContext('2d');
    charts.loc = new Chart(ctxLoc, {
        type: 'bar',
        data: { labels: [], datasets: [{ data: [], backgroundColor: '#f59e0b', borderRadius: 6, maxBarThickness: 32 }] },
        options: commonOptions
    });

    const ctxTime = document.getElementById('chart-time').getContext('2d');
    charts.time = new Chart(ctxTime, {
        type: 'line',
        data: { labels: [], datasets: [{ data: [], borderColor: '#10b981', borderWidth: 2.5, backgroundColor: 'rgba(16, 185, 129, 0.12)', fill: true, tension: 0.35, pointBackgroundColor: '#10b981', pointRadius: 4 }] },
        options: commonOptions
    });

    renderStatsTypeOptions();
    ['stats-date-filter', 'stats-type-filter', 'stats-time-filter'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateCharts);
    });

    updateCharts();
}

function renderStatsTypeOptions() {
    const select = document.getElementById('stats-type-filter');
    const current = select.value || 'All';
    select.innerHTML = `<option value="All">${t('stats.allTypes')}</option>` +
        INCIDENT_TYPES.map(type => `<option value="${type}">${typeLabel(type)}</option>`).join('');
    select.value = current;
}

function getFilteredStatsData() {
    const dateFilter = document.getElementById('stats-date-filter').value;
    const typeFilter = document.getElementById('stats-type-filter').value;
    const timeFilter = document.getElementById('stats-time-filter').value;
    let data = State.incidents;

    if (dateFilter === 'Today') {
        data = data.filter(i => i.date === todayKey());
    } else if (dateFilter === 'Last7') {
        const now = new Date();
        const from = toDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6));
        data = data.filter(i => i.date >= from);
    }
    if (typeFilter !== 'All') {
        data = data.filter(i => i.type === typeFilter);
    }
    if (timeFilter !== 'All') {
        data = data.filter(i => {
            const hour = parseInt(i.time.split(':')[0], 10);
            if (timeFilter === 'Morning') return hour >= 6 && hour < 12;
            if (timeFilter === 'Afternoon') return hour >= 12 && hour < 18;
            if (timeFilter === 'Evening') return hour >= 18 || hour < 6;
            return true;
        });
    }
    return data;
}

function updateStatsKPIs(data) {
    const kpis = document.getElementById('stats-kpis');
    if (!kpis) return;

    const accidents = data.filter(i => i.type === 'Possible Accident').length;

    const locCounts = {};
    data.forEach(i => locCounts[i.loc] = (locCounts[i.loc] || 0) + 1);
    const topLoc = Object.keys(locCounts).sort((a, b) => locCounts[b] - locCounts[a])[0];

    const hourCounts = {};
    data.forEach(i => {
        const hour = `${i.time.split(':')[0]}:00`;
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const busiestHour = Object.keys(hourCounts).sort((a, b) => hourCounts[b] - hourCounts[a])[0] || '-';

    kpis.innerHTML =
        renderStatCard(t('stats.kpiEvents'), data.length, 'var(--primary-color)', 'var(--primary-light)', svgIcon(22, ICON_PATHS.Clipboard, 2)) +
        renderStatCard(t('stats.kpiAccidents'), accidents, 'var(--danger-color)', 'var(--danger-light)', getIncidentIconSVG('Possible Accident', 22)) +
        renderStatCard(t('stats.kpiTopLoc'), topLoc ? locLabel(topLoc) : '-', 'var(--warning-color)', 'var(--warning-light)', svgIcon(22, ICON_PATHS.MapPin, 2)) +
        renderStatCard(t('stats.kpiBusiest'), busiestHour, '#8b5cf6', '#f5f3ff', svgIcon(22, ICON_PATHS.Clock, 2));
}

function updateCharts() {
    if (!charts.type) return;

    const data = getFilteredStatsData();
    updateStatsKPIs(data);
    const datasetLabel = t('stats.events');

    // Type
    const types = {};
    data.forEach(i => types[i.type] = (types[i.type] || 0) + 1);
    charts.type.data.labels = Object.keys(types).map(typeLabel);
    charts.type.data.datasets[0].data = Object.values(types);
    charts.type.data.datasets[0].label = datasetLabel;
    charts.type.update();

    // Loc
    const locs = {};
    data.forEach(i => locs[i.loc] = (locs[i.loc] || 0) + 1);
    charts.loc.data.labels = Object.keys(locs).map(locLabel);
    charts.loc.data.datasets[0].data = Object.values(locs);
    charts.loc.data.datasets[0].label = datasetLabel;
    charts.loc.update();

    // Time (Group by hour): 08-18 by default, widened to include any event outside it
    const hours = data.map(i => parseInt(i.time.split(':')[0], 10));
    const firstHour = Math.min(8, ...hours);
    const lastHour = Math.max(18, ...hours);
    const times = {};
    for (let h = firstHour; h <= lastHour; h++) times[`${String(h).padStart(2, '0')}:00`] = 0;

    hours.forEach(h => times[`${String(h).padStart(2, '0')}:00`]++);

    charts.time.data.labels = Object.keys(times);
    charts.time.data.datasets[0].data = Object.values(times);
    charts.time.data.datasets[0].label = datasetLabel;
    charts.time.update();
}
