'use client';
import { Check } from "lucide-react"
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function QRTransactionContent() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const orderCode = searchParams.get('orderCode');
    const privateCode = searchParams.get('privateCode');

    if (orderCode && privateCode) {
      finishTransaction(orderCode, privateCode);
    }
  }, [searchParams]);

  const finishTransaction = async (orderCode, privateCode) => {
    try {
      const response = await fetch('/api/finishTransaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          privateCode: privateCode,
          orderId: orderCode
        }),
      });
      
      const data = await response.json();
      console.log(data.message);
      setMessage(data.message);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while processing the transaction.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-12 w-12 text-green-600" strokeWidth={3} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
            Transaction Completed
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 sm:text-base">
            Your transaction has been processed successfully.
          </p>
        </div>
      </div>
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
