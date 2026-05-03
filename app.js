// =====================================================================
// MAP SETUP
// =====================================================================
const map = L.map('map', { zoomControl: false }).setView([22.34, 114.15], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// =====================================================================
// NETWORK CONFIG
// Station order is based on the official MTR open-data line/station CSV.
// Coordinates are normalized from Wikidata coordinate records for MTR stations.
// Travel time is no longer a fixed value. Each rail edge is estimated from
// geodesic distance, route profile speed, dwell time, and interchange penalties.
// =====================================================================
const lineProfiles = {
  AEL: { name: 'Airport Express',      color: '#00888a', speedKmh: 75, dwellMins: 0.25, minEdgeMins: 2.0 },
  DRL: { name: 'Disneyland Resort',    color: '#f08bb4', speedKmh: 48, dwellMins: 0.35, minEdgeMins: 2.0 },
  EAL: { name: 'East Rail Line',       color: '#6cc4e8', speedKmh: 62, dwellMins: 0.35, minEdgeMins: 1.5 },
  ISL: { name: 'Island Line',          color: '#007dc5', speedKmh: 42, dwellMins: 0.35, minEdgeMins: 1.3 },
  KTL: { name: 'Kwun Tong Line',       color: '#00a040', speedKmh: 38, dwellMins: 0.35, minEdgeMins: 1.4 },
  SIL: { name: 'South Island Line',    color: '#b5bd00', speedKmh: 45, dwellMins: 0.35, minEdgeMins: 1.6 },
  TCL: { name: 'Tung Chung Line',      color: '#f7941d', speedKmh: 68, dwellMins: 0.35, minEdgeMins: 1.6 },
  TKL: { name: 'Tseung Kwan O Line',   color: '#7d499d', speedKmh: 45, dwellMins: 0.35, minEdgeMins: 1.4 },
  TML: { name: 'Tuen Ma Line',         color: '#9a3b26', speedKmh: 55, dwellMins: 0.35, minEdgeMins: 1.5 },
  TWL: { name: 'Tsuen Wan Line',       color: '#e2231a', speedKmh: 40, dwellMins: 0.35, minEdgeMins: 1.3 },
  XFER: { name: 'Interchange Walk',    color: '#9aa4b2', speedKmh: 5,  dwellMins: 0,    minEdgeMins: 0 }
};

const transferPenaltyMins = {
  ADM: 4, CEN: 4, HOK: 5, TST: 4, ETS: 4, KOT: 4, TAW: 4, DIH: 4,
  HOM: 4, HUH: 4, MEF: 4, NAC: 4, LAK: 3, TSY: 3, YMT: 3, MOK: 3,
  PRE: 3, NOP: 3, QUB: 3, YAT: 3, TIK: 3
};

const DEFAULT_TRANSFER_MINS = 3;
const FASTEST_SPEED_KMH = 75;

const stations = [
  { id: 'CEN', name: 'Central', lat: 22.282171, lng: 114.157825, lines: ['ISL', 'TWL'] },
  { id: 'ADM', name: 'Admiralty', lat: 22.2788, lng: 114.1646, lines: ['EAL', 'ISL', 'SIL', 'TWL'] },
  { id: 'TST', name: 'Tsim Sha Tsui', lat: 22.2973, lng: 114.1722, lines: ['TWL'] },
  { id: 'JOR', name: 'Jordan', lat: 22.3049, lng: 114.1718, lines: ['TWL'] },
  { id: 'YMT', name: 'Yau Ma Tei', lat: 22.3128, lng: 114.170694, lines: ['KTL', 'TWL'] },
  { id: 'MOK', name: 'Mong Kok', lat: 22.31925, lng: 114.169361, lines: ['KTL', 'TWL'] },
  { id: 'SKM', name: 'Shek Kip Mei', lat: 22.332025, lng: 114.168889, lines: ['KTL'] },
  { id: 'KOT', name: 'Kowloon Tong', lat: 22.336786, lng: 114.177542, lines: ['EAL', 'KTL'] },
  { id: 'LOF', name: 'Lok Fu', lat: 22.338, lng: 114.1871, lines: ['KTL'] },
  { id: 'WTS', name: 'Wong Tai Sin', lat: 22.3417, lng: 114.1939, lines: ['KTL'] },
  { id: 'DIH', name: 'Diamond Hill', lat: 22.3401, lng: 114.2016, lines: ['KTL', 'TML'] },
  { id: 'CHH', name: 'Choi Hung', lat: 22.3348, lng: 114.2089, lines: ['KTL'] },
  { id: 'KOB', name: 'Kowloon Bay', lat: 22.3235, lng: 114.2141, lines: ['KTL'] },
  { id: 'NTK', name: 'Ngau Tau Kok', lat: 22.315457, lng: 114.21901, lines: ['KTL'] },
  { id: 'KWT', name: 'Kwun Tong', lat: 22.3121, lng: 114.2265, lines: ['KTL'] },
  { id: 'PRE', name: 'Prince Edward', lat: 22.3245, lng: 114.1683, lines: ['KTL', 'TWL'] },
  { id: 'SSP', name: 'Sham Shui Po', lat: 22.3307, lng: 114.1623, lines: ['TWL'] },
  { id: 'CSW', name: 'Cheung Sha Wan', lat: 22.3354, lng: 114.1563, lines: ['TWL'] },
  { id: 'LCK', name: 'Lai Chi Kok', lat: 22.3373, lng: 114.1482, lines: ['TWL'] },
  { id: 'MEF', name: 'Mei Foo', lat: 22.338, lng: 114.139028, lines: ['TML', 'TWL'] },
  { id: 'LAK', name: 'Lai King', lat: 22.3484, lng: 114.1261, lines: ['TCL', 'TWL'] },
  { id: 'KWF', name: 'Kwai Fong', lat: 22.3569, lng: 114.1279, lines: ['TWL'] },
  { id: 'KWH', name: 'Kwai Hing', lat: 22.3632, lng: 114.1312, lines: ['TWL'] },
  { id: 'TWH', name: 'Tai Wo Hau', lat: 22.3708, lng: 114.125, lines: ['TWL'] },
  { id: 'TSW', name: 'Tsuen Wan', lat: 22.3736, lng: 114.1178, lines: ['TWL'] },
  { id: 'SHW', name: 'Sheung Wan', lat: 22.2862, lng: 114.1518, lines: ['ISL'] },
  { id: 'WAC', name: 'Wan Chai', lat: 22.2773, lng: 114.1728, lines: ['ISL'] },
  { id: 'CAB', name: 'Causeway Bay', lat: 22.2802, lng: 114.1835, lines: ['ISL'] },
  { id: 'TIH', name: 'Tin Hau', lat: 22.2827, lng: 114.1917, lines: ['ISL'] },
  { id: 'FOH', name: 'Fortress Hill', lat: 22.2881, lng: 114.1936, lines: ['ISL'] },
  { id: 'NOP', name: 'North Point', lat: 22.2909, lng: 114.2007, lines: ['ISL', 'TKL'] },
  { id: 'QUB', name: 'Quarry Bay', lat: 22.2878, lng: 114.2096, lines: ['ISL', 'TKL'] },
  { id: 'TAK', name: 'Tai Koo', lat: 22.2846, lng: 114.2161, lines: ['ISL'] },
  { id: 'SWH', name: 'Sai Wan Ho', lat: 22.2816, lng: 114.2224, lines: ['ISL'] },
  { id: 'SKW', name: 'Shau Kei Wan', lat: 22.2789, lng: 114.2289, lines: ['ISL'] },
  { id: 'HFC', name: 'Heng Fa Chuen', lat: 22.2769, lng: 114.2398, lines: ['ISL'] },
  { id: 'CHW', name: 'Chai Wan', lat: 22.2644, lng: 114.2368, lines: ['ISL'] },
  { id: 'LAT', name: 'Lam Tin', lat: 22.3064, lng: 114.2331, lines: ['KTL'] },
  { id: 'OLY', name: 'Olympic', lat: 22.3178, lng: 114.1602, lines: ['TCL'] },
  { id: 'TUC', name: 'Tung Chung', lat: 22.2893, lng: 113.9416, lines: ['TCL'] },
  { id: 'HOK', name: 'Hong Kong', lat: 22.2848, lng: 114.158, lines: ['AEL', 'TCL'] },
  { id: 'KOW', name: 'Kowloon', lat: 22.3049, lng: 114.1615, lines: ['AEL', 'TCL'] },
  { id: 'TSY', name: 'Tsing Yi', lat: 22.3584, lng: 114.107, lines: ['AEL', 'TCL'] },
  { id: 'AIR', name: 'Airport', lat: 22.316, lng: 113.9366, lines: ['AEL'] },
  { id: 'YAT', name: 'Yau Tong', lat: 22.2979, lng: 114.2371, lines: ['KTL', 'TKL'] },
  { id: 'TIK', name: 'Tiu Keng Leng', lat: 22.3041, lng: 114.2524, lines: ['KTL', 'TKL'] },
  { id: 'TKO', name: 'Tseung Kwan O', lat: 22.3074, lng: 114.26, lines: ['TKL'] },
  { id: 'HAH', name: 'Hang Hau', lat: 22.3156, lng: 114.2644, lines: ['TKL'] },
  { id: 'POA', name: 'Po Lam', lat: 22.3224, lng: 114.258, lines: ['TKL'] },
  { id: 'NAC', name: 'Nam Cheong', lat: 22.326497, lng: 114.153089, lines: ['TCL', 'TML'] },
  { id: 'SUN', name: 'Sunny Bay', lat: 22.3318, lng: 114.0288, lines: ['DRL', 'TCL'] },
  { id: 'DIS', name: 'Disneyland Resort', lat: 22.3155, lng: 114.0451, lines: ['DRL'] },
  { id: 'AWE', name: 'AsiaWorld-Expo', lat: 22.3218, lng: 113.9412, lines: ['AEL'] },
  { id: 'LHP', name: 'LOHAS Park', lat: 22.2957, lng: 114.2689, lines: ['TKL'] },
  { id: 'HUH', name: 'Hung Hom', lat: 22.3029, lng: 114.1816, lines: ['EAL', 'TML'] },
  { id: 'MKK', name: 'Mong Kok East', lat: 22.3222, lng: 114.1728, lines: ['EAL'] },
  { id: 'TAW', name: 'Tai Wai', lat: 22.3731, lng: 114.1786, lines: ['EAL', 'TML'] },
  { id: 'SHT', name: 'Sha Tin', lat: 22.3825, lng: 114.1875, lines: ['EAL'] },
  { id: 'FOT', name: 'Fo Tan', lat: 22.3953, lng: 114.1982, lines: ['EAL'] },
  { id: 'UNI', name: 'University', lat: 22.4134, lng: 114.2102, lines: ['EAL'] },
  { id: 'TAP', name: 'Tai Po Market', lat: 22.4446, lng: 114.1706, lines: ['EAL'] },
  { id: 'TWO', name: 'Tai Wo', lat: 22.4511, lng: 114.1611, lines: ['EAL'] },
  { id: 'FAN', name: 'Fanling', lat: 22.4921, lng: 114.1387, lines: ['EAL'] },
  { id: 'SHS', name: 'Sheung Shui', lat: 22.5012, lng: 114.128, lines: ['EAL'] },
  { id: 'LOW', name: 'Lo Wu', lat: 22.5283, lng: 114.1134, lines: ['EAL'] },
  { id: 'LMC', name: 'Lok Ma Chau', lat: 22.5144, lng: 114.0657, lines: ['EAL'] },
  { id: 'ETS', name: 'East Tsim Sha Tsui', lat: 22.2953, lng: 114.1742, lines: ['TML'] },
  { id: 'SYP', name: 'Sai Ying Pun', lat: 22.2856, lng: 114.143, lines: ['ISL'] },
  { id: 'HKU', name: 'HKU', lat: 22.2841, lng: 114.136, lines: ['ISL'] },
  { id: 'KET', name: 'Kennedy Town', lat: 22.2812, lng: 114.129, lines: ['ISL'] },
  { id: 'HOM', name: 'Ho Man Tin', lat: 22.3093, lng: 114.183, lines: ['KTL', 'TML'] },
  { id: 'WHA', name: 'Whampoa', lat: 22.305, lng: 114.19, lines: ['KTL'] },
  { id: 'OCP', name: 'Ocean Park', lat: 22.2486, lng: 114.174, lines: ['SIL'] },
  { id: 'WCH', name: 'Wong Chuk Hang', lat: 22.248, lng: 114.168, lines: ['SIL'] },
  { id: 'LET', name: 'Lei Tung', lat: 22.2421, lng: 114.1562, lines: ['SIL'] },
  { id: 'SOH', name: 'South Horizons', lat: 22.2425, lng: 114.1491, lines: ['SIL'] },
  { id: 'HIK', name: 'Hin Keng', lat: 22.364, lng: 114.171, lines: ['TML'] },
  { id: 'KAT', name: 'Kai Tak', lat: 22.3305, lng: 114.199, lines: ['TML'] },
  { id: 'SUW', name: 'Sung Wong Toi', lat: 22.3258, lng: 114.191, lines: ['TML'] },
  { id: 'TKW', name: 'To Kwa Wan', lat: 22.3172, lng: 114.188, lines: ['TML'] },
  { id: 'EXC', name: 'Exhibition Centre', lat: 22.2818, lng: 114.1754, lines: ['EAL'] },
  { id: 'CKT', name: 'Che Kung Temple', lat: 22.3748, lng: 114.1861, lines: ['TML'] },
  { id: 'STW', name: 'Sha Tin Wai', lat: 22.3771, lng: 114.195, lines: ['TML'] },
  { id: 'CIO', name: 'City One', lat: 22.3828, lng: 114.2035, lines: ['TML'] },
  { id: 'SHM', name: 'Shek Mun', lat: 22.3877, lng: 114.2083, lines: ['TML'] },
  { id: 'TSH', name: 'Tai Shui Hang', lat: 22.4088, lng: 114.223, lines: ['TML'] },
  { id: 'HEO', name: 'Heng On', lat: 22.4174, lng: 114.2258, lines: ['TML'] },
  { id: 'MOS', name: 'Ma On Shan', lat: 22.4247, lng: 114.2316, lines: ['TML'] },
  { id: 'WKS', name: 'Wu Kai Sha', lat: 22.4291, lng: 114.2438, lines: ['TML'] },
  { id: 'AUS', name: 'Austin', lat: 22.303625, lng: 114.166767, lines: ['TML'] },
  { id: 'TWW', name: 'Tsuen Wan West', lat: 22.3682, lng: 114.1098, lines: ['TML'] },
  { id: 'KSR', name: 'Kam Sheung Road', lat: 22.434789, lng: 114.0635, lines: ['TML'] },
  { id: 'YUL', name: 'Yuen Long', lat: 22.4462, lng: 114.0355, lines: ['TML'] },
  { id: 'LOP', name: 'Long Ping', lat: 22.447594, lng: 114.0256, lines: ['TML'] },
  { id: 'TIS', name: 'Tin Shui Wai', lat: 22.4481, lng: 114.0048, lines: ['TML'] },
  { id: 'SIH', name: 'Siu Hong', lat: 22.412414, lng: 113.978611, lines: ['TML'] },
  { id: 'TUM', name: 'Tuen Mun', lat: 22.3941, lng: 113.973194, lines: ['TML'] },
];

const lineSequences = {
  AEL: [['HOK', 'KOW', 'TSY', 'AIR', 'AWE']],
  DRL: [['DIS', 'SUN']],
  EAL: [
    ['ADM', 'EXC', 'HUH', 'MKK', 'KOT', 'TAW', 'SHT', 'FOT', 'UNI', 'TAP', 'TWO', 'FAN', 'SHS', 'LOW'],
    ['ADM', 'EXC', 'HUH', 'MKK', 'KOT', 'TAW', 'SHT', 'FOT', 'UNI', 'TAP', 'TWO', 'FAN', 'SHS', 'LMC']
  ],
  ISL: [['KET', 'HKU', 'SYP', 'SHW', 'CEN', 'ADM', 'WAC', 'CAB', 'TIH', 'FOH', 'NOP', 'QUB', 'TAK', 'SWH', 'SKW', 'HFC', 'CHW']],
  KTL: [['WHA', 'HOM', 'YMT', 'MOK', 'PRE', 'SKM', 'KOT', 'LOF', 'WTS', 'DIH', 'CHH', 'KOB', 'NTK', 'KWT', 'LAT', 'YAT', 'TIK']],
  SIL: [['ADM', 'OCP', 'WCH', 'LET', 'SOH']],
  TCL: [['HOK', 'KOW', 'OLY', 'NAC', 'LAK', 'TSY', 'SUN', 'TUC']],
  TKL: [
    ['NOP', 'QUB', 'YAT', 'TIK', 'TKO', 'HAH', 'POA'],
    ['LHP', 'TKO', 'TIK']
  ],
  TML: [['WKS', 'MOS', 'HEO', 'TSH', 'SHM', 'CIO', 'STW', 'CKT', 'TAW', 'HIK', 'DIH', 'KAT', 'SUW', 'TKW', 'HOM', 'HUH', 'ETS', 'AUS', 'NAC', 'MEF', 'TWW', 'KSR', 'YUL', 'LOP', 'TIS', 'SIH', 'TUM']],
  TWL: [['CEN', 'ADM', 'TST', 'JOR', 'YMT', 'MOK', 'PRE', 'SSP', 'CSW', 'LCK', 'MEF', 'LAK', 'KWF', 'KWH', 'TWH', 'TSW']]
};

const transferLinks = [
  { u: 'CEN', v: 'HOK', mins: 5 },
  { u: 'TST', v: 'ETS', mins: 4 }
];

const stopSuggestions = {
  CEN: [
    {
      title: 'The Peak Tram',
      kind: 'View',
      walk: '10-14 phút đi bộ',
      note: 'Điểm dừng rất hợp nếu khách muốn ngắm skyline Victoria Harbour trước khi tiếp tục hành trình.',
      tip: 'Đẹp nhất vào hoàng hôn hoặc buổi tối.'
    },
    {
      title: 'Tai Kwun',
      kind: 'Culture',
      walk: '8-12 phút đi bộ',
      note: 'Cụm di sản - nghệ thuật - cafe ngay khu Central, phù hợp nghỉ 45-90 phút.',
      tip: 'Có nhiều triển lãm và sân trong để chụp ảnh.'
    },
    {
      title: 'Egg tart & cha chaan teng',
      kind: 'Food',
      walk: '5-12 phút đi bộ',
      note: 'Khu Central có nhiều tiệm bánh và quán trà kiểu Hong Kong để thử egg tart, milk tea hoặc pineapple bun.',
      tip: 'Dừng nhanh 20-30 phút là đủ.'
    }
  ],
  HOK: [
    {
      title: 'IFC Mall & Central Harbourfront',
      kind: 'View',
      walk: '5-10 phút đi bộ',
      note: 'Điểm nghỉ gọn nếu đi Airport Express hoặc Tung Chung Line, có view cảng và nhiều lựa chọn ăn uống.',
      tip: 'Dễ nối sang Central bằng đường đi bộ.'
    }
  ],
  SHW: [
    {
      title: 'Man Mo Temple',
      kind: 'Heritage',
      walk: '7-10 phút đi bộ',
      note: 'Một trong các đền cổ nổi bật ở Sheung Wan, hợp cho khách thích Old Town Central.',
      tip: 'Kết hợp đi Hollywood Road và PMQ.'
    },
    {
      title: 'Dim sum / wonton noodles',
      kind: 'Food',
      walk: '5-12 phút đi bộ',
      note: 'Sheung Wan có nhiều quán ăn Cantonese truyền thống, hợp để thử dim sum hoặc mì hoành thánh.',
      tip: 'Nên đi trước giờ cao điểm ăn trưa.'
    }
  ],
  ADM: [
    {
      title: 'Hong Kong Park',
      kind: 'Nature',
      walk: '8-12 phút đi bộ',
      note: 'Một khoảng xanh ngay giữa khu tài chính, phù hợp nghỉ chân nhẹ trước khi đổi tuyến.',
      tip: 'Đi cùng Peak Tram hoặc Central đều tiện.'
    },
    {
      title: 'Tamar Park & harbour view',
      kind: 'View',
      walk: '8-12 phút đi bộ',
      note: 'Không gian mở nhìn ra Victoria Harbour, hợp chụp ảnh nhanh nếu route đi qua Admiralty.',
      tip: 'Đẹp khi trời quang.'
    }
  ],
  WAC: [
    {
      title: 'Blue House & Lee Tung Avenue',
      kind: 'Culture',
      walk: '6-10 phút đi bộ',
      note: 'Wan Chai có kiến trúc cũ, phố nhỏ và nhiều hàng ăn địa phương.',
      tip: 'Hợp dừng 30-60 phút.'
    }
  ],
  CAB: [
    {
      title: 'Causeway Bay shopping loop',
      kind: 'Shopping',
      walk: '3-8 phút đi bộ',
      note: 'Khu mua sắm sầm uất với nhiều mall, dessert shop và quán ăn nhanh kiểu Hong Kong.',
      tip: 'Có thể đông vào cuối tuần.'
    },
    {
      title: 'Victoria Park',
      kind: 'Nature',
      walk: '8-12 phút đi bộ',
      note: 'Nếu muốn nghỉ khỏi nhịp metro, Victoria Park là điểm dừng thoáng gần Causeway Bay/Tin Hau.',
      tip: 'Hợp đi bộ ngắn.'
    }
  ],
  TIH: [
    {
      title: 'Tin Hau local eats',
      kind: 'Food',
      walk: '3-8 phút đi bộ',
      note: 'Khu quanh ga có nhiều quán nhỏ, hợp thử mì, dessert hoặc đồ nướng địa phương.',
      tip: 'Dừng nhanh trước khi đi tiếp Island Line.'
    }
  ],
  QUB: [
    {
      title: 'Quarry Bay street canyons',
      kind: 'Photo',
      walk: '8-12 phút đi bộ',
      note: 'Khu nhà cao tầng dày đặc tạo cảm giác Hong Kong rất điện ảnh.',
      tip: 'Tôn trọng khu dân cư khi chụp ảnh.'
    }
  ],
  TAK: [
    {
      title: 'Tai Koo cafes',
      kind: 'Food',
      walk: '5-10 phút đi bộ',
      note: 'Điểm dừng nhẹ cho cafe, bánh ngọt hoặc bữa nhanh trước khi tiếp tục tuyến Island Line.',
      tip: 'Phù hợp nếu không muốn rẽ quá xa.'
    }
  ],
  KET: [
    {
      title: 'Kennedy Town waterfront',
      kind: 'View',
      walk: '6-10 phút đi bộ',
      note: 'Một điểm ngắm biển và hoàng hôn thư giãn ở cuối Island Line.',
      tip: 'Có nhiều cafe gần bờ nước.'
    }
  ],
  HKU: [
    {
      title: 'HKU campus walk',
      kind: 'Culture',
      walk: '5-10 phút đi bộ',
      note: 'Dừng lại để đi bộ trong khu Đại học Hong Kong, hợp khách thích kiến trúc và không gian yên tĩnh.',
      tip: 'Giữ trật tự vì đây là khu học thuật.'
    }
  ],
  SYP: [
    {
      title: 'Sai Ying Pun cafes',
      kind: 'Food',
      walk: '5-10 phút đi bộ',
      note: 'Khu cafe, bakery và hàng ăn nhỏ rất hợp để đổi nhịp giữa hành trình metro.',
      tip: 'Hợp dừng 30-45 phút.'
    }
  ],
  TST: [
    {
      title: 'Avenue of Stars',
      kind: 'Landmark',
      walk: '8-12 phút đi bộ',
      note: 'Promenade ven Victoria Harbour, nổi tiếng với tượng và dấu tay điện ảnh Hong Kong.',
      tip: 'Đi lúc chiều muộn để có ánh sáng đẹp.'
    },
    {
      title: 'Clock Tower & Star Ferry Pier',
      kind: 'Heritage',
      walk: '7-10 phút đi bộ',
      note: 'Cụm điểm ngắm cảng kinh điển ở Tsim Sha Tsui, rất dễ ghé trước khi lên tàu tiếp.',
      tip: 'Có thể kết hợp đi dọc promenade.'
    }
  ],
  ETS: [
    {
      title: 'Tsim Sha Tsui Promenade',
      kind: 'View',
      walk: '5-10 phút đi bộ',
      note: 'Lối đi ven cảng với skyline Hong Kong Island, gần bảo tàng và khu mua sắm.',
      tip: 'Đẹp cả ban ngày lẫn buổi tối.'
    }
  ],
  JOR: [
    {
      title: 'Temple Street Night Market',
      kind: 'Night market',
      walk: '4-8 phút đi bộ',
      note: 'Chợ đêm nổi tiếng với đồ lưu niệm, không khí địa phương và nhiều món ăn đường phố.',
      tip: 'Hợp nhất vào buổi tối.'
    },
    {
      title: 'Claypot rice & street snacks',
      kind: 'Food',
      walk: '4-10 phút đi bộ',
      note: 'Khu Jordan/Temple Street là lựa chọn tốt để thử đồ ăn nóng, mì và món địa phương.',
      tip: 'Nên chuẩn bị tiền mặt.'
    }
  ],
  YMT: [
    {
      title: 'Yau Ma Tei Fruit Market',
      kind: 'Local life',
      walk: '8-12 phút đi bộ',
      note: 'Một lát cắt đời sống bản địa rất khác với khu shopping, hợp khách thích khám phá phố thật.',
      tip: 'Đi sớm sẽ thấy nhịp chợ rõ hơn.'
    }
  ],
  MOK: [
    {
      title: 'Ladies Market',
      kind: 'Shopping',
      walk: '5-8 phút đi bộ',
      note: 'Phố chợ đông vui, nhiều đồ lưu niệm và hàng ăn vặt quanh Mong Kok.',
      tip: 'Hợp dừng tự do 45-90 phút.'
    },
    {
      title: 'Goldfish Market',
      kind: 'Local culture',
      walk: '8-12 phút đi bộ',
      note: 'Một khu chợ rất đặc trưng ở Mong Kok, nhiều màu sắc và khá lạ với du khách.',
      tip: 'Tránh dùng flash khi chụp ảnh.'
    }
  ],
  PRE: [
    {
      title: 'Flower Market',
      kind: 'Local market',
      walk: '8-12 phút đi bộ',
      note: 'Khu phố hoa gần Prince Edward, hợp dừng ngắn nếu muốn xem một mặt rất đời thường của Hong Kong.',
      tip: 'Đi ban ngày sẽ nhiều hàng mở hơn.'
    }
  ],
  DIH: [
    {
      title: 'Nan Lian Garden & Chi Lin Nunnery',
      kind: 'Culture',
      walk: '5-10 phút đi bộ',
      note: 'Khu vườn và tu viện yên tĩnh, tương phản mạnh với nhịp đô thị quanh Kowloon.',
      tip: 'Dành ít nhất 45 phút.'
    }
  ],
  AUS: [
    {
      title: 'West Kowloon Cultural District',
      kind: 'Art',
      walk: '8-12 phút đi bộ',
      note: 'Khu văn hóa ven cảng với bảo tàng, không gian mở và view đẹp về Hong Kong Island.',
      tip: 'Hợp đi chiều muộn.'
    }
  ],
  KOW: [
    {
      title: 'Sky100 & West Kowloon',
      kind: 'View',
      walk: '5-12 phút đi bộ',
      note: 'Điểm ngắm thành phố từ trên cao và khu waterfront gần Kowloon Station.',
      tip: 'Tiện nếu route đi Airport Express/Tung Chung Line.'
    }
  ],
  OCP: [
    {
      title: 'Ocean Park Hong Kong',
      kind: 'Theme park',
      walk: '3-6 phút đi bộ',
      note: 'Điểm dừng lớn cho gia đình: công viên chủ đề, thủy cung và cáp treo trong khuôn viên.',
      tip: 'Cần nửa ngày hoặc cả ngày.'
    }
  ],
  WCH: [
    {
      title: 'Wong Chuk Hang galleries',
      kind: 'Art',
      walk: '6-12 phút đi bộ',
      note: 'Khu công nghiệp cũ chuyển thành cụm gallery, cafe và studio sáng tạo.',
      tip: 'Kiểm tra lịch triển lãm nếu đi chuyên sâu.'
    }
  ],
  SOH: [
    {
      title: 'Ap Lei Chau waterfront',
      kind: 'View',
      walk: '8-12 phút đi bộ',
      note: 'Điểm dừng yên hơn khu trung tâm, hợp đi bộ ven nước và ăn nhẹ.',
      tip: 'Phù hợp nếu tuyến đi South Island Line.'
    }
  ],
  DIS: [
    {
      title: 'Hong Kong Disneyland',
      kind: 'Theme park',
      walk: '3-6 phút đi bộ',
      note: 'Điểm dừng trọn ngày cho khách muốn rẽ khỏi tuyến chính sang Disneyland Resort Line.',
      tip: 'Nên lên kế hoạch trước vì mất nhiều thời gian.'
    }
  ],
  SUN: [
    {
      title: 'Disneyland Resort Line photo stop',
      kind: 'Transit',
      walk: 'Trong ga',
      note: 'Có thể đổi sang tàu Disney-themed ở Sunny Bay nếu khách muốn thêm trải nghiệm vui trên đường.',
      tip: 'Hợp cho gia đình hoặc khách thích chụp ảnh.'
    }
  ],
  TUC: [
    {
      title: 'Ngong Ping / Big Buddha gateway',
      kind: 'Day trip',
      walk: '5-10 phút tới cáp treo/bus',
      note: 'Tung Chung là cửa ngõ đi Ngong Ping, Big Buddha và outlet shopping.',
      tip: 'Nên dành vài giờ nếu rẽ hướng.'
    }
  ],
  YAT: [
    {
      title: 'Lei Yue Mun seafood',
      kind: 'Food',
      walk: '10-15 phút đi bộ hoặc đi ngắn bằng taxi/bus',
      note: 'Khu làng hải sản nổi tiếng, hợp nếu khách muốn dừng ăn bữa chính.',
      tip: 'Đi tối sẽ có không khí hơn.'
    }
  ],
  HUH: [
    {
      title: 'Hung Hom waterfront',
      kind: 'View',
      walk: '8-12 phút đi bộ',
      note: 'Một đoạn waterfront ít ồn hơn Tsim Sha Tsui, hợp nghỉ ngắn khi route qua East Rail/Tuen Ma.',
      tip: 'Có thể đi bộ nối về TST East.'
    }
  ],
  TAW: [
    {
      title: 'Che Kung Temple',
      kind: 'Heritage',
      walk: 'Đi 1 ga tới CKT hoặc 10-15 phút đi bộ',
      note: 'Một điểm văn hóa nổi bật ở Sha Tin, hợp nếu khách muốn rẽ khỏi route chính một chút.',
      tip: 'Dễ ghé khi đi East Rail hoặc Tuen Ma.'
    }
  ],
  SHT: [
    {
      title: 'Ten Thousand Buddhas Monastery',
      kind: 'Culture',
      walk: '15-20 phút đi bộ',
      note: 'Điểm tham quan đặc sắc ở Sha Tin với lối lên nhiều tượng Phật.',
      tip: 'Có bậc thang, nên đi giày thoải mái.'
    }
  ],
  TAP: [
    {
      title: 'Tai Po Market food streets',
      kind: 'Food',
      walk: '8-15 phút đi bộ',
      note: 'Khu Tai Po có nhiều hàng ăn địa phương, hợp dừng bữa nhẹ ngoài khu trung tâm.',
      tip: 'Thử noodles, tofu pudding hoặc bakery địa phương.'
    }
  ],
  YUL: [
    {
      title: 'Yuen Long local snacks',
      kind: 'Food',
      walk: '5-12 phút đi bộ',
      note: 'Yuen Long nổi tiếng với nhịp phố địa phương và nhiều món ăn vặt kiểu New Territories.',
      tip: 'Hợp nếu tuyến đi Tuen Ma Line phía tây.'
    }
  ],
  TUM: [
    {
      title: 'Tuen Mun town centre',
      kind: 'Local life',
      walk: '5-10 phút đi bộ',
      note: 'Điểm dừng cuối tuyến phía tây với mall, công viên và hàng ăn địa phương.',
      tip: 'Có thể kết hợp Light Rail nếu muốn khám phá thêm.'
    }
  ]
};

// =====================================================================
// APP STATE
// =====================================================================
let mode = 'block';
let scale = 1;
let markerStart = null;
let markerEnd = null;
let pathLine = null;
let routeEdgeLines = [];

const defaultGuideTips = [
  'Hai hướng dẫn viên sẽ dẫn bạn qua mạng MTR Hong Kong. Click vào đoạn metro để giả lập sự cố nhé.',
  'Sau khi chọn điểm đi và điểm đến, mình sẽ gợi ý thêm điểm chơi hoặc món ngon dọc đường.',
  'Các ga trung chuyển sáng hơn trên bản đồ; đó thường là nơi đổi tuyến nhanh nhất.',
  'Nếu route đi qua Tsim Sha Tsui, Central hoặc Mong Kok, rất đáng xuống tàu chơi một lúc.'
];
let currentGuideTips = [...defaultGuideTips];
let guideTipIndex = 0;

const blockedEdges = new Set();
const stationById = new Map(stations.map(station => [station.id, station]));
const edges = buildEdges();
const adj = buildAdjacency(edges);

// =====================================================================
// GEOMETRY AND GRAPH HELPERS
// =====================================================================
function haversine(a, b) {
  const R = 6371000;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2
          + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180)
          * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function roundedMinutes(value) {
  return Math.round(value * 10) / 10;
}

function formatMinutes(value) {
  const rounded = Math.round(value);
  return `${rounded} phút`;
}

function canonicalEdgeKey(u, v) {
  return [u, v].sort().join('-');
}

function lineLabel(line) {
  return lineProfiles[line]?.name || line;
}

function lineColor(line) {
  return lineProfiles[line]?.color || '#4d9cff';
}

function estimateRailMinutes(line, u, v) {
  const a = stationById.get(u);
  const b = stationById.get(v);
  const profile = lineProfiles[line];
  const distanceKm = haversine(a, b) / 1000;
  const rawMins = (distanceKm / profile.speedKmh) * 60 + profile.dwellMins;
  return roundedMinutes(Math.max(profile.minEdgeMins, rawMins));
}

function buildEdges() {
  const mapByKey = new Map();

  Object.entries(lineSequences).forEach(([line, branches]) => {
    branches.forEach(sequence => {
      for (let i = 0; i < sequence.length - 1; i += 1) {
        const u = sequence[i];
        const v = sequence[i + 1];
        if (!stationById.has(u) || !stationById.has(v)) continue;

        const key = canonicalEdgeKey(u, v);
        if (!mapByKey.has(key)) {
          mapByKey.set(key, {
            key,
            u,
            v,
            lines: [],
            timeByLine: {},
            isTransfer: false,
            distanceKm: roundedMinutes(haversine(stationById.get(u), stationById.get(v)) / 1000)
          });
        }

        const edge = mapByKey.get(key);
        if (!edge.lines.includes(line)) edge.lines.push(line);
        edge.timeByLine[line] = estimateRailMinutes(line, u, v);
      }
    });
  });

  transferLinks.forEach(link => {
    const key = canonicalEdgeKey(link.u, link.v);
    mapByKey.set(key, {
      key,
      u: link.u,
      v: link.v,
      lines: ['XFER'],
      timeByLine: { XFER: link.mins },
      isTransfer: true,
      distanceKm: roundedMinutes(haversine(stationById.get(link.u), stationById.get(link.v)) / 1000)
    });
  });

  return [...mapByKey.values()];
}

function buildAdjacency(edgeList) {
  const graph = new Map();
  stations.forEach(station => graph.set(station.id, []));
  edgeList.forEach(edge => {
    graph.get(edge.u).push(edge);
    graph.get(edge.v).push(edge);
  });
  return graph;
}

function nearest(latlng) {
  let best = stations[0].id;
  let min = Infinity;

  stations.forEach(station => {
    const d = haversine(latlng, station);
    if (d < min) {
      min = d;
      best = station.id;
    }
  });

  return best;
}

function heuristic(u, dst) {
  if (u === dst) return 0;
  const distanceKm = haversine(stationById.get(u), stationById.get(dst)) / 1000;
  return (distanceKm / FASTEST_SPEED_KMH) * 60;
}

function stateKey(stationId, line) {
  return `${stationId}|${line || 'START'}`;
}

function transferPenalty(stationId, fromLine, toLine) {
  if (!fromLine || !toLine || fromLine === toLine || fromLine === 'XFER' || toLine === 'XFER') {
    return 0;
  }
  return transferPenaltyMins[stationId] || DEFAULT_TRANSFER_MINS;
}

function findPath(src, dst) {
  if (src === dst) {
    return { route: [src], legs: [], cost: 0 };
  }

  const startKey = stateKey(src, null);
  const g = new Map([[startKey, 0]]);
  const trace = new Map();
  const closed = new Set();
  const open = [{ station: src, line: null, key: startKey, f: heuristic(src, dst) }];

  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift();

    if (closed.has(current.key)) continue;
    closed.add(current.key);

    if (current.station === dst) {
      return reconstructPath(src, current.key, trace, g.get(current.key));
    }

    for (const edge of adj.get(current.station) || []) {
      if (!edge.isTransfer && blockedEdges.has(edge.key)) continue;

      const nextStation = edge.u === current.station ? edge.v : edge.u;
      const candidateLines = edge.lines;

      for (const edgeLine of candidateLines) {
        const nextLine = edge.isTransfer ? null : edgeLine;
        const extraTransfer = edge.isTransfer ? 0 : transferPenalty(current.station, current.line, edgeLine);
        const edgeCost = edge.timeByLine[edgeLine] + extraTransfer;
        const tentative = g.get(current.key) + edgeCost;
        const nextKey = stateKey(nextStation, nextLine);

        if (tentative >= (g.get(nextKey) ?? Infinity)) continue;

        g.set(nextKey, tentative);
        trace.set(nextKey, {
          prevKey: current.key,
          from: current.station,
          to: nextStation,
          line: edgeLine,
          edgeTime: edge.timeByLine[edgeLine],
          transferTime: extraTransfer,
          isTransfer: edge.isTransfer
        });

        open.push({
          station: nextStation,
          line: nextLine,
          key: nextKey,
          f: tentative + heuristic(nextStation, dst)
        });
      }
    }
  }

  return null;
}

function reconstructPath(src, finalKey, trace, cost) {
  const legs = [];
  let key = finalKey;

  while (key !== stateKey(src, null)) {
    const record = trace.get(key);
    if (!record) break;
    legs.push(record);
    key = record.prevKey;
  }

  legs.reverse();
  return {
    route: [src, ...legs.map(leg => leg.to)],
    legs,
    cost: roundedMinutes(cost)
  };
}

// =====================================================================
// MAP RENDERING
// =====================================================================
stations.forEach(station => {
  const isInterchange = station.lines.length > 1;
  L.marker([station.lat, station.lng], {
    icon: L.divIcon({
      className: '',
      html: `<div class="station-dot ${isInterchange ? 'interchange' : ''}"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    })
  }).addTo(map).bindTooltip(
    `${station.name}<br><span>${station.lines.join(' · ')}</span>`,
    { permanent: false, direction: 'top' }
  );
});

map.fitBounds(stations.map(station => [station.lat, station.lng]), { padding: [28, 28] });

let edgeLines = [];

function drawEdges() {
  edgeLines.forEach(line => map.removeLayer(line));
  edgeLines = [];

  edges.forEach(edge => {
    const a = stationById.get(edge.u);
    const b = stationById.get(edge.v);
    const blocked = blockedEdges.has(edge.key);
    const primaryLine = edge.lines[0];
    const color = blocked ? '#ff5252' : lineColor(primaryLine);

    const line = L.polyline(
      [[a.lat, a.lng], [b.lat, b.lng]],
      {
        color,
        weight: edge.isTransfer ? 3 : blocked ? 6 : 4,
        opacity: edge.isTransfer ? 0.58 : blocked ? 1 : 0.76,
        dashArray: edge.isTransfer ? '4,8' : blocked ? '9,7' : null
      }
    ).addTo(map);

    const timeText = Math.min(...edge.lines.map(code => edge.timeByLine[code]));
    line.bindTooltip(
      `${a.name} ↔ ${b.name}<br>${edge.lines.map(lineLabel).join(' / ')} · ${formatMinutes(timeText)}${blocked ? ' · Đang cấm' : ''}`,
      { sticky: true }
    );

    line.on('click', () => {
      if (mode !== 'block' || edge.isTransfer) return;
      if (blockedEdges.has(edge.key)) {
        blockedEdges.delete(edge.key);
      } else {
        blockedEdges.add(edge.key);
      }
      updateBlockUI();
      drawEdges();
    });

    line.on('mouseover', () => {
      if (mode === 'block' && !edge.isTransfer) line.setStyle({ weight: 8, opacity: 1 });
    });
    line.on('mouseout', () => {
      line.setStyle({
        weight: edge.isTransfer ? 3 : blockedEdges.has(edge.key) ? 6 : 4,
        opacity: edge.isTransfer ? 0.58 : blockedEdges.has(edge.key) ? 1 : 0.76
      });
    });

    edgeLines.push(line);
  });
}

drawEdges();

// =====================================================================
// PANEL UI
// =====================================================================
function setStatus(text, variant = '') {
  const badge = document.getElementById('status-badge');
  badge.className = variant;
  badge.innerHTML = `<span class="dot"></span><span>${text}</span>`;
}

function setGuideTip(text) {
  const guideText = document.getElementById('guide-text');
  const guideTextRight = document.getElementById('guide-text-right');
  if (!guideText) return;
  guideText.textContent = text;
  if (guideTextRight) guideTextRight.textContent = companionGuideLine(text);
}

function companionGuideLine(text) {
  if (text.includes('Central') || text.includes('Tsim Sha Tsui') || text.includes('Mong Kok')) {
    return 'Điểm này đáng xuống tàu lắm, nhớ chừa thời gian ăn chơi nha.';
  }
  if (text.includes('không') || text.includes('chia cắt') || text.includes('bị cấm')) {
    return 'Nếu tuyến bị nghẽn, thử bỏ cấm vài đoạn hoặc chọn ga gần hơn.';
  }
  if (text.includes('phút')) {
    return 'Mình sẽ canh thời gian, bạn cứ xem các điểm dừng thú vị.';
  }
  if (text.includes('điểm đến') || text.includes('điểm đi')) {
    return 'Chọn xong hai điểm là tụi mình sẽ lên lịch dừng chân ngay.';
  }
  return 'Tớ sẽ phụ trách nhắc các điểm nên xuống chơi!';
}

function cycleGuideTip() {
  if (!currentGuideTips.length) return;
  guideTipIndex = (guideTipIndex + 1) % currentGuideTips.length;
  setGuideTip(currentGuideTips[guideTipIndex]);
}

function resetGuideTips() {
  currentGuideTips = [...defaultGuideTips];
  guideTipIndex = 0;
  setGuideTip(currentGuideTips[0]);
}

function updateGuideTipsForRoute(result) {
  const suggestions = getRouteSuggestions(result.route);
  const routeTips = suggestions.map(item => `${item.stationName}: thử ${item.title}. ${item.walk}.`);

  currentGuideTips = [
    `Tuyến này mất khoảng ${formatMinutes(result.cost)}. Mình đã đánh dấu vài điểm đáng xuống chơi.`,
    ...routeTips,
    'Bạn có thể bấm vào mình để xem lần lượt các gợi ý dọc tuyến.'
  ];

  guideTipIndex = 0;
  setGuideTip(currentGuideTips[0]);
}

function updateBlockUI() {
  const count = blockedEdges.size;
  const chip = document.getElementById('blocked-count-chip');
  const badge = document.getElementById('blocked-count-badge');

  chip.style.display = count > 0 ? 'inline' : 'none';
  chip.textContent = count;
  badge.style.display = count > 0 ? 'inline' : 'none';
  badge.textContent = count;

  setStatus(
    count > 0
      ? `${count} đoạn bị cấm — nhấn Xác nhận để chọn điểm đi/đến`
      : `${stations.length} ga · ${edges.filter(edge => !edge.isTransfer).length} đoạn metro — chọn đoạn bị cấm`,
    count > 0 ? 'danger' : ''
  );
  setGuideTip(
    count > 0
      ? 'Đã có đoạn bị cấm rồi. Nhấn Xác nhận để mình dẫn bạn sang bước chọn điểm đi/đến.'
      : 'Click vào đoạn metro nếu muốn giả lập sự cố, hoặc nhấn Xác nhận để tìm đường ngay.'
  );

  renderBlockedList();
}

function renderBlockedList() {
  const list = document.getElementById('blocked-list');
  const empty = document.getElementById('blocked-empty-msg');
  list.innerHTML = '';

  if (blockedEdges.size === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  [...blockedEdges].sort().forEach(key => {
    const edge = edges.find(item => item.key === key);
    if (!edge) return;

    const u = stationById.get(edge.u);
    const v = stationById.get(edge.v);
    const row = document.createElement('div');
    row.className = 'blocked-line-item';
    row.innerHTML = `
      <div class="blocked-line-names">
        <span class="stn-tag">${u.name}</span>
        <span class="line-arrow">⟷</span>
        <span class="stn-tag">${v.name}</span>
      </div>
      <button class="unblock-btn" onclick="unblockEdge('${edge.key}')">Bỏ cấm</button>`;
    list.appendChild(row);
  });
}

function unblockEdge(key) {
  blockedEdges.delete(key);
  updateBlockUI();
  drawEdges();
  if (mode === 'done') updateRoute();
}

function clearRouteLayers() {
  if (pathLine) {
    map.removeLayer(pathLine);
    pathLine = null;
  }
  routeEdgeLines.forEach(line => map.removeLayer(line));
  routeEdgeLines = [];
}

function getRouteSuggestions(route) {
  const routeSet = new Set(route);
  const primary = [];
  const secondary = [];
  const seen = new Set();

  route.forEach((stationId, index) => {
    const items = stopSuggestions[stationId] || [];
    items.forEach((item, itemIndex) => {
      const key = `${stationId}:${item.title}`;
      if (seen.has(key)) return;
      seen.add(key);

      const suggestion = {
        ...item,
        stationId,
        stationName: stationById.get(stationId).name,
        stopIndex: index + 1
      };

      if (itemIndex === 0) {
        primary.push(suggestion);
      } else {
        secondary.push(suggestion);
      }
    });
  });

  const suggestions = [...primary, ...secondary]
    .filter(item => routeSet.has(item.stationId))
    .slice(0, 6);

  return suggestions;
}

function updateRoute() {
  if (!markerStart || !markerEnd) return;

  const sourceId = nearest(markerStart.getLatLng());
  const targetId = nearest(markerEnd.getLatLng());
  const result = findPath(sourceId, targetId);
  clearRouteLayers();

  const section = document.getElementById('route-section');
  const body = document.getElementById('route-body');
  section.style.display = 'block';

  if (!result) {
    setStatus('Không tìm được đường đi với các đoạn đang bị cấm', 'danger');
    body.innerHTML = '<div class="no-route">Không còn tuyến hợp lệ giữa hai điểm đã chọn.</div>';
    setGuideTip('Tuyến này đang bị chia cắt. Hãy bỏ cấm một vài đoạn hoặc chọn cặp ga khác nhé.');
    return;
  }

  result.legs.forEach(leg => {
    const a = stationById.get(leg.from);
    const b = stationById.get(leg.to);
    const line = L.polyline(
      [[a.lat, a.lng], [b.lat, b.lng]],
      {
        color: lineColor(leg.line),
        weight: leg.isTransfer ? 5 : 7,
        opacity: 0.95,
        dashArray: leg.isTransfer ? '5,7' : null
      }
    ).addTo(map);
    routeEdgeLines.push(line);
  });

  body.innerHTML = renderRoute(result) + renderStopSuggestions(result);
  updateGuideTipsForRoute(result);
  const source = stationById.get(sourceId);
  const target = stationById.get(targetId);
  setStatus(`Đã tính tuyến ${source.name} → ${target.name}`, 'success');
}

function renderRoute(result) {
  if (result.route.length === 1) {
    const station = stationById.get(result.route[0]);
    return `<div class="route-flow"><div class="route-stop"><span class="stop-dot first"></span><span class="stop-name">${station.name}</span></div></div>`;
  }

  let html = '<div class="route-flow">';

  result.route.forEach((stationId, idx) => {
    const station = stationById.get(stationId);
    const cls = idx === 0 ? 'first' : idx === result.route.length - 1 ? 'last' : 'mid';
    html += `<div class="route-stop">
      <span class="stop-dot ${cls}"></span>
      <span class="stop-name">${station.name}</span>
    </div>`;

    if (idx < result.legs.length) {
      const leg = result.legs[idx];
      const transferText = leg.transferTime > 0 ? ` + ${formatMinutes(leg.transferTime)} đổi tuyến` : '';
      html += `<div class="route-leg" style="--line-color:${lineColor(leg.line)}">
        <span class="line-chip">${leg.line === 'XFER' ? 'Walk' : leg.line}</span>
        <span>${formatMinutes(leg.edgeTime)}${transferText}</span>
      </div>`;
    }
  });

  html += `</div>
  <div class="route-summary">
    <span class="time-chip">⏱ ${formatMinutes(result.cost)}</span>
    <span class="stop-count-chip">${result.route.length} ga · ${result.legs.filter(leg => !leg.isTransfer).length} đoạn metro</span>
  </div>`;

  return html;
}

function renderStopSuggestions(result) {
  const suggestions = getRouteSuggestions(result.route);

  if (!suggestions.length) {
    return `
      <div class="trip-ideas empty">
        <div class="ideas-head">
          <span class="section-label">Gợi ý dừng chân</span>
        </div>
        <div class="idea-empty">Tuyến này chưa có gợi ý du lịch trong dữ liệu mẫu. Bạn vẫn có thể thêm dữ liệu cho các ga đi qua.</div>
      </div>`;
  }

  let html = `
    <div class="trip-ideas">
      <div class="ideas-head">
        <span class="section-label">Gợi ý dừng chân</span>
        <span class="ideas-count">${suggestions.length}</span>
      </div>
      <div class="ideas-subtitle">Các điểm này nằm trên tuyến vừa tính, phù hợp nếu khách muốn xuống ga chơi hoặc ăn rồi tiếp tục đi tàu.</div>
      <div class="idea-list">`;

  suggestions.forEach(item => {
    html += `
      <div class="idea-card">
        <div class="idea-card-top">
          <span class="idea-kind">${item.kind}</span>
          <span class="idea-station">${item.stationName} · stop ${item.stopIndex}</span>
        </div>
        <div class="idea-title">${item.title}</div>
        <div class="idea-note">${item.note}</div>
        <div class="idea-meta">
          <span>${item.walk}</span>
          <span>${item.tip}</span>
        </div>
      </div>`;
  });

  html += `
      </div>
      <div class="ideas-source">Gợi ý tham khảo từ dữ liệu du lịch Hong Kong; nên kiểm tra giờ mở cửa thực tế trước khi ghé.</div>
    </div>`;

  return html;
}

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

map.on('click', event => {
  if (mode === 'block') return;

  if (mode === 'start') {
    if (markerStart) map.removeLayer(markerStart);
    markerStart = L.marker(event.latlng, markerOpts('▶ Bắt đầu', '#36c95a')).addTo(map);
    mode = 'end';
    setStatus('Chọn điểm kết thúc trên bản đồ');
    setGuideTip('Tốt rồi. Giờ chọn điểm đến, mình sẽ tính tuyến và chọn vài điểm dừng thú vị cho bạn.');
    return;
  }

  if (mode === 'end') {
    if (markerEnd) map.removeLayer(markerEnd);
    markerEnd = L.marker(event.latlng, markerOpts('■ Kết thúc', '#ff5252')).addTo(map);
    mode = 'done';
    updateRoute();
  }
});

function finishBlock() {
  mode = 'start';
  document.getElementById('route-section').style.display = 'none';
  clearRouteLayers();
  setStatus('Chọn điểm bắt đầu trên bản đồ');
  setGuideTip('Chọn điểm bắt đầu trên bản đồ. Mình sẽ tự gán vị trí đó với ga MTR gần nhất.');
}

function resetMap() {
  if (markerStart) { map.removeLayer(markerStart); markerStart = null; }
  if (markerEnd) { map.removeLayer(markerEnd); markerEnd = null; }
  clearRouteLayers();

  blockedEdges.clear();
  drawEdges();

  mode = 'block';
  scale = 1;
  document.getElementById('panel').style.transform = '';
  document.getElementById('route-section').style.display = 'none';
  document.getElementById('blocked-count-chip').style.display = 'none';

  resetGuideTips();
  updateBlockUI();
}

function zoomIn() {
  scale = Math.min(scale + 0.1, 1.5);
  applyZoom();
}

function zoomOut() {
  scale = Math.max(scale - 0.1, 0.6);
  applyZoom();
}

function applyZoom() {
  const panel = document.getElementById('panel');
  panel.style.transform = `scale(${scale})`;
  panel.style.transformOrigin = 'top right';
}

updateBlockUI();
