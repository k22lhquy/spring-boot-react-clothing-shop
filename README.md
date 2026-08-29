# 👕 TRENDS CLOTHING STORE - Fullstack E-Commerce & Anti-DDoS Protection

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](#license)

Một ứng dụng web bán quần áo thương mại điện tử hoàn chỉnh xây dựng theo kiến trúc **MVC / RESTful API** chuẩn, sử dụng **Spring Boot**, **React SPA**, **MongoDB**, tích hợp khung **Live Chat CSKH 24/7**, hệ thống **Mã Giảm Giá (Voucher)**, **Đánh Giá & Nhận Xét**, cùng giải pháp **Chống DDoS / Spam truy cập theo IP (Rate Limiting Filter)**.

---

## 🌟 Tính Năng Nổi Bật

### 🛍️ 1. Trải Nghiệm Mua Sắm Hiện Đại
- **Trang Chủ (Home)**: Hero banner cao cấp, slider bộ sưu tập bán chạy, cam kết freeship & đổi trả.
- **Bộ Lọc Tìm Kiếm (Catalog)**: Lọc sản phẩm theo từ khóa, lọc danh mục (*Áo khoác, Hoodie, Áo thun, Quần dài, Phụ kiện*), chọn khoảng giá linh hoạt và chọn kích thước (*Size S, M, L, XL*).
- **Xem Nhanh & Chi Tiết (Product Detail)**: Xem bộ sưu tập hình ảnh sắc nét, mô tả chất liệu, chọn Size, theo dõi số lượng kho còn lại.
- **Danh Sách Yêu Thích (Wishlist)**: Lưu lại các món đồ yêu thích với 1-click.
- **Giỏ Hàng & Voucher**: Áp dụng mã quà tặng giảm giá ngay khi đặt hàng (Ví dụ: `WELCOME10` - giảm 10%, `SUMMER20` - giảm 20%).
- **Thanh Toán (Checkout)**: Nhập địa chỉ giao hàng và chọn phương thức thanh toán linh hoạt (*COD, QR Pay, Thẻ Visa/Mastercard*).
- **Theo Dõi Đơn Hàng (Order Timeline)**: Tiến trình trực quan 4 bước (*Đã Đặt ➔ Đang Chuẩn Bị ➔ Đang Giao ➔ Đã Giao Thành Công*).

### 💬 2. Khung Live Chat CSKH 24/7
- Floating Widget Chat góc dưới màn hình giúp khách hàng trao đổi trực tiếp.
- Auto Bot tư vấn thông minh tự động trả lời thắc mắc về bảng size, phí ship, thời gian giao hàng, mã giảm giá và chính sách đổi trả.

### ⭐ 3. Đánh Giá & Nhận Xét Sản Phẩm
- Cho phép người mua đã đăng nhập chấm điểm từ 1 đến 5 sao (★) và để lại bình luận thực tế.
- Tự động tính toán điểm đánh giá trung bình của từng sản phẩm.

### 👑 4. Bảng Quản Trị Admin (Admin Dashboard)
- **Thống kê doanh thu**: Xem tổng doanh thu, tổng số đơn hàng, số đơn hàng đang chờ đóng gói.
- **Quản lý kho sản phẩm (CRUD)**: Thêm sản phẩm mới, cập nhật giá bán, số lượng kho, xóa sản phẩm.
- **Quản lý đơn hàng**: Cập nhật trạng thái xử lý đơn hàng (*PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED*).

### 🛡️ 5. Bộ Lọc Chống DDoS & Rate Limiting IP
- **RateLimitingFilter**: Tích hợp trực tiếp vào chuỗi Spring Security Filter Chain để giám sát lượt truy cập theo IP người dùng.
- **Giới hạn**:
  - API công khai: Max **60 request / phút / IP**.
  - Endpoint nhạy cảm (*Login, Register, Checkout*): Max **10 request / phút / IP**.
- **Phản hồi khi vượt ngưỡng**: Trả về HTTP status `429 Too Many Requests` kèm header `Retry-After: 60`.
- **Giao diện Frontend**: Tự động hiển thị banner cảnh báo khẩn cấp màu đỏ kèm đồng hồ đếm ngược `60s` khóa thao tác nhằm ngăn chặn bot spam dồn dập.

---

## 🏗️ Kiến Trúc Hệ Thống (Architecture)

```
d:\shop
├── backend/                  # Spring Boot Maven Project (Java 21)
│   ├── src/main/java/com/shop/
│   │   ├── config/           # SecurityConfig, JwtUtils, CorsConfig
│   │   ├── security/         # Anti-DDoS RateLimitingFilter, JwtAuthFilter
│   │   ├── model/            # User, Product, Category, Order, ChatMessage, Review, Voucher
│   │   ├── repository/       # MongoRepositories & InMemoryStore Fallback
│   │   ├── service/          # Business Services & In-Memory Storage
│   │   ├── controller/       # AuthController, ProductController, OrderController, ChatController...
│   │   └── seeder/           # DataSeeder (Dữ liệu mẫu ban đầu)
│   └── pom.xml
└── frontend/                 # React SPA (Vite + JavaScript)
    ├── src/
    │   ├── components/       # Navbar, Footer, ProductCard, LiveChatWidget, RateLimitBanner...
    │   ├── pages/            # Home, Catalog, ProductDetail, Checkout, Orders, AdminDashboard
    │   ├── context/          # AuthContext, CartContext, WishlistContext, ChatContext
    │   ├── services/         # api.js (Axios/Fetch wrapper với RateLimit Error Handler)
    │   └── index.css         # Dark Luxury CSS Design System & Glassmorphism
    └── package.json
```

---

## ⚡ Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu Cầu Tiền Đề
- Java 17+ hoặc **Java 21**
- Node.js 18+ và `npm`

### 2. Khởi Chạy Backend (Spring Boot)
1. Mở terminal tại thư mục `backend`:
   ```powershell
   cd d:\shop\backend
   ```
2. Chạy ứng dụng bằng Maven wrapper:
   ```powershell
   .\apache-maven-3.9.6\bin\mvn spring-boot:run
   ```
   *Backend sẽ khởi chạy trên cổng **`http://localhost:8085`**.*
   *(Lưu ý: Nếu MongoDB chưa khởi chạy trên máy local, ứng dụng sẽ tự động kích hoạt bộ nhớ tạm `InMemoryStore` để đảm bảo hệ thống hoạt động 100% không bị crash).*

### 3. Khởi Chạy Frontend (React)
1. Mở terminal tại thư mục `frontend`:
   ```powershell
   cd d:\shop\frontend
   ```
2. Khởi chạy Vite Dev Server:
   ```powershell
   npm run dev
   ```
3. Mở trình duyệt và truy cập: **`http://localhost:5173`**

---

## 🔑 Tài Khoản Mẫu Trải Nghiệm

| Vai Trò | Email | Mật Khẩu | Quyền Hạn |
| :--- | :--- | :--- | :--- |
| **Quản Trị Viên (Admin)** | `admin@shop.com` | `admin123` | Truy cập Admin Dashboard, Quản lý kho, Thêm/Xóa SP, Đổi trạng thái đơn |
| **Khách Hàng (Customer)** | `user@shop.com` | `user123` | Mua hàng, Áp mã voucher, Đánh giá sản phẩm, Xem đơn hàng |

---

## 🧪 Kiểm Thử Tự Động & Chống DDoS

Chạy kịch bản test bằng PowerShell để kiểm tra hoạt động API và bộ lọc chống DDoS:

```powershell
cd d:\shop
.\test_api.ps1
```

Kịch bản sẽ gửi luồng request dồn dập vào endpoint nhạy cảm để xác minh phản hồi `HTTP 429 Too Many Requests` từ bộ lọc chống DDoS.

---

## 📄 License
Project được phát hành dưới bản quyền [MIT License](LICENSE).
