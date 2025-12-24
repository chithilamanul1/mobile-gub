import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, Headphones, Watch, BatteryCharging } from "lucide-react"

export default function CategoriesPage() {
    const categories = [
        { name: "Apple", icon: Smartphone, count: 12 },
        { name: "Samsung", icon: Smartphone, count: 8 },
        { name: "Xiaomi", icon: Smartphone, count: 5 },
        { name: "Accessories", icon: Headphones, count: 45 },
        { name: "Wearables", icon: Watch, count: 10 },
        { name: "Power Banks", icon: BatteryCharging, count: 15 },
    ]

    return (
        <div className="container mx-auto px-4 py-8 mb-20">
            <h1 className="text-3xl font-bold mb-6">Categories</h1>
            <div className="grid grid-cols-2 gap-4">
                {categories.map((cat) => (
                    <Card key={cat.name} className="hover:bg-accent/50 transition-colors cursor-pointer border-primary/20">
                        <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                            <cat.icon className="w-8 h-8 text-primary" />
                            <div className="text-center">
                                <div className="font-bold">{cat.name}</div>
                                <div className="text-xs text-muted-foreground">{cat.count} items</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
