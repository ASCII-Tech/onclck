// components/QRCodeScanner.jsx
"use client";

import { useState, useEffect } from "react";
import QrScanner from 'react-qr-scanner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function QrCodeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </svg>
  );
}

export function QRCodeScanner({ isOpen, onClose, onScan }) {
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      checkCameraPermission();
    }
  }, [isOpen]);

  const checkCameraPermission = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setError(null);
    } catch (err) {
      console.error('Camera permission error:', err);
      setHasPermission(false);
      setError('Please allow camera access to scan QR codes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError(err.message || 'Failed to access camera');
  };

  const handleScan = async (data) => {
    if (data) {
      try {
        const url = new URL(data.text);
        const orderCode = url.searchParams.get('orderCode');
        const privateCode = url.searchParams.get('privateCode');

        if (orderCode && privateCode) {
          onScan({ orderCode, privateCode });
          onClose();
        } else {
          setError('Invalid QR code format');
        }
      } catch (err) {
        setError('Invalid QR code URL');
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const requestCameraPermission = async () => {
    await checkCameraPermission();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>
        <div className="relative">
          {isLoading ? (
            <div className="text-center py-4">Loading camera...</div>
          ) : hasPermission ? (
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              constraints={{
                video: {
                  facingMode: facingMode,
                  width: { ideal: 1280 },
                  height: { ideal: 720 }
                }
              }}
              style={{ width: '100%' }}
            />
          ) : (
            <div className="text-center py-4">
              <p className="mb-4">Camera access is required to scan QR codes</p>
              <Button onClick={requestCameraPermission}>
                Enable Camera
              </Button>
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-sm mt-2 text-center">
              {error}
            </div>
          )}
          
          {hasPermission && (
            <div className="flex justify-between mt-4 gap-2">
              <Button 
                onClick={toggleCamera}
                variant="secondary"
                className="flex-1"
              >
                Switch Camera
              </Button>
              <Button 
                onClick={onClose}
                variant="destructive"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { QrCodeIcon };