"use client";
import { useEffect, useState } from "react";

type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    isAvailable: boolean;
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: "", category: "SNACKS", price: "" });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editPrice, setEditPrice] = useState<string>("");

    const fetchProducts = () => {
        setLoading(true);
        fetch(`/api/products?t=${new Date().getTime()}`, { cache: 'no-store' })
            .then((res) => res.json())
            .then((data: Product[]) => {
                setProducts(data);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const toggleAvailability = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isAvailable: !currentStatus }),
            });
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this item?")) return;
        try {
            await fetch(`/api/products/${id}`, { method: "DELETE" });
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    const savePrice = async (id: string) => {
        if (!editPrice || isNaN(parseFloat(editPrice))) return alert("Invalid price");
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ price: parseFloat(editPrice) }),
            });
            if (!res.ok) throw new Error("Failed to save");
            setEditingId(null);
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert("Error saving price");
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price) return alert("Missing fields");

        try {
            await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newProduct.name,
                    category: newProduct.category,
                    price: parseFloat(newProduct.price),
                }),
            });
            setNewProduct({ name: "", category: "SNACKS", price: "" });
            setIsAdding(false);
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen lg:h-[90vh] flex flex-col relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-0 pb-12">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-800 pb-6 mb-8 gap-6">
                <div>
                    <h1 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-indigo-400 drop-shadow-lg tracking-tight">Inventory Terminal</h1>
                    <p className="text-slate-500 font-medium tracking-wide mt-2">Manage menu items and instant availability.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold tracking-wide transition-all border
            ${isAdding
                            ? "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white"
                            : "bg-indigo-600 border-indigo-500 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                        }`}
                >
                    {isAdding ? "Cancel Entry" : "+ Add New Asset"}
                </button>
            </header>

            {isAdding && (
                <form onSubmit={handleAddProduct} className="glass-panel p-6 rounded-3xl mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-end animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Item Designation</label>
                        <input
                            type="text"
                            required
                            value={newProduct.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                            placeholder="e.g. Masala Dosa"
                        />
                    </div>
                    <div className="md:w-48">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Classification</label>
                        <select
                            value={newProduct.category}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewProduct({ ...newProduct, category: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                        >
                            <option value="SNACKS">Snacks</option>
                            <option value="TEA">Tea</option>
                            <option value="DRINKS">Drinks</option>
                            <option value="MEALS">Meals</option>
                        </select>
                    </div>
                    <div className="md:w-32">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Value (₹)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={newProduct.price}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProduct({ ...newProduct, price: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                            placeholder="0.00"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full md:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-400 border border-emerald-400 text-slate-900 font-black rounded-xl transition shadow-[0_0_15px_rgba(52,211,153,0.3)] mt-2 md:mt-0"
                    >
                        INITIALIZE
                    </button>
                </form>
            )}

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-indigo-400 animate-pulse font-mono tracking-widest text-lg">ACCESSING DATABANKS...</div>
                </div>
            ) : (
                <div className="glass-panel rounded-3xl overflow-hidden flex-1 flex flex-col shadow-2xl relative border border-white/5">
                    {/* Header - Desktop only */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-900/80 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest sticky top-0 backdrop-blur-md z-10">
                        <div className="col-span-4">Item Name</div>
                        <div className="col-span-3">Category</div>
                        <div className="col-span-2">Price</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    <div className="overflow-auto custom-scrollbar flex-1 p-2 md:p-4 space-y-4 md:space-y-1">
                        {products.map((p: Product) => (
                            <div key={p.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 px-6 md:px-8 py-6 md:py-4 items-start md:items-center rounded-2xl bg-slate-900/40 md:bg-transparent hover:bg-slate-800/50 transition-colors group relative border border-white/5 md:border-none">
                                <div className="md:col-span-4 font-bold text-slate-200 text-lg flex items-center gap-3 w-full">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.isAvailable ? 'bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`} />
                                    <span className="truncate">{p.name}</span>
                                </div>
                                <div className="md:col-span-3 flex md:block items-center justify-between w-full">
                                    <span className="md:hidden text-xs font-bold text-slate-500 uppercase">Category</span>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-700">
                                        {p.category}
                                    </span>
                                </div>
                                <div className="md:col-span-2 font-mono text-emerald-400 font-bold flex items-center justify-between md:justify-start w-full">
                                    <span className="md:hidden text-xs font-bold text-slate-500 uppercase">Price</span>
                                    {editingId === p.id ? (
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm">₹</span>
                                            <input
                                                type="number"
                                                value={editPrice}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditPrice(e.target.value)}
                                                onKeyDown={(e: React.KeyboardEvent) => {
                                                    if (e.key === 'Enter') savePrice(p.id);
                                                    if (e.key === 'Escape') setEditingId(null);
                                                }}
                                                className="w-16 bg-slate-900 border border-emerald-500/50 p-1 rounded-md text-slate-100 text-sm focus:outline-none focus:border-emerald-500 shadow-inner"
                                                autoFocus
                                            />
                                        </div>
                                    ) : (
                                        `₹${p.price.toFixed(2)}`
                                    )}
                                </div>
                                <div className="md:col-span-2 flex md:block items-center justify-between w-full">
                                    <span className="md:hidden text-xs font-bold text-slate-500 uppercase">Availability</span>
                                    <button
                                        onClick={() => toggleAvailability(p.id, p.isAvailable)}
                                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${p.isAvailable
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                            : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                                            }`}
                                    >
                                        {p.isAvailable ? "ACTIVE" : "SUSPENDED"}
                                    </button>
                                </div>
                                <div className="md:col-span-1 flex justify-end gap-3 md:opacity-0 group-hover:opacity-100 transition items-center w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-slate-800 md:border-none">
                                    {editingId === p.id ? (
                                        <button
                                            onClick={() => savePrice(p.id)}
                                            className="p-2 md:p-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg transition flex-1 md:flex-none flex justify-center"
                                            title="Save Price"
                                        >
                                            💾 <span className="md:hidden ml-2">Save</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => { setEditingId(p.id); setEditPrice(p.price.toString()); }}
                                            className="p-2 md:p-1.5 bg-sky-500/20 hover:bg-sky-500 text-sky-400 hover:text-white rounded-lg transition flex-1 md:flex-none flex justify-center"
                                            title="Edit Price"
                                        >
                                            ✏️ <span className="md:hidden ml-2">Edit</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteProduct(p.id)}
                                        className="p-2 md:p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg transition flex-1 md:flex-none flex justify-center"
                                        title="Delete Item"
                                    >
                                        🗑️ <span className="md:hidden ml-2">Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {products.length === 0 && (
                            <div className="h-40 flex items-center justify-center text-slate-500 font-mono">
                                No inventory records found.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
