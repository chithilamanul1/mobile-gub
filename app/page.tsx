"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { FaArrowRight, FaShieldAlt, FaTruck, FaClock } from "react-icons/fa"
import { useRef } from "react"

import { FacebookFeed } from "@/components/social/FacebookFeed"
import { ReviewCarousel } from "@/components/social/ReviewCarousel"

export default function Home() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  return (
    <div className="bg-black text-white selection:bg-primary selection:text-black">

      {/* 🚀 CINEMATIC HERO SECTION */}
      <section ref={targetRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">

        {/* Dynamic Background Element - "The Halo" */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] animate-pulse duration-[5000ms]" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 brightness-200 contrast-200 mix-blend-overlay" />
          {/* Note: noise.png is a common texture, if missing it just won't show. */}
        </div>

        <motion.div
          style={{ opacity, scale, y }}
          className="relative z-10 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full pt-20"
        >
          {/* Typography & Content */}
          <div className="lg:col-span-7 space-y-8 lg:space-y-10 text-center lg:text-left">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mx-auto lg:mx-0"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/80">
                Sri Lanka's #1 Premium Mobile Store
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tighter leading-[0.9] uppercase">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="block text-white"
              >
                Genuine.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-200 to-amber-500"
              >
                Premium.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="block text-white"
              >
                Trusted.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed tracking-tight"
            >
              Upgrade to the latest Apple & Samsung flagships with confidence. <br className="hidden md:block" />
              TRCSL Approved. 1-Year Hub Warranty. Best Prices.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6"
            >
              <Link href="/shop">
                <Button className="w-full sm:w-auto bg-white text-black hover:bg-primary hover:text-black font-black px-12 h-16 rounded-2xl text-xs tracking-[0.2em] uppercase transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-5px_rgba(212,175,55,0.5)]">
                  Shop Flagships
                </Button>
              </Link>
              <Link href="/shop?category=Pre-owned">
                <Button variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:border-white/40 font-black px-12 h-16 rounded-2xl text-xs tracking-[0.2em] uppercase transition-all backdrop-blur-sm">
                  Certified Used
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Visual - Floating Product */}
          <div className="lg:col-span-5 relative hidden lg:block h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <div className="relative w-[120%] aspect-square -mr-32">
                <Image
                  src="/products/iphone_white_v2.png" // Ensure this asset exists or fallback
                  alt="Hero Product"
                  fill
                  className="object-contain drop-shadow-[0_50px_100px_rgba(212,175,55,0.15)] z-20"
                  priority
                />
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="absolute top-1/4 -left-10 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl z-30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <FaShieldAlt />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-white tracking-wider">Hub Warranty</p>
                      <p className="text-[9px] text-gray-400">Comprehensive Coverage</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-1/4 -right-0 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl z-30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <FaTruck />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-white tracking-wider">Islandwide</p>
                      <p className="text-[9px] text-gray-400">Fast Delivery</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Trust & Stats Strip */}
      <div className="border-y border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            <StatBox number="5K+" label="Active Users" />
            <StatBox number="100%" label="Genuine Devices" />
            <StatBox number="24/7" label="Support" />
            <StatBox number="4.9" label="Trust Score" />
          </div>
        </div>
      </div>

      {/* Category Grid (Refined) */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-2">
              <span className="text-primary font-black tracking-widest text-[10px] uppercase">Curated Collections</span>
              <h2 className="text-4xl font-black tracking-tight uppercase text-white">SHOP BY CATEGORY</h2>
            </div>
            <Link href="/shop" className="group flex items-center gap-2 text-xs font-black tracking-widest uppercase text-white hover:text-primary transition-colors">
              View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CategoryCard
              title="THE PRO SERIES"
              subtitle="Apple iPhone Excellence"
              image="/products/preowned_iphones.png"
              href="/shop?brand=Apple"
            />
            <CategoryCard
              title="ANDROID ELITE"
              subtitle="Samsung & Flagships"
              image="/products/preowned_androids.png"
              href="/shop?brand=Samsung"
              dark
            />
            <CategoryCard
              title="THE CERTIFIED"
              subtitle="Best Value Pre-owned"
              image="/products/packaging.png"
              href="/shop?category=Pre-owned"
            />
          </div>
        </div>
      </section>

      {/* Brand Strips */}
      <section className="py-20 bg-black overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
        <div className="container mx-auto px-6 text-center space-y-12 relative z-0">
          <p className="text-[10px] font-bold tracking-[0.4em] text-gray-500 uppercase">Authorized Hub For Global Brands</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-20">
            <p className="text-5xl md:text-7xl font-black tracking-tighter italic text-white/50">APPLE</p>
            <p className="text-5xl md:text-7xl font-black tracking-tighter italic text-white/50">SAMSUNG</p>
            <p className="text-5xl md:text-7xl font-black tracking-tighter italic text-white/50">GOOGLE</p>
          </div>
        </div>
      </section>

      {/* Trust/Guarantee Banner */}
      <section className="py-40 bg-zinc-900 text-white relative overflow-hidden group">
        <Image
          src="/products/preowned_iphones.png"
          alt="BG"
          fill
          className="object-cover opacity-10 grayscale group-hover:scale-105 transition-transform duration-[2s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-zinc-900" />

        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl space-y-12">
          <div className="inline-block p-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4">
            <FaShieldAlt className="text-3xl text-primary" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight uppercase leading-[0.9]">
            QUALITY IS OUR <br /> <span className="text-primary">ABSOLUTE STANDARD</span>
          </h2>
          <p className="text-xl text-white/60 font-medium leading-relaxed uppercase tracking-tight">
            "We don't just sell phones. We provide a promise of purity. Every device, whether new or certified pre-owned, is rigorously tested to ensure perfection before it reaches your hands."
          </p>
          <div className="pt-8">
            <Link href="/about">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black font-black px-12 h-16 rounded-2xl text-xs tracking-widest uppercase transition-all">
                OUR CERTIFICATION PROCESS
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ReviewCarousel />
      <FacebookFeed />
    </div>
  );
}

function StatBox({ number, label }: { number: string, label: string }) {
  return (
    <div className="py-8 text-center bg-black hover:bg-zinc-900 transition-colors cursor-default">
      <p className="text-3xl lg:text-5xl font-black text-white mb-2">{number}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</p>
    </div>
  )
}

function CategoryCard({ title, subtitle, image, href, dark = false }: { title: string, subtitle: string, image: string, href: string, dark?: boolean }) {
  return (
    <Link href={href} className={`group relative h-[600px] rounded-[32px] overflow-hidden flex flex-col justify-end p-10 bg-zinc-900 border border-white/5`}>
      <div className="absolute inset-0 flex items-center justify-center p-12 transition-transform duration-700 group-hover:scale-110">
        <Image src={image} alt={title} fill className="object-contain p-8 group-hover:drop-shadow-[0_20px_50px_rgba(255,255,255,0.1)] transition-all duration-500" />
      </div>
      <div className="relative z-10 space-y-2">
        <p className={`text-[10px] font-black tracking-[0.3em] uppercase text-primary`}>{subtitle}</p>
        <h3 className={`text-4xl font-black tracking-tight uppercase leading-none text-white`}>{title}</h3>
        <div className="pt-4 overflow-hidden">
          <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase translate-y-8 group-hover:translate-y-0 transition-transform duration-500 text-white">
            Shop Collection <FaArrowRight className="text-primary" />
          </div>
        </div>
      </div>
    </Link>
  )
}
