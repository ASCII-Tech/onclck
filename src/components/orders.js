"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fetchOrders } from '@/lib/api';
import { QRCodeScanner, QrCodeIcon } from "@/components/qr-scanner";
export function Overview2() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [privateCode, setPrivateCode] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const effectRan = useRef(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleScanComplete = ({ orderCode, privateCode }) => {
    setOrderId(orderCode);
    setPrivateCode(privateCode);
  };

  console.log(process.env.NODE_ENV);
  const handleConfirmTransaction = async () => {
    if (!privateCode || !orderId) return;

    try {
      const response = await fetch('/api/finishTransaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ privateCode, orderId }),
      });

      const data = await response.json();
      console.log(data.message);
      
      // Refresh the orders after confirming a transaction
      const fetchedOrders = await fetchOrders();
      setOrders(fetchedOrders);
      
      // Close the dialog and reset fields
      setIsDialogOpen(false);
      setPrivateCode("");
      setOrderId("");
    } catch (error) {
      console.error("Failed to confirm transaction:", error);
    }
  };

  const handlePrivateCodeChange = (e) => {
    setPrivateCode(e.target.value);
  };

  const handlePrivateCodeSubmit = async (e) => {
    e.preventDefault();
    if (!privateCode) return;

    try {
      const response = await fetch('/api/finishTransaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ privateCode }),
      });

      const data = await response.json();
      console.log(data.message);
      
      // Optionally, refresh the orders after confirming a transaction
      const fetchedOrders = await fetchOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to confirm transaction:", error);
    }

    // Clear the input field after submission
    setPrivateCode("");
  };

  useEffect(() => {
    if (effectRan.current === false) {
      console.log("Fetching orders");
      const loadOrders = async () => {
        try {
          const fetchedOrders = await fetchOrders();
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        }
      }
      loadOrders();

      return () => {
        effectRan.current = true;
      }
    }
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      Object.values(order).some((value) => 
        value !== null && value !== undefined && 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, orders]);

  const sortedOrders = useMemo(() => {
    if (!sortColumn) return filteredOrders;
    return [...filteredOrders].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];
      if (valueA == null) return 1;
      if (valueB == null) return -1;
      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredOrders, sortColumn, sortDirection]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="container mx-auto py-10 px-10">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
      <div className="flex-1">
          <h1 className="font-semibold text-lg">Recent Orders</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Confirm Order</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Order</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="orderId"
                  placeholder="Order Code"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="col-span-4"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="privateCode"
                  placeholder="Private Code"
                  value={privateCode}
                  onChange={(e) => setPrivateCode(e.target.value)}
                  className="col-span-4"
                />
              </div>
              <Button 
                  onClick={() => setShowScanner(true)}
                  variant="secondary"
                >
                  <QrCodeIcon className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleConfirmTransaction}>Confirm</Button>
            </div>
          </DialogContent>
        </Dialog>

        <QRCodeScanner 
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleScanComplete}
      />
        <div className="relative flex-1 md:grow-0">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <img
                src="/placeholder.svg"
                width="32"
                height="32"
                className="rounded-full"
                alt="Avatar"
                style={{ aspectRatio: "32/32", objectFit: "cover" }}
              />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="border shadow-sm rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {["order_id", "seller_id", "order_date", "total_amount", "currency", "order_status", "delivery_address", "payment_status", "delivery_date", "tracking_number", "quantity"].map((column) => (
                  <TableHead key={column} className="cursor-pointer" onClick={() => handleSort(column)}>
                    {column.charAt(0).toUpperCase() + column.slice(1).replace('_', ' ')}
                    {sortColumn === column && (
                      <span className="ml-1">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.map((order) => (
                <TableRow key={order.order_id}>
                  {Object.keys(order).map((key) => (
                    <TableCell key={key}>{order[key]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}

function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default Overview2;