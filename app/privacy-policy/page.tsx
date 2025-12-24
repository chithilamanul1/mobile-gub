import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy | MOBILE HUB",
    description: "Our commitment to your privacy and data security. Read our institutional privacy policy.",
}

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-black min-h-screen text-white pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">

                {/* Header */}
                <div className="mb-16 border-b border-white/10 pb-12">
                    <span className="text-primary font-black tracking-widest text-xs uppercase mb-4 block">
                        Legal Registry
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight uppercase mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-2xl">
                        At Mobile Hub, we believe privacy is the ultimate luxury. We are committed to protecting your personal data with institutional-grade security.
                    </p>
                    <p className="mt-4 text-sm text-gray-600 uppercase tracking-widest font-bold">
                        Last Updated: December 23, 2025
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-12 text-gray-300 leading-relaxed">

                    <Section title="1. Identity & Mission">
                        <p>
                            This Privacy Policy governs the manner in which MOBILE HUB ("The Institution," "We," "Us") collects, uses, maintains, and discloses information collected from users (each, a "User") of the mobilehub.lk website ("Site"). This privacy policy applies to the Site and all products and services offered by Mobile Hub.
                        </p>
                    </Section>

                    <Section title="2. Information Collection">
                        <p className="mb-4">
                            We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, fill out a form, and in connection with other activities, services, features, or resources we make available on our Site.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-400">
                            <li><strong>Identity Data:</strong> Name, username, or similar identifier.</li>
                            <li><strong>Contact Data:</strong> Billing address, delivery address, email address, and telephone numbers.</li>
                            <li><strong>Technical Data:</strong> Internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                            <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products and services you have purchased from us.</li>
                        </ul>
                    </Section>

                    <Section title="3. Institutional Use of Data">
                        <p>
                            Mobile Hub collects and uses Users personal information for the following purposes:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4 text-gray-400">
                            <li>To personalize user experience and deliver "Boutique" service standards.</li>
                            <li>To process transactions securely. We do not store credit card details on our servers.</li>
                            <li>To send periodic emails regarding order status, institutional updates, and exclusive offers (The Inner Circle).</li>
                            <li>To improve our Site offerings based on information and feedback we receive from you.</li>
                        </ul>
                    </Section>

                    <Section title="4. Data Protection">
                        <p>
                            We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored on our Site. Our exchange of sensitive and private data happens over a SSL secured communication channel and is encrypted and protected with digital signatures.
                        </p>
                    </Section>

                    <Section title="5. Sharing Your Personal Information">
                        <p>
                            We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above.
                        </p>
                    </Section>

                    <Section title="6. Compliance with Laws">
                        <p>
                            We will disclose your Personal Information where required to do so by law or subpoena or if we believe that such action is necessary to comply with the law and the reasonable requests of law enforcement or to protect the security or integrity of our Service.
                        </p>
                    </Section>

                    <Section title="7. Contacting the Institution">
                        <p>
                            If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:
                        </p>
                        <div className="mt-6 p-6 bg-white/5 border border-white/10 rounded-xl">
                            <p className="font-bold text-white uppercase tracking-widest mb-1">Mobile Hub Legal Department</p>
                            <p className="text-sm text-gray-400">No. 484/1 Kotugoda Rd, Seeduwa, Sri Lanka</p>
                            <p className="text-sm text-primary mt-2">legal@mobilehub.lk</p>
                        </div>
                    </Section>

                </div>
            </div>
        </div>
    )
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <section className="border-l-2 border-primary/20 pl-8 transition-colors hover:border-primary">
            <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-6">{title}</h2>
            <div className="text-lg">
                {children}
            </div>
        </section>
    )
}
