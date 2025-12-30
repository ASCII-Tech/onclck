"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ArrowUpDown,
  MoreHorizontal,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Package
} from "lucide-react";
import { QRCodeScanner, QrCodeIcon } from "@/components/qr-scanner";

// --- Types ---
interface Order {
  order_id: number;
  tracking_number: string;
  total_amount: number;
  currency: string;
  order_status: "pending" | "confirmed" | "cancelled";
  order_date: string;
  quantity: number;
  private_code?: string;
}

// --- API Fetcher ---
const fetchOrders = async ({
  pageIndex,
  pageSize,
  searchTerm,
}: {
  pageIndex: number;
  pageSize: number;
  searchTerm: string;
}) => {
  const params = new URLSearchParams({
    page: (pageIndex + 1).toString(),
    limit: pageSize.toString(),
    search: searchTerm,
  });

  const res = await fetch(`/api/orders?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

export default function OrdersPage() {
  const queryClient = useQueryClient();

  // --- State ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog & Scanner State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [confirmForm, setConfirmForm] = useState({ orderId: "", privateCode: "" });

  // --- Queries ---
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", pagination, searchTerm],
    queryFn: () => fetchOrders({ ...pagination, searchTerm }),
    placeholderData: keepPreviousData,
  });

  const orders = data?.data || [];
  const pageCount = data?.pagination?.totalPages || 1;
  const totalOrders = data?.pagination?.total || 0;

  // --- Mutation (Confirm Transaction) ---
  const confirmMutation = useMutation({
    mutationFn: async (payload: { orderId: string; privateCode: string }) => {
      const res = await fetch("/api/finish-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to confirm");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setIsDialogOpen(false);
      setConfirmForm({ orderId: "", privateCode: "" });
      alert("Transaction Confirmed Successfully!");
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  // --- Handlers ---
  const handleScanComplete = ({ orderCode, privateCode }: { orderCode: string; privateCode: string }) => {
    setConfirmForm({ orderId: orderCode, privateCode });
    setShowScanner(false);
  };

  const handleConfirmSubmit = () => {
    if (!confirmForm.orderId || !confirmForm.privateCode) return;
    confirmMutation.mutate(confirmForm);
  };

  // --- Columns ---
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "tracking_number",
      header: "Order Code",
      cell: ({ row }) => <span className="font-mono font-medium">{row.getValue("tracking_number")}</span>,
    },
    {
      accessorKey: "order_date",
      header: "Date",
      cell: ({ row }) => new Date(row.getValue("order_date")).toLocaleDateString(),
    },
    {
      accessorKey: "total_amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.currency} {Number(row.getValue("total_amount")).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Qty",
      cell: ({ row }) => row.getValue("quantity"),
    },
    {
      accessorKey: "order_status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("order_status") as string;
        return (
          <Badge
            variant={status === "confirmed" ? "default" : status === "cancelled" ? "destructive" : "secondary"}
            className={status === "confirmed" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => {
              setConfirmForm({ orderId: row.original.tracking_number, privateCode: "" });
              setIsDialogOpen(true);
            }}>
              Manually Confirm
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">

      {/* --- Header & Actions --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recent Orders</h1>
          <p className="text-muted-foreground">Manage and confirm customer transactions.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Verify Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Transaction</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Order Code (e.g. 123456)"
                  value={confirmForm.orderId}
                  onChange={(e) => setConfirmForm(prev => ({ ...prev, orderId: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Private Code"
                  value={confirmForm.privateCode}
                  onChange={(e) => setConfirmForm(prev => ({ ...prev, privateCode: e.target.value }))}
                  className="flex-1"
                />
                <Button
                  onClick={() => setShowScanner(true)}
                  variant="outline"
                  size="icon"
                  title="Scan QR"
                >
                  <QrCodeIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleConfirmSubmit}
                disabled={confirmMutation.isPending || !confirmForm.orderId || !confirmForm.privateCode}
              >
                {confirmMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <QRCodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleScanComplete}
      />

      {/* --- Search --- */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by Order Code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* --- Table --- */}
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" /> Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Pagination --- */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Total {totalOrders} orders
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <div className="text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
