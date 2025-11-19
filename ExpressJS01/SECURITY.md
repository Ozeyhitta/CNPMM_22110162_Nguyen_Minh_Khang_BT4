# 🔒 Tài liệu Bảo mật API

## Tổng quan

API đã được bảo vệ bằng **4 lớp bảo mật**:

1. ✅ **Input Validation** - Kiểm tra dữ liệu đầu vào
2. ✅ **Rate Limiting** - Giới hạn số lượng request
3. ✅ **Authentication (JWT)** - Xác thực người dùng
4. ✅ **Authorization** - Phân quyền User và Admin

---

## 1. Input Validation (express-validation)

### Mục đích
- Kiểm tra và validate dữ liệu đầu vào trước khi xử lý
- Ngăn chặn dữ liệu không hợp lệ hoặc độc hại

### Các validation đã implement:

#### User Validation (`src/validation/user.validation.js`)
- `registerValidation`: Validate đăng ký (name, email, password)
- `loginValidation`: Validate đăng nhập (email, password)
- `forgotValidation`: Validate quên mật khẩu (email)
- `checkOtpValidation`: Validate OTP (email, otp)
- `resetPasswordValidation`: Validate reset password (email, otp, password)

#### Product Validation (`src/validation/product.validation.js`)
- `getProductsValidation`: Validate query params (page, limit, category)
- `createProductValidation`: Validate tạo sản phẩm (name, category, price, thumbnail)
- `updateProductValidation`: Validate cập nhật sản phẩm

#### Admin Validation (`src/validation/admin.validation.js`)
- `updateUserRoleValidation`: Validate cập nhật role (role: "user" | "admin")

---

## 2. Rate Limiting (express-rate-limit)

### Mục đích
- Ngăn chặn tấn công DDoS và brute force
- Bảo vệ server khỏi quá tải

### Các rate limiter đã cấu hình (`src/middleware/rateLimit.js`):

1. **globalLimiter**: 
   - 200 requests / 15 phút
   - Áp dụng cho hầu hết các route

2. **loginLimiter**:
   - 10 requests / 5 phút
   - Áp dụng cho route `/login`

3. **otpLimiter**:
   - 3 requests / 1 phút
   - Áp dụng cho routes `/forgot-password` và `/check-otp`

---

## 3. Authentication (JWT)

### Mục đích
- Xác thực người dùng đã đăng nhập
- Lưu thông tin user trong token

### Cách hoạt động:

1. **Đăng nhập**: User nhận JWT token chứa:
   - `email`
   - `name`
   - `role` (user hoặc admin)

2. **Middleware Auth** (`src/middleware/auth.js`):
   - Kiểm tra token trong header `Authorization: Bearer <token>`
   - Verify token và gán `req.user` với thông tin từ token

3. **Routes được bảo vệ**:
   - Tất cả routes có middleware `auth` đều yêu cầu token hợp lệ

---

## 4. Authorization (Phân quyền)

### Mục đích
- Phân quyền truy cập dựa trên role
- User chỉ truy cập được routes của user
- Admin truy cập được tất cả routes

### Middleware Authorize (`src/middleware/authorize.js`)

```javascript
authorize("admin") // Chỉ admin mới truy cập được
authorize("user", "admin") // Cả user và admin đều truy cập được
```

### Phân loại Routes:

#### 🔓 PUBLIC ROUTES (Không cần auth)
- `GET /` - Test route
- `GET /products` - Xem danh sách sản phẩm
- `GET /products/:id` - Xem chi tiết sản phẩm
- `POST /register` - Đăng ký
- `POST /login` - Đăng nhập
- `POST /forgot-password` - Quên mật khẩu
- `POST /check-otp` - Kiểm tra OTP
- `POST /reset-password` - Reset mật khẩu

#### 🔐 USER ROUTES (Cần đăng nhập)
- `GET /user` - Lấy thông tin user hiện tại

#### 👑 ADMIN ROUTES (Chỉ admin)
- `GET /account` - Lấy thông tin account (admin)
- `POST /products` - Tạo sản phẩm
- `PUT /products/:id` - Cập nhật sản phẩm
- `DELETE /products/:id` - Xóa sản phẩm
- `GET /admin/users` - Lấy danh sách users
- `GET /admin/users/:id` - Lấy thông tin user theo ID
- `PUT /admin/users/:id/role` - Cập nhật role của user
- `DELETE /admin/users/:id` - Xóa user

---

## Cách sử dụng

### 1. Tạo Admin User

```bash
cd ExpressJS01
node src/seed/createAdmin.js
```

Admin mặc định:
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **Lưu ý**: Đổi mật khẩu ngay sau khi đăng nhập!

### 2. Đăng nhập và lấy token

```bash
POST /v1/api/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Response:
```json
{
  "EC": 0,
  "EM": "Đăng nhập thành công",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### 3. Sử dụng token trong request

```bash
GET /v1/api/user
Headers:
  Authorization: Bearer <access_token>
```

### 4. Tạo sản phẩm (Admin only)

```bash
POST /v1/api/products
Headers:
  Authorization: Bearer <admin_token>
Body:
{
  "name": "Sản phẩm mới",
  "category": "Điện tử",
  "price": 1000000,
  "thumbnail": "https://example.com/image.jpg"
}
```

---

## Cấu trúc File

```
ExpressJS01/
├── src/
│   ├── middleware/
│   │   ├── auth.js              # JWT Authentication
│   │   ├── authorize.js         # Role-based Authorization
│   │   └── rateLimit.js         # Rate Limiting
│   ├── validation/
│   │   ├── user.validation.js   # User input validation
│   │   ├── product.validation.js # Product input validation
│   │   └── admin.validation.js  # Admin input validation
│   ├── controllers/
│   │   ├── userController.js    # User controllers
│   │   ├── productController.js # Product controllers
│   │   └── adminController.js   # Admin controllers
│   ├── routes/
│   │   └── api.js               # API routes với đầy đủ bảo mật
│   └── seed/
│       └── createAdmin.js       # Script tạo admin
```

---

## Best Practices

1. ✅ Luôn validate input trước khi xử lý
2. ✅ Sử dụng rate limiting cho các route quan trọng
3. ✅ JWT token có thời hạn (1 ngày)
4. ✅ Không trả về password trong response
5. ✅ Phân quyền rõ ràng giữa user và admin
6. ✅ Error handling đầy đủ

---

## Bảo mật bổ sung (Khuyến nghị)

- [ ] HTTPS/SSL cho production
- [ ] CORS configuration chi tiết hơn
- [ ] Helmet.js để bảo vệ headers
- [ ] Input sanitization (xss)
- [ ] SQL injection protection (Sequelize đã có)
- [ ] Logging và monitoring
- [ ] Refresh token mechanism

