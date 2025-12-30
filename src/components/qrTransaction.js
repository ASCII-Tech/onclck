"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function QRTransactionContent() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const orderCode = searchParams.get("orderCode");
    const privateCode = searchParams.get("privateCode");

    if (orderCode && privateCode) {
      finishTransaction(orderCode, privateCode);
    }
  }, [searchParams]);

  const finishTransaction = async (orderCode, privateCode) => {
    try {
      const response = await fetch("/api/finish-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          privateCode: privateCode,
          orderId: orderCode,
        }),
      });

      const data = await response.json();
      console.log(data.message);
      setMessage(data.message);
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while processing the transaction.");
    }
  };

  return (
    <div>
      <h1>QR Transaction</h1>
      {message && <p>{message}</p>}
    </div>
  );
}

export default function QRTransaction() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QRTransactionContent />
    </Suspense>
  );
}
