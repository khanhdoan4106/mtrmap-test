# README1 - Nâng cấp Tour Mode cho MTR Navigator

File này ghi lại chi tiết đợt nâng cấp mới nhất của project sau khi đã có bản đồ MTR Hong Kong, dữ liệu 97 ga, thời gian di chuyển theo tốc độ từng tuyến và gợi ý địa điểm dọc hành trình.

## 1. Mục tiêu nâng cấp

Trước nâng cấp, app đã có thể:

- Chọn điểm bắt đầu và điểm kết thúc trên bản đồ.
- Tìm tuyến MTR hợp lệ bằng thuật toán A*.
- Tính thời gian theo dữ liệu cạnh thay vì mặc định 2 phút.
- Hiển thị gợi ý địa điểm hoặc món ăn tại các ga trên route.
- Cho phép giả lập đóng một số đoạn metro.

Đợt nâng cấp này bổ sung thêm lớp trải nghiệm du lịch:

- Cho người dùng chọn phong cách hành trình bằng Tour Mode.
- So sánh các phương án route khác nhau nếu có route khác biệt.
- Hiển thị timeline hành trình theo từng chặng/tuyến.
- Giữ nguyên thời gian metro thực tế tương đối, nhưng thêm một lớp điểm tối ưu riêng cho du lịch.

## 2. Các file đã chỉnh sửa

| File | Vai trò |
| --- | --- |
| `index.html` | Thêm cụm điều khiển Tour Mode trong panel bên phải. |
| `app.js` | Bổ sung scoring theo mode, route comparison, timeline renderer và cập nhật guide tips. |
| `style.css` | Thêm giao diện cho Tour Mode, route option cards, profile chip và journey timeline. |
| `README1.md` | Ghi lại quá trình nâng cấp và cách kiểm thử. |

## 3. Tour Mode mới

Trong panel điều khiển có thêm 5 chế độ:

| Mode | Ý nghĩa | Cách ưu tiên |
| --- | --- | --- |
| `Balanced` | Chế độ mặc định | Cân bằng thời gian, số lần đổi tuyến và điểm ăn chơi. |
| `fastest` | Nhanh nhất | Tối ưu gần với thời gian MTR thực tế nhất. |
| `lowTransfers` | Ít đổi tuyến | Phạt nặng thao tác đổi tuyến để hành trình dễ đi hơn. |
| `food` | Ăn uống | Ưu tiên tuyến đi qua ga có món ngon, chợ đêm hoặc khu ẩm thực địa phương. |
| `Check-in` | Tham quan/chụp ảnh | Ưu tiên route đi qua view, landmark, culture, heritage, nature, theme park. |

Các mode này được khai báo trong `routeModes` ở `app.js`.

## 4. Thiết kế thuật toán sau nâng cấp

Thuật toán vẫn dựa trên A*, nhưng chi phí được tách làm 2 lớp:

| Thành phần | Vai trò |
| --- | --- |
| `actual cost` | Thời gian di chuyển thật tương đối, dùng để hiển thị cho người dùng. |
| `score cost` | Điểm tối ưu nội bộ, dùng để chọn route theo Tour Mode. |

Công thức score cho mỗi cạnh:

```text
score = edgeTime * timeWeight
      + transferTime * transferWeight
      - stationTourBonus(nextStation)
```

Trong đó:

- `edgeTime`: thời gian đi qua cạnh metro hoặc đoạn đi bộ chuyển tuyến.
- `transferTime`: thời gian phạt khi đổi tuyến.
- `timeWeight`: mức độ ưu tiên thời gian của từng mode.
- `transferWeight`: mức độ phạt đổi tuyến của từng mode.
- `stationTourBonus`: điểm thưởng nếu ga tiếp theo có địa điểm/món ăn hợp với mode.

Để tránh route đi vòng chỉ vì bonus du lịch, hàm `findPath()` hiện lưu thêm `visited` cho từng trạng thái mở rộng và không cho đi lại qua ga đã xuất hiện trong cùng hành trình.

## 5. Route comparison

Hàm `buildRouteOptions(src, dst)` chạy tìm đường theo nhiều mode:

```text
mode đang chọn -> balanced -> fastest -> lowTransfers -> food -> checkin
```

Sau đó app:

- Loại route trùng nhau bằng chữ ký `route.join('>')`.
- Giữ route của mode đang chọn lên đầu danh sách.
- Hiển thị tối đa 4 phương án trong phần `Phương án gợi ý`.
- Mỗi card tuyến hiển thị: chế độ, thời gian, số lần đổi tuyến và số điểm dừng gợi ý.

Nếu các mode khác nhau vẫn dẫn tới cùng một route, app chỉ hiển thị một card duy nhất để tránh gây nhiễu.

## 6. Timeline hành trình

Sau khi chọn route, app render thêm phần `Timeline hanh trinh`.

Timeline được tạo bởi `buildLineSegments(result)`:

- Gộp các leg liên tiếp cùng tuyến thành một chặng.
- Tách riêng các đoạn đổi tuyến hoặc đi bộ chuyển tuyến.
- Hiển thị tuyến, ga đầu, ga cuối, số điểm dừng và thời gian từng chặng.

Phần này giúp người dùng nhìn route như một lịch trình metro, thay vì chỉ đọc danh sách ga dài.

## 7. Gợi ý du lịch và anime guide

Dữ liệu `stopSuggestions` cũ tiếp tục được tái sử dụng. Sau nâng cấp:

- `stationTourBonus()` dùng dữ liệu này để cộng điểm cho route.
- `getRouteSuggestions()` vẫn lấy tối đa 6 gợi ý để hiển thị.
- `updateGuideTipsForRoute()` được cập nhật để nhắc chế độ đang chọn, thời gian, số lần đổi tuyến và số gợi ý dừng chân.

Hai nhân vật guide vẫn hoạt động như trước, nhưng lời thoại route-aware hơn.

## 8. Giao diện mới

Các class CSS mới:

| Class | Chức năng |
| --- | --- |
| `.tour-mode-card` | Khung chọn Tour Mode. |
| `.mode-pill` | Nút chọn từng mode. |
| `.route-options` | Khối so sánh phương án route. |
| `.route-option-card` | Card của từng phương án route. |
| `.profile-chip` | Chip mode trong route summary. |
| `.journey-timeline` | Khối timeline hành trình. |
| `.timeline-segment` | Một chặng trong timeline. |

Giao diện vẫn giữ style dashboard nhẹ, nhưng thêm accent đỏ để nổi bật phần tính năng mới.

## 9. Kiểm thử đã thực hiện

### Kiểm tra cú pháp

```bash
node --check app.js
```

Kết quả: không có lỗi cú pháp.

### Smoke test logic route

Đã chạy script Node với stub Leaflet/DOM để kiểm tra:

- `buildRouteOptions('CEN', 'AIR')`
- `buildRouteOptions('TUM', 'CHW')`
- `buildRouteOptions('DIS', 'LOW')`

Mục tiêu kiểm tra:

- Route trả về được theo mode mặc định.
- Route có `cost`, `transfers`, `suggestionCount`.
- Không còn route lặp lại ga cũ do bonus du lịch.
- Trường hợp có route khác biệt thì danh sách phương án hiển thị nhiều card.

## 10. Ghi chú kỹ thuật

- Dữ liệu mạng MTR không bị thay đổi trong nâng cấp này.
- Số ga vẫn là 97.
- Số cạnh vẫn là 106, gồm 104 cạnh metro và 2 cạnh đi bộ chuyển tuyến.
- Tour Mode chỉ thay đổi cách chọn route, không làm sai lệch thời gian hiển thị.
- Nếu muốn làm tiếp, hướng nâng cấp hợp lý là thêm fare estimate hoặc tạo lịch trình nửa ngày tự động từ route đang chọn.

## 11. Nâng cấp mascot animation

Đợt chỉnh sau bổ sung hệ thống biểu cảm cho hai anime guide:

- Mỗi guide có `mood badge` riêng, ví dụ `:D`, `!!`, `-_-`, `>:(`, `B)`, `**`.
- Hai guide không còn dùng chung một câu thoại. `setGuideTip()` hiện nhận được cả chuỗi đơn giản hoặc object:

```js
{
  left: 'Lời thoại guide tóc trắng',
  right: 'Lời thoại guide tóc tím',
  leftMood: 'excited',
  rightMood: 'pout'
}
```

- Các mood được khai báo trong `guideMoods`.
- `buildGuideDuelTips()` tạo chuỗi đối thoại tranh luận theo route:
  - Guide tóc trắng ưu tiên điểm ăn uống và dừng chân vui.
  - Guide tóc tím phản biện về thời gian, số lần đổi tuyến và tuyến gọn.
- CSS mới thêm icon cảm xúc bay quanh nhân vật, rung nhẹ khi giận, chùng xuống khi hờn, bật nhanh khi hào hứng.
- Khi bấm vào một trong hai guide, `cycleGuideTip()` sẽ đổi sang lượt đối thoại kế tiếp và cập nhật mood của cả hai.
