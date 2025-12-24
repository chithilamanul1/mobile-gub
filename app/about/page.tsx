import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FaApple, FaAndroid, FaShieldAlt, FaAward } from "react-icons/fa"
import { MdVerified } from "react-icons/md"

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-12">
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/50">Est. 2020</Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">About Mobile Hub</h1>
                <p className="text-xl text-muted-foreground">
                    Seeduwa's Trusted Mobile Technology Partner
                </p>
            </div>

            <div className="prose prose-invert max-w-none space-y-8">
                <Card className="glass-dark border-white/10">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <MdVerified className="text-primary" />
                            Our Story
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Founded in 2020, Mobile Hub has become the premier destination for mobile technology in Seeduwa.
                            We started with a simple mission: to provide customers with genuine, TRCSL-approved devices and
                            exceptional after-sales service that sets the standard in Sri Lanka.
                        </p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="glass-dark border-white/10 text-center">
                        <CardContent className="p-6">
                            <FaApple className="w-12 h-12 mx-auto mb-4 text-primary" />
                            <h3 className="font-bold mb-2">Authorized Seller</h3>
                            <p className="text-sm text-muted-foreground">Official retailer for Apple, Samsung, and Xiaomi</p>
                        </CardContent>
                    </Card>

                    <Card className="glass-dark border-white/10 text-center">
                        <CardContent className="p-6">
                            <FaShieldAlt className="w-12 h-12 mx-auto mb-4 text-primary" />
                            <h3 className="font-bold mb-2">TRCSL Approved</h3>
                            <p className="text-sm text-muted-foreground">100% genuine devices with full compliance</p>
                        </CardContent>
                    </Card>

                    <Card className="glass-dark border-white/10 text-center">
                        <CardContent className="p-6">
                            <FaAward className="w-12 h-12 mx-auto mb-4 text-primary" />
                            <h3 className="font-bold mb-2">Company Warranty</h3>
                            <p className="text-sm text-muted-foreground">Full hardware and software support</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="glass-dark border-white/10">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">✓</span>
                                <span>Flexible installment plans with leading banks</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">✓</span>
                                <span>Expert repair services with genuine parts</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">✓</span>
                                <span>Trade-in program for your old devices</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">✓</span>
                                <span>Free TRCSL registration assistance</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-1">✓</span>
                                <span>Extended store hours: 9 AM - 9 PM daily</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
