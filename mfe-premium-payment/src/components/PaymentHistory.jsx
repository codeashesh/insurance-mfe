import React, { useState, useEffect } from "react";

const PAYMENTS_KEY = "insurance_payments";
const POLICIES_KEY = "insurance_policies";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    loadData();

    // Refresh when a new payment completes
    const handlePaymentCompleted = () => {
      loadData();
    };

    window.addEventListener("PAYMENT_COMPLETED", handlePaymentCompleted);
    return () => {
      window.removeEventListener("PAYMENT_COMPLETED", handlePaymentCompleted);
    };
  }, []);

  const loadData = () => {
    const storedPayments = JSON.parse(
      localStorage.getItem(PAYMENTS_KEY) || "[]"
    );
    const storedPolicies = JSON.parse(
      localStorage.getItem(POLICIES_KEY) || "[]"
    );
    setPayments(storedPayments.reverse());
    setPolicies(storedPolicies);
  };

  const getPolicyType = (policyId) => {
    const policy = policies.find((p) => p.id === policyId);
    return policy ? `${policy.type} Insurance` : policyId;
  };

  if (payments.length === 0) {
    return (
      <div className="payment-history">
        <h3 className="payment-history__title">Payment History</h3>
        <div className="payment-history__empty">
          <p>No payments recorded yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-history">
      <h3 className="payment-history__title">Payment History</h3>
      <div className="payment-history__list">
        {payments.map((payment) => (
          <div key={payment.id} className="payment-history__item">
            <div className="payment-history__icon">💰</div>
            <div className="payment-history__details">
              <span className="payment-history__policy">
                {getPolicyType(payment.policyId)}
              </span>
              <span className="payment-history__date">{payment.date}</span>
              <span className="payment-history__receipt">
                {payment.receiptNo}
              </span>
            </div>
            <div className="payment-history__amount">
              ${payment.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
