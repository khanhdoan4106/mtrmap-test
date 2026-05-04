# MTR Navigator - Hong Kong MTR Network

MTR Navigator là một ứng dụng web tĩnh mô phỏng bài toán tìm đường trên mạng lưới tàu điện ngầm MTR tại Hong Kong. Ứng dụng hiển thị mạng MTR heavy rail gồm 97 ga, nhiều tuyến, nhánh rẽ và các điểm trung chuyển quan trọng. Người dùng có thể giả lập sự cố bằng cách chặn một hoặc nhiều đoạn metro, chọn điểm bắt đầu và điểm kết thúc trên bản đồ, sau đó xem tuyến đường khả dụng được tính bằng thuật toán A* có trọng số.

Ngoài phần tìm đường, ứng dụng còn có lớp trải nghiệm du lịch: sau khi tìm route, hệ thống gợi ý các địa danh nổi tiếng hoặc món ăn đáng thử gần các ga nằm trên tuyến. Giao diện có hai mascot anime tự dựng, một tóc trắng và một tóc tím, đứng hai bên bản đồ với bong bóng thoại tương tác để hướng dẫn người dùng.

## Mục Lục

- [Tổng Quan](#tổng-quan)
- [Tính Năng Chính](#tính-năng-chính)
- [Phạm Vi Mô Phỏng](#phạm-vi-mô-phỏng)
- [Danh Sách Ga](#danh-sách-ga)
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

- Mỗi ga là một đỉnh;
- Mỗi đoạn metro nối hai ga là một cạnh;
- Mỗi cạnh có trọng số thời gian di chuyển riêng;
- Người dùng có thể chặn cạnh trong thời gian thực;
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

## Danh Sách Ga

Tổng cộng dự án đang sử dụng **97 ga**. ID trong bảng dưới đây là chỉ số nội bộ theo thứ tự mảng `stations` trong `app.js`; cột "Các ga kề" cũng dùng các ID này để biểu diễn quan hệ kề trong đồ thị. Quan hệ kề bao gồm cả đoạn metro và liên kết trung chuyển đi bộ.

### Nhóm ID 0-24

<table style="width:100%; border-collapse:collapse; margin:12px 0 24px; font-size:14px;">
  <thead>
    <tr style="background:#b91c1c; color:#ffffff;">
      <th style="border:1px solid #7f1d1d; padding:8px;">ID</th>
      <th style="border:1px solid #7f1d1d; padding:8px;">Tên ga</th>
      <th style="border:1px solid #7f1d1d; padding:8px;">Các ga kề</th>
      <th style="border:1px solid #7f1d1d; padding:8px;">Tọa độ (lat, lng)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">0</td><td style="border:1px solid #fecaca; padding:7px;">Central</td><td style="border:1px solid #fecaca; padding:7px;">1, 25, 40</td><td style="border:1px solid #fecaca; padding:7px;">22.282171, 114.157825</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">1</td><td style="border:1px solid #fecaca; padding:7px;">Admiralty</td><td style="border:1px solid #fecaca; padding:7px;">0, 2, 26, 72, 80</td><td style="border:1px solid #fecaca; padding:7px;">22.2788, 114.1646</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">2</td><td style="border:1px solid #fecaca; padding:7px;">Tsim Sha Tsui</td><td style="border:1px solid #fecaca; padding:7px;">1, 3, 66</td><td style="border:1px solid #fecaca; padding:7px;">22.2973, 114.1722</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">3</td><td style="border:1px solid #fecaca; padding:7px;">Jordan</td><td style="border:1px solid #fecaca; padding:7px;">2, 4</td><td style="border:1px solid #fecaca; padding:7px;">22.3049, 114.1718</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">4</td><td style="border:1px solid #fecaca; padding:7px;">Yau Ma Tei</td><td style="border:1px solid #fecaca; padding:7px;">3, 5, 70</td><td style="border:1px solid #fecaca; padding:7px;">22.3128, 114.170694</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">5</td><td style="border:1px solid #fecaca; padding:7px;">Mong Kok</td><td style="border:1px solid #fecaca; padding:7px;">4, 15</td><td style="border:1px solid #fecaca; padding:7px;">22.31925, 114.169361</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">6</td><td style="border:1px solid #fecaca; padding:7px;">Shek Kip Mei</td><td style="border:1px solid #fecaca; padding:7px;">7, 15</td><td style="border:1px solid #fecaca; padding:7px;">22.332025, 114.168889</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">7</td><td style="border:1px solid #fecaca; padding:7px;">Kowloon Tong</td><td style="border:1px solid #fecaca; padding:7px;">6, 8, 55, 56</td><td style="border:1px solid #fecaca; padding:7px;">22.336786, 114.177542</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">8</td><td style="border:1px solid #fecaca; padding:7px;">Lok Fu</td><td style="border:1px solid #fecaca; padding:7px;">7, 9</td><td style="border:1px solid #fecaca; padding:7px;">22.338, 114.1871</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">9</td><td style="border:1px solid #fecaca; padding:7px;">Wong Tai Sin</td><td style="border:1px solid #fecaca; padding:7px;">8, 10</td><td style="border:1px solid #fecaca; padding:7px;">22.3417, 114.1939</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">10</td><td style="border:1px solid #fecaca; padding:7px;">Diamond Hill</td><td style="border:1px solid #fecaca; padding:7px;">9, 11, 76, 77</td><td style="border:1px solid #fecaca; padding:7px;">22.3401, 114.2016</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">11</td><td style="border:1px solid #fecaca; padding:7px;">Choi Hung</td><td style="border:1px solid #fecaca; padding:7px;">10, 12</td><td style="border:1px solid #fecaca; padding:7px;">22.3348, 114.2089</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">12</td><td style="border:1px solid #fecaca; padding:7px;">Kowloon Bay</td><td style="border:1px solid #fecaca; padding:7px;">11, 13</td><td style="border:1px solid #fecaca; padding:7px;">22.3235, 114.2141</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">13</td><td style="border:1px solid #fecaca; padding:7px;">Ngau Tau Kok</td><td style="border:1px solid #fecaca; padding:7px;">12, 14</td><td style="border:1px solid #fecaca; padding:7px;">22.315457, 114.21901</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">14</td><td style="border:1px solid #fecaca; padding:7px;">Kwun Tong</td><td style="border:1px solid #fecaca; padding:7px;">13, 37</td><td style="border:1px solid #fecaca; padding:7px;">22.3121, 114.2265</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">15</td><td style="border:1px solid #fecaca; padding:7px;">Prince Edward</td><td style="border:1px solid #fecaca; padding:7px;">5, 6, 16</td><td style="border:1px solid #fecaca; padding:7px;">22.3245, 114.1683</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">16</td><td style="border:1px solid #fecaca; padding:7px;">Sham Shui Po</td><td style="border:1px solid #fecaca; padding:7px;">15, 17</td><td style="border:1px solid #fecaca; padding:7px;">22.3307, 114.1623</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">17</td><td style="border:1px solid #fecaca; padding:7px;">Cheung Sha Wan</td><td style="border:1px solid #fecaca; padding:7px;">16, 18</td><td style="border:1px solid #fecaca; padding:7px;">22.3354, 114.1563</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">18</td><td style="border:1px solid #fecaca; padding:7px;">Lai Chi Kok</td><td style="border:1px solid #fecaca; padding:7px;">17, 19</td><td style="border:1px solid #fecaca; padding:7px;">22.3373, 114.1482</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">19</td><td style="border:1px solid #fecaca; padding:7px;">Mei Foo</td><td style="border:1px solid #fecaca; padding:7px;">18, 20, 49, 90</td><td style="border:1px solid #fecaca; padding:7px;">22.338, 114.139028</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">20</td><td style="border:1px solid #fecaca; padding:7px;">Lai King</td><td style="border:1px solid #fecaca; padding:7px;">19, 21, 42, 49</td><td style="border:1px solid #fecaca; padding:7px;">22.3484, 114.1261</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">21</td><td style="border:1px solid #fecaca; padding:7px;">Kwai Fong</td><td style="border:1px solid #fecaca; padding:7px;">20, 22</td><td style="border:1px solid #fecaca; padding:7px;">22.3569, 114.1279</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">22</td><td style="border:1px solid #fecaca; padding:7px;">Kwai Hing</td><td style="border:1px solid #fecaca; padding:7px;">21, 23</td><td style="border:1px solid #fecaca; padding:7px;">22.3632, 114.1312</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">23</td><td style="border:1px solid #fecaca; padding:7px;">Tai Wo Hau</td><td style="border:1px solid #fecaca; padding:7px;">22, 24</td><td style="border:1px solid #fecaca; padding:7px;">22.3708, 114.125</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">24</td><td style="border:1px solid #fecaca; padding:7px;">Tsuen Wan</td><td style="border:1px solid #fecaca; padding:7px;">23</td><td style="border:1px solid #fecaca; padding:7px;">22.3736, 114.1178</td></tr>
  </tbody>
</table>

### Nhóm ID 25-49

<table style="width:100%; border-collapse:collapse; margin:12px 0 24px; font-size:14px;">
  <thead>
    <tr style="background:#b91c1c; color:#ffffff;">
      <th style="border:1px solid #7f1d1d; padding:8px;">ID</th>
      <th style="border:1px solid #7f1d1d; padding:8px;">Tên ga</th>
      <th style="border:1px solid #7f1d1d; padding:8px;">Các ga kề</th>
      <th style="border:1px solid #7f1d1d; padding:8px;">Tọa độ (lat, lng)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">25</td><td style="border:1px solid #fecaca; padding:7px;">Sheung Wan</td><td style="border:1px solid #fecaca; padding:7px;">0, 67</td><td style="border:1px solid #fecaca; padding:7px;">22.2862, 114.1518</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">26</td><td style="border:1px solid #fecaca; padding:7px;">Wan Chai</td><td style="border:1px solid #fecaca; padding:7px;">1, 27</td><td style="border:1px solid #fecaca; padding:7px;">22.2773, 114.1728</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">27</td><td style="border:1px solid #fecaca; padding:7px;">Causeway Bay</td><td style="border:1px solid #fecaca; padding:7px;">26, 28</td><td style="border:1px solid #fecaca; padding:7px;">22.2802, 114.1835</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">28</td><td style="border:1px solid #fecaca; padding:7px;">Tin Hau</td><td style="border:1px solid #fecaca; padding:7px;">27, 29</td><td style="border:1px solid #fecaca; padding:7px;">22.2827, 114.1917</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">29</td><td style="border:1px solid #fecaca; padding:7px;">Fortress Hill</td><td style="border:1px solid #fecaca; padding:7px;">28, 30</td><td style="border:1px solid #fecaca; padding:7px;">22.2881, 114.1936</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">30</td><td style="border:1px solid #fecaca; padding:7px;">North Point</td><td style="border:1px solid #fecaca; padding:7px;">29, 31</td><td style="border:1px solid #fecaca; padding:7px;">22.2909, 114.2007</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">31</td><td style="border:1px solid #fecaca; padding:7px;">Quarry Bay</td><td style="border:1px solid #fecaca; padding:7px;">30, 32, 44</td><td style="border:1px solid #fecaca; padding:7px;">22.2878, 114.2096</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">32</td><td style="border:1px solid #fecaca; padding:7px;">Tai Koo</td><td style="border:1px solid #fecaca; padding:7px;">31, 33</td><td style="border:1px solid #fecaca; padding:7px;">22.2846, 114.2161</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">33</td><td style="border:1px solid #fecaca; padding:7px;">Sai Wan Ho</td><td style="border:1px solid #fecaca; padding:7px;">32, 34</td><td style="border:1px solid #fecaca; padding:7px;">22.2816, 114.2224</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">34</td><td style="border:1px solid #fecaca; padding:7px;">Shau Kei Wan</td><td style="border:1px solid #fecaca; padding:7px;">33, 35</td><td style="border:1px solid #fecaca; padding:7px;">22.2789, 114.2289</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">35</td><td style="border:1px solid #fecaca; padding:7px;">Heng Fa Chuen</td><td style="border:1px solid #fecaca; padding:7px;">34, 36</td><td style="border:1px solid #fecaca; padding:7px;">22.2769, 114.2398</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">36</td><td style="border:1px solid #fecaca; padding:7px;">Chai Wan</td><td style="border:1px solid #fecaca; padding:7px;">35</td><td style="border:1px solid #fecaca; padding:7px;">22.2644, 114.2368</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">37</td><td style="border:1px solid #fecaca; padding:7px;">Lam Tin</td><td style="border:1px solid #fecaca; padding:7px;">14, 44</td><td style="border:1px solid #fecaca; padding:7px;">22.3064, 114.2331</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">38</td><td style="border:1px solid #fecaca; padding:7px;">Olympic</td><td style="border:1px solid #fecaca; padding:7px;">41, 49</td><td style="border:1px solid #fecaca; padding:7px;">22.3178, 114.1602</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">39</td><td style="border:1px solid #fecaca; padding:7px;">Tung Chung</td><td style="border:1px solid #fecaca; padding:7px;">50</td><td style="border:1px solid #fecaca; padding:7px;">22.2893, 113.9416</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">40</td><td style="border:1px solid #fecaca; padding:7px;">Hong Kong</td><td style="border:1px solid #fecaca; padding:7px;">0, 41</td><td style="border:1px solid #fecaca; padding:7px;">22.2848, 114.158</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">41</td><td style="border:1px solid #fecaca; padding:7px;">Kowloon</td><td style="border:1px solid #fecaca; padding:7px;">38, 40, 42</td><td style="border:1px solid #fecaca; padding:7px;">22.3049, 114.1615</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">42</td><td style="border:1px solid #fecaca; padding:7px;">Tsing Yi</td><td style="border:1px solid #fecaca; padding:7px;">20, 41, 43, 50</td><td style="border:1px solid #fecaca; padding:7px;">22.3584, 114.107</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">43</td><td style="border:1px solid #fecaca; padding:7px;">Airport</td><td style="border:1px solid #fecaca; padding:7px;">42, 52</td><td style="border:1px solid #fecaca; padding:7px;">22.316, 113.9366</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">44</td><td style="border:1px solid #fecaca; padding:7px;">Yau Tong</td><td style="border:1px solid #fecaca; padding:7px;">31, 37, 45</td><td style="border:1px solid #fecaca; padding:7px;">22.2979, 114.2371</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">45</td><td style="border:1px solid #fecaca; padding:7px;">Tiu Keng Leng</td><td style="border:1px solid #fecaca; padding:7px;">44, 46</td><td style="border:1px solid #fecaca; padding:7px;">22.3041, 114.2524</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">46</td><td style="border:1px solid #fecaca; padding:7px;">Tseung Kwan O</td><td style="border:1px solid #fecaca; padding:7px;">45, 47, 53</td><td style="border:1px solid #fecaca; padding:7px;">22.3074, 114.26</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">47</td><td style="border:1px solid #fecaca; padding:7px;">Hang Hau</td><td style="border:1px solid #fecaca; padding:7px;">46, 48</td><td style="border:1px solid #fecaca; padding:7px;">22.3156, 114.2644</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">48</td><td style="border:1px solid #fecaca; padding:7px;">Po Lam</td><td style="border:1px solid #fecaca; padding:7px;">47</td><td style="border:1px solid #fecaca; padding:7px;">22.3224, 114.258</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">49</td><td style="border:1px solid #fecaca; padding:7px;">Nam Cheong</td><td style="border:1px solid #fecaca; padding:7px;">19, 20, 38, 89</td><td style="border:1px solid #fecaca; padding:7px;">22.326497, 114.153089</td></tr>
  </tbody>
</table>

### Nhóm ID 50-74

<table style="width:100%; border-collapse:collapse; margin:12px 0 24px; font-size:14px;">
  <thead>
    <tr style="background:#b91c1c; color:#ffffff;">
      <th style="border:1px solid #7f1d1d; padding:8px;">ID</th>
      <th style="border:1px solid #7f1d1d; padding:8px;">Tên ga</th>
      <th style="border:1px solid #7f1d1d; padding:8px;">Các ga kề</th>
      <th style="border:1px solid #7f1d1d; padding:8px;">Tọa độ (lat, lng)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">50</td><td style="border:1px solid #fecaca; padding:7px;">Sunny Bay</td><td style="border:1px solid #fecaca; padding:7px;">39, 42, 51</td><td style="border:1px solid #fecaca; padding:7px;">22.3318, 114.0288</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">51</td><td style="border:1px solid #fecaca; padding:7px;">Disneyland Resort</td><td style="border:1px solid #fecaca; padding:7px;">50</td><td style="border:1px solid #fecaca; padding:7px;">22.3155, 114.0451</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">52</td><td style="border:1px solid #fecaca; padding:7px;">AsiaWorld-Expo</td><td style="border:1px solid #fecaca; padding:7px;">43</td><td style="border:1px solid #fecaca; padding:7px;">22.3218, 113.9412</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">53</td><td style="border:1px solid #fecaca; padding:7px;">LOHAS Park</td><td style="border:1px solid #fecaca; padding:7px;">46</td><td style="border:1px solid #fecaca; padding:7px;">22.2957, 114.2689</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">54</td><td style="border:1px solid #fecaca; padding:7px;">Hung Hom</td><td style="border:1px solid #fecaca; padding:7px;">55, 66, 70, 80</td><td style="border:1px solid #fecaca; padding:7px;">22.3029, 114.1816</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">55</td><td style="border:1px solid #fecaca; padding:7px;">Mong Kok East</td><td style="border:1px solid #fecaca; padding:7px;">7, 54</td><td style="border:1px solid #fecaca; padding:7px;">22.3222, 114.1728</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">56</td><td style="border:1px solid #fecaca; padding:7px;">Tai Wai</td><td style="border:1px solid #fecaca; padding:7px;">7, 57, 76, 81</td><td style="border:1px solid #fecaca; padding:7px;">22.3731, 114.1786</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">57</td><td style="border:1px solid #fecaca; padding:7px;">Sha Tin</td><td style="border:1px solid #fecaca; padding:7px;">56, 58</td><td style="border:1px solid #fecaca; padding:7px;">22.3825, 114.1875</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">58</td><td style="border:1px solid #fecaca; padding:7px;">Fo Tan</td><td style="border:1px solid #fecaca; padding:7px;">57, 59</td><td style="border:1px solid #fecaca; padding:7px;">22.3953, 114.1982</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">59</td><td style="border:1px solid #fecaca; padding:7px;">University</td><td style="border:1px solid #fecaca; padding:7px;">58, 60</td><td style="border:1px solid #fecaca; padding:7px;">22.4134, 114.2102</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">60</td><td style="border:1px solid #fecaca; padding:7px;">Tai Po Market</td><td style="border:1px solid #fecaca; padding:7px;">59, 61</td><td style="border:1px solid #fecaca; padding:7px;">22.4446, 114.1706</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">61</td><td style="border:1px solid #fecaca; padding:7px;">Tai Wo</td><td style="border:1px solid #fecaca; padding:7px;">60, 62</td><td style="border:1px solid #fecaca; padding:7px;">22.4511, 114.1611</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">62</td><td style="border:1px solid #fecaca; padding:7px;">Fanling</td><td style="border:1px solid #fecaca; padding:7px;">61, 63</td><td style="border:1px solid #fecaca; padding:7px;">22.4921, 114.1387</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">63</td><td style="border:1px solid #fecaca; padding:7px;">Sheung Shui</td><td style="border:1px solid #fecaca; padding:7px;">62, 64, 65</td><td style="border:1px solid #fecaca; padding:7px;">22.5012, 114.128</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">64</td><td style="border:1px solid #fecaca; padding:7px;">Lo Wu</td><td style="border:1px solid #fecaca; padding:7px;">63</td><td style="border:1px solid #fecaca; padding:7px;">22.5283, 114.1134</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">65</td><td style="border:1px solid #fecaca; padding:7px;">Lok Ma Chau</td><td style="border:1px solid #fecaca; padding:7px;">63</td><td style="border:1px solid #fecaca; padding:7px;">22.5144, 114.0657</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">66</td><td style="border:1px solid #fecaca; padding:7px;">East Tsim Sha Tsui</td><td style="border:1px solid #fecaca; padding:7px;">2, 54, 89</td><td style="border:1px solid #fecaca; padding:7px;">22.2953, 114.1742</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">67</td><td style="border:1px solid #fecaca; padding:7px;">Sai Ying Pun</td><td style="border:1px solid #fecaca; padding:7px;">25, 68</td><td style="border:1px solid #fecaca; padding:7px;">22.2856, 114.143</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">68</td><td style="border:1px solid #fecaca; padding:7px;">HKU</td><td style="border:1px solid #fecaca; padding:7px;">67, 69</td><td style="border:1px solid #fecaca; padding:7px;">22.2841, 114.136</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">69</td><td style="border:1px solid #fecaca; padding:7px;">Kennedy Town</td><td style="border:1px solid #fecaca; padding:7px;">68</td><td style="border:1px solid #fecaca; padding:7px;">22.2812, 114.129</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">70</td><td style="border:1px solid #fecaca; padding:7px;">Ho Man Tin</td><td style="border:1px solid #fecaca; padding:7px;">4, 54, 71, 79</td><td style="border:1px solid #fecaca; padding:7px;">22.3093, 114.183</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">71</td><td style="border:1px solid #fecaca; padding:7px;">Whampoa</td><td style="border:1px solid #fecaca; padding:7px;">70</td><td style="border:1px solid #fecaca; padding:7px;">22.305, 114.19</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">72</td><td style="border:1px solid #fecaca; padding:7px;">Ocean Park</td><td style="border:1px solid #fecaca; padding:7px;">1, 73</td><td style="border:1px solid #fecaca; padding:7px;">22.2486, 114.174</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">73</td><td style="border:1px solid #fecaca; padding:7px;">Wong Chuk Hang</td><td style="border:1px solid #fecaca; padding:7px;">72, 74</td><td style="border:1px solid #fecaca; padding:7px;">22.248, 114.168</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">74</td><td style="border:1px solid #fecaca; padding:7px;">Lei Tung</td><td style="border:1px solid #fecaca; padding:7px;">73, 75</td><td style="border:1px solid #fecaca; padding:7px;">22.2421, 114.1562</td></tr>
  </tbody>
</table>

### Nhóm ID 75-96

<table style="width:100%; border-collapse:collapse; margin:12px 0 24px; font-size:14px;">
  <thead>
    <tr style="background:#b91c1c; color:#ffffff;">
      <th style="border:1px solid #7f1d1d; padding:8px;">ID</th>
      <th style="border:1px solid #7f1d1d; padding:8px;">Tên ga</th>
      <th style="border:1px solid #7f1d1d; padding:8px;">Các ga kề</th>
      <th style="border:1px solid #7f1d1d; padding:8px;">Tọa độ (lat, lng)</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">75</td><td style="border:1px solid #fecaca; padding:7px;">South Horizons</td><td style="border:1px solid #fecaca; padding:7px;">74</td><td style="border:1px solid #fecaca; padding:7px;">22.2425, 114.1491</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">76</td><td style="border:1px solid #fecaca; padding:7px;">Hin Keng</td><td style="border:1px solid #fecaca; padding:7px;">10, 56</td><td style="border:1px solid #fecaca; padding:7px;">22.364, 114.171</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">77</td><td style="border:1px solid #fecaca; padding:7px;">Kai Tak</td><td style="border:1px solid #fecaca; padding:7px;">10, 78</td><td style="border:1px solid #fecaca; padding:7px;">22.3305, 114.199</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">78</td><td style="border:1px solid #fecaca; padding:7px;">Sung Wong Toi</td><td style="border:1px solid #fecaca; padding:7px;">77, 79</td><td style="border:1px solid #fecaca; padding:7px;">22.3258, 114.191</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">79</td><td style="border:1px solid #fecaca; padding:7px;">To Kwa Wan</td><td style="border:1px solid #fecaca; padding:7px;">70, 78</td><td style="border:1px solid #fecaca; padding:7px;">22.3172, 114.188</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">80</td><td style="border:1px solid #fecaca; padding:7px;">Exhibition Centre</td><td style="border:1px solid #fecaca; padding:7px;">1, 54</td><td style="border:1px solid #fecaca; padding:7px;">22.2818, 114.1754</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">81</td><td style="border:1px solid #fecaca; padding:7px;">Che Kung Temple</td><td style="border:1px solid #fecaca; padding:7px;">56, 82</td><td style="border:1px solid #fecaca; padding:7px;">22.3748, 114.1861</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">82</td><td style="border:1px solid #fecaca; padding:7px;">Sha Tin Wai</td><td style="border:1px solid #fecaca; padding:7px;">81, 83</td><td style="border:1px solid #fecaca; padding:7px;">22.3771, 114.195</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">83</td><td style="border:1px solid #fecaca; padding:7px;">City One</td><td style="border:1px solid #fecaca; padding:7px;">82, 84</td><td style="border:1px solid #fecaca; padding:7px;">22.3828, 114.2035</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">84</td><td style="border:1px solid #fecaca; padding:7px;">Shek Mun</td><td style="border:1px solid #fecaca; padding:7px;">83, 85</td><td style="border:1px solid #fecaca; padding:7px;">22.3877, 114.2083</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">85</td><td style="border:1px solid #fecaca; padding:7px;">Tai Shui Hang</td><td style="border:1px solid #fecaca; padding:7px;">84, 86</td><td style="border:1px solid #fecaca; padding:7px;">22.4088, 114.223</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">86</td><td style="border:1px solid #fecaca; padding:7px;">Heng On</td><td style="border:1px solid #fecaca; padding:7px;">85, 87</td><td style="border:1px solid #fecaca; padding:7px;">22.4174, 114.2258</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">87</td><td style="border:1px solid #fecaca; padding:7px;">Ma On Shan</td><td style="border:1px solid #fecaca; padding:7px;">86, 88</td><td style="border:1px solid #fecaca; padding:7px;">22.4247, 114.2316</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">88</td><td style="border:1px solid #fecaca; padding:7px;">Wu Kai Sha</td><td style="border:1px solid #fecaca; padding:7px;">87</td><td style="border:1px solid #fecaca; padding:7px;">22.4291, 114.2438</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">89</td><td style="border:1px solid #fecaca; padding:7px;">Austin</td><td style="border:1px solid #fecaca; padding:7px;">49, 66</td><td style="border:1px solid #fecaca; padding:7px;">22.303625, 114.166767</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">90</td><td style="border:1px solid #fecaca; padding:7px;">Tsuen Wan West</td><td style="border:1px solid #fecaca; padding:7px;">19, 91</td><td style="border:1px solid #fecaca; padding:7px;">22.3682, 114.1098</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">91</td><td style="border:1px solid #fecaca; padding:7px;">Kam Sheung Road</td><td style="border:1px solid #fecaca; padding:7px;">90, 92</td><td style="border:1px solid #fecaca; padding:7px;">22.434789, 114.0635</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">92</td><td style="border:1px solid #fecaca; padding:7px;">Yuen Long</td><td style="border:1px solid #fecaca; padding:7px;">91, 93</td><td style="border:1px solid #fecaca; padding:7px;">22.4462, 114.0355</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">93</td><td style="border:1px solid #fecaca; padding:7px;">Long Ping</td><td style="border:1px solid #fecaca; padding:7px;">92, 94</td><td style="border:1px solid #fecaca; padding:7px;">22.447594, 114.0256</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">94</td><td style="border:1px solid #fecaca; padding:7px;">Tin Shui Wai</td><td style="border:1px solid #fecaca; padding:7px;">93, 95</td><td style="border:1px solid #fecaca; padding:7px;">22.4481, 114.0048</td></tr>
    <tr style="background:#fff1f2;"><td style="border:1px solid #fecaca; padding:7px;">95</td><td style="border:1px solid #fecaca; padding:7px;">Siu Hong</td><td style="border:1px solid #fecaca; padding:7px;">94, 96</td><td style="border:1px solid #fecaca; padding:7px;">22.412414, 113.978611</td></tr>
    <tr><td style="border:1px solid #fecaca; padding:7px;">96</td><td style="border:1px solid #fecaca; padding:7px;">Tuen Mun</td><td style="border:1px solid #fecaca; padding:7px;">95</td><td style="border:1px solid #fecaca; padding:7px;">22.3941, 113.973194</td></tr>
  </tbody>
</table>

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

### Bảng Thông Số Theo Repo

<table style="width:100%; border-collapse:collapse; margin:12px 0 24px; font-size:14px;">
  <thead>
    <tr style="background:#b91c1c; color:#ffffff;">
      <th style="border:1px solid #7f1d1d; padding:8px;">Chỉ số</th>
      <th style="border:1px solid #7f1d1d; padding:8px;">Giá trị</th>
      <th style="border:1px solid #7f1d1d; padding:8px;">Ghi chú</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#fff1f2;">
      <td style="border:1px solid #fecaca; padding:7px;">Số đỉnh |V|</td>
      <td style="border:1px solid #fecaca; padding:7px;">97</td>
      <td style="border:1px solid #fecaca; padding:7px;">Tương ứng 97 ga MTR trong mảng <code>stations</code>.</td>
    </tr>
    <tr>
      <td style="border:1px solid #fecaca; padding:7px;">Số cạnh |E|</td>
      <td style="border:1px solid #fecaca; padding:7px;">106</td>
      <td style="border:1px solid #fecaca; padding:7px;">Gồm 104 đoạn metro và 2 liên kết trung chuyển đi bộ.</td>
    </tr>
    <tr style="background:#fff1f2;">
      <td style="border:1px solid #fecaca; padding:7px;">Số tuyến</td>
      <td style="border:1px solid #fecaca; padding:7px;">10</td>
      <td style="border:1px solid #fecaca; padding:7px;">AEL, DRL, EAL, ISL, KTL, SIL, TCL, TKL, TML, TWL.</td>
    </tr>
    <tr>
      <td style="border:1px solid #fecaca; padding:7px;">Số ga trung chuyển</td>
      <td style="border:1px solid #fecaca; padding:7px;">21</td>
      <td style="border:1px solid #fecaca; padding:7px;">Các ga có từ 2 tuyến trở lên trong thuộc tính <code>lines</code>.</td>
    </tr>
    <tr style="background:#fff1f2;">
      <td style="border:1px solid #fecaca; padding:7px;">Bậc lớn nhất</td>
      <td style="border:1px solid #fecaca; padding:7px;">5</td>
      <td style="border:1px solid #fecaca; padding:7px;">Bậc theo graph thực tế sau khi sinh từ <code>lineSequences</code> và <code>transferLinks</code>.</td>
    </tr>
    <tr>
      <td style="border:1px solid #fecaca; padding:7px;">Số trạng thái A*</td>
      <td style="border:1px solid #fecaca; padding:7px;">121</td>
      <td style="border:1px solid #fecaca; padding:7px;">Repo tìm trên trạng thái <code>stationId|currentLine</code>, không chỉ trên ga.</td>
    </tr>
    <tr style="background:#fff1f2;">
      <td style="border:1px solid #fecaca; padding:7px;">Độ phức tạp thời gian</td>
      <td style="border:1px solid #fecaca; padding:7px;">O(S² log S + A)</td>
      <td style="border:1px solid #fecaca; padding:7px;">S là số trạng thái A*. Code hiện dùng mảng <code>open</code> và <code>sort()</code> mỗi vòng, chưa dùng heap/priority queue.</td>
    </tr>
    <tr>
      <td style="border:1px solid #fecaca; padding:7px;">Nếu dùng heap</td>
      <td style="border:1px solid #fecaca; padding:7px;">O(A log S)</td>
      <td style="border:1px solid #fecaca; padding:7px;">Đây là phương án tối ưu hơn nếu thay <code>open.sort()</code> bằng priority queue.</td>
    </tr>
    <tr style="background:#fff1f2;">
      <td style="border:1px solid #fecaca; padding:7px;">Độ phức tạp không gian</td>
      <td style="border:1px solid #fecaca; padding:7px;">O(S + A)</td>
      <td style="border:1px solid #fecaca; padding:7px;">Dùng cho <code>g</code>, <code>trace</code>, <code>closed</code>, <code>open</code> và graph kề.</td>
    </tr>
    <tr>
      <td style="border:1px solid #fecaca; padding:7px;">Worst case</td>
      <td style="border:1px solid #fecaca; padding:7px;">Mở gần hết S trạng thái</td>
      <td style="border:1px solid #fecaca; padding:7px;">Không còn là đồ thị tuyến tính 7 ga; khi nhiều đoạn bị cấm, A* có thể phải xét phần lớn graph.</td>
    </tr>
  </tbody>
</table>

## Gợi Ý Du Lịch

Sau khi route được tính, `renderStopSuggestions(result)` sẽ:

1. Lấy danh sách ga nằm trên route;
2. Lọc các ga có dữ liệu trong `stopSuggestions`;
3. Ưu tiên gợi ý đầu tiên của mỗi ga;
4. Giới hạn số card để panel không quá dài;
5. Render các card "Gợi ý dừng chân".

Các gợi ý hiện có bao gồm những khu vực như Central, Sheung Wan, Admiralty, Wan Chai, Causeway Bay, Tsim Sha Tsui, Jordan, Mong Kok, Diamond Hill, Ocean Park, Disneyland Resort, Tung Chung, Sha Tin, Yuen Long và Tuen Mun.

## Giao Diện

Giao diện hiện gồm:

- Bản đồ Leaflet toàn màn hình;
- Panel điều khiển bên phải;
- Legend màu tuyến ở góc trái trên;
- Khung trang trí bản đồ bằng dải màu MTR;
- Mascot tóc trắng ở góc trái dưới;
- Mascot tóc tím ở phía phải dưới, cạnh panel;
- Bong bóng thoại cho cả hai mascot;
- Route flow có màu tuyến, thời gian từng đoạn và card gợi ý dừng chân.

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
