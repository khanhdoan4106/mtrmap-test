# MTR Navigator - Hong Kong Island Line

MTR Navigator là một ứng dụng web tĩnh mô phỏng bài toán tìm đường trên mạng lưới tàu điện ngầm MTR tại Hong Kong. Dự án tập trung vào Island Line, cho phép người dùng chặn một hoặc nhiều đoạn nối giữa các ga, chọn điểm bắt đầu và điểm kết thúc trên bản đồ, sau đó quan sát tuyến đường khả dụng được tính bằng thuật toán A*.

Ứng dụng được xây dựng như một minh họa trực quan cho các chủ đề trong Nhập môn Trí tuệ nhân tạo: biểu diễn bài toán bằng đồ thị, tìm kiếm đường đi tối ưu, heuristic, xử lý ràng buộc động và trực quan hóa kết quả trên giao diện tương tác.

## Mục Lục

- [MTR Navigator - Hong Kong Island Line](#mtr-navigator---hong-kong-island-line)
  - [Mục Lục](#mục-lục)
  - [Tổng Quan](#tổng-quan)
  - [Tính Năng Chính](#tính-năng-chính)
  - [Phạm Vi Mô Phỏng](#phạm-vi-mô-phỏng)
  - [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
  - [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
  - [Cách Chạy Dự Án](#cách-chạy-dự-án)
  - [Hướng Dẫn Sử Dụng](#hướng-dẫn-sử-dụng)
  - [Mô Hình Dữ Liệu](#mô-hình-dữ-liệu)
  - [Thuật Toán A*](#thuật-toán-a)
  - [Luồng Hoạt Động](#luồng-hoạt-động)
  - [Chi Tiết Giao Diện](#chi-tiết-giao-diện)
  - [Các File Chính](#các-file-chính)
  - [Giới Hạn Hiện Tại](#giới-hạn-hiện-tại)
  - [Hướng Phát Triển](#hướng-phát-triển)
  - [Ghi Chú](#ghi-chú)

## Tổng Quan

Trong thực tế, các hệ thống giao thông đô thị có thể bị gián đoạn do bảo trì, sự cố kỹ thuật hoặc các tình huống khẩn cấp. Khi một đoạn tuyến bị đóng, hành khách cần một tuyến thay thế phù hợp dựa trên trạng thái hiện tại của mạng lưới.

Dự án này mô phỏng tình huống đó trên một phần nhỏ của mạng lưới MTR. Người dùng có thể:

- đánh dấu các đoạn nối giữa hai ga là bị cấm;
- xác nhận trạng thái mạng lưới sau khi chặn đoạn;
- chọn vị trí bắt đầu và kết thúc trực tiếp trên bản đồ;
- xem tuyến đường tìm được, tổng thời gian ước tính và số ga đi qua;
- đặt lại toàn bộ bản đồ để thử kịch bản khác.

Về mặt thuật toán, mỗi ga được xem là một đỉnh của đồ thị, mỗi đoạn nối trực tiếp giữa hai ga là một cạnh. Khi người dùng chặn một đoạn, cạnh tương ứng bị loại khỏi quá trình tìm kiếm. Thuật toán A* sau đó tìm đường đi hợp lệ từ ga gần điểm bắt đầu nhất đến ga gần điểm kết thúc nhất.

## Tính Năng Chính

- Hiển thị bản đồ thật bằng Leaflet và OpenStreetMap.
- Vẽ các ga thuộc Hong Kong Island Line bằng marker tùy chỉnh.
- Vẽ các đoạn nối giữa ga bằng polyline.
- Cho phép bật hoặc tắt trạng thái cấm của từng đoạn nối bằng thao tác click.
- Lưu danh sách đoạn bị cấm và hiển thị trong panel điều khiển.
- Cho phép bỏ cấm từng đoạn ngay trong panel.
- Chọn điểm bắt đầu và điểm kết thúc bằng cách click trên bản đồ.
- Tìm đường bằng thuật toán A* có xét các đoạn bị chặn.
- Hiển thị tuyến đường hợp lệ bằng đường màu xanh lá.
- Thông báo khi không thể tìm được đường đi.
- Có nút đặt lại trạng thái bản đồ.
- Có nút phóng to và thu nhỏ panel điều khiển.

## Phạm Vi Mô Phỏng

Phiên bản hiện tại tập trung vào 7 ga trên Island Line:

| ID | Ga | Vĩ độ | Kinh độ |
| --- | --- | --- | --- |
| 0 | Central | 22.2819 | 114.1589 |
| 1 | Admiralty | 22.2798 | 114.1655 |
| 2 | Wan Chai | 22.2770 | 114.1731 |
| 3 | Causeway Bay | 22.2803 | 114.1856 |
| 4 | Tin Hau | 22.2825 | 114.1918 |
| 5 | Fortress Hill | 22.2882 | 114.1937 |
| 6 | North Point | 22.2913 | 114.2006 |

Các ga được nối theo cấu trúc tuyến tính:

```text
Central <-> Admiralty <-> Wan Chai <-> Causeway Bay <-> Tin Hau <-> Fortress Hill <-> North Point
```

Cấu trúc tuyến tính giúp bài toán dễ quan sát, dễ kiểm chứng và phù hợp với mục tiêu minh họa thuật toán. Nếu một đoạn ở giữa bị chặn, mạng lưới có thể bị tách thành hai phần, khiến một số cặp điểm bắt đầu - kết thúc không còn đường đi.

## Công Nghệ Sử Dụng

- HTML5: định nghĩa cấu trúc trang và panel điều khiển.
- CSS3: thiết kế giao diện, màu sắc, layout, trạng thái hover và responsive cơ bản.
- JavaScript thuần: xử lý dữ liệu đồ thị, trạng thái tương tác và thuật toán tìm đường.
- Leaflet: thư viện bản đồ tương tác.
- OpenStreetMap: nguồn tile bản đồ nền.
- Google Fonts: font `Outfit` và `JetBrains Mono` cho giao diện.

Dự án không dùng framework frontend, bundler hay package manager. Toàn bộ ứng dụng chạy trực tiếp từ các file tĩnh.

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

Cách này phù hợp vì dự án chỉ gồm file tĩnh. Tuy nhiên, trình duyệt vẫn cần kết nối Internet để tải Leaflet, font và tile bản đồ từ CDN.

### Cách 2: Chạy bằng local static server

Nếu muốn chạy qua localhost, có thể dùng một server tĩnh bất kỳ. Ví dụ với Python:

```bash
python -m http.server 8000
```

Sau đó mở:

```text
http://localhost:8000
```

Lưu ý: lệnh trên cần được chạy trong thư mục `mtrmap-test`.

## Hướng Dẫn Sử Dụng

1. Mở ứng dụng trong trình duyệt.
2. Click vào một hoặc nhiều đoạn nối giữa các ga để đánh dấu là bị cấm.
3. Quan sát danh sách "Đoạn bị cấm" trong panel bên phải.
4. Nếu muốn bỏ cấm một đoạn, nhấn nút "Bỏ cấm" ở dòng tương ứng.
5. Nhấn "Xác nhận" để chuyển sang bước chọn điểm bắt đầu.
6. Click lên bản đồ để chọn điểm bắt đầu. Ứng dụng sẽ gán điểm này với ga gần nhất.
7. Click lên bản đồ lần nữa để chọn điểm kết thúc. Ứng dụng sẽ gán điểm này với ga gần nhất.
8. Xem tuyến đường, thời gian ước tính và số ga đi qua trong panel.
9. Nhấn nút đặt lại để xóa trạng thái hiện tại và thử kịch bản mới.

Các nút `+` và `-` trong panel dùng để phóng to hoặc thu nhỏ panel điều khiển, không phải zoom bản đồ.

## Mô Hình Dữ Liệu

### Danh sách ga

Các ga được khai báo trong mảng `stations` trong `app.js`. Mỗi ga có:

- `id`: định danh số nguyên;
- `name`: tên hiển thị;
- `lat`: vĩ độ;
- `lng`: kinh độ.

Ví dụ:

```javascript
{ id: 0, name: 'Central', lat: 22.2819, lng: 114.1589 }
```

### Danh sách kề

Quan hệ nối giữa các ga được biểu diễn bằng adjacency list:

```javascript
const adj = {
  0: [1],
  1: [0, 2],
  2: [1, 3],
  3: [2, 4],
  4: [3, 5],
  5: [4, 6],
  6: [5]
};
```

Đây là đồ thị vô hướng. Mỗi cạnh được lưu hai chiều trong danh sách kề.

### Đoạn bị cấm

Các đoạn bị cấm được lưu trong `blockedEdges`, một `Set` chứa khóa dạng:

```text
u-v
v-u
```

Khi chặn đoạn giữa ga `u` và `v`, ứng dụng thêm cả hai khóa để đảm bảo thuật toán không thể đi qua cạnh đó theo bất kỳ chiều nào.

## Thuật Toán A*

Hàm `findPath(src, dst)` trong `app.js` triển khai thuật toán A* để tìm đường đi từ ga nguồn `src` đến ga đích `dst`.

### Chi phí di chuyển

Mỗi đoạn nối giữa hai ga liền kề có chi phí cố định:

```javascript
const TIME_PER_EDGE = 2;
```

Điều này có nghĩa mỗi cạnh được xem như mất 2 phút để di chuyển.

### Heuristic

Heuristic được tính bằng khoảng cách Haversine giữa ga hiện tại và ga đích, sau đó chia cho tốc độ quy đổi:

```javascript
h(n) = haversine(n, destination) / MTR_SPEED_MPS
```

Trong đó:

- `haversine` trả về khoảng cách địa lý theo mét;
- `MTR_SPEED_MPS` là tốc độ quy đổi dùng để đưa khoảng cách về đơn vị phút;
- heuristic giúp A* ưu tiên mở rộng các ga có vẻ gần đích hơn.

### Công thức đánh giá

A* sử dụng:

```text
f(n) = g(n) + h(n)
```

Trong đó:

- `g(n)` là chi phí thực tế từ ga bắt đầu đến ga `n`;
- `h(n)` là chi phí ước lượng từ ga `n` đến ga đích;
- `f(n)` là tổng chi phí ước lượng nếu tuyến đường đi qua `n`.

### Xử lý đoạn bị chặn

Khi duyệt các ga kề, thuật toán bỏ qua cạnh nếu cạnh đó xuất hiện trong `blockedEdges`:

```javascript
if (blockedEdges.has(`${u}-${v}`)) continue;
```

Nếu không còn đường hợp lệ từ nguồn đến đích, hàm trả về `null` và giao diện hiển thị thông báo không tìm được đường đi.

## Luồng Hoạt Động

Ứng dụng hoạt động theo biến trạng thái `mode`:

| Mode | Ý nghĩa |
| --- | --- |
| `block` | Người dùng đang chọn các đoạn bị cấm |
| `start` | Người dùng chọn điểm bắt đầu |
| `end` | Người dùng chọn điểm kết thúc |
| `done` | Đã tính xong tuyến đường |

Luồng chính:

```text
block -> start -> end -> done
```

Khi nhấn đặt lại, ứng dụng quay về `block`, xóa marker, xóa đường đi đã vẽ và xóa toàn bộ đoạn bị cấm.

## Chi Tiết Giao Diện

Giao diện gồm hai phần chính:

- Bản đồ toàn màn hình: hiển thị nền OpenStreetMap, các ga, các đoạn nối và tuyến đường kết quả.
- Panel điều khiển: hiển thị trạng thái hiện tại, danh sách đoạn bị cấm, tuyến đường tìm được và các nút thao tác.

Quy ước màu:

| Màu | Ý nghĩa |
| --- | --- |
| Xanh dương | Ga và đoạn đang hoạt động |
| Đỏ | Đoạn bị cấm hoặc điểm kết thúc |
| Xanh lá | Tuyến đường tìm được hoặc điểm bắt đầu |
| Xám đậm | Nền panel và các vùng thông tin |

## Các File Chính

### `index.html`

Định nghĩa cấu trúc trang:

- vùng bản đồ `#map`;
- panel điều khiển `#panel`;
- khu vực trạng thái;
- danh sách đoạn bị cấm;
- khu vực hiển thị tuyến đường;
- các nút xác nhận, phóng to, thu nhỏ và đặt lại;
- liên kết tới Leaflet, Google Fonts, `style.css` và `app.js`.

### `style.css`

Chứa toàn bộ phần giao diện:

- reset CSS cơ bản;
- biến màu và font trong `:root`;
- layout toàn màn hình;
- thiết kế panel;
- trạng thái badge;
- danh sách đoạn bị cấm;
- hiển thị tuyến đường;
- style cho nút và tooltip Leaflet.

### `app.js`

Chứa toàn bộ logic ứng dụng:

- khởi tạo bản đồ Leaflet;
- khai báo dữ liệu ga và đồ thị;
- tính khoảng cách Haversine;
- tìm ga gần nhất với vị trí click;
- triển khai heuristic và thuật toán A*;
- vẽ marker ga và polyline cạnh;
- xử lý chặn hoặc bỏ chặn cạnh;
- cập nhật panel điều khiển;
- xử lý chọn điểm bắt đầu, điểm kết thúc;
- vẽ tuyến đường kết quả;
- đặt lại bản đồ và điều chỉnh kích thước panel.

## Giới Hạn Hiện Tại

- Mới mô phỏng 7 ga của Island Line, chưa phải toàn bộ mạng MTR.
- Mỗi đoạn nối có chi phí cố định 2 phút, chưa xét khoảng cách thực tế, tốc độ từng đoạn hoặc thời gian chờ tàu.
- Đồ thị hiện tại là tuyến tính, chưa có nhánh rẽ hoặc ga trung chuyển.
- Chưa có kiểm thử tự động.
- Chưa có lưu trạng thái sau khi tải lại trang.
- Ứng dụng phụ thuộc vào CDN và tile bản đồ trực tuyến.
- Chưa có xử lý tối ưu cho nhiều loại ràng buộc như quá tải, trễ tàu hoặc đóng ga.

## Hướng Phát Triển

- Mở rộng dữ liệu sang nhiều tuyến MTR hơn.
- Bổ sung ga trung chuyển và mô hình đồ thị phức tạp hơn.
- Cho phép chặn cả ga, không chỉ chặn đoạn nối.
- Tính chi phí theo khoảng cách hoặc dữ liệu thời gian thực.
- Thêm nhiều tiêu chí tối ưu như ít chuyển tuyến nhất, ít thời gian nhất hoặc ít đoạn bị ảnh hưởng nhất.
- Thêm khả năng nhập điểm bắt đầu và điểm kết thúc bằng dropdown.
- Thêm kiểm thử cho `findPath`, `nearest`, `haversine` và xử lý `blockedEdges`.
- Tách dữ liệu ga và đồ thị sang file JSON riêng để dễ bảo trì.
- Bổ sung chế độ mô phỏng sự cố theo kịch bản.

## Ghi Chú

Dự án phù hợp để trình bày trong học phần Nhập môn Trí tuệ nhân tạo vì thể hiện rõ các thành phần quan trọng của một bài toán tìm kiếm:

- không gian trạng thái là tập các ga;
- hành động là di chuyển qua một cạnh hợp lệ;
- chi phí đường đi là tổng chi phí các cạnh;
- ràng buộc động là các cạnh bị người dùng chặn;
- heuristic là khoảng cách địa lý ước lượng đến đích;
- lời giải là chuỗi ga tạo thành tuyến đường hợp lệ.
