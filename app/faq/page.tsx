"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Minus, Shield, Truck, Smartphone, CreditCard, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// --- Data ---
const CATEGORIES = [
    { id: "general", label: "General & Stock", icon: HelpCircle },
    { id: "warranty", label: "Warranty & TRCSL", icon: Shield },
    { id: "payments", label: "Payments & EMI", icon: CreditCard },
    { id: "trade-in", label: "Trade-In", icon: Smartphone },
    { id: "shipping", label: "Shipping", icon: Truck },
]

const FAQS = [
    // General
    {
        category: "general",
        question: "Are your devices brand new?",
        answer: "Yes, we exclusively sell brand new, factory-sealed devices. We do not sell refurbished or used units unless specifically marked in our 'Pre-Owned' section."
    },
    {
        category: "general",
        question: "How can I check stock availability?",
        answer: "Stock is updated in real-time on our website. If a product says 'In Stock', it is available at our Seeduwa showroom. You can also reserve items via WhatsApp."
    },
    // Warranty
    {
        category: "warranty",
        question: "Are your devices TRCSL Approved?",
        answer: "100% of our telecommunication devices are TRCSL approved. We handle the registration process for you to ensure compliance with local regulations."
    },
    {
        category: "warranty",
        question: "What is the difference between Company and Shop warranty?",
        answer: "Company Warranty (Genxt/Singer) is handled directly by the authorized agent in Sri Lanka. Shop Warranty is handled by our in-house technical team with genuine parts."
    },
    // Payments
    {
        category: "payments",
        question: "Do you accept credit card installments?",
        answer: "Yes! We offer 0% interest installment plans for up to 24 months with Sampath, Commercial, HNB, and Amex cards. Handling fees may apply."
    },
    {
        category: "payments",
        question: "Can I pay using Koko or Mintpay?",
        answer: "Absolutely. You can split your payment into 3 interest-free installments using Koko or Mintpay directly at checkout or in-store."
    },
    // Trade-In
    {
        category: "trade-in",
        question: "How does the Trade-In process work?",
        answer: "Bring your old device to our store or submit a quote request online. We'll inspect it and offer instant credit towards your new purchase."
    },
    {
        category: "trade-in",
        question: "Do you accept phones with broken screens?",
        answer: "Yes, we accept devices in any condition. However, the trade-in value will be adjusted based on the extent of the damage."
    },
    // Shipping
    {
        category: "shipping",
        question: "Do you deliver island-wide?",
        answer: "Yes, we offer secure delivery to any location in Sri Lanka. Colombo orders are often delivered same-day, other areas within 1-3 business days."
    },
]

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState("general")
    const [searchQuery, setSearchQuery] = useState("")
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const filteredFaqs = FAQS.filter(faq => {
        const matchesCategory = faq.category === activeCategory
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

        return searchQuery ? matchesSearch : matchesCategory
    })

    return (
        <div className="bg-black min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Hero Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="text-primary font-black tracking-widest text-xs uppercase">
                        Institutional Support
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
                        Help Center
                    </h1>
                    <p className="text-gray-400 max-w-lg mx-auto text-lg">
                        Find answers to your questions about our products, warranty, and services.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto mt-8 relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search specifically..."
                                className="pl-10 bg-white/5 border-white/10 text-white rounded-full h-12 focus:border-primary/50 transition-all placeholder:text-gray-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                {!searchQuery && (
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300",
                                    activeCategory === cat.id
                                        ? "bg-primary text-black border-primary font-bold"
                                        : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:border-white/20"
                                )}
                            >
                                <cat.icon className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-wider">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* FAQ List */}
                <div className="space-y-4 max-w-3xl mx-auto">
                    <AnimatePresence mode="wait">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <Item
                                    key={index}
                                    faq={faq}
                                    isOpen={openIndex === index}
                                    onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                                />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 text-gray-500"
                            >
                                <p>No results found for "{searchQuery}"</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Direct Support Contact */}
                <div className="mt-20 pt-10 border-t border-white/5 text-center">
                    <h3 className="text-white font-bold uppercase tracking-widest mb-2">Still need help?</h3>
                    <p className="text-gray-500 text-sm mb-6">Our concierge team is available 9AM - 9PM</p>
                    <a
                        href="https://wa.me/94768825485"
                        target="_blank"
                        className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-sm font-bold uppercase tracking-wider border-b border-primary/20 hover:border-white pb-1"
                    >
                        Chat with Support →
                    </a>
                </div>

            </div>
        </div>
    )
}

function Item({ faq, isOpen, onToggle }: { faq: any, isOpen: boolean, onToggle: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
                "border rounded-2xl overflow-hidden transition-colors duration-300",
                isOpen ? "bg-white/5 border-primary/30" : "bg-transparent border-white/10 hover:border-white/20"
            )}
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className={cn(
                    "text-sm font-bold uppercase tracking-wider transition-colors",
                    isOpen ? "text-primary" : "text-gray-300"
                )}>
                    {faq.question}
                </span>
                <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center border transition-all",
                    isOpen ? "bg-primary text-black border-primary" : "border-white/20 text-gray-500"
                )}>
                    {isOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-6 pb-6 text-gray-400 leading-relaxed text-sm">
                            {faq.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
