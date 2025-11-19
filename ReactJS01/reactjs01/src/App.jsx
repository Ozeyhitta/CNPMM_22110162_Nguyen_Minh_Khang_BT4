import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.customize";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";
import { Spin } from "antd";

function App() {
  const { auth, setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      // Kiểm tra xem đã có token chưa
      const token = localStorage.getItem("access_token");
      if (!token) {
        setAppLoading(false);
        return;
      }

      // Nếu đã có auth data hợp lệ, không cần fetch lại
      const currentAuth = auth;
      if (
        currentAuth.isAuthenticated &&
        currentAuth.user?.email &&
        currentAuth.user?.role
      ) {
        setAppLoading(false);
        return;
      }

      setAppLoading(true);
      try {
        const res = await axios.get(`/v1/api/user`);
        console.log(">>> App.jsx - fetchAccount response:", res);

        // Backend trả về format: { EC: 0, EM: "...", data: { email, name, role } }
        if (res && res.EC === 0 && res.data) {
          // Kiểm tra xem data là object hay array
          let userData = res.data;

          // Nếu data là array (có thể do lỗi route), lấy phần tử đầu tiên
          if (Array.isArray(userData)) {
            console.warn(
              ">>> App.jsx - Response data là array, lấy phần tử đầu tiên"
            );
            userData = userData[0] || {};
          }

          // Chỉ update nếu có dữ liệu hợp lệ (object với email và role)
          if (
            userData &&
            typeof userData === "object" &&
            userData.email &&
            userData.role
          ) {
            setAuth({
              isAuthenticated: true,
              user: {
                email: userData.email,
                name: userData.name || "",
                role: userData.role,
              },
            });
          } else {
            console.warn(">>> App.jsx - Response data không đầy đủ:", userData);
          }
        } else {
          // Nếu không có token hoặc token hết hạn, xóa token
          console.warn(">>> App.jsx - Invalid response:", res);
          localStorage.removeItem("access_token");
          setAuth({
            isAuthenticated: false,
            user: {
              email: "",
              name: "",
              role: "",
            },
          });
        }
      } catch (error) {
        console.error("Fetch account error:", error);
        // Nếu lỗi 401, xóa token
        if (error?.response?.status === 401 || error?.EC === 1) {
          localStorage.removeItem("access_token");
        }
        // Chỉ set auth = false nếu chưa có auth data
        const currentAuth = auth;
        if (!currentAuth.isAuthenticated) {
          setAuth({
            isAuthenticated: false,
            user: {
              email: "",
              name: "",
              role: "",
            },
          });
        }
      } finally {
        setAppLoading(false);
      }
    };

    fetchAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy một lần khi mount

  return (
    <div>
      {appLoading ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          <Header />
          <Outlet />
        </>
      )}
    </div>
  );
}

export default App;
