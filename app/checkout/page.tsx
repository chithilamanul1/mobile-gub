"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FaCreditCard, FaUniversity, FaMoneyBillWave } from "react-icons/fa"
import { SiVisa, SiMastercard } from "react-icons/si"

export default function CheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState("cod")

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Contact Info */}
                    <Card className="glass-dark border-white/10">
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input placeholder="Full Name" className="bg-white/5 border-white/10" />
                            <Input placeholder="Email Address" type="email" className="bg-white/5 border-white/10" />
                            <Input placeholder="Phone Number" className="bg-white/5 border-white/10" />
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card className="glass-dark border-white/10">
                        <CardHeader>
                            <CardTitle>Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input placeholder="Address Line 1" className="bg-white/5 border-white/10" />
                            <Input placeholder="Address Line 2 (Optional)" className="bg-white/5 border-white/10" />
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="City" className="bg-white/5 border-white/10" />
                                <Input placeholder="Postal Code" className="bg-white/5 border-white/10" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card className="glass-dark border-white/10">
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div
                                onClick={() => setPaymentMethod("cod")}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "cod" ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FaMoneyBillWave className="text-primary w-6 h-6" />
                                        <div>
                                            <p className="font-bold">Cash on Delivery</p>
                                            <p className="text-sm text-muted-foreground">Pay when you receive</p>
                                        </div>
                                    </div>
                                    {paymentMethod === "cod" && <Badge className="bg-primary text-black">Selected</Badge>}
                                </div>
                            </div>

                            <div
                                onClick={() => setPaymentMethod("bank")}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "bank" ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FaUniversity className="text-primary w-6 h-6" />
                                        <div>
                                            <p className="font-bold">Bank Transfer</p>
                                            <p className="text-sm text-muted-foreground">Pay via online banking</p>
                                        </div>
                                    </div>
                                    {paymentMethod === "bank" && <Badge className="bg-primary text-black">Selected</Badge>}
                                </div>
                            </div>

                            <div
                                onClick={() => setPaymentMethod("card")}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "card" ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/20"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FaCreditCard className="text-primary w-6 h-6" />
                                        <div>
                                            <p className="font-bold">Credit/Debit Card</p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                <SiVisa className="w-8 h-5" />
                                                <SiMastercard className="w-8 h-5" />
                                            </p>
                                        </div>
                                    </div>
                                    {paymentMethod === "card" && <Badge className="bg-primary text-black">Selected</Badge>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="glass-dark border-white/10 sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3 pb-4 border-b border-white/10">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal (2 items)</span>
                                    <span>LKR 705,000</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-green-500">FREE</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span className="text-primary">LKR 705,000</span>
                            </div>

                            <Button className="w-full bg-primary text-black font-bold hover:bg-primary/90 h-12 text-lg">
                                Place Order
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                By placing this order, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
