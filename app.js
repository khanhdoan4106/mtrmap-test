// =====================================================================
// KHỞI TẠO BẢN ĐỒ
// Tạo bản đồ Leaflet, tắt nút zoom mặc định, căn giữa vào khu vực HK
// =====================================================================
const map = L.map('map', { zoomControl: false }).setView([22.2819, 114.1589], 14);

// Thêm lớp tile OpenStreetMap làm nền bản đồ
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// =====================================================================
// HẰNG SỐ CẤU HÌNH
// =====================================================================
const TIME_PER_EDGE = 2; // Thời gian di chuyển giữa 2 ga liền kề (phút)

// =====================================================================
// BIẾN TRẠNG THÁI TOÀN CỤC
// =====================================================================
let mode  = 'block'; // Chế độ hiện tại: 'block' | 'start' | 'end' | 'done'
let scale = 1;       // Tỉ lệ phóng to/thu nhỏ của panel giao diện

let markerStart = null; // Marker điểm xuất phát trên bản đồ
let markerEnd   = null; // Marker điểm đích trên bản đồ
let pathLine    = null; // Polyline thể hiện tuyến đường tìm được

// Tập hợp các cạnh (đoạn đường) bị cấm, lưu dạng "u-v" và "v-u"
const blockedEdges = new Set();

// =====================================================================
// DỮ LIỆU CÁC GA (ĐỈNH CỦA ĐỒ THỊ)
// Mỗi ga có id, tên hiển thị và tọa độ địa lý
// =====================================================================
const stations = [
  { id:0, name:'Central',       lat:22.2819, lng:114.1589 },
  { id:1, name:'Admiralty',     lat:22.2798, lng:114.1655 },
  { id:2, name:'Wan Chai',      lat:22.2770, lng:114.1731 },
  { id:3, name:'Causeway Bay',  lat:22.2803, lng:114.1856 },
  { id:4, name:'Tin Hau',       lat:22.2825, lng:114.1918 },
  { id:5, name:'Fortress Hill', lat:22.2882, lng:114.1937 },
  { id:6, name:'North Point',   lat:22.2913, lng:114.2006 },
];

// Danh sách kề (adjacency list) — mô tả các ga nào nối trực tiếp với nhau
const adj = { 0:[1], 1:[0,2], 2:[1,3], 3:[2,4], 4:[3,5], 5:[4,6], 6:[5] };

// =====================================================================
// TÍNH KHOẢNG CÁCH ĐỊA LÝ (HAVERSINE)
// Trả về khoảng cách thực (mét) giữa 2 tọa độ trên mặt cầu Trái Đất
// =====================================================================
function haversine(a, b) {
  const R    = 6371000; // Bán kính Trái Đất (mét)
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const x    = Math.sin(dLat/2)**2
              + Math.cos(a.lat * Math.PI/180) * Math.cos(b.lat * Math.PI/180)
              * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// =====================================================================
// TÌM GA GẦN NHẤT VỚI VỊ TRÍ CLICK TRÊN BẢN ĐỒ
// Duyệt qua tất cả các ga, trả về index của ga gần latlng nhất
// =====================================================================
function nearest(latlng) {
  let best = 0, min = Infinity;
  stations.forEach((s, i) => {
    const d = haversine(latlng, s);
    if (d < min) { min = d; best = i; }
  });
  return best;
}

// =====================================================================
// HEURISTIC CHO A* — ƯỚC LƯỢNG CHI PHÍ TỪ GA u ĐẾN GA ĐÍCH dst
// Dùng khoảng cách Haversine (mét) chia cho tốc độ trung bình tàu MTR
// để quy ra đơn vị phút — đảm bảo heuristic không vượt quá chi phí thực
// (admissible heuristic), tức h(n) ≤ chi_phi_thuc(n, dst)
// =====================================================================
const MTR_SPEED_MPS = 400; // Tốc độ quy đổi (mét/phút) — ước lượng tàu MTR

function heuristic(u, dst) {
  if (u === dst) return 0;
  return haversine(stations[u], stations[dst]) / MTR_SPEED_MPS;
}

// =====================================================================
// TÌM ĐƯỜNG ĐI NGẮN NHẤT — THUẬT TOÁN A* (A-STAR)
// ---------------------------------------------------------------
// A* là cải tiến của Dijkstra: thay vì chỉ dựa vào chi phí đã đi (g),
// A* ưu tiên mở rộng các node có tổng f = g + h nhỏ nhất, trong đó:
//   g(n) = chi phí thực tế từ src đến n (số phút đã đi)
//   h(n) = ước lượng chi phí từ n đến dst (heuristic địa lý)
//   f(n) = g(n) + h(n) = ước lượng tổng chi phí qua n
//
// Tham số:
//   src — id ga xuất phát
//   dst — id ga đích
// Trả về:
//   { route: [id, ...], cost: số_phút } hoặc null nếu không có đường
// =====================================================================
function findPath(src, dst) {
  if (src === dst) return { route: [src], cost: 0 };

  const g      = Array(stations.length).fill(Infinity);
  const trace  = {};
  const closed = new Set();

  g[src] = 0;
  const open = [{ id: src, f: heuristic(src, dst) }];

  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const { id: u } = open.shift();

    if (u === dst) {
      const route = [dst];
      let cur = dst;
      while (cur !== src) { cur = trace[cur]; route.push(cur); }
      route.reverse();
      return { route, cost: g[dst] };
    }

    if (closed.has(u)) continue;
    closed.add(u);

    for (const v of (adj[u] || [])) {
      if (blockedEdges.has(`${u}-${v}`)) continue;
      if (closed.has(v)) continue;

      const tentative_g = g[u] + TIME_PER_EDGE;

      if (tentative_g < g[v]) {
        g[v]     = tentative_g;
        trace[v] = u;
        const f_v = tentative_g + heuristic(v, dst);
        open.push({ id: v, f: f_v });
      }
    }
  }

  return null;
}

// =====================================================================
// VẼ MARKER CHO TỪNG GA TRÊN BẢN ĐỒ
// =====================================================================
stations.forEach(s => {
  L.marker([s.lat, s.lng], {
    icon: L.divIcon({
      className: '',
      html: `<div style="width:13px;height:13px;background:#4d9cff;border:2.5px solid #0a0e14;border-radius:50%;box-shadow:0 0 8px rgba(77,156,255,0.8)"></div>`,
      iconSize:   [13, 13],
      iconAnchor: [6.5, 6.5]
    })
  }).addTo(map).bindTooltip(s.name, { permanent: false, direction: 'top' });
});

// =====================================================================
// VẼ CÁC CẠNH (ĐOẠN NỐI GIỮA 2 GA) TRÊN BẢN ĐỒ
// =====================================================================
let edgeLines = [];

function drawEdges() {
  edgeLines.forEach(l => map.removeLayer(l));
  edgeLines = [];

  for (const u in adj) {
    for (const v of adj[u]) {
      if (Number(u) >= Number(v)) continue;

      const blocked = blockedEdges.has(`${u}-${v}`);

      const line = L.polyline(
        [[stations[u].lat, stations[u].lng], [stations[v].lat, stations[v].lng]],
        {
          color:     blocked ? '#ff5252' : '#4d9cff',
          weight:    blocked ? 6 : 5,
          opacity:   blocked ? 1 : 0.72,
          dashArray: blocked ? '9,7' : null
        }
      ).addTo(map);

      line.bindTooltip(
        `${stations[u].name} ↔ ${stations[v].name}${blocked ? ' 🚫' : ''}`,
        { sticky: true }
      );

      line.on('click', () => {
        if (mode !== 'block') return;
        const k1 = `${u}-${v}`, k2 = `${v}-${u}`;
        if (blockedEdges.has(k1)) {
          blockedEdges.delete(k1); blockedEdges.delete(k2);
        } else {
          blockedEdges.add(k1);   blockedEdges.add(k2);
        }
        updateBlockUI();
        drawEdges();
      });

      line.on('mouseover', () => { if (mode === 'block') line.setStyle({ weight: 9, opacity: 1 }); });
      line.on('mouseout',  () => { line.setStyle({ weight: blocked ? 6 : 5, opacity: blocked ? 1 : 0.72 }); });

      edgeLines.push(line);
    }
  }
}

drawEdges();

// =====================================================================
// CẬP NHẬT BADGE TRẠNG THÁI TRÊN PANEL
// =====================================================================
function setStatus(text, variant = '') {
  const b = document.getElementById('status-badge');
  b.className = variant;
  b.innerHTML = `<span class="dot"></span><span>${text}</span>`;
}

// =====================================================================
// CẬP NHẬT GIAO DIỆN PHẦN DANH SÁCH CẤM
// =====================================================================
function updateBlockUI() {
  const count = blockedEdges.size / 2;
  const chip  = document.getElementById('blocked-count-chip');
  const badge = document.getElementById('blocked-count-badge');

  chip.style.display  = count > 0 ? 'inline' : 'none';
  chip.textContent    = count;
  badge.style.display = count > 0 ? 'inline' : 'none';
  badge.textContent   = count;

  setStatus(
    count > 0
      ? `${count} đoạn bị cấm — nhấn Xác nhận để tiếp tục`
      : 'Chọn đoạn bị cấm → Nhấn Xác nhận',
    count > 0 ? 'danger' : ''
  );

  renderBlockedList();
}

// =====================================================================
// RENDER DANH SÁCH CÁC ĐOẠN BỊ CẤM TRONG PANEL
// =====================================================================
function renderBlockedList() {
  const list  = document.getElementById('blocked-list');
  const empty = document.getElementById('blocked-empty-msg');
  list.innerHTML = '';

  const pairs = [];
  blockedEdges.forEach(edge => {
    const [u, v] = edge.split('-').map(Number);
    if (u < v) pairs.push([u, v]);
  });

  if (pairs.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  pairs.forEach(([u, v]) => {
    const row = document.createElement('div');
    row.className = 'blocked-line-item';
    row.innerHTML = `
      <div class="blocked-line-names">
        <span class="stn-tag">${stations[u].name}</span>
        <span class="line-arrow">⟷</span>
        <span class="stn-tag">${stations[v].name}</span>
      </div>
      <button class="unblock-btn" onclick="unblockEdge(${u},${v})">Bỏ cấm</button>`;
    list.appendChild(row);
  });
}

// =====================================================================
// GỠ CẤM MỘT ĐOẠN CỤ THỂ
// =====================================================================
function unblockEdge(u, v) {
  blockedEdges.delete(`${u}-${v}`);
  blockedEdges.delete(`${v}-${u}`);
  updateBlockUI();
  drawEdges();
  if (mode === 'done') updateRoute();
}

// =====================================================================
// TÍNH VÀ HIỂN THỊ TUYẾN ĐƯỜNG
// =====================================================================
function updateRoute() {
  if (!markerStart || !markerEnd) return;

  const s      = nearest(markerStart.getLatLng());
  const t      = nearest(markerEnd.getLatLng());
  const result = findPath(s, t);

  if (pathLine) { map.removeLayer(pathLine); pathLine = null; }

  const sec  = document.getElementById('route-section');
  const body = document.getElementById('route-body');
  sec.style.display = 'block';

  if (!result) {
    setStatus('Không tìm được đường đi', 'danger');
    body.innerHTML = `<div class="no-route">❌ Mọi tuyến đường đều bị chặn.</div>`;
    return;
  }

  const coords = result.route.map(i => [stations[i].lat, stations[i].lng]);
  pathLine = L.polyline(coords, { color: '#36c95a', weight: 5, opacity: 0.95 }).addTo(map);

  const n = result.route.length;
  let html = '<div class="route-flow">';
  result.route.forEach((id, idx) => {
    const cls = idx === 0 ? 'first' : idx === n - 1 ? 'last' : 'mid';
    html += `<div class="route-stop">
               <span class="stop-dot ${cls}"></span>
               <span class="stop-name">${stations[id].name}</span>
             </div>`;
    if (idx < n - 1) html += `<div class="stop-connector"></div>`;
  });
  html += `</div>
  <div style="display:flex;align-items:center;gap:10px;margin-top:12px;">
    <span class="time-chip">⏱ ${result.cost} phút</span>
    <span class="stop-count-chip">${n} ga · ${n - 1} đoạn</span>
  </div>`;

  body.innerHTML = html;
  setStatus('Tuyến đường đã được tính toán', 'success');
}

// =====================================================================
// TẠO ICON MARKER CHO ĐIỂM BẮT ĐẦU / KẾT THÚC
// =====================================================================
const markerOpts = (label, color) => ({
  icon: L.divIcon({
    className: '',
    html: `<div style="
      background:${color};color:#0a0e14;border-radius:7px;
      padding:4px 10px;font-family:'Outfit',sans-serif;
      font-size:12px;font-weight:700;white-space:nowrap;
      box-shadow:0 3px 10px rgba(0,0,0,0.45);">${label}</div>`,
    iconAnchor: [30, 12]
  })
});

// =====================================================================
// XỬ LÝ SỰ KIỆN CLICK TRÊN BẢN ĐỒ
// =====================================================================
map.on('click', e => {
  if (mode === 'block') return;

  if (mode === 'start') {
    if (markerStart) map.removeLayer(markerStart);
    markerStart = L.marker(e.latlng, markerOpts('▶ Bắt đầu', '#36c95a')).addTo(map);
    mode = 'end';
    setStatus('Chọn điểm kết thúc trên bản đồ');
    return;
  }

  if (mode === 'end') {
    if (markerEnd) map.removeLayer(markerEnd);
    markerEnd = L.marker(e.latlng, markerOpts('■ Kết thúc', '#ff5252')).addTo(map);
    mode = 'done';
    updateRoute();
    return;
  }
});

// =====================================================================
// NÚT "XÁC NHẬN"
// =====================================================================
function finishBlock() {
  mode = 'start';
  document.getElementById('route-section').style.display = 'none';
  setStatus('Chọn điểm bắt đầu trên bản đồ');
}

// =====================================================================
// NÚT "ĐẶT LẠI"
// =====================================================================
function resetMap() {
  if (markerStart) { map.removeLayer(markerStart); markerStart = null; }
  if (markerEnd)   { map.removeLayer(markerEnd);   markerEnd   = null; }
  if (pathLine)    { map.removeLayer(pathLine);     pathLine    = null; }

  blockedEdges.clear();
  drawEdges();

  mode  = 'block';
  scale = 1;
  document.getElementById('panel').style.transform = '';
  document.getElementById('route-section').style.display = 'none';
  document.getElementById('blocked-count-chip').style.display = 'none';

  updateBlockUI();
  setStatus('Chọn đoạn bị cấm → Nhấn Xác nhận');
}

// =====================================================================
// ZOOM PANEL
// =====================================================================
function zoomIn()  { scale = Math.min(scale + 0.1, 1.5); applyZoom(); }
function zoomOut() { scale = Math.max(scale - 0.1, 0.6); applyZoom(); }

function applyZoom() {
  const p = document.getElementById('panel');
  p.style.transform       = `scale(${scale})`;
  p.style.transformOrigin = 'top right';
}
