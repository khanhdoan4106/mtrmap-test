# MTR Navigator - Hong Kong MTR Network

MTR Navigator là một ứng dụng web tĩnh mô phỏng bài toán tìm đường trên mạng lưới tàu điện ngầm MTR tại Hong Kong. Ứng dụng hiển thị mạng MTR heavy rail gồm 97 ga, nhiều tuyến, nhánh rẽ và các điểm trung chuyển quan trọng. Người dùng có thể giả lập sự cố bằng cách chặn một hoặc nhiều đoạn metro, chọn điểm bắt đầu và điểm kết thúc trên bản đồ, sau đó xem tuyến đường khả dụng được tính bằng thuật toán A* có trọng số.

Ngoài phần tìm đường, ứng dụng còn có lớp trải nghiệm du lịch: sau khi tìm route, hệ thống gợi ý các địa danh nổi tiếng hoặc món ăn đáng thử gần các ga nằm trên tuyến. Giao diện có hai mascot anime tự dựng, một tóc trắng và một tóc tím, đứng hai bên bản đồ với bong bóng thoại tương tác để hướng dẫn người dùng.

## Mục Lục

- [Tổng Quan](#tổng-quan)
- [Tính Năng Chính](#tính-năng-chính)
- [Phạm Vi Mô Phỏng](#phạm-vi-mô-phỏng)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
- [Cách Chạy Dự Án](#cách-chạy-dự-án)
- [Hướng Dẫn Sử Dụng](#hướng-dẫn-sử-dụng)
- [Mô Hình Dữ Liệu](#mô-hình-dữ-liệu)
- [Thuật Toán A*](#thuật-toán-a)
- [Gợi Ý Du Lịch](#gợi-ý-du-lịch)
- [Giao Diện](#giao-diện)
- [Các File Chính](#các-file-chính)
- [Nguồn Dữ Liệu](#nguồn-dữ-liệu)
- [Giới Hạn Hiện Tại](#giới-hạn-hiện-tại)
- [Hướng Phát Triển](#hướng-phát-triển)

## Tổng Quan

Trong thực tế, hệ thống giao thông đô thị có thể bị gián đoạn do bảo trì, sự cố kỹ thuật, thời tiết hoặc quá tải. Khi một đoạn tuyến bị đóng, hành khách cần tìm một tuyến thay thế phù hợp dựa trên trạng thái hiện tại của mạng lưới.

Dự án này mô phỏng bài toán đó trên mạng MTR Hong Kong. Về mặt trí tuệ nhân tạo, đây là một bài toán tìm kiếm đường đi trên đồ thị có ràng buộc động:

- mỗi ga là một đỉnh;
- mỗi đoạn metro nối hai ga là một cạnh;
- mỗi cạnh có trọng số thời gian di chuyển riêng;
- người dùng có thể chặn cạnh trong thời gian thực;
- A* tìm route hợp lệ từ ga gần điểm bắt đầu nhất đến ga gần điểm kết thúc nhất.

## Tính Năng Chính

- Hiển thị bản đồ thật bằng Leaflet và OpenStreetMap.
- Vẽ 97 ga MTR bằng marker tùy chỉnh.
- Đánh dấu ga trung chuyển bằng marker nổi bật hơn.
- Vẽ 104 đoạn metro và các liên kết trung chuyển đi bộ.
- Cho phép click vào đoạn metro để bật/tắt trạng thái bị cấm.
- Hiển thị danh sách các đoạn bị cấm trong panel điều khiển.
- Cho phép bỏ cấm từng đoạn ngay trong panel.
- Chọn điểm bắt đầu và điểm kết thúc trực tiếp trên bản đồ.
- Tìm đường bằng thuật toán A* có xét đoạn bị chặn, thời gian từng cạnh và phí đổi tuyến.
- Hiển thị route kết quả bằng màu tuyến tương ứng.
- Hiển thị tổng thời gian ước tính, số ga và số đoạn metro.
- Gợi ý địa danh/ẩm thực nằm trên tuyến vừa tính.
- Có hai mascot anime hai bên bản đồ với animation CSS và bong bóng thoại tương tác.
- Có legend màu tuyến, khung trang trí bản đồ và panel giao diện dạng dashboard.
- Có nút đặt lại trạng thái bản đồ.
- Có nút phóng to/thu nhỏ panel điều khiển.

## Phạm Vi Mô Phỏng

Phiên bản hiện tại mô phỏng các tuyến MTR heavy rail chính:

| Mã tuyến | Tuyến |
| --- | --- |
| AEL | Airport Express |
| DRL | Disneyland Resort Line |
| EAL | East Rail Line |
| ISL | Island Line |
| KTL | Kwun Tong Line |
| SIL | South Island Line |
| TCL | Tung Chung Line |
| TKL | Tseung Kwan O Line |
| TML | Tuen Ma Line |
| TWL | Tsuen Wan Line |

Mạng có cả tuyến trung tâm đông ga, tuyến sân bay, tuyến nhánh như East Rail tới Lo Wu/Lok Ma Chau và Tseung Kwan O tới Po Lam/LOHAS Park. Hai liên kết trung chuyển đi bộ cũng được mô hình hóa:

- Central - Hong Kong;
- Tsim Sha Tsui - East Tsim Sha Tsui.

## Công Nghệ Sử Dụng

- HTML5: cấu trúc trang, panel, mascot và các lớp giao diện.
- CSS3: layout, màu sắc, responsive, animation mascot, khung trang trí và card gợi ý.
- JavaScript thuần: dữ liệu đồ thị, trạng thái tương tác, A*, route rendering và gợi ý du lịch.
- Leaflet: thư viện bản đồ tương tác.
- OpenStreetMap: tile bản đồ nền.
- Google Fonts: `Outfit` và `JetBrains Mono`.

Dự án không dùng framework frontend, bundler hoặc package manager. Toàn bộ ứng dụng chạy từ các file tĩnh.

## Cấu Trúc Thư Mục

```text
mtrmap-test/
├── README.md
├── app.js
├── index.html
└── style.css
```

## Cách Chạy Dự Án

### Cách 1: Mở trực tiếp file HTML

Mở file `index.html` bằng trình duyệt:

```text
mtrmap-test/index.html
```

Cách này chạy được vì dự án là web tĩnh. Tuy nhiên, trình duyệt cần Internet để tải Leaflet, Google Fonts và tile OpenStreetMap.

### Cách 2: Chạy local static server

Trong thư mục `mtrmap-test`, chạy:

```bash
python -m http.server 8000
```

Sau đó mở:

```text
http://localhost:8000
```

## Hướng Dẫn Sử Dụng

1. Mở ứng dụng trong trình duyệt.
2. Click vào một hoặc nhiều đoạn nối giữa các ga để đánh dấu là bị cấm.
3. Xem danh sách "Đoạn bị cấm" trong panel bên phải.
4. Nếu muốn bỏ cấm, nhấn "Bỏ cấm" ở dòng tương ứng.
5. Nhấn "Xác nhận" để chuyển sang bước chọn điểm bắt đầu.
6. Click lên bản đồ để chọn điểm bắt đầu. Ứng dụng tự gán vị trí click với ga MTR gần nhất.
7. Click lần nữa để chọn điểm kết thúc.
8. Xem tuyến đường, thời gian ước tính, số ga, số đoạn metro và gợi ý dừng chân.
9. Bấm vào mascot để đổi nội dung gợi ý trong bong bóng thoại.
10. Nhấn nút đặt lại để xóa trạng thái hiện tại và thử kịch bản mới.

Các nút `+` và `-` trong panel dùng để phóng to hoặc thu nhỏ panel điều khiển, không phải zoom bản đồ.

## Mô Hình Dữ Liệu

### Ga

Các ga được khai báo trong mảng `stations` trong `app.js`. Mỗi ga có:

- `id`: mã ga MTR dạng chuỗi;
- `name`: tên hiển thị;
- `lat`: vĩ độ;
- `lng`: kinh độ;
- `lines`: danh sách tuyến đi qua ga.

Ví dụ:

```javascript
{ id: 'CEN', name: 'Central', lat: 22.282171, lng: 114.157825, lines: ['ISL', 'TWL'] }
```

### Tuyến

Thứ tự ga trên từng tuyến được khai báo trong `lineSequences`. Với tuyến có nhánh, một mã tuyến có thể chứa nhiều sequence.

Ví dụ dạng rút gọn:

```javascript
const lineSequences = {
  TKL: [
    ['NOP', 'QUB', 'YAT', 'TIK', 'TKO', 'HAH', 'POA'],
    ['LHP', 'TKO', 'TIK']
  ]
};
```

### Cạnh

Ứng dụng không viết tay adjacency list cố định. Thay vào đó:

1. `buildEdges()` sinh các cạnh từ `lineSequences`.
2. Mỗi cạnh lưu `u`, `v`, danh sách `lines`, `timeByLine`, `distanceKm` và cờ `isTransfer`.
3. `buildAdjacency()` dựng đồ thị kề từ danh sách cạnh đã sinh.

Các cạnh bị cấm được lưu trong `blockedEdges` bằng khóa chuẩn hóa:

```text
stationA-stationB
```

Khóa được tạo bằng `canonicalEdgeKey(u, v)`, nên cạnh vô hướng chỉ cần lưu một lần.

### Gợi Ý Dừng Chân

Dữ liệu gợi ý du lịch/ẩm thực nằm trong object `stopSuggestions`. Mỗi key là mã ga, mỗi item gồm:

- `title`: tên địa danh/món ăn/khu vực;
- `kind`: loại gợi ý;
- `walk`: thời gian đi bộ hoặc cách tiếp cận;
- `note`: mô tả ngắn;
- `tip`: lưu ý thực tế.

## Thuật Toán A*

Hàm `findPath(src, dst)` triển khai A* để tìm đường từ ga nguồn đến ga đích.

Khác bản đơn giản ban đầu, trạng thái tìm kiếm hiện tại không chỉ là ga mà còn gồm tuyến đang đi:

```text
stationId | currentLine
```

Cách này cho phép thuật toán cộng thêm chi phí đổi tuyến khi route chuyển từ tuyến này sang tuyến khác.

### Chi Phí Cạnh

Ứng dụng đã bỏ chi phí cố định 2 phút cho mọi đoạn. Thay vào đó, mỗi cạnh được ước lượng thời gian từ:

- khoảng cách Haversine giữa hai ga;
- tốc độ profile theo từng tuyến;
- thời gian dừng tàu ngắn tại ga;
- phí đổi tuyến tại ga trung chuyển.

Ví dụ các tuyến dài như Airport Express/Tung Chung Line có profile tốc độ cao hơn tuyến nội đô dày ga. Các ga trung chuyển lớn như Admiralty, Central/Hong Kong, Kowloon Tong, Tai Wai, Diamond Hill hoặc Nam Cheong có penalty đổi tuyến riêng.

### Heuristic

Heuristic dùng khoảng cách địa lý từ ga hiện tại đến ga đích, quy đổi sang phút bằng tốc độ lớn nhất trong mô hình:

```javascript
h(n) = distance_km(n, destination) / FASTEST_SPEED_KMH * 60
```

Giá trị này giúp A* ưu tiên mở rộng các ga có vẻ gần đích hơn.

### Xử Lý Đoạn Bị Cấm

Khi duyệt cạnh, nếu cạnh là cạnh metro và xuất hiện trong `blockedEdges`, thuật toán bỏ qua cạnh đó:

```javascript
if (!edge.isTransfer && blockedEdges.has(edge.key)) continue;
```

Nếu không còn đường hợp lệ, `findPath()` trả về `null` và giao diện hiển thị thông báo không tìm được route.

## Gợi Ý Du Lịch

Sau khi route được tính, `renderStopSuggestions(result)` sẽ:

1. lấy danh sách ga nằm trên route;
2. lọc các ga có dữ liệu trong `stopSuggestions`;
3. ưu tiên gợi ý đầu tiên của mỗi ga;
4. giới hạn số card để panel không quá dài;
5. render các card "Gợi ý dừng chân".

Các gợi ý hiện có bao gồm những khu vực như Central, Sheung Wan, Admiralty, Wan Chai, Causeway Bay, Tsim Sha Tsui, Jordan, Mong Kok, Diamond Hill, Ocean Park, Disneyland Resort, Tung Chung, Sha Tin, Yuen Long và Tuen Mun.

## Giao Diện

Giao diện hiện gồm:

- bản đồ Leaflet toàn màn hình;
- panel điều khiển bên phải;
- legend màu tuyến ở góc trái trên;
- khung trang trí bản đồ bằng dải màu MTR;
- mascot tóc trắng ở góc trái dưới;
- mascot tóc tím ở phía phải dưới, cạnh panel;
- bong bóng thoại cho cả hai mascot;
- route flow có màu tuyến, thời gian từng đoạn và card gợi ý dừng chân.

Mascot được dựng bằng SVG và CSS animation, không phụ thuộc ảnh ngoài. Các chuyển động gồm floating, vẫy tay, chớp mắt, nhún nhẹ, tóc chuyển động và sparkle. Khi người dùng click vào một mascot, cả hai bong bóng thoại đổi nội dung theo tip hiện tại.

## Các File Chính

### `index.html`

Định nghĩa cấu trúc trang:

- `#map`: vùng bản đồ;
- `.map-frame`: khung trang trí quanh map;
- `#line-legend`: legend tuyến;
- `#tour-guide`: mascot tóc trắng và bong bóng thoại chính;
- `#tour-guide-right`: mascot tóc tím và bong bóng thoại phụ;
- `#panel`: panel điều khiển;
- các vùng trạng thái, danh sách đoạn bị cấm, route result và nút thao tác;
- liên kết tới Leaflet, Google Fonts, `style.css` và `app.js`.

### `style.css`

Chứa toàn bộ giao diện:

- reset CSS;
- biến màu/font trong `:root`;
- layout map và panel;
- khung trang trí bản đồ;
- legend tuyến;
- marker ga và tooltip Leaflet;
- route flow, summary và card gợi ý;
- mascot SVG và animation;
- responsive cho màn hình nhỏ.

### `app.js`

Chứa logic ứng dụng:

- khởi tạo bản đồ Leaflet;
- khai báo dữ liệu tuyến/ga/cạnh/gợi ý;
- tính Haversine;
- sinh edge và adjacency graph;
- tìm ga gần nhất từ vị trí click;
- triển khai A* có trọng số và trạng thái tuyến;
- xử lý chặn/bỏ chặn cạnh;
- render marker, cạnh, route và gợi ý dừng chân;
- điều khiển mascot tip;
- reset trạng thái và zoom panel.

## Nguồn Dữ Liệu

- Thứ tự tuyến/ga: CSV mở chính thức của MTR tại `https://opendata.mtr.com.hk/data/mtr_lines_and_stations.csv`.
- Dataset gốc: `DATA.GOV.HK - MTR routes, fares and barrier-free facilities`.
- Tọa độ ga: dữ liệu vị trí từ Wikidata cho các ga MTR.
- Bản đồ nền: OpenStreetMap tile qua Leaflet.
- Gợi ý du lịch/ẩm thực: biên soạn thủ công từ các địa danh và món ăn phổ biến do Hong Kong Tourism Board giới thiệu.

## Giới Hạn Hiện Tại

- Chưa mô phỏng Light Rail, High Speed Rail và các dịch vụ ngoài mạng MTR heavy rail chính.
- Thời gian cạnh là mô hình ước lượng, chưa phải lịch vận hành realtime từng chuyến.
- Chưa gọi API next-train realtime của MTR để cộng thời gian chờ tàu thực tế.
- Gợi ý du lịch/ẩm thực là dữ liệu mẫu, chưa kiểm tra giờ mở cửa hoặc tình trạng vận hành theo thời gian thực.
- Chưa có kiểm thử tự động.
- Chưa lưu trạng thái sau khi tải lại trang.
- Ứng dụng phụ thuộc vào CDN cho Leaflet, Google Fonts và tile bản đồ.
- Dữ liệu tuyến, ga và gợi ý hiện vẫn nhúng trực tiếp trong `app.js`.

## Hướng Phát Triển

- Tách dữ liệu ga, tuyến, cạnh và gợi ý sang file JSON riêng.
- Bổ sung Light Rail, High Speed Rail hoặc các tuyến tương lai.
- Cho phép chặn cả ga, không chỉ chặn đoạn nối.
- Kết nối API realtime của MTR để tính thêm thời gian chờ tàu.
- Thêm tiêu chí tối ưu: ít chuyển tuyến nhất, ít thời gian nhất, nhiều điểm tham quan nhất.
- Thêm dropdown chọn ga thay vì chỉ click bản đồ.
- Thêm bộ lọc gợi ý theo loại: food, landmark, shopping, nature, culture.
- Thêm kiểm thử cho `findPath`, `nearest`, `haversine`, `buildEdges` và `getRouteSuggestions`.
