"use client";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

type BillItem = {
    id: string;
    quantity: number;
    price: number;
    product: { name: string; category: string };
};

type Bill = {
    id: string;
    totalAmount: number;
    paymentMethod: string;
    createdAt: string;
    items: BillItem[];
};

export default function ReportsPage() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [expandedBill, setExpandedBill] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/bills?date=${date}`)
            .then((res) => res.json())
            .then((data) => {
                setBills(data);
                setLoading(false);
            });
    }, [date]);

    const totalRevenue = bills.reduce((acc: number, b: Bill) => acc + b.totalAmount, 0);

    const downloadPDF = (bill: Bill) => {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text("VAPOR POS", 105, 20, { align: "center" });
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Premium Cash Counter Interface", 105, 28, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Receipt ID: #${bill.id.slice(-8).toUpperCase()}`, 14, 45);
        doc.text(`Date: ${new Date(bill.createdAt).toLocaleDateString()} ${new Date(bill.createdAt).toLocaleTimeString()}`, 14, 52);
        doc.text(`Payment Protocol: ${bill.paymentMethod}`, 14, 59);

        // Calculate GST backward (Assuming 5% built-in for display)
        const subtotal = bill.totalAmount / 1.05;
        const tax = bill.totalAmount - subtotal;

        const tableColumn = ["Asset", "Qty", "Unit Price", "Total"];
        const tableRows = bill.items.map((item: BillItem) => [
            item.product.name,
            item.quantity.toString(),
            `Rs. ${item.price.toFixed(2)}`,
            `Rs. ${(item.quantity * item.price).toFixed(2)}`
        ]);

        (doc as any).autoTable({
            startY: 70,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
        });

        const finalY = (doc as any).lastAutoTable.finalY + 10;

        doc.setFontSize(10);
        doc.text(`Subtotal: Rs. ${subtotal.toFixed(2)}`, 140, finalY);
        doc.text(`Tax (5%): Rs. ${tax.toFixed(2)}`, 140, finalY + 7);

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Total Paid: Rs. ${bill.totalAmount.toFixed(2)}`, 140, finalY + 17);

        doc.save(`Receipt_${bill.id.slice(-8)}.pdf`);
    };

    return (
        <div className="min-h-screen lg:h-[90vh] flex flex-col relative z-10 w-full max-w-7xl mx-auto space-y-8 px-4 sm:px-0 pb-12">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-800 pb-6 glass-panel rounded-t-3xl p-6 lg:p-8 border-b-0 relative overflow-hidden gap-6">
                <div className="absolute top-0 right-0 w-[500px] h-3 bg-gradient-to-r from-transparent via-indigo-500 to-indigo-400 rotate-2 opacity-50 blur-[5px]" />
                <div>
                    <h1 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-indigo-400 drop-shadow-lg tracking-tight">Ledger Archives</h1>
                    <p className="text-slate-500 font-medium tracking-wide mt-2 text-sm lg:text-base">Historical transaction logs and itemized receipts.</p>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-center shadow-inner">Target Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                        className="w-full sm:w-auto bg-slate-900 border border-slate-700 p-3 rounded-xl text-slate-100 font-mono font-bold hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    />
                </div>
            </header>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div className="glass-panel p-6 rounded-3xl border border-sky-500/20 shadow-lg flex justify-between items-center group hover:border-sky-500/40 transition duration-300">
                    <div>
                        <span className="text-sky-400/80 font-bold uppercase tracking-widest text-sm block mb-1">Registers Filtered</span>
                        <span className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-sky-100 to-sky-400">{bills.length}</span>
                    </div>
                    <div className="h-14 lg:h-16 w-14 lg:w-16 bg-sky-500/10 rounded-full flex items-center justify-center border border-sky-500/20 group-hover:scale-110 group-hover:rotate-12 transition duration-500">
                        📄
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 shadow-lg flex justify-between items-center group hover:border-emerald-500/40 transition duration-300 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[30px]" />
                    <div className="relative z-10">
                        <span className="text-emerald-400/80 font-bold uppercase tracking-widest text-sm block mb-1">Gross Yield</span>
                        <span className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-100 to-emerald-400">₹{totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="h-14 lg:h-16 w-14 lg:w-16 rounded-full flex items-center justify-center text-2xl lg:text-3xl z-10 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] transition duration-500">
                        💎
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center glass-panel rounded-3xl">
                    <div className="text-sky-400 font-mono tracking-widest font-black animate-pulse flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-dashed border-sky-500/50 rounded-full animate-spin-slow"></div>
                        DECRYPTING LOGS...
                    </div>
                </div>
            ) : (
                <div className="glass-panel flex-1 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative border border-white/5">
                    {/* Header - Desktop only */}
                    <div className="hidden md:grid h-14 px-8 grid-cols-12 gap-4 bg-slate-900/90 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 items-center sticky top-0 z-20 backdrop-blur-xl">
                        <div className="col-span-3">Registry ID</div>
                        <div className="col-span-3">Timestamp</div>
                        <div className="col-span-2">Protocol</div>
                        <div className="col-span-2 font-mono text-right pr-4">Amount</div>
                        <div className="col-span-2 text-center">Status</div>
                    </div>

                    <div className="overflow-auto custom-scrollbar flex-1 p-4 space-y-4 md:space-y-2 relative">
                        {bills.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 font-mono text-sm opacity-50 px-4 text-center">
                                <span className="text-4xl mb-4">📭</span>
                                NO TRANSACTIONS LOCATED FOR {date}
                            </div>
                        ) : (
                            bills.map((bill: Bill) => (
                                <div key={bill.id} className="bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-md overflow-hidden transition-all hover:border-slate-700">
                                    <div
                                        onClick={() => setExpandedBill(expandedBill === bill.id ? null : bill.id)}
                                        className="p-4 md:p-5 flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center cursor-pointer group"
                                    >
                                        <div className="md:col-span-3 font-mono text-indigo-300 text-sm tracking-wide bg-indigo-500/10 md:bg-transparent px-2 py-0.5 md:p-0 rounded border border-indigo-500/20 md:border-none uppercase">#{bill.id.slice(-8).toUpperCase()}</div>

                                        <div className="md:col-span-3 flex md:block items-center justify-between w-full">
                                            <span className="md:hidden text-xs font-bold text-slate-500 uppercase">Timestamp</span>
                                            <div className="text-slate-300 font-medium font-mono text-sm md:text-base">
                                                {new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 flex md:block items-center justify-between w-full">
                                            <span className="md:hidden text-xs font-bold text-slate-500 uppercase">Method</span>
                                            <span className={`px-3 py-1 bg-slate-800 text-[10px] lg:text-xs font-bold rounded shadow-inner border border-slate-700
                                                ${bill.paymentMethod === 'UPI' ? 'text-sky-400' : bill.paymentMethod === 'CARD' ? 'text-purple-400' : 'text-emerald-400'}  
                                            `}>
                                                {bill.paymentMethod}
                                            </span>
                                        </div>

                                        <div className="md:col-span-2 flex md:block items-center justify-between w-full md:text-right md:pr-4">
                                            <span className="md:hidden text-xs font-bold text-slate-500 uppercase">Amount</span>
                                            <div className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 to-emerald-400 font-black text-xl lg:text-2xl font-mono">
                                                ₹{bill.totalAmount.toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 flex items-center justify-between w-full md:justify-center mt-2 md:mt-0 pt-2 md:pt-0 border-t border-slate-800 md:border-none">
                                            <span className="md:hidden text-xs font-bold text-indigo-400/60 uppercase">Tap for details</span>
                                            <button className={`w-8 h-8 rounded bg-slate-800 flex items-center justify-center transition ${expandedBill === bill.id ? 'rotate-180 bg-indigo-600/20 text-indigo-400' : ''}`}>▼</button>
                                        </div>
                                    </div>

                                    {/* Expanded Receipt View */}
                                    {expandedBill === bill.id && (
                                        <div className="bg-slate-950/80 p-6 border-t border-slate-800/80 animate-in slide-in-from-top-2 fade-in duration-200">
                                            <div className="flex justify-between items-center mb-4 border-b border-slate-900 pb-2">
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0">Itemized Receipt Overview</h4>
                                                <button
                                                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); downloadPDF(bill); }}
                                                    className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 rounded-lg text-xs font-bold transition flex items-center gap-2"
                                                >
                                                    <span className="text-base">📄</span> Download PDF
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {bill.items.map((item: BillItem) => (
                                                    <div key={item.id} className="flex justify-between items-end border-b border-slate-900 pb-2 border-dashed">
                                                        <div>
                                                            <div className="font-bold text-slate-200">{item.product.name}</div>
                                                            <div className="text-xs text-slate-500 font-mono tracking-wide mt-0.5">{item.quantity}  ×  ₹{item.price.toFixed(2)}</div>
                                                        </div>
                                                        <div className="font-mono text-slate-300 font-bold text-lg leading-none">
                                                            ₹{(item.quantity * item.price).toFixed(2)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
