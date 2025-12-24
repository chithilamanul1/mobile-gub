"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

export type CartItem = {
    id: string
    name: string
    price: number
    image: string
    qty: number
    variant?: {
        color: string
        storage: string
    }
}

type CartContextType = {
    items: CartItem[]
    addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void
    removeItem: (id: string) => void
    updateQty: (id: string, delta: number) => void
    clearCart: () => void
    cartCount: number
    cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem("mobilehub-cart")
        if (saved) {
            try {
                setItems(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse cart", e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save to LocalStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("mobilehub-cart", JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addItem = (newItem: Omit<CartItem, "qty"> & { qty?: number }) => {
        setItems(current => {
            const existing = current.find(i => i.id === newItem.id &&
                i.variant?.color === newItem.variant?.color &&
                i.variant?.storage === newItem.variant?.storage
            )

            if (existing) {
                toast.success("Updated cart quantity")
                return current.map(i =>
                    (i.id === newItem.id && i.variant?.color === newItem.variant?.color)
                        ? { ...i, qty: i.qty + (newItem.qty || 1) }
                        : i
                )
            }

            toast.success("Added to cart")
            return [...current, { ...newItem, qty: newItem.qty || 1 }]
        })
    }

    const removeItem = (id: string) => {
        setItems(current => current.filter(i => i.id !== id))
        toast.info("Removed from cart")
    }

    const updateQty = (id: string, delta: number) => {
        setItems(current =>
            current.map(i => {
                if (i.id === id) {
                    const newQty = Math.max(1, i.qty + delta)
                    return { ...i, qty: newQty }
                }
                return i
            })
        )
    }

    const clearCart = () => {
        setItems([])
        localStorage.removeItem("mobilehub-cart")
    }

    const cartCount = items.reduce((acc, item) => acc + item.qty, 0)
    const cartTotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0)

    if (!isLoaded) return null

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error("useCart must be used within a CartProvider")
    return context
}
