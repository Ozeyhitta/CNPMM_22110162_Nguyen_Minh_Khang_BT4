#!/bin/bash

# Script commit code với message mô tả đầy đủ

echo "📦 Đang add các files đã thay đổi..."

# Add backend files
git add ExpressJS01/src/
git add ExpressJS01/package.json
git add ExpressJS01/package-lock.json
git add ExpressJS01/SECURITY.md
git add ExpressJS01/USER_PERMISSIONS.md

# Add frontend files
git add ReactJS01/reactjs01/src/
git add ReactJS01/reactjs01/index.html
git add ReactJS01/reactjs01/.env

# Add documentation
git add COMMIT_GUIDE.md
git add ReactJS01/reactjs01/ENV_SETUP.md
git add ReactJS01/reactjs01/FIX_404_ERROR.md

echo "✅ Đã add các files"
echo ""
echo "📝 Commit message:"
echo ""

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
- Thêm .env config cho backend URL

Files:
- Backend: middleware (auth, authorize, rateLimit), validation, controllers (admin, product)
- Frontend: pages (user, ProductList), components, util/api
- Documentation: SECURITY.md, USER_PERMISSIONS.md, COMMIT_GUIDE.md"

echo ""
echo "✅ Đã commit thành công!"
echo ""
echo "Để push lên remote:"
echo "  git push origin main"

