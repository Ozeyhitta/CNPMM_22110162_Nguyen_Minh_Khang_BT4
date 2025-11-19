# 🔐 Phân Quyền User và Admin

## Tổng quan

Hệ thống có **2 loại quyền**:
- **User**: Quyền hạn chế, chỉ xem được thông tin của chính mình
- **Admin**: Quyền đầy đủ, có thể CRUD users và products

---

## 📋 Bảng Phân Quyền

### 👤 USER (role: "user")

| Chức năng | Route | Mô tả |
|-----------|-------|-------|
| ✅ Xem sản phẩm | `GET /v1/api/products` | Xem danh sách sản phẩm (public) |
| ✅ Xem chi tiết sản phẩm | `GET /v1/api/products/:id` | Xem chi tiết sản phẩm (public) |
| ✅ Xem thông tin của mình | `GET /v1/api/user` | Chỉ xem được thông tin của chính mình |
| ❌ CRUD Users | - | **KHÔNG** được phép |
| ❌ CRUD Products | - | **KHÔNG** được phép |

### 👑 ADMIN (role: "admin")

| Chức năng | Route | Mô tả |
|-----------|-------|-------|
| ✅ Tất cả quyền của User | - | Admin có tất cả quyền của user |
| ✅ CRUD Users | `/v1/api/admin/users` | **ĐẦY ĐỦ** quyền CRUD users |
| ✅ CRUD Products | `/v1/api/products` | **ĐẦY ĐỦ** quyền CRUD products |
| ✅ Xem account | `GET /v1/api/account` | Xem thông tin account (admin only) |

---

## 🔧 ADMIN - CRUD Users

### CREATE - Tạo user mới

```bash
POST /v1/api/admin/users
Headers:
  Authorization: Bearer <admin_token>
Body:
{
  "name": "Tên user",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"  // optional, mặc định là "user"
}
```

### READ - Lấy danh sách users

```bash
GET /v1/api/admin/users
Headers:
  Authorization: Bearer <admin_token>
```

### READ - Lấy user theo ID

```bash
GET /v1/api/admin/users/:id
Headers:
  Authorization: Bearer <admin_token>
```

### UPDATE - Cập nhật user

```bash
PUT /v1/api/admin/users/:id
Headers:
  Authorization: Bearer <admin_token>
Body:
{
  "name": "Tên mới",      // optional
  "email": "new@email.com", // optional
  "password": "newpass",   // optional
  "role": "admin"          // optional
}
```

### UPDATE - Chỉ cập nhật role

```bash
PUT /v1/api/admin/users/:id/role
Headers:
  Authorization: Bearer <admin_token>
Body:
{
  "role": "admin"  // "user" hoặc "admin"
}
```

### DELETE - Xóa user

```bash
DELETE /v1/api/admin/users/:id
Headers:
  Authorization: Bearer <admin_token>
```

⚠️ **Lưu ý**: Admin không thể xóa chính mình.

---

## 🔧 ADMIN - CRUD Products

### CREATE - Tạo sản phẩm

```bash
POST /v1/api/products
Headers:
  Authorization: Bearer <admin_token>
Body:
{
  "name": "Tên sản phẩm",
  "category": "Danh mục",
  "price": 100000,
  "thumbnail": "https://example.com/image.jpg"  // optional
}
```

### UPDATE - Cập nhật sản phẩm

```bash
PUT /v1/api/products/:id
Headers:
  Authorization: Bearer <admin_token>
Body:
{
  "name": "Tên mới",        // optional
  "category": "Danh mục mới", // optional
  "price": 200000,          // optional
  "thumbnail": "..."        // optional
}
```

### DELETE - Xóa sản phẩm

```bash
DELETE /v1/api/products/:id
Headers:
  Authorization: Bearer <admin_token>
```

---

## 👤 USER - Quyền hạn chế

### Xem thông tin của chính mình

```bash
GET /v1/api/user
Headers:
  Authorization: Bearer <user_token>
```

Response:
```json
{
  "EC": 0,
  "EM": "Lấy thông tin user thành công",
  "data": {
    "email": "user@example.com",
    "name": "Tên user",
    "role": "user"
  }
}
```

### ❌ User KHÔNG thể:

- ❌ Truy cập `/v1/api/admin/users` → **403 Forbidden**
- ❌ Tạo/sửa/xóa products → **403 Forbidden**
- ❌ Xem danh sách tất cả users → **403 Forbidden**
- ❌ Cập nhật role của user khác → **403 Forbidden**

---

## 🔒 Bảo mật

### Middleware Authorization

Tất cả routes admin đều có:
```javascript
auth,                    // Kiểm tra đã đăng nhập
authorize("admin"),      // Kiểm tra role = "admin"
```

### Kiểm tra trong code

```javascript
// Middleware authorize
if (!roles.includes(req.user.role)) {
  return res.status(403).json({ 
    message: "Bạn không có quyền truy cập" 
  });
}
```

---

## 📝 Ví dụ Test

### Test với User thường:

```bash
# 1. Đăng nhập với user
POST /v1/api/login
{
  "email": "user@example.com",
  "password": "password123"
}

# 2. Thử truy cập admin route → Sẽ bị từ chối
GET /v1/api/admin/users
Headers: Authorization: Bearer <user_token>
# Response: 403 - "Bạn không có quyền truy cập"
```

### Test với Admin:

```bash
# 1. Đăng nhập với admin
POST /v1/api/login
{
  "email": "admin@example.com",
  "password": "admin123"
}

# 2. Truy cập admin routes → Thành công
GET /v1/api/admin/users
Headers: Authorization: Bearer <admin_token>
# Response: 200 - Danh sách users
```

---

## ✅ Tóm tắt

| Quyền | User | Admin |
|-------|------|-------|
| Xem sản phẩm | ✅ | ✅ |
| Xem thông tin của mình | ✅ | ✅ |
| CRUD Users | ❌ | ✅ |
| CRUD Products | ❌ | ✅ |
| Xem tất cả users | ❌ | ✅ |
| Cập nhật role | ❌ | ✅ |

**Kết luận**: 
- ✅ **Admin có thể CRUD user**
- ❌ **User không thể CRUD user**

