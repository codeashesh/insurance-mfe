import React, { useState, useEffect, useRef } from "react";

const POLICIES_KEY = "insurance_policies";
const PAYMENTS_KEY = "insurance_payments";

export default function PaymentForm() {
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");
  const workerRef = useRef(null);

  useEffect(() => {
    // Load policies from localStorage
    const stored = JSON.parse(localStorage.getItem(POLICIES_KEY) || "[]");
    setPolicies(stored);

    // Initialize Web Worker
    const workerCode = `
      self.onmessage = function (event) {
        const { policyId, policyName, holderName, amount, paymentDate } = event.data;
        // Simulate processing delay
        const start = Date.now();
        while (Date.now() - start < 800) {}
        const taxRate = 0.18;
        const taxAmount = parseFloat((amount * taxRate).toFixed(2));
        const totalAmount = parseFloat((amount + taxAmount).toFixed(2));
        const dateStr = paymentDate.replace(/-/g, "");
        const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
        const receiptNo = "REC-" + dateStr + "-" + randomSuffix;
        const receipt = {
          receiptNo, policyId, policyName, holderName,
          baseAmount: amount, taxRate: (taxRate * 100).toFixed(0) + "%",
          taxAmount, totalAmount, paymentDate,
          generatedAt: new Date().toISOString(), status: "Success"
        };
        self.postMessage({ type: "RECEIPT_GENERATED", receipt: receipt });
      };
    `;
    const blob = new Blob([workerCode], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    workerRef.current = new Worker(workerUrl);

    workerRef.current.onmessage = (event) => {
      if (event.data.type === "RECEIPT_GENERATED") {
        const generatedReceipt = event.data.receipt;
        setReceipt(generatedReceipt);
        setProcessing(false);

        // Save payment to localStorage
        const payments = JSON.parse(
          localStorage.getItem(PAYMENTS_KEY) || "[]"
        );
        payments.push({
          id: `PAY-${String(payments.length + 1).padStart(3, "0")}`,
          policyId: generatedReceipt.policyId,
          amount: generatedReceipt.totalAmount,
          date: generatedReceipt.paymentDate,
          receiptNo: generatedReceipt.receiptNo,
        });
        localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));

        // Notify MFE 1 that payment is complete (cross-MFE communication)
        window.dispatchEvent(
          new CustomEvent("PAYMENT_COMPLETED", {
            detail: { policyId: generatedReceipt.policyId },
          })
        );
      }
    };

    // Listen for POLICY_SELECTED event from MFE 1 (cross-MFE communication)
    const handlePolicySelected = (event) => {
      const { policyId, policyName, holderName, premiumAmount } = event.detail;
      setSelectedPolicy({
        id: policyId,
        policyName,
        holderName,
        premiumAmount,
      });
      setReceipt(null);
      setError("");
    };

    window.addEventListener("POLICY_SELECTED", handlePolicySelected);

    return () => {
      window.removeEventListener("POLICY_SELECTED", handlePolicySelected);
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      URL.revokeObjectURL(workerUrl);
    };
  }, []);

  const handlePolicyChange = (e) => {
    const policyId = e.target.value;
    if (!policyId) {
      setSelectedPolicy(null);
      return;
    }
    const policy = policies.find((p) => p.id === policyId);
    if (policy) {
      setSelectedPolicy({
        id: policy.id,
        policyName: `${policy.type} Insurance`,
        holderName: policy.holderName,
        premiumAmount: policy.premiumAmount,
      });
    }
    setReceipt(null);
    setError("");
  };

  const validateForm = () => {
    if (!selectedPolicy) return "Please select a policy";
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16)
      return "Please enter a valid 16-digit card number";
    if (!cardName.trim()) return "Please enter the cardholder name";
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry))
      return "Please enter a valid expiry date (MM/YY)";
    if (!cvv || cvv.length < 3) return "Please enter a valid CVV";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setProcessing(true);
    setError("");
    setReceipt(null);

    // Send data to Web Worker for receipt generation
    workerRef.current.postMessage({
      policyId: selectedPolicy.id,
      policyName: selectedPolicy.policyName,
      holderName: selectedPolicy.holderName,
      amount: selectedPolicy.premiumAmount,
      paymentDate: new Date().toISOString().split("T")[0],
    });
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      return digits.slice(0, 2) + "/" + digits.slice(2);
    }
    return digits;
  };

  return (
    <div className="payment-form-container">
      <div className="payment-form-card">
        <h3 className="payment-form-card__title">Make a Payment</h3>

        {/* Policy Selection */}
        <div className="payment-form__group">
          <label className="payment-form__label">Select Policy</label>
          <select
            className="payment-form__select"
            value={selectedPolicy?.id || ""}
            onChange={handlePolicyChange}
          >
            <option value="">-- Choose a policy --</option>
            {policies.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} — {p.type} Insurance (${p.premiumAmount}/mo)
              </option>
            ))}
          </select>
        </div>

        {selectedPolicy && (
          <div className="payment-form__summary">
            <div className="payment-form__summary-row">
              <span>Policy:</span>
              <strong>{selectedPolicy.policyName}</strong>
            </div>
            <div className="payment-form__summary-row">
              <span>Holder:</span>
              <strong>{selectedPolicy.holderName}</strong>
            </div>
            <div className="payment-form__summary-row">
              <span>Premium:</span>
              <strong className="payment-form__amount">
                ${selectedPolicy.premiumAmount.toLocaleString()}
              </strong>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="payment-form__group">
            <label className="payment-form__label">Card Number</label>
            <input
              type="text"
              className="payment-form__input"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
            />
          </div>

          <div className="payment-form__group">
            <label className="payment-form__label">Cardholder Name</label>
            <input
              type="text"
              className="payment-form__input"
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
          </div>

          <div className="payment-form__row">
            <div className="payment-form__group">
              <label className="payment-form__label">Expiry</label>
              <input
                type="text"
                className="payment-form__input"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
              />
            </div>
            <div className="payment-form__group">
              <label className="payment-form__label">CVV</label>
              <input
                type="password"
                className="payment-form__input"
                placeholder="***"
                value={cvv}
                onChange={(e) =>
                  setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                maxLength={4}
              />
            </div>
          </div>

          {error && <div className="payment-form__error">{error}</div>}

          <button
            type="submit"
            className="payment-form__submit"
            disabled={processing}
          >
            {processing ? (
              <>
                <span className="payment-form__spinner"></span>
                Processing...
              </>
            ) : (
              `Pay $${selectedPolicy?.premiumAmount?.toLocaleString() || "0"}`
            )}
          </button>
        </form>

        {/* Receipt (generated by Web Worker) */}
        {receipt && (
          <div className="payment-receipt">
            <div className="payment-receipt__header">
              <span>✅</span>
              <h4>Payment Successful!</h4>
            </div>
            <div className="payment-receipt__body">
              <div className="payment-receipt__row">
                <span>Receipt No:</span>
                <strong>{receipt.receiptNo}</strong>
              </div>
              <div className="payment-receipt__row">
                <span>Policy:</span>
                <strong>{receipt.policyName}</strong>
              </div>
              <div className="payment-receipt__row">
                <span>Base Amount:</span>
                <strong>${receipt.baseAmount.toLocaleString()}</strong>
              </div>
              <div className="payment-receipt__row">
                <span>Tax ({receipt.taxRate}):</span>
                <strong>${receipt.taxAmount.toLocaleString()}</strong>
              </div>
              <div className="payment-receipt__row payment-receipt__row--total">
                <span>Total Paid:</span>
                <strong>${receipt.totalAmount.toLocaleString()}</strong>
              </div>
              <div className="payment-receipt__row">
                <span>Date:</span>
                <strong>{receipt.paymentDate}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
