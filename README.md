1.1. Bối cảnh và động lực

Hệ thống tàu điện ngầm MTR (Mass Transit Railway) tại Hong Kong là một trong những mạng lưới giao thông đô thị hiệu quả nhất thế giới, vận chuyển hơn 5 triệu hành khách mỗi ngày. Tuy nhiên, các sự cố kỹ thuật, bảo trì định kỳ, hoặc thảm họa tự nhiên đều có thể gây gián đoạn trên một hoặc nhiều đoạn tuyến, buộc hành khách phải tìm tuyến đường thay thế trong thời gian ngắn.

Bài toán tìm đường tối ưu trên đồ thị có ràng buộc động (cạnh bị chặn thay đổi theo thời gian thực) là bài toán kinh điển trong lý thuyết đồ thị và có ứng dụng rộng rãi trong lĩnh vực hệ thống thông tin địa lý (GIS), lập kế hoạch logistics, và robot tự hành. Dự án MTR Navigator ra đời nhằm minh hoạ trực quan bài toán này trong một ngữ cảnh thực tiễn và gần gũi.

1.2. Mục tiêu

•Xây dựng ứng dụng web tương tác hiển thị mạng lưới ga MTR trên nền bản đồ địa lý thực tế.

•Cài đặt thuật toán A* để tìm đường ngắn nhất có tính đến các đoạn bị vô hiệu hoá.

•Cho phép người dùng thao tác thời gian thực: thêm/xoá ràng buộc và quan sát kết quả ngay lập tức.

•Thiết kế giao diện trực quan, hiện đại theo chuẩn UI/UX chuyên nghiệp.

•Phân tách rõ ràng giữa cấu trúc, giao diện và logic theo nguyên tắc Separation of Concerns.


1.3. Phạm vi dự án

Phiên bản hiện tại tập trung vào tuyến Island Line của MTR gồm 7 ga: Central, Admiralty, Wan Chai, Causeway Bay, Tin Hau, Fortress Hill và North Point. Đây là tuyến tàu điện ngầm chạy ven bờ bắc đảo Hong Kong, được lựa chọn vì có cấu trúc đồ thị tuyến tính (linear graph) phù hợp cho mục đích minh hoạ và dễ kiểm chứng kết quả.
