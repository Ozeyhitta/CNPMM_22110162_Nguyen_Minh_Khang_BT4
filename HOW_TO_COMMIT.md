# 🚀 Hướng dẫn Commit Code

## 📋 Tóm tắt các tính năng đã implement

### ✅ 1. Validation cho các form trong Frontend
- Login, Register, User management, Product forms
- Sử dụng Ant Design Form validation

### ✅ 2. 04 Lớp Bảo mật cho API
- **Input Validation**: express-validation (Joi)
- **Rate Limiting**: express-rate-limit
- **Authentication**: JWT với role
- **Authorization**: Phân quyền user/admin

### ✅ 3. Lazy Loading Products
- Infinite scroll với IntersectionObserver
- Pagination với page/limit

### ✅ 4. Admin CRUD
- CRUD Users (Admin only)
- CRUD Products (Admin only)

---

## 🔧 Cách Commit (Windows PowerShell)

### Bước 1: Kiểm tra files sẽ commit

```powershell
git status
```

### Bước 2: Add các files (KHÔNG add node_modules và .env)

```powershell
# Add backend
git add ExpressJS01/src/
git add ExpressJS01/package.json
git add ExpressJS01/package-lock.json
git add ExpressJS01/SECURITY.md
git add ExpressJS01/USER_PERMISSIONS.md

# Add frontend (KHÔNG add .env vì đã có trong .gitignore)
git add ReactJS01/reactjs01/src/
git add ReactJS01/reactjs01/index.html

# Add documentation
git add COMMIT_GUIDE.md
git add COMMIT_INSTRUCTIONS.md
git add HOW_TO_COMMIT.md
git add ReactJS01/reactjs01/ENV_SETUP.md
git add ReactJS01/reactjs01/FIX_404_ERROR.md
```

### Bước 3: Commit với message

```powershell
git commit -m "feat: Implement 4-layer security, validation, lazy loading và admin CRUD

Backend:
- Thêm 4 lớp bảo mật: Input validation, Rate limiting, JWT Auth, Authorization
- Validation cho user, product, admin với express-validation
- Rate limiting: global (200/15min), login (10/5min), OTP (3/1min)
- JWT authentication với role (user/admin)
- Authorization middleware phân quyền user/admin
- Admin CRUD users và products
- Script tạo admin user (src/seed/createAdmin.js)

Frontend:
- Validation cho tất cả forms (login, register, user, product)
- Lazy loading products với IntersectionObserver
- Admin CRUD users với modal form và table
- Admin thêm sản phẩm trong ProductList
- Phân quyền UI: chỉ admin thấy các nút CRUD
- Fix auth context để lưu và sử dụng role
- Cải thiện error handling và loading states

Files:
- Backend: middleware (auth, authorize, rateLimit), validation, controllers
- Frontend: pages (user, ProductList), components, util/api
- Documentation: SECURITY.md, USER_PERMISSIONS.md"
```

### Bước 4: Push lên remote (nếu cần)

```powershell
git push origin main
```

---

## ⚠️ Lưu ý quan trọng

### ❌ KHÔNG commit:
- `node_modules/` - Đã có trong .gitignore
- `.env` - Đã có trong .gitignore (chứa thông tin nhạy cảm)
- Files build (`dist/`, `build/`)

### ✅ NÊN commit:
- Source code (`.js`, `.jsx`)
- Config files (`package.json`)
- Documentation (`.md`)
- Validation files
- Controllers, middleware, routes

---

## 📝 Commit Message Format

```
<type>: <subject>

<body>
```

**Type**: `feat` (tính năng mới)

**Subject**: Mô tả ngắn gọn

**Body**: Chi tiết các thay đổi

---

## ✅ Checklist

- [ ] Đã test code và hoạt động đúng
- [ ] Không có lỗi linter
- [ ] Đã xóa debug logs không cần thiết
- [ ] Backend và Frontend đều chạy được
- [ ] Đã test các tính năng:
  - [ ] Login/Register với validation
  - [ ] Admin CRUD users
  - [ ] Admin CRUD products
  - [ ] Lazy loading products
  - [ ] Phân quyền user/admin

---

## 🔍 Kiểm tra sau khi commit

```powershell
# Xem commit vừa tạo
git log --oneline -1

# Xem chi tiết commit
git show HEAD

# Xem files đã commit
git show --name-only HEAD
```

