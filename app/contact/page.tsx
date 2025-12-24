import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa"
import { IoLogoWhatsapp } from "react-icons/io"

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <h1 className="text-4xl font-bold text-center mb-12">Get in Touch</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-6">
                    <Card className="glass-dark border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FaMapMarkerAlt className="text-primary" />
                                Visit Our Store
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            No.484/1 Kotugoda Rd, Seeduwa<br />
                            Sri Lanka
                        </CardContent>
                    </Card>

                    <Card className="glass-dark border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FaPhoneAlt className="text-primary" />
                                Call Us
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            +94 76 882 5485
                        </CardContent>
                    </Card>

                    <Card className="glass-dark border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FaEnvelope className="text-primary" />
                                Email
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            support@mobilehub.lk
                        </CardContent>
                    </Card>

                    <Card className="glass-dark border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FaClock className="text-primary" />
                                Opening Hours
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            Monday - Sunday<br />
                            9:00 AM - 9:00 PM
                        </CardContent>
                    </Card>

                    <a href="https://wa.me/94768825485" target="_blank" rel="noopener noreferrer">
                        <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center gap-2">
                            <IoLogoWhatsapp className="w-5 h-5" />
                            Chat on WhatsApp
                        </Button>
                    </a>
                </div>

                {/* Contact Form */}
                <Card className="glass-dark border-white/10">
                    <CardHeader>
                        <CardTitle>Send us a Message</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input placeholder="Your Name" className="bg-white/5 border-white/10" />
                        <Input placeholder="Email Address" type="email" className="bg-white/5 border-white/10" />
                        <Input placeholder="Subject" className="bg-white/5 border-white/10" />
                        <textarea
                            placeholder="Your message..."
                            className="w-full min-h-40 p-3 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-gray-500"
                        />
                        <Button className="w-full bg-primary text-black font-bold hover:bg-primary/90">
                            Send Message
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Map - Google Maps Embed */}
            <div className="mt-12">
                <Card className="glass-dark border-white/10 overflow-hidden">
                    <div className="relative h-[400px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126732.6105740439!2d79.8407481!3d7.1318202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2f100437b8263%3A0xe2c390ad70acedcc!2sMobile%20hub!5e0!3m2!1sen!2slk!4v1703358000000!5m2!1sen!2slk"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale hover:grayscale-0 transition-all duration-300"
                        />
                        <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/80 backdrop-blur-sm rounded-lg border border-white/10">
                            <p className="text-sm font-bold">📍 Mobile Hub - Seeduwa</p>
                            <p className="text-xs text-muted-foreground">No.484/1 Kotugoda Rd, Seeduwa, Sri Lanka</p>
                            <a
                                href="https://maps.google.com/?q=7.0167,79.8849"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline mt-2 inline-block"
                            >
                                Get Directions →
                            </a>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
