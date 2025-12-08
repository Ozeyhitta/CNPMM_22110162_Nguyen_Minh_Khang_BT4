import { Row, Col, Input, Button, notification } from "antd";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../util/axios.customize";

export default function VerifyOTP() {
  const [search] = useSearchParams();
  const email = search.get("email") ?? "";
  const navigate = useNavigate();

  const inputs = Array(6).fill(0);
  const refs = useRef([]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // COUNTDOWN 60s
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // AUTO FILL OTP KHI USER DÁN CẢ CHUỖI VÍ DỤ 123456
  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(text)) {
      const arr = text.split("");
      setOtp(arr);
      refs.current[5].focus();
      e.preventDefault();
    }
  };

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      refs.current[index + 1].focus();
    }
  };

  // VERIFY OTP
  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== 6)
      return notification.error({
        message: "OTP",
        description: "Vui lòng nhập đủ 6 số OTP",
      });

    try {
      setLoading(true);
      const res = await axios.post("/v1/api/check-otp", {
        email,
        otp: code,
      });

      notification.success({
        message: "Xác minh OTP",
        description: res.data?.EM || "Mã OTP hợp lệ",
      });

      navigate(`/reset-password?email=${email}&otp=${code}`);
    } catch (err) {
      notification.error({
        message: "Xác minh OTP",
        description:
          err?.response?.data?.EM || "Mã OTP không đúng hoặc đã hết hạn",
      });
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP
  const handleResend = async () => {
    try {
      const res = await axios.post("/v1/api/forgot-password", { email });

      notification.success({
        message: "Gửi lại OTP",
        description: res.data?.EM || "Mã OTP mới đã được gửi đến email của bạn",
      });

      setCountdown(60); // reset countdown
      setOtp(["", "", "", "", "", ""]);
      refs.current[0].focus();
    } catch (err) {
      notification.error({
        message: "OTP",
        description: "Không thể gửi lại OTP",
      });
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 30 }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset style={{ padding: 15, border: "1px solid #ccc" }}>
          <legend>Xác minh OTP</legend>

          <p>
            Mã OTP đã gửi tới: <b>{email}</b>
          </p>

          {/* --- OTP input --- */}
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              marginBottom: 15,
            }}
            onPaste={handlePaste}
          >
            {inputs.map((_, idx) => (
              <Input
                key={idx}
                maxLength={1}
                value={otp[idx]}
                onChange={(e) => handleChange(e.target.value, idx)}
                ref={(el) => (refs.current[idx] = el)}
                style={{
                  width: 45,
                  height: 45,
                  textAlign: "center",
                  fontSize: 22,
                }}
              />
            ))}
          </div>

          {/* Button xác nhận */}
          <Button
            type="primary"
            onClick={handleVerify}
            loading={loading}
            disabled={otp.join("").length !== 6}
            block
          >
            Xác nhận
          </Button>

          {/* RESEND + COUNTDOWN */}
          <div style={{ marginTop: 15, textAlign: "center" }}>
            {countdown > 0 ? (
              <span>
                Gửi lại mã sau <b>{countdown}s</b>
              </span>
            ) : (
              <Button type="link" onClick={handleResend}>
                Gửi lại mã OTP
              </Button>
            )}
          </div>
        </fieldset>
      </Col>
    </Row>
  );
}
