"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa"
import Link from "next/link"
import { useCart } from "@/components/providers/CartProvider"
import Image from "next/image"

export default function CartPage() {
    const { items, updateQty, removeItem, cartTotal } = useCart()
    const shipping = 0 // Free shipping
    const total = cartTotal + shipping

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <FaShoppingCart className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-8">Start shopping to add items to your cart</p>
                <Link href="/shop">
                    <Button className="bg-primary text-black font-bold hover:bg-primary/90">
                        Browse Products
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl pt-32">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <FaShoppingCart className="text-primary" />
                Shopping Cart ({items.length})
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <Card key={item.id} className="glass-dark border-white/10">
                            <CardContent className="p-4 flex gap-4">
                                <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    ) : (
                                        <span className="text-2xl">📱</span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold mb-1">{item.name}</h3>
                                    {item.variant && (
                                        <div className="flex gap-2 text-xs text-muted-foreground mb-2">
                                            {item.variant.color && <span>{item.variant.color}</span>}
                                            {item.variant.storage && <span>• {item.variant.storage}</span>}
                                        </div>
                                    )}
                                    <p className="text-primary font-bold text-lg mb-3">
                                        LKR {item.price.toLocaleString()}
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 border border-white/10 rounded-lg">
                                            <button
                                                onClick={() => updateQty(item.id, -1)}
                                                className="p-2 hover:bg-white/5 transition-colors"
                                            >
                                                <FaMinus className="w-3 h-3" />
                                            </button>
                                            <span className="w-12 text-center font-bold">{item.qty}</span>
                                            <button
                                                onClick={() => updateQty(item.id, 1)}
                                                className="p-2 hover:bg-white/5 transition-colors"
                                            >
                                                <FaPlus className="w-3 h-3" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-muted-foreground text-sm mb-1">Subtotal</p>
                                    <p className="font-bold text-xl">
                                        LKR {(item.price * item.qty).toLocaleString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="glass-dark border-white/10 sticky top-32">
                        <CardContent className="p-6 space-y-4">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                            <div className="space-y-3 pb-4 border-b border-white/10">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-bold">LKR {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-bold text-green-500">FREE</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span className="text-primary">LKR {total.toLocaleString()}</span>
                            </div>

                            <Link href="/checkout">
                                <Button className="w-full bg-primary text-black font-bold hover:bg-primary/90 h-12 text-lg">
                                    Proceed to Checkout
                                </Button>
                            </Link>

                            <Link href="/shop">
                                <Button variant="outline" className="w-full">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
