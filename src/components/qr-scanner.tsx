"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function QrCodeIcon(props: any) {
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

interface QRCodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: { orderCode: string; privateCode: string }) => void;
}

export function QRCodeScanner({ isOpen, onClose, onScan }: QRCodeScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  // We use a key to force re-mounting of the div when dialog opens/closes
  // This ensures html5-qrcode finds the DOM element freshly every time
  const [mountKey, setMountKey] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setMountKey((prev) => prev + 1);
    } else {
      // Cleanup if closed externally
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Failed to clear html5-qrcode scanner. ", error);
        });
        scannerRef.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && mountKey > 0) {
      // Small timeout to ensure the Dialog DOM is ready
      const timeoutId = setTimeout(() => {
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          showTorchButtonIfSupported: true,
        };

        const scanner = new Html5QrcodeScanner("reader", config, false);
        scannerRef.current = scanner;

        const onScanSuccess = (decodedText: string) => {
          try {
            // Check if it's a URL with parameters
            const url = new URL(decodedText);
            const orderCode = url.searchParams.get("orderCode");
            const privateCode = url.searchParams.get("privateCode");

            if (orderCode && privateCode) {
              // Stop scanning and cleanup
              scanner.clear().then(() => {
                onScan({ orderCode, privateCode });
                onClose();
              }).catch(err => console.error(err));
            } else {
              console.warn("QR code missing required parameters");
            }
          } catch (e) {
            // Handle raw JSON or text if needed
            console.warn("Scanned text is not a valid URL", decodedText);
          }
        };

        const onScanFailure = (error: any) => {
          // This fires frequently when no QR is detected, usually safe to ignore logs
          // console.warn(`Code scan error = ${error}`);
        };

        scanner.render(onScanSuccess, onScanFailure);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        if (scannerRef.current) {
          scannerRef.current.clear().catch((error) => {
            // Suppress errors during unmount cleanup
            console.log("Scanner cleanup", error);
          });
          scannerRef.current = null;
        }
      };
    }
  }, [isOpen, mountKey, onClose, onScan]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-4">
          <div
            id="reader"
            key={mountKey}
            className="w-full overflow-hidden rounded-lg border border-border"
          />
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Point your camera at the Order Invoice QR Code
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
