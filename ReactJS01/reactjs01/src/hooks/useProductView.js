import { useEffect, useContext } from "react";
import { AuthContext } from "../components/context/auth.context";
import { trackProductViewApi } from "../util/api";

const useProductView = (productId) => {
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (!productId) return;

    let timeoutId;

    const trackView = async () => {
      try {
        // Always generate/get session ID for tracking continuity
        let sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          localStorage.setItem("sessionId", sessionId);
        }

        // Track view after a short delay to avoid spam
        timeoutId = setTimeout(async () => {
          try {
            const res = await trackProductViewApi(null, productId, sessionId);

            // Nếu server trả về sessionId mới (cho anonymous user), lưu lại
            if (res && res.sessionId && !auth?.isAuthenticated) {
              localStorage.setItem("sessionId", res.sessionId);
              console.log(">>> Updated sessionId from server:", res.sessionId);
            }
          } catch (error) {
            console.error("Error tracking product view:", error);
          }
        }, 2000); // 2 second delay
      } catch (error) {
        console.error("Error in track view setup:", error);
      }
    };

    trackView();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [productId, auth?.isAuthenticated]);
};

export default useProductView;
