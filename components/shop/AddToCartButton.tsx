"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/CartProvider"
import { useState } from "react"

interface AddToCartProps {
    product: {
        id: string
        name: string
        price: number
        image: string
    }
}

export function AddToCartButton({ product }: AddToCartProps) {
    const { addItem } = useCart()
    const [isLoading, setIsLoading] = useState(false)

    const handleAdd = () => {
        setIsLoading(true)
        // Simulate a small delay for better UX feel or if we add api validation later
        setTimeout(() => {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
            })
            setIsLoading(false)
        }, 300)
    }

    return (
        <Button
            onClick={handleAdd}
            disabled={isLoading}
            variant="outline"
            className="flex-1 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 font-black h-16 rounded-2xl text-sm tracking-widest uppercase transition-all"
        >
            {isLoading ? "ADDING..." : "ADD TO CART"}
        </Button>
    )
}
