
import { BoutiqueGallery } from "@/components/social/BoutiqueGallery"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "The Vault",
    description: "Exclusive access to Mobile Hub's visual archives. Device unboxings, event captures, and community highlights.",
}

export default function GalleryPage() {
    return (
        <main className="min-h-screen bg-black pt-24">
            <BoutiqueGallery />
        </main>
    )
}
