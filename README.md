# JW Marriott Hotel Hanoi – Website giới thiệu và đặt dịch vụ

Bài tập lớn môn **Thiết kế Web** – Nhóm 8, lớp QT02, Khoa Đào tạo Quốc tế, Trường ĐH Giao thông vận tải.

Website tĩnh viết bằng **HTML, CSS và JavaScript thuần** (không dùng framework), mô phỏng website khách sạn JW Marriott Hotel Hanoi: xem phòng, đặt nhiều phòng qua giỏ hàng, đặt bàn nhà hàng, đăng ký hội viên, áp dụng ưu đãi và quản lý lịch sử đặt. Dữ liệu được lưu bằng `localStorage` của trình duyệt.

> Đây là sản phẩm học tập, không phải website chính thức của Marriott.

## Thành viên

| Họ tên | MSV | Phụ trách |
|---|---|---|
| Phạm Quang Vũ | 252601098 | Trang chủ, Ưu đãi & Gói |
| Nguyễn Minh Quang | 252601077 | Danh sách phòng, giỏ phòng |
| Dương Hoàng Tùng | 252601093 | Chi tiết phòng, Thanh toán, Đặt thành công |
| Vũ Bình An | 252601008 | Ẩm thực, đặt bàn, hội viên |
| Bùi Tiến Đạt | 252601031 | Khung chung, Dịch vụ & Tiện ích, Lịch sử đặt |

## Các trang

| Trang | File |
|---|---|
| Trang chủ – Tổng quan | `index.html` |
| Danh sách phòng | `rooms.html` |
| Chi tiết phòng | `room-detail.html?id=...` |
| Thanh toán | `checkout.html` |
| Đặt thành công | `success.html` |
| Ẩm thực | `cuisine.html` |
| Dịch vụ & Tiện ích | `services.html` |
| Ưu đãi & Gói | `offers.html` |
| Lịch sử đặt | `history.html` |

## Cấu trúc thư mục

```
├── *.html          9 trang
├── css/            site.css (dùng chung) + 1 file CSS cho mỗi trang
├── js/             site.js, cart.js (dùng chung), dữ liệu phòng/nhà hàng, JS từng trang
└── images/         ảnh phòng, nhà hàng, tiện ích
```

## Chạy thử

Mở trực tiếp `index.html` bằng trình duyệt (Chrome, Edge, Firefox), hoặc xem bản đã triển khai trên GitHub Pages.
