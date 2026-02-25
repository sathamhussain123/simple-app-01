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
            .then((data) => {
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
        <div className="h-[90vh] flex flex-col relative z-10 w-full max-w-7xl mx-auto">
            <header className="flex justify-between items-end border-b border-slate-800 pb-6 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-indigo-400 drop-shadow-lg tracking-tight">Inventory Terminal</h1>
                    <p className="text-slate-500 font-medium tracking-wide mt-2">Manage menu items and instant availability.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={`px-6 py-3 rounded-xl font-bold tracking-wide transition-all border
            ${isAdding
                            ? "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white"
                            : "bg-indigo-600 border-indigo-500 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                        }`}
                >
                    {isAdding ? "Cancel Entry" : "+ Add New Asset"}
                </button>
            </header>

            {isAdding && (
                <form onSubmit={handleAddProduct} className="glass-panel p-6 rounded-3xl mb-8 flex gap-4 items-end animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Item Designation</label>
                        <input
                            type="text"
                            required
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                            placeholder="e.g. Masala Dosa"
                        />
                    </div>
                    <div className="w-48">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Classification</label>
                        <select
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                        >
                            <option value="SNACKS">Snacks</option>
                            <option value="TEA">Tea</option>
                            <option value="DRINKS">Drinks</option>
                            <option value="MEALS">Meals</option>
                        </select>
                    </div>
                    <div className="w-32">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Value (₹)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                            placeholder="0.00"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 border border-emerald-400 text-slate-900 font-black rounded-xl transition shadow-[0_0_15px_rgba(52,211,153,0.3)]"
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
                    <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-slate-900/80 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest sticky top-0 backdrop-blur-md">
                        <div className="col-span-4">Item Name</div>
                        <div className="col-span-3">Category</div>
                        <div className="col-span-2">Price</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    <div className="overflow-auto custom-scrollbar flex-1 p-2 space-y-1">
                        {products.map((p) => (
                            <div key={p.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center rounded-2xl hover:bg-slate-800/50 transition-colors group">
                                <div className="col-span-4 font-bold text-slate-200 text-lg flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${p.isAvailable ? 'bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`} />
                                    {p.name}
                                </div>
                                <div className="col-span-3">
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-700">
                                        {p.category}
                                    </span>
                                </div>
                                <div className="col-span-2 font-mono text-emerald-400 font-bold flex items-center h-full">
                                    {editingId === p.id ? (
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm">₹</span>
                                            <input
                                                type="number"
                                                value={editPrice}
                                                onChange={(e) => setEditPrice(e.target.value)}
                                                onKeyDown={(e) => {
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
                                <div className="col-span-2">
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
                                <div className="col-span-1 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition items-center">
                                    {editingId === p.id ? (
                                        <button
                                            onClick={() => savePrice(p.id)}
                                            className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg transition"
                                            title="Save Price"
                                        >
                                            💾
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => { setEditingId(p.id); setEditPrice(p.price.toString()); }}
                                            className="p-1.5 bg-sky-500/20 hover:bg-sky-500 text-sky-400 hover:text-white rounded-lg transition"
                                            title="Edit Price"
                                        >
                                            ✏️
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteProduct(p.id)}
                                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg transition"
                                        title="Delete Item"
                                    >
                                        🗑️
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
