import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPaymentStatus } from "../services/api";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("Loading...");
  const bookingId = params.get("bookingId");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getPaymentStatus(bookingId);
        setStatus(`✅ Payment successful! Booking ID: ${bookingId}`);
        console.log("Payment status:", res);
      } catch (err) {
        setStatus("❌ Unable to confirm payment.");
        console.error(err);
      }
    };

    if (bookingId) fetchStatus();
    else setStatus("⚠️ Missing booking ID in URL");
  }, [bookingId]);

  return (
    <div style={{ textAlign: "center", marginTop: "10vh" }}>
      <h2>{status}</h2>
      <p>Thank you for your booking!</p>
    </div>
  );
};

export default PaymentSuccess;
