"use client";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function Dashboard() {
    const [reportType, setReportType] = useState("daily");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/reports?range=${reportType}`)
            .then((res) => res.json())
            .then((d) => {
                setData(d.summary);
                setLoading(false);
            });
    }, [reportType]);

    const downloadAnalytics = () => {
        if (!data) return;

        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text("SATHAM HUSSAIN-AEROSYNC POS", 105, 20, { align: "center" });
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("Analytics Executive Summary", 105, 28, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Timeframe Segment: ${reportType.toUpperCase()}`, 14, 45);
        doc.text(`Generated At: ${new Date().toLocaleString()}`, 14, 52);

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Key Performance Indicators (KPIs)", 14, 70);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");

        doc.text("Total Revenue:", 14, 85);
        doc.setFont("helvetica", "bold");
        doc.text(`Rs. ${data?.totalSales?.toFixed(2) || "0.00"}`, 70, 85);

        doc.setFont("helvetica", "normal");
        doc.text("Valid Transactions (Bills):", 14, 95);
        doc.setFont("helvetica", "bold");
        doc.text(`${data?.totalBills || 0}`, 70, 95);

        doc.setFont("helvetica", "normal");
        doc.text("Vertex Asset (Top Seller):", 14, 105);
        doc.setFont("helvetica", "bold");
        doc.text(`${data?.topItem?.name || "N/A"} (${data?.topItem?.quantitySold || 0} units)`, 70, 105);

        doc.save(`SATHAM HUSSAIN-AeroSync_Analytics_${reportType}_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="h-[90vh] flex flex-col relative z-10 w-full max-w-6xl mx-auto space-y-10">
            <header className="flex justify-between items-end border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-indigo-400 drop-shadow-lg tracking-tight">Intelligence Node</h1>
                    <p className="text-slate-500 font-medium tracking-wide mt-2">Realtime financial ledger & analytics.</p>
                </div>
                <button
                    onClick={downloadAnalytics}
                    disabled={loading || !data}
                    className="px-6 py-3 rounded-xl font-bold tracking-wide transition-all border bg-indigo-600/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-600 hover:text-white disabled:opacity-50 flex items-center gap-2"
                >
                    <span className="text-lg">📄</span> Download Report
                </button>
            </header>

            {/* Tabs */}
            <div className="flex gap-4 p-2 bg-slate-900/40 w-fit rounded-2xl backdrop-blur-xl border border-slate-800/60 shadow-inner">
                {["daily", "weekly", "monthly", "yearly"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setReportType(type)}
                        className={`px-8 py-3 rounded-xl font-bold tracking-wide uppercase text-sm transition-all duration-300 relative overflow-hidden
              ${reportType === type
                                ? "bg-indigo-600/20 py-3 px-8 shadow-[0_0_20px_rgba(79,70,229,0.2)] text-indigo-300 border border-indigo-500/30"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            }`}
                    >
                        {reportType === type && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none" />}
                        {type}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(99,102,241,0.5)]"></div>
                    <p className="text-indigo-400 animate-pulse font-mono tracking-widest text-lg">AGGREGATING METRICS...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group border border-emerald-500/20 hover:border-emerald-500/50 transition duration-500">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[40px] group-hover:bg-emerald-500/20 transition duration-500" />
                        <div className="flex flex-col relative z-10 space-y-2">
                            <span className="text-emerald-400/80 font-bold uppercase tracking-widest text-sm flex items-center gap-2">Total Revenue <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span></span>
                            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-100 to-emerald-400 drop-shadow-md py-2">
                                ₹{data?.totalSales?.toFixed(2) || "0.00"}
                            </span>
                        </div>
                        <div className="mt-8 pt-6 border-t border-emerald-500/10">
                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-3/4 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group border border-sky-500/20 hover:border-sky-500/50 transition duration-500">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-sky-500/10 blur-[40px] group-hover:bg-sky-500/20 transition duration-500" />
                        <div className="flex flex-col relative z-10 space-y-2">
                            <span className="text-sky-400/80 font-bold uppercase tracking-widest text-sm">Valid Transactions</span>
                            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-sky-100 to-sky-400 drop-shadow-md py-2">
                                {data?.totalBills || 0}
                            </span>
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group border border-purple-500/20 hover:border-purple-500/50 transition duration-500">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />
                        <div className="flex flex-col relative z-10 space-y-2 h-full justify-between">
                            <span className="text-purple-400/80 font-bold uppercase tracking-widest text-sm">Vertex Asset (Top Seller)</span>
                            <div>
                                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-100 to-purple-400 drop-shadow-md py-1 capitalize block truncate">
                                    {data?.topItem?.name || "N/A"}
                                </span>
                                {data?.topItem && (
                                    <span className="inline-block mt-3 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold rounded shadow-inner text-sm tracking-wide">
                                        {data.topItem.quantitySold} units registered
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
