import Footer from "@/components/Footer";
import Navbar from "@/components/Home/Navbar";
import Head from "next/head";

export default function PrivacyPolicy() {
    return (
        <>
        <Navbar source="home-mmr" />
            <Head>
                <title>Privacy Policy | MMR Realty LLP</title>
            </Head>
            <div className="px-4 py-10 max-w-4xl mx-auto text-gray-800">
                <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
                <p className="mb-4 text-sm text-gray-500 text-center">
                    Effective Date: 2024-10-23
                </p>

                <p className="mb-4">
                    MMR Realty LLP (“we,” “our,” or “us”), a Kolkata-based real estate company founded in 2003, is committed to protecting the privacy of its users (“you,” “your”). This Privacy Policy outlines how we collect, use, share, and safeguard your personal information when you interact with our website and services.
                </p>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Personal Identification Information: Name, email address, phone number, postal address, etc.</li>
                        <li>Property Information: Details regarding your property interests, preferences, and queries.</li>
                        <li>Payment Information: For services that require payment, such as real estate transactions or consultations.</li>
                        <li>Technical Data: IP address, browser type, device information, and browsing activity on our website.</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">2. How We Collect Information</h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li>When you voluntarily submit information through contact forms, subscription forms, or inquiries.</li>
                        <li>Automatically when you visit our website, using cookies and tracking technologies.</li>
                        <li>When you engage in real estate transactions or use our services.</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">3. Use of Information</h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li>To provide real estate services and property solutions tailored to your needs.</li>
                        <li>To respond to your inquiries, process transactions, and send you relevant updates.</li>
                        <li>To improve our services and website functionality.</li>
                        <li>To send marketing communications if you have opted in to receive them.</li>
                        <li>To comply with legal and regulatory obligations.</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">4. Sharing of Information</h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Service Providers: With trusted third-party service providers who help us operate our business.</li>
                        <li>Legal Requirements: If required by law or in response to valid public authority requests.</li>
                        <li>Business Transfers: In the event of a merger, sale, or acquisition of our business assets.</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">5. Cookies and Tracking Technologies</h2>
                    <p className="mb-2">
                        We use cookies and similar tracking technologies to enhance your experience on our website.
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Analyze how you use our site</li>
                        <li>Personalize content</li>
                        <li>Ensure site security</li>
                    </ul>
                    <p className="mt-2">You can control cookies through browser settings, but disabling them may affect some features.</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">6. Data Security</h2>
                    <p>
                        We take reasonable measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no online transmission is 100% secure.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>Access:</strong> Request access to the data we hold about you.</li>
                        <li><strong>Correction:</strong> Request corrections or updates to inaccurate information.</li>
                        <li><strong>Deletion:</strong> Request deletion of personal data, subject to legal obligations.</li>
                        <li><strong>Opt-Out:</strong> Opt out of marketing communications at any time.</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">8. Third-Party Links</h2>
                    <p>
                        Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">9. Children’s Privacy</h2>
                    <p>
                        Our services are not intended for individuals under the age of 18. We do not knowingly collect personal data from children without parental consent.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">10. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. The updated policy will be posted on this page with a revised effective date.
                    </p>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">11. Contact Us</h2>
                    <p>If you have any questions or concerns about this Privacy Policy, contact us at:</p>
                    <ul className="list-none space-y-1 mt-2">
                        <li><strong>Email:</strong> info@mmrrealty.in</li>
                        <li><strong>Phone:</strong> +91 9123853689</li>
                        <li><strong>Address:</strong> 3108 Rajdanga Main Road, Block EB, Plot 47, Kolkata – 700107</li>
                    </ul>
                </section>

                <p className="mt-10 text-sm text-gray-500">
                    By using our website and services, you agree to this Privacy Policy and consent to the collection and use of your information as described above.
                </p>
            </div>
            <Footer phoneNumber="7439514475" />
        </>
    );
}
