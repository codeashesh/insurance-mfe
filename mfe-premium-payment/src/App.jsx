import React from "react";
import PaymentForm from "./components/PaymentForm";
import PaymentHistory from "./components/PaymentHistory";
import "./styles/PremiumPayment.scss";

export default function App() {
  return (
    <div className="premium-payment">
      <h2 className="premium-payment__title">Premium Payment</h2>
      <div className="premium-payment__layout">
        <PaymentForm />
        <PaymentHistory />
      </div>
    </div>
  );
}
