import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FaTools, FaMobileAlt, FaBatteryHalf, FaShieldAlt } from "react-icons/fa"
import { MdScreenShare } from "react-icons/md"

export default function RepairsPage() {
    const services = [
        { icon: MdScreenShare, title: "Screen Replacement", price: "LKR 8,000 - 45,000", time: "1-2 hours" },
        { icon: FaBatteryHalf, title: "Battery Replacement", price: "LKR 5,000 - 25,000", time: "30 mins" },
        { icon: FaShieldAlt, title: "Water Damage Repair", price: "LKR 15,000+", time: "2-3 days" },
        { icon: FaTools, title: "Software Issues", price: "LKR 2,000 - 8,000", time: "1 hour" },
    ]

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center mb-12">
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/50">Expert Repairs</Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Device Repair Services</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Professional repairs for all major brands. Same-day service available for most issues.
                </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {services.map((service) => (
                    <Card key={service.title} className="glass-dark border-white/10 hover:border-primary/50 transition-all">
                        <CardHeader className="text-center">
                            <service.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                            <CardTitle className="text-lg">{service.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-2">
                            <p className="text-primary font-bold">{service.price}</p>
                            <p className="text-sm text-muted-foreground">{service.time}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Booking Form */}
            <Card className="glass-dark border-white/10 max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FaMobileAlt className="text-primary" />
                        Book a Repair
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="Your Name" className="bg-white/5 border-white/10" />
                        <Input placeholder="Phone Number" className="bg-white/5 border-white/10" />
                    </div>
                    <Input placeholder="Device Model (e.g., iPhone 14 Pro)" className="bg-white/5 border-white/10" />
                    <textarea
                        placeholder="Describe the issue..."
                        className="w-full min-h-32 p-3 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-gray-500"
                    />
                    <Button className="w-full bg-primary text-black font-bold hover:bg-primary/90">
                        Submit Repair Request
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
