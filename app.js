const fmt = new Intl.NumberFormat('en-CA');
let rows = [];
const $ = id => document.getElementById(id);
const percent = (n, d) => d ? (100 * n / d).toFixed(1) + '%' : '—';
function median(values) {
 if (!values.length) return null;
 const sorted = [...values].sort((a, b) => a - b), half = Math.floor(sorted.length / 2);
 return sorted.length % 2 ? sorted[half] : (sorted[half - 1] + sorted[half]) / 2;
}
function render() {
 const platform = $('platform').value, path = $('path').value;
 const data = rows.filter(r => (platform === 'All platforms' || r.platform === platform) && (path === 'All routes' || r.verification_path === path));
 const count = outcome => data.filter(r => r.outcome === outcome).length;
 const verified = count('Verified'), recovery = data.filter(r => r.outcome === 'Support recovery');
 const legit = data.filter(r => r.simulated_legitimate === '1');
 const incomplete = legit.filter(r => r.outcome === 'Not completed').length;
 const retries = data.filter(r => Number(r.retry_count) > 0).length;
 const resolution = median(recovery.map(r => Number(r.support_resolution_minutes)));
 $('total').textContent = fmt.format(data.length);
 $('verified').textContent = percent(verified, data.length);
 $('verified-detail').textContent = fmt.format(verified) + ' Verified ÷ ' + fmt.format(data.length) + ' selected';
 $('recovery').textContent = fmt.format(recovery.length);
 $('recovery-detail').textContent = percent(recovery.length, data.length) + ' of selected journeys · outcome category';
 $('friction').textContent = percent(incomplete, legit.length);
 $('friction-detail').textContent = incomplete + ' ÷ ' + fmt.format(legit.length) + ' fictional legitimate labels';
 $('retry-rate').textContent = percent(retries, data.length);
 $('retry-detail').textContent = retries + ' with retry_count > 0 ÷ ' + fmt.format(data.length) + ' selected';
 $('support-time').textContent = resolution === null ? '—' : resolution + ' min';
 const categories = ['Verified', 'Retry needed', 'Support recovery', 'Not completed'];
 const max = Math.max(1, ...categories.map(count));
 $('bars').replaceChildren();
 for (const outcome of categories) {
  const row = document.createElement('div'); row.className = 'bar-row';
  const name = document.createElement('span'); name.textContent = outcome;
  const track = document.createElement('div'); track.className = 'bar-track';
  const fill = document.createElement('div'); fill.className = 'bar-fill'; fill.style.width = count(outcome) * 100 / max + '%'; track.append(fill);
  const value = document.createElement('strong'); value.textContent = fmt.format(count(outcome)); row.append(name, track, value); $('bars').append(row);
 }
 $('insight-text').textContent = data.length ? `In this fictional segment, ${incomplete} of ${fmt.format(legit.length)} sessions labelled “legitimate” do not complete access. I'd first audit whether a defensible real-world label and comparable journey exist, then test clearer recovery guidance with safety outcomes monitored alongside access.` : 'No sessions match these filters. No conclusion should be drawn.';
 $('status').textContent = fmt.format(data.length) + ' synthetic journeys · ' + platform + ' · ' + path;
}
for (const id of ['platform', 'path']) $(id).addEventListener('change', render);
fetch('data/simulated_sessions.csv').then(r => {if (!r.ok) throw new Error('Data unavailable'); return r.text();}).then(text => {
 const lines = text.trim().split(/\r?\n/), header = lines.shift().split(',');
 rows = lines.filter(Boolean).map(line => {const values = line.split(','); return Object.fromEntries(header.map((h, i) => [h, values[i] || '']));}); render();
}).catch(() => {
 $('bars').textContent = 'The sample could not load. Download the CSV to inspect it.';
 $('status').textContent = 'Dataset unavailable'; $('insight-text').textContent = 'Data unavailable; no results were calculated.';
 for (const id of ['verified-detail', 'recovery-detail', 'friction-detail', 'retry-detail']) $(id).textContent = 'Dataset unavailable';
});
