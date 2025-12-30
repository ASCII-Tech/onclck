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
// Make sure to import addProduct here
import { editProduct, deleteProduct, addProduct } from "@/lib/api";
import { EditProductPopupComponent } from "@/components/edit-product-popup";
import { AddProductModal, NewProduct } from "@/components/add-product-modal"; // Import New Modal
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  Edit2,
  Trash2,
  Copy,
  PackageX,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- Types ---
interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  category: number;
}

interface ApiResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const getProducts = async ({
  pageIndex,
  pageSize,
  sorting,
}: {
  pageIndex: number;
  pageSize: number;
  sorting: SortingState;
}): Promise<ApiResponse> => {
  const page = pageIndex + 1;
  const sortField = sorting[0]?.id || "name";
  const sortOrder = sorting[0]?.desc ? "desc" : "asc";

  const res = await fetch(
    `/api/products?page=${page}&limit=${pageSize}&sort=${sortField}&order=${sortOrder}`
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function Products() {
  const queryClient = useQueryClient();

  // --- Table State ---
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // --- UI State ---
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // --- TanStack Query ---
  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ["products", pagination, sorting],
    queryFn: () => getProducts({ ...pagination, sorting }),
    placeholderData: keepPreviousData,
  });

  const products = data?.data || [];
  const pageCount = data?.pagination.totalPages || -1;
  const totalRows = data?.pagination.total || 0;

  // --- Mutations ---

  // 1. Add Product Mutation
  const addMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowAddProductModal(false); // Close modal on success
      alert("Product added successfully!");
    },
    onError: (error) => {
      alert(`Error adding product: ${error.message}`);
    }
  });

  const editMutation = useMutation({
    mutationFn: editProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingProduct(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // --- Handlers ---
  const handleAddProduct = async (newProduct: NewProduct) => {
    // Return the promise so the modal can handle the loading state
    return addMutation.mutateAsync(newProduct);
  };

  const handleEdit = (product: Product) => setEditingProduct(product);

  const handleSaveEdit = (updatedProduct: Product) => {
    editMutation.mutate(updatedProduct);
  };

  const handleDelete = (product: Product) => {
    if (window.confirm("Are you sure?")) {
      deleteMutation.mutate(product.product_id);
    }
  };

  const handleCopy = (product: Product) => {
    const url = `${window.location.origin}/products/${product.product_id}`;
    navigator.clipboard.writeText(url);
    alert("Copied!");
  };

  // --- Column Definitions ---
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 hover:bg-transparent"
        >
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.getValue("description")}>
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 hover:bg-transparent"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>ETB {row.getValue("price")}</div>,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 hover:bg-transparent"
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${stock > 10
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-destructive/10 text-destructive"
              }`}
          >
            {stock}
          </span>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-md border border-transparent bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
          {row.getValue("category")}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
              <Edit2 className="h-4 w-4 text-blue-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleCopy(product)}>
              <Copy className="h-4 w-4 text-orange-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(product)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: pageCount,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  const displayProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in zoom-in-95 duration-300">

      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your store inventory ({totalRows} items)
          </p>
        </div>
        <Button
          onClick={() => setShowAddProductModal(true)}
          className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* --- Controls --- */}
      <div className="relative max-w-md w-full group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Filter current page..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-card border-input focus:ring-2 focus:ring-ring transition-all shadow-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-center text-destructive">Failed to load products.</div>
      ) : (
        <>
          {/* --- Mobile View (Cards) --- */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {displayProducts.map((product) => (
              <div
                key={product.product_id}
                className="bg-card text-card-foreground border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-secondary-foreground/10">
                      {product.category}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(product)}>
                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopy(product)}>
                        <Copy className="mr-2 h-4 w-4" /> Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-medium">ETB {product.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className={`font-medium ${product.stock < 10 ? 'text-destructive' : 'text-green-600'}`}>{product.stock}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- Desktop View (Shadcn Table) --- */}
          <div className="hidden md:block rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <PackageX className="h-8 w-8 opacity-50" />
                        No results.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* --- Pagination Controls --- */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Page {pagination.pageIndex + 1} of {pageCount}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isPlaceholderData}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isPlaceholderData}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </>
      )}

      {/* --- Edit Modal --- */}
      {editingProduct && (
        <EditProductPopupComponent
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* --- Add Product Modal --- */}
      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onSave={handleAddProduct}
      />
    </div>
  );
}
