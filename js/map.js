// --- RISK MAP ---
function updateMap() {
    const locCounts = {};
    State.incidents.forEach(i => {
        locCounts[i.loc] = (locCounts[i.loc] || 0) + 1;
    });

    document.querySelectorAll('.map-marker').forEach(marker => {
        const loc = marker.getAttribute('data-loc');
        const count = locCounts[loc] || 0;
        const risk = getRiskLevel(count);

        marker.classList.remove('marker-low', 'marker-med', 'marker-high');
        marker.classList.add({ High: 'marker-high', Medium: 'marker-med', Low: 'marker-low' }[risk]);

        // Click a marker to see its event count / risk level and jump to its incidents
        marker.onclick = (e) => {
            e.stopPropagation();
            const tt = document.getElementById('map-tooltip');
            document.getElementById('tt-title').innerText = locLabel(loc);
            document.getElementById('tt-events').innerText = count;
            document.getElementById('tt-risk').innerText = t(`risk.${risk}`);
            tt.style.display = 'block';
            positionMapTooltip(tt, marker);

            document.getElementById('tt-view-btn').onclick = () => {
                navTo('incidents');
                document.getElementById('incident-status-filter').value = 'All';
                document.getElementById('incident-search').value = locLabel(loc);
                updateIncidentsList();
                hideMapTooltip();
            };
        };
    });
}

// Place the tooltip beside the marker, flipping to the left and clamping so it stays inside the map
function positionMapTooltip(tt, marker) {
    const gap = 10;
    const rect = marker.getBoundingClientRect();
    const mapRect = document.getElementById('map-container').getBoundingClientRect();

    let left = rect.right - mapRect.left + gap;
    if (left + tt.offsetWidth > mapRect.width - gap) {
        left = rect.left - mapRect.left - tt.offsetWidth - gap;
    }
    left = Math.max(gap, Math.min(left, mapRect.width - tt.offsetWidth - gap));

    let top = rect.top - mapRect.top - 20;
    top = Math.max(gap, Math.min(top, mapRect.height - tt.offsetHeight - gap));

    tt.style.left = `${left}px`;
    tt.style.top = `${top}px`;
}

function hideMapTooltip() {
    const tt = document.getElementById('map-tooltip');
    if (tt) tt.style.display = 'none';
}

// Close the tooltip when clicking anywhere else on the map
document.addEventListener('click', (e) => {
    if (!e.target.closest('.map-marker') && !e.target.closest('#map-tooltip')) hideMapTooltip();
});
