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
      setAppLoading(true);

      try {
        // Kiểm tra xem đã có token chưa
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.log(">>> App.jsx - No token found");
          setAppLoading(false);
          return;
        }

        console.log(">>> App.jsx - Token found, fetching account info");
        const res = await axios.get(`/v1/api/user`);
        console.log(">>> App.jsx - fetchAccount response:", res);

        // Backend trả về format: { EC: 0, EM: "...", data: { email, name, role } }
        if (res && res.EC === 0 && res.data) {
          const userData = res.data;

          // Chỉ update nếu có dữ liệu hợp lệ
          if (userData && userData.email && userData.role) {
            console.log(">>> App.jsx - Setting authenticated user:", userData);
            setAuth({
              isAuthenticated: true,
              user: {
                email: userData.email,
                name: userData.name || "",
                role: userData.role,
              },
            });
          } else {
            console.warn(">>> App.jsx - Invalid user data:", userData);
            // Xóa token nếu data không hợp lệ
            localStorage.removeItem("access_token");
            setAuth({
              isAuthenticated: false,
              user: { email: "", name: "", role: "" },
            });
          }
        } else {
          console.warn(">>> App.jsx - Invalid API response:", res);
          // Xóa token nếu response không hợp lệ
          localStorage.removeItem("access_token");
          setAuth({
            isAuthenticated: false,
            user: { email: "", name: "", role: "" },
          });
        }
      } catch (error) {
        console.error(">>> App.jsx - Fetch account error:", error);
        console.error(">>> Error details:", error?.response?.data || error?.message);

        // Nếu lỗi 401 (Unauthorized) hoặc token expired, xóa token
        if (error?.response?.status === 401 || error?.EC === 1) {
          console.log(">>> App.jsx - Token invalid/expired, removing token");
          localStorage.removeItem("access_token");
        }

        // Luôn set auth = false khi có lỗi
        setAuth({
          isAuthenticated: false,
          user: { email: "", name: "", role: "" },
        });
      } finally {
        setAppLoading(false);
      }
    };

    fetchAccount();
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
