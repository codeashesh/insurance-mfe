// receiptWorker.js — Web Worker for generating payment receipts
// This runs off the main thread to simulate heavy computation

self.onmessage = function (event) {
  const { policyId, policyName, holderName, amount, paymentDate } = event.data;

  // Simulate processing delay (mimicking complex computation)
  const start = Date.now();
  while (Date.now() - start < 500) {
    // Busy-wait to simulate heavy work
  }

  // Calculate tax and total
  const taxRate = 0.18; // 18% GST
  const taxAmount = parseFloat((amount * taxRate).toFixed(2));
  const totalAmount = parseFloat((amount + taxAmount).toFixed(2));

  // Generate receipt number
  const dateStr = paymentDate.replace(/-/g, "");
  const randomSuffix = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  const receiptNo = `REC-${dateStr}-${randomSuffix}`;

  // Build receipt object
  const receipt = {
    receiptNo,
    policyId,
    policyName,
    holderName,
    baseAmount: amount,
    taxRate: `${(taxRate * 100).toFixed(0)}%`,
    taxAmount,
    totalAmount,
    paymentDate,
    generatedAt: new Date().toISOString(),
    status: "Success",
  };

  // Send receipt back to main thread
  self.postMessage({ type: "RECEIPT_GENERATED", receipt });
};
