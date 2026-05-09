## 1. Fix lỗi không thể Zoom Out

 - sửa applyZoom() để khi scale lớn hơn 1 thì max-height tự điều chỉnh
 - thêm document.getElementById('panel').style.maxHeight = ''; vào resetMap()


