// =============================================================
// AirBook Admin — Promotions Manager
// =============================================================

import { useState, useMemo, useEffect } from "react";
import type { Promo, UUID } from "../types";
import { clsx } from "../utils";
import { Header, EmptyRow, Pagination, Modal, AddButton } from "../components/Components";
import { useData } from "../contexts/DataContext";

export function PromosManager() {
  const {
    promos,
    promosLoading,
    promosError,
    createPromo,
    updatePromo,
    deletePromo
  } = useData();

  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Promo | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);

  // Enhanced filter states
  const [filterStatus, setFilterStatus] = useState<string>("all"); // active, inactive, expired
  const [filterDiscountType, setFilterDiscountType] = useState<string>("all"); // PERCENTAGE, FIXED
  const [filterDateRange, setFilterDateRange] = useState<string>("all"); // active, upcoming, expired
  const [filterHasCode, setFilterHasCode] = useState<string>("all"); // with-code, without-code

  const rows = useMemo(() => {
    const lower = q.toLowerCase();
    const now = new Date();

    return promos.filter(p => {
      // Basic search filter
      const matchesSearch = [p.title, p.code, p.description].some(x => x?.toLowerCase().includes(lower));

      // Status filter (active/inactive)
      const matchesStatus = filterStatus === "all" ||
        (filterStatus === "active" && p.isActive) ||
        (filterStatus === "inactive" && !p.isActive);

      // Discount type filter
      const matchesDiscountType = filterDiscountType === "all" || p.discountType === filterDiscountType;

      // Date range filter (active, upcoming, expired)
      let matchesDateRange = true;
      if (filterDateRange !== "all") {
        const startDate = new Date(p.startDate);
        const endDate = new Date(p.endDate);

        if (filterDateRange === "active") {
          matchesDateRange = now >= startDate && now <= endDate;
        } else if (filterDateRange === "upcoming") {
          matchesDateRange = now < startDate;
        } else if (filterDateRange === "expired") {
          matchesDateRange = now > endDate;
        }
      }

      // Has code filter
      const matchesHasCode = filterHasCode === "all" ||
        (filterHasCode === "with-code" && p.code) ||
        (filterHasCode === "without-code" && !p.code);

      return matchesSearch && matchesStatus && matchesDiscountType && matchesDateRange && matchesHasCode;
    });
  }, [q, promos, filterStatus, filterDiscountType, filterDateRange, filterHasCode]);

  const paged = useMemo(() => {
    const start = (page - 1) * size;
    return rows.slice(start, start + size);
  }, [rows, page, size]);

  const pages = Math.max(1, Math.ceil(rows.length / size));
  useEffect(() => { if (page > pages) setPage(1); }, [page, pages, setPage]);

  const handleSave = async (input: Partial<Promo>) => {
    console.log("🚀 handleSave promotion called with input:", input);

    if (!input.title || !input.startDate || !input.endDate) {
      console.log("❌ Validation failed - missing required fields");
      return alert("Judul dan Periode wajib diisi");
    }

    const discountValue = Number(input.discountValue ?? 0);
    if (discountValue <= 0) {
      console.log("❌ Validation failed - invalid discount value");
      return alert("Nilai diskon harus lebih dari 0");
    }

    // Validate date order
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    if (endDate <= startDate) {
      console.log("❌ Validation failed - end date must be after start date");
      return alert("Tanggal berakhir harus lebih dari tanggal mulai!");
    }

    // Validate promotion period (minimum 1 day)
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationDays = durationMs / (1000 * 60 * 60 * 24);

    if (durationDays < 1) {
      console.log("❌ Validation failed - minimum 1 day duration");
      return alert("Periode promo minimal 1 hari!");
    }

    // Use dates as-is from form (already properly formatted)
    const startDateFixed = input.startDate!;
    const endDateFixed = input.endDate!;

    console.log("🔧 Using datetime formats from form:", {
      startDate: startDateFixed,
      endDate: endDateFixed,
      startDateType: typeof startDateFixed,
      endDateType: typeof endDateFixed,
      startDateIncludes: startDateFixed?.includes?.('T'),
      endDateIncludes: endDateFixed?.includes?.('T')
    });

    try {
      if (editing && editing.id) {
        console.log("✏️ Updating existing promotion:", editing.id);
        // Only include fields that are in the schema and have valid values
        const updatePromoData: Partial<Promo> = {
          title: input.title!,
          discountType: input.discountType ?? "PERCENTAGE",
          discountValue,
          startDate: startDateFixed,
          endDate: endDateFixed,
          isActive: input.isActive !== undefined ? input.isActive : true,
        };

        // Add optional fields only if they have valid values
        if (input.description?.trim()) {
          updatePromoData.description = input.description.trim();
        }
        if (input.code?.trim()) {
          updatePromoData.code = input.code.toUpperCase();
        }
        if (input.minPurchase && input.minPurchase > 0) {
          updatePromoData.minPurchase = input.minPurchase;
        }
        if (input.maxDiscount && input.maxDiscount > 0) {
          updatePromoData.maxDiscount = input.maxDiscount;
        }
        if (input.usageLimit && input.usageLimit > 0) {
          updatePromoData.usageLimit = input.usageLimit;
        }
        if (input.destinationId?.trim()) {
          updatePromoData.destinationId = input.destinationId;
        }
        console.log("🔄 Updating promotion with data:", updatePromoData);
        console.log("🔍 isActive debug:", {
          inputIsActive: input.isActive,
          finalIsActive: updatePromoData.isActive,
          inputType: typeof input.isActive
        });
        console.log("🔍 JSON stringified update data:", JSON.stringify(updatePromoData, null, 2));

        // Debug the exact data being sent to API
        console.log("🚀 About to call updatePromo with ID:", editing.id);
        console.log("🚀 Update payload keys:", Object.keys(updatePromoData));
        console.log("🚀 Update payload values:", Object.values(updatePromoData));

        await updatePromo(editing.id, updatePromoData);
        setEditing(null);
      } else {
        const newPromoData = {
          title: input.title!,
          description: input.description?.trim(),
          code: input.code ? input.code.toUpperCase() : undefined,
          discountType: input.discountType ?? "PERCENTAGE",
          discountValue,
          minPurchase: input.minPurchase || undefined,
          maxDiscount: input.maxDiscount || undefined,
          startDate: startDateFixed,
          endDate: endDateFixed,
          usageLimit: input.usageLimit || undefined,
          isActive: input.isActive !== undefined ? input.isActive : true,
          destinationId: input.destinationId,
        };
        console.log("➕ Creating new promotion with data:", newPromoData);
        console.log("🔍 JSON stringified data:", JSON.stringify(newPromoData, null, 2));
        await createPromo(newPromoData);
        console.log("✅ Promotion created successfully");
        setEditing(null); // Close modal after successful creation
      }
    } catch (error) {
      console.error("❌ Error in handleSave promotion:", error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: UUID) => {
    try {
      await deletePromo(id);
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Show loading state
  if (promosLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error state
  if (promosError) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-red-600">Error Loading Promotions</h2>
        <p className="text-red-500">{promosError}</p>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <Header title="Promo" subtitle="Kelola kode promo dan periode berlakunya">
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Cari judul/kode/ketentuan..."
            className="input max-w-sm"
          />
          <AddButton onClick={() => setEditing({
            id: "",
            title: "",
            description: "",
            code: "",
            discountType: "PERCENTAGE",
            discountValue: 10,
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
            usageLimit: undefined,
            usedCount: 0,
            isActive: true,
            destinationId: undefined,
            createdAt: "",
            updatedAt: ""
          })}>
            Tambah Promo
          </AddButton>
        </div>
      </Header>

      {/* Advanced Filters */}
      <div className="card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">🔍 Filter Lanjutan</h3>
          <button
            onClick={() => {
              setFilterStatus("all");
              setFilterDiscountType("all");
              setFilterDateRange("all");
              setFilterHasCode("all");
            }}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Reset Filter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:border-slate-600"
            >
              <option value="all">Semua Status</option>
              <option value="active">✅ Aktif</option>
              <option value="inactive">❌ Tidak Aktif</option>
            </select>
          </div>

          {/* Discount Type Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tipe Diskon</label>
            <select
              value={filterDiscountType}
              onChange={(e) => setFilterDiscountType(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:border-slate-600"
            >
              <option value="all">Semua Tipe</option>
              <option value="PERCENTAGE">📊 Persentase</option>
              <option value="FIXED">💰 Nominal Tetap</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Periode</label>
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:border-slate-600"
            >
              <option value="all">Semua Periode</option>
              <option value="active">🟢 Sedang Berlangsung</option>
              <option value="upcoming">🔵 Akan Datang</option>
              <option value="expired">🔴 Berakhir</option>
            </select>
          </div>

          {/* Has Code Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Kode Promo</label>
            <select
              value={filterHasCode}
              onChange={(e) => setFilterHasCode(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:border-slate-600"
            >
              <option value="all">Semua</option>
              <option value="with-code">🏷️ Dengan Kode</option>
              <option value="without-code">📢 Tanpa Kode</option>
            </select>
          </div>
        </div>

        {/* Filter Results Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
          <span>
            Menampilkan {rows.length} dari {promos.length} promosi
          </span>
          {(filterStatus !== "all" || filterDiscountType !== "all" || filterDateRange !== "all" || filterHasCode !== "all") && (
            <span className="text-blue-600 font-medium">
              Filter aktif
            </span>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur dark:bg-slate-900/90">
              <tr className="border-b border-slate-200/30 dark:border-slate-700/30">
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Judul</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Kode</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Diskon</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Periode</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Status</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p, index) => (
                <tr
                  key={p.id}
                  className={clsx(
                    "group border-b border-slate-200/20 dark:border-slate-700/20 transition-all duration-200 hover:bg-white/40 dark:hover:bg-slate-800/40",
                    index % 2 === 0 ? "bg-white/20 dark:bg-slate-800/20" : "bg-transparent"
                  )}
                >
                  <td className="py-4 px-3">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{p.title}</div>
                    {p.description && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{p.description}</div>
                    )}
                  </td>
                  <td className="py-4 px-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 text-sm font-mono font-medium border border-amber-200/30 dark:border-amber-800/30">
                      {p.code}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {p.discountType === "PERCENTAGE" ? `${p.discountValue}%` : `Rp ${p.discountValue.toLocaleString()}`}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {p.discountType === "PERCENTAGE" ? "OFF" : "OFF"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium">{new Date(p.startDate).toLocaleDateString()}</span>
                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium">{new Date(p.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", p.isActive ? "badge-ok" : "badge-dim")}>
                      <span className={clsx("w-1.5 h-1.5 rounded-full", p.isActive ? "bg-emerald-500" : "bg-slate-400")} />
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditing(p)}
                        className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                        title="Edit promo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                        title="Delete promo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <EmptyRow colSpan={6} message="No promotions found. Create your first promotion to get started." />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} pages={pages} size={size} onPage={setPage} onSize={setSize} />

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit Promo" : "Tambah Promo"}>
          <div className="max-h-[85vh] overflow-y-auto">
            <PromoForm value={editing} onCancel={() => setEditing(null)} onSubmit={(v) => handleSave(v)} />
          </div>
        </Modal>
      )}
    </section>
  );
}

function PromoForm({ value, onSubmit, onCancel }: {
  value: Partial<Promo>;
  onSubmit: (v: Partial<Promo>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Promo>>({ ...value });

  // Update form when value changes (for editing existing promotions)
  useEffect(() => {
    const formattedValue = { ...value };

    // Convert ISO datetime to date format for form inputs
    if (formattedValue.startDate && formattedValue.startDate.includes('T')) {
      formattedValue.startDate = formattedValue.startDate.split('T')[0];
    }
    if (formattedValue.endDate && formattedValue.endDate.includes('T')) {
      formattedValue.endDate = formattedValue.endDate.split('T')[0];
    }

    console.log('🔄 Form useEffect - original value:', value);
    console.log('🔄 Form useEffect - formatted value:', formattedValue);

    setForm(formattedValue);
  }, [value]);

  // Date validation functions
  const isValidDateOrder = (startDate: string | undefined, endDate: string | undefined): boolean => {
    if (!startDate || !endDate) return true;
    return new Date(startDate) < new Date(endDate);
  };

  const isValidStartDate = (startDate: string | undefined): boolean => {
    if (!startDate) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(startDate) >= today;
  };

  // Convert date to ISO 8601 datetime format
  const fixDatetime = (dateStr: string | undefined, isEndDate: boolean = false): string => {
    if (!dateStr) return '';

    // If already in ISO format, return as is
    if (dateStr.includes('T')) {
      return dateStr;
    }

    // Convert date to datetime
    const timeStr = isEndDate ? '23:59:59.000' : '00:00:00.000';
    return `${dateStr}T${timeStr}Z`;
  };

  // Validation checks
  const dateOrderValid = isValidDateOrder(form.startDate, form.endDate);
  const startDateValid = isValidStartDate(form.startDate);
  const hasRequiredFields = !!(form.title && form.code && form.discountValue && form.startDate && form.endDate);
  const allValidationsPass = dateOrderValid && startDateValid && hasRequiredFields;

  return (
    <div className="w-full max-w-2xl mx-auto p-1">
      <form onSubmit={(e) => {
        e.preventDefault();
        console.log('PromoForm submission attempt:', {
          form,
          allValidationsPass,
          dateOrderValid,
          startDateValid,
          hasRequiredFields,
          formIsActive: form.isActive,
          formIsActiveType: typeof form.isActive
        });
        if (allValidationsPass) {
          // Convert dates to proper ISO 8601 datetime format before submission
          console.log('🔧 Date conversion debug:', {
            originalStartDate: form.startDate,
            originalEndDate: form.endDate,
            fixedStartDate: fixDatetime(form.startDate, false),
            fixedEndDate: fixDatetime(form.endDate, true)
          });

          const formattedForm = {
            ...form,
            startDate: fixDatetime(form.startDate, false),
            endDate: fixDatetime(form.endDate, true)
          };
          console.log('Submitting formatted promotion:', formattedForm);
          console.log('📋 Form data keys:', Object.keys(formattedForm));
          console.log('📋 Form isActive value:', formattedForm.isActive, typeof formattedForm.isActive);
          onSubmit(formattedForm);
        } else {
          console.warn('Form submission blocked due to validation errors');
        }
      }} className="space-y-6">
        {/* Header */}
        <div className="text-center pb-3 border-b border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
            {form.id ? "Edit Promosi" : "Tambah Promosi Baru"}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Buat kode promo menarik untuk meningkatkan penjualan tiket pesawat
          </p>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Judul Promosi <span className="text-red-500">*</span>
              </label>
              <input
                className={clsx(
                  "w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm",
                  !form.title && hasRequiredFields
                    ? "border-red-300 dark:border-red-600"
                    : "border-slate-300 dark:border-slate-600"
                )}
                value={form.title ?? ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Flash Sale Akhir Tahun"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Kode Promo <span className="text-red-500">*</span>
              </label>
              <input
                className={clsx(
                  "w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 font-mono text-center text-sm",
                  !form.code && hasRequiredFields
                    ? "border-red-300 dark:border-red-600"
                    : "border-slate-300 dark:border-slate-600"
                )}
                value={form.code ?? ""}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="FLASHSALE2024"
              />
            </div>
          </div>
        </div>

        {/* Discount & Period */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Diskon (%) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className={clsx(
                    "w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-center font-bold text-sm",
                    (!form.discountValue || form.discountValue <= 0) && hasRequiredFields
                      ? "border-red-300 dark:border-red-600"
                      : "border-slate-300 dark:border-slate-600"
                  )}
                  value={form.discountValue ?? 0}
                  onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                  placeholder="25"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">%</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={clsx(
                  "w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 transition-all duration-200 text-sm",
                  !startDateValid
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500"
                )}
                value={form.startDate ?? ""}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
              {!startDateValid && form.startDate && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Tanggal mulai tidak boleh di masa lalu
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Tanggal Berakhir <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={clsx(
                  "w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 transition-all duration-200 text-sm",
                  !dateOrderValid
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-slate-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500"
                )}
                value={form.endDate ?? ""}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
              {!dateOrderValid && form.startDate && form.endDate && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Tanggal berakhir harus setelah tanggal mulai
                </div>
              )}
            </div>
          </div>

          {/* Discount Preview */}
          <div className="flex justify-center">
            <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  {form.discountType === "PERCENTAGE" ? `${form.discountValue || 0}%` : `Rp ${(form.discountValue || 0).toLocaleString()}`} OFF
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Preview diskon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Warning */}
        {(!dateOrderValid || !startDateValid || !hasRequiredFields) && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                  {!hasRequiredFields ? "Lengkapi semua field yang wajib" : "Terdapat kesalahan pada tanggal"}
                </h4>
                <ul className="text-xs text-red-700 dark:text-red-400 space-y-1">
                  {!form.title && <li>• Judul promosi wajib diisi</li>}
                  {!form.code && <li>• Kode promo wajib diisi</li>}
                  {(!form.discountValue || form.discountValue <= 0) && <li>• Nilai diskon harus lebih dari 0</li>}
                  {!form.startDate && <li>• Tanggal mulai wajib diisi</li>}
                  {!form.endDate && <li>• Tanggal berakhir wajib diisi</li>}
                  {!startDateValid && form.startDate && <li>• Tanggal mulai tidak boleh di masa lalu</li>}
                  {!dateOrderValid && form.startDate && form.endDate && <li>• Tanggal berakhir harus setelah tanggal mulai</li>}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Terms & Status */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Deskripsi
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm h-20 resize-none"
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Contoh: Minimal pembelian Rp 500.000. Berlaku untuk rute domestik."
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="relative flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive ?? true}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="sr-only"
              />
              <div className={clsx(
                "w-11 h-6 rounded-full transition-all duration-200 relative",
                form.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
              )}>
                <div className={clsx(
                  "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-200",
                  form.isActive ? "transform translate-x-5" : ""
                )} />
              </div>
              <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                {form.isActive ? "Aktif" : "Nonaktif"}
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 transition-all duration-200 font-medium text-sm"
            onClick={onCancel}
          >
            Batal
          </button>
          <button
            className={clsx(
              "px-6 py-2 rounded-lg font-medium shadow-lg transition-all duration-200 flex items-center gap-2 text-sm",
              allValidationsPass
                ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-amber-500/25 hover:shadow-amber-500/40"
                : "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-slate-500/10"
            )}
            type="submit"
            disabled={!allValidationsPass}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {form.id ? "Update Promo" : "Simpan Promo"}
          </button>
        </div>
      </form>
    </div>
  );
}
