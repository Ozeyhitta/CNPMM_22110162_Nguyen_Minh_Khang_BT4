import React, { useContext, useState, useEffect } from "react";
import {
  UsergroupAddOutlined,
  HomeOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TagsOutlined,
  PlusOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Menu, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, CartContext } from "../context/auth.context";
import { logoutApi } from "../../util/api";

// Utility function to extract username from email
const extractUsernameFromEmail = (email) => {
  if (!email || typeof email !== "string") {
    return "";
  }

  // Trim whitespace and validate email format
  const trimmedEmail = email.trim();

  // Check if email contains @ symbol
  if (!trimmedEmail.includes("@")) {
    return trimmedEmail; // Return as-is if no @ symbol
  }

  // Split email by @ and take the first part
  const username = trimmedEmail.split("@")[0];

  // Return username if valid, otherwise return original
  return username && username.length > 0 ? username : trimmedEmail;
};

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [prevCartCount, setPrevCartCount] = useState(cartCount);
  const [animateBadge, setAnimateBadge] = useState(false);

  console.log(">>> check auth: ", auth);

  // Animate badge when cart count changes
  useEffect(() => {
    if (prevCartCount !== cartCount) {
      setAnimateBadge(true);
      setPrevCartCount(cartCount);

      const timer = setTimeout(() => {
        setAnimateBadge(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [cartCount, prevCartCount]);

  // Format cart count (show 99+ for large numbers)
  const displayCount = cartCount > 99 ? "99+" : cartCount.toString();

  const items = [
    {
      label: <Link to="/">Home Page</Link>,
      key: "home",
      icon: <HomeOutlined />,
    },

    {
      label: <Link to="/products">Products</Link>,
      key: "products",
      icon: <ShoppingOutlined />,
    },

    ...(auth.isAuthenticated
      ? [
          {
            label: <Link to="/favorites">Yêu thích</Link>,
            key: "favorites",
            icon: <HeartOutlined />,
          },
        ]
      : []),

    // Admin menu
    ...(auth.isAuthenticated && auth.user?.role === "admin"
      ? [
          {
            label: "Quản lý",
            key: "admin",
            icon: <SettingOutlined />,
            children: [
              {
                label: <Link to="/categories">Danh mục</Link>,
                key: "categories",
                icon: <TagsOutlined />,
              },
              {
                label: <Link to="/products-management">Quản lý sản phẩm</Link>,
                key: "products-management",
                icon: <PlusOutlined />,
              },
              {
                label: <Link to="/user">Users</Link>,
                key: "user",
                icon: <UsergroupAddOutlined />,
              },
            ],
          },
        ]
      : []),

    {
      label: `Welcome ${extractUsernameFromEmail(auth?.user?.email) || ""}`,
      key: "submenu",
      icon: <SettingOutlined />,
      children: [
        ...(auth.isAuthenticated
          ? [
              {
                label: (
                  <span
                    onClick={async () => {
                      try {
                        // Gọi API logout để tạo sessionId mới
                        const res = await logoutApi();
                        console.log(">>> Logout response:", res);

                        if (res && res.EC === 0 && res.DT?.sessionId) {
                          // Lưu sessionId mới vào localStorage
                          localStorage.setItem("sessionId", res.DT.sessionId);
                          console.log(
                            ">>> Saved new sessionId:",
                            res.DT.sessionId
                          );
                        }

                        // Xóa access token
                        localStorage.removeItem("access_token");

                        // Reset auth context
                        setAuth({
                          isAuthenticated: false,
                          user: {
                            email: "",
                            name: "",
                            role: "",
                          },
                        });

                        notification.success({
                          message: "Đăng xuất thành công",
                          description: "Bạn đã được chuyển hướng về trang chủ",
                        });

                        navigate("/");
                      } catch (error) {
                        console.error("Logout error:", error);
                        // Vẫn thực hiện logout locally ngay cả khi API fail
                        localStorage.removeItem("access_token");
                        localStorage.setItem(
                          "sessionId",
                          `session_${Date.now()}_${Math.random()
                            .toString(36)
                            .substr(2, 9)}`
                        );
                        setAuth({
                          isAuthenticated: false,
                          user: {
                            email: "",
                            name: "",
                            role: "",
                          },
                        });
                        notification.warning({
                          message: "Đăng xuất",
                          description:
                            "Đã đăng xuất nhưng có lỗi kết nối server",
                        });
                        navigate("/");
                      }
                    }}
                  >
                    Đăng xuất
                  </span>
                ),
                key: "logout",
              },
            ]
          : [
              {
                label: <Link to="/login">Đăng nhập</Link>,
                key: "login",
              },
            ]),
      ],
    },
  ];

  const [current, setCurrent] = useState("home");

  const onClick = (e) => {
    console.log("click: ", e);
    setCurrent(e.key);
  };

  return (
    <div style={{ position: "relative" }}>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
        style={{ paddingRight: "60px" }}
      />

      {/* Shopping Cart Icon - Fixed Position */}
      <div className="cart-icon-container">
        <Link
          to="/payment"
          style={{
            color: "inherit",
            textDecoration: "none",
            display: "inline-block",
            position: "relative",
          }}
          title={`Giỏ hàng (${cartCount} sản phẩm)`}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <ShoppingCartOutlined
              style={{
                fontSize: "24px",
                color: "#1890ff",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />

            {cartCount > 0 && (
              <span
                className={animateBadge ? "cart-badge-animate" : ""}
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  backgroundColor: "#ff4d4f",
                  color: "white",
                  borderRadius: "50%",
                  minWidth: displayCount.length > 2 ? "24px" : "20px",
                  height: displayCount.length > 2 ? "24px" : "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: displayCount.length > 2 ? "11px" : "12px",
                  fontWeight: "bold",
                  border: "2px solid white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease",
                  zIndex: 1,
                }}
              >
                {displayCount}
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Inline styles for animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .cart-badge-animate {
            animation: badgePulse 0.3s ease-in-out;
          }

          @keyframes badgePulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }

          .cart-icon-container {
            position: absolute;
            top: 50%;
            right: 16px;
            transform: translateY(-50%);
            z-index: 1000;
          }

          @media (max-width: 768px) {
            .cart-icon-container {
              right: 12px;
            }
            .ant-menu-horizontal {
              padding-right: 50px !important;
            }
          }

          @media (max-width: 480px) {
            .cart-icon-container {
              right: 8px;
            }
            .ant-menu-horizontal {
              padding-right: 45px !important;
            }
          }
        `,
        }}
      />
    </div>
  );
};

export default Header;
