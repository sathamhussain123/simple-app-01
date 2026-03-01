"use client";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import GooglePayButton from "@google-pay/button-react";

type Product = { id: string; name: string; category: string; price: number; isAvailable: boolean };
type CartItem = Product & { quantity: number };

export default function POSPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [gst, setGst] = useState<number>(5);
    const [paymentMethod, setPaymentMethod] = useState<"CASH" | "UPI" | "CARD" | "G-PAY">("UPI");
    const [loading, setLoading] = useState(true);
    const [showQRModal, setShowQRModal] = useState(false);

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data: Product[]) => {
                setProducts(data.filter((p: Product) => p.isAvailable));
                setLoading(false);
            });
    }, []);

    const addToCart = (product: Product) => {
        setCart((prev: CartItem[]) => {
            const existing = prev.find((item: CartItem) => item.id === product.id);
            if (existing) return prev.map((item: CartItem) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart((prev: CartItem[]) => prev.map((item: CartItem) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item: CartItem) => item.quantity > 0));
    };

    const subtotal = cart.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);
    const total = subtotal + (subtotal * gst) / 100;

    const generateBill = async () => {
        if (cart.length === 0) return alert("Cart is empty");
        try {
            const res = await fetch("/api/bills", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: cart.map((c: CartItem) => ({ productId: c.id, quantity: c.quantity, price: c.price })), paymentMethod, totalAmount: total }),
            });
            if (res.ok) {
                alert("✨ Bill successfully generated! Sparkles flying out of printer!");
                setCart([]);
                setShowQRModal(false);
            } else {
                alert("Transaction Aborted");
            }
        } catch { alert("Connection Error"); }
    };

    if (loading) return <div className="text-white text-3xl font-black w-full h-[60vh] flex items-center justify-center animate-pulse drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">INITIALIZING SATHAM HUSSAIN-AEROSYNC TERMINAL...</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-full">

            {/* Grid of Items */}
            <div className="flex-1 flex flex-col h-auto lg:h-[90vh]">
                <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-indigo-500/20 pb-4 gap-4">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-indigo-300 drop-shadow-md tracking-tight">Menu Registry</h2>
                        <p className="text-slate-500 font-medium tracking-wide text-sm lg:text-base">Touch products to insert immediately.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6 overflow-auto pb-10 custom-scrollbar lg:pr-4">
                    {products.map((p: Product) => (
                        <button
                            key={p.id}
                            onClick={() => addToCart(p)}
                            className="group premium-card rounded-2xl p-6 text-left flex flex-col justify-between h-40 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/20 blur-[30px] rounded-full group-hover:scale-150 transition duration-500" />

                            <div className="relative z-10 flex justify-between items-start">
                                <span className="font-bold text-slate-100 text-xl tracking-tight leading-tight">{p.name}</span>
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">{p.category}</span>
                            </div>
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-teal-200 to-emerald-400 font-black text-3xl drop-shadow-[0_2px_10px_rgba(52,211,153,0.3)]">₹{p.price}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cart Container */}
            <div className="w-full lg:w-[400px] xl:w-[440px] glass-panel rounded-3xl p-6 lg:p-8 flex flex-col shadow-2xl relative overflow-hidden ring-1 ring-white/10 h-auto lg:h-[90vh] min-h-[500px]">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-[40px] pointer-events-none" />

                <div className="flex justify-between items-center mb-6 z-10">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Current Ledger</h3>
                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse blur-[1px] shadow-[0_0_15px_rgba(34,197,94,1)]"></span>
                </div>

                {/* Selected Items */}
                <div className="flex-1 overflow-auto rounded-xl p-1 mb-6 space-y-2 custom-scrollbar z-10">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 font-semibold space-y-4">
                            <div className="w-16 h-16 rounded-full border border-dashed border-slate-700 flex items-center justify-center opacity-50">✦</div>
                            <p>Ledger empty. Scan items.</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex items-center justify-between relative bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 backdrop-blur-sm group hover:bg-slate-800 hover:border-indigo-500/50 transition">
                                <div className="flex flex-col w-1/3 overflow-hidden">
                                    <span className="font-bold text-slate-200 text-sm truncate" title={item.name}>{item.name}</span>
                                    <span className="text-slate-500 text-xs font-mono font-medium tracking-wide">₹{item.price}</span>
                                </div>
                                <div className="flex items-center bg-slate-950/80 rounded px-1.5 py-1 border border-slate-800/80 shadow-inner">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-xs transition flex justify-center items-center leading-none">-</button>
                                    <span className="w-7 text-center font-bold text-slate-200 text-xs">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded bg-indigo-600/30 text-indigo-300 hover:bg-indigo-500 hover:text-white border border-indigo-500/30 transition flex justify-center items-center font-black text-xs leading-none">+</button>
                                </div>
                                <div className="text-right flex-1 min-w-16">
                                    <span className="font-bold text-emerald-400 text-sm font-mono tracking-tighter">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Totals & Commit */}
                <div className="border-t border-slate-800/80 pt-3 z-10 flex flex-col gap-2">
                    <div className="flex justify-between text-slate-400 font-medium font-mono text-xs uppercase">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-400 font-medium font-mono text-xs uppercase">
                        <span>Tax Protocol (GST %)</span>
                        <input
                            type="number"
                            value={gst}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGst(Number(e.target.value))}
                            className="w-16 bg-slate-900 border border-slate-700 text-right p-1 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded shadow-inner"
                            min="0"
                        />
                    </div>

                    <div className="flex justify-between items-center border-t border-dashed border-slate-700 pt-2 pb-1">
                        <span className="text-sm text-slate-200 tracking-wider font-bold">NET TOTAL</span>
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] tracking-tighter">
                            ₹{total.toFixed(2)}
                        </span>
                    </div>

                    <div>
                        <div className="grid grid-cols-4 gap-2">
                            {["CASH", "UPI", "CARD", "G-PAY"].map((method) => (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method as any)}
                                    className={`py-1.5 rounded-lg font-bold text-xs tracking-wide transition-all shadow-sm
                    ${paymentMethod === method
                                            ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] border-indigo-500 border relative overflow-hidden"
                                            : "bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-800"
                                        }`}
                                >
                                    {paymentMethod === method && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />}
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* QR Code Trigger Container */}
                    {paymentMethod === "UPI" && cart.length > 0 && (
                        <div className="flex justify-center animate-in zoom-in fade-in duration-300">
                            <button
                                onClick={() => setShowQRModal(true)}
                                className="w-full py-1.5 rounded-lg border border-indigo-500/50 hover:bg-indigo-600/20 text-indigo-300 font-bold transition flex justify-center items-center gap-2 text-sm"
                            >
                                <span>📱</span> Generate UPI QR
                            </button>
                        </div>
                    )}

                    {/* Google Pay Integration Container */}
                    {paymentMethod === "G-PAY" && cart.length > 0 && (
                        <div className="flex justify-center animate-in zoom-in fade-in duration-300 mt-2 w-full [&>div]:w-full min-h-[40px]">
                            <GooglePayButton
                                environment="TEST"
                                paymentRequest={{
                                    apiVersion: 2,
                                    apiVersionMinor: 0,
                                    allowedPaymentMethods: [
                                        {
                                            type: 'CARD',
                                            parameters: {
                                                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                                allowedCardNetworks: ['MASTERCARD', 'VISA'],
                                            },
                                            tokenizationSpecification: {
                                                type: 'PAYMENT_GATEWAY',
                                                parameters: {
                                                    gateway: 'example',
                                                    gatewayMerchantId: 'exampleGatewayMerchantId',
                                                },
                                            },
                                        },
                                    ],
                                    merchantInfo: {
                                        merchantId: '12345678901234567890',
                                        merchantName: 'SATHAM HUSSAIN-AeroSync POS',
                                    },
                                    transactionInfo: {
                                        totalPriceStatus: 'FINAL',
                                        totalPriceLabel: 'Total',
                                        totalPrice: total.toFixed(2),
                                        currencyCode: 'INR',
                                        countryCode: 'IN',
                                    },
                                }}
                                onLoadPaymentData={(paymentRequest: any) => {
                                    console.log('load payment data', paymentRequest);
                                    generateBill();
                                }}
                                onCancel={() => { console.log('Payment cancelled') }}
                                buttonColor="white"
                                buttonType="plain"
                                style={{ width: '100%', height: '40px' }}
                            />
                        </div>
                    )}

                    <button
                        onClick={generateBill}
                        disabled={cart.length === 0}
                        className="group relative w-full h-10 mt-1 rounded-xl flex justify-center items-center text-sm font-black tracking-widest uppercase transition-all overflow-hidden
             disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed
             bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white
             shadow-[0_0_30px_rgba(99,102,241,0.4)]
             border border-indigo-400/50 hover:border-white/50
             active:scale-95 duration-200"
                    >
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                        <span className="relative z-10 flex items-center gap-3">
                            COMMIT TRANSACTION
                        </span>
                    </button>
                </div>

            </div>
            {/* Fullscreen QR Modal */}
            {showQRModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.3)] flex flex-col items-center max-w-sm w-full relative">
                        <button
                            onClick={() => setShowQRModal(false)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                        >
                            ✕
                        </button>
                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">Scan to Pay</h3>
                        <p className="text-slate-400 mb-8 font-mono text-center">Amount: ₹{total.toFixed(2)}<br /><span className="text-xs text-slate-500">restaurant@upi</span></p>

                        <div className="bg-white p-4 rounded-2xl shadow-inner mb-8 ring-4 ring-indigo-500/20">
                            <QRCodeSVG
                                value={`upi://pay?pa=restaurant@upi&pn=SATHAM HUSSAIN-AeroSyncPOS&am=${total.toFixed(2)}&cu=INR`}
                                size={220}
                                bgColor={"#ffffff"}
                                fgColor={"#0f172a"}
                                level={"M"}
                            />
                        </div>

                        <button
                            onClick={() => setShowQRModal(false)}
                            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold tracking-wide transition"
                        >
                            Close Viewer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
