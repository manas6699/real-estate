import Footer from "@/components/Footer";
import Navbar from "@/components/Home/Navbar";

export default function PrivacyPolicy() {
    return (
        <>
            <Navbar source="home-mmr" />
            <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Terms and Conditions
                </h1>

                <p className="mb-6">
                    Welcome to <strong>MMR REALTY LLP</strong>. These terms and conditions
                    outline the rules and regulations for the use of our website.
                </p>

                <p className="mb-6">
                    By accessing this website, you agree to accept these terms. Do not
                    continue to use our website if you do not agree with all the terms and
                    conditions stated on this page.
                </p>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-xl font-semibold mb-2">1. General Information</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                MMR REALTY LLP, established in 2003, is a Kolkata-based real
                                estate company offering comprehensive property solutions.
                            </li>
                            <li>These terms govern your use of our website and services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">2. Services Offered</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Residential and Commercial Property Sales</li>
                            <li>Leasing and Renting Services</li>
                            <li>Property Valuation and Appraisal</li>
                            <li>Investment Consulting</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">
                            3. Intellectual Property Rights
                        </h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>
                                MMR REALTY LLP and/or its licensors own the intellectual property
                                rights for all content on this website.
                            </li>
                            <li>
                                You may use the website for personal use only, subject to these
                                restrictions.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">4. Website Usage</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>No republishing or sub-licensing of content</li>
                            <li>No duplication or reproduction of website material</li>
                            <li>No illegal or unauthorized use</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">
                            5. Accuracy of Information
                        </h2>
                        <p>
                            While we aim to provide accurate information, MMR REALTY LLP makes
                            no warranties regarding the completeness or reliability of any
                            information on this site. Use at your own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">6. Third-Party Links</h2>
                        <p>
                            We are not responsible for content on third-party websites linked
                            from our site. These are provided for convenience only.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">
                            7. Limitation of Liability
                        </h2>
                        <p>
                            MMR REALTY LLP shall not be held liable for any damages resulting
                            from your use or inability to use the website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">8. Governing Law</h2>
                        <p>
                            These terms are governed by the laws of India. Any disputes shall be
                            under the exclusive jurisdiction of courts in Kolkata, West Bengal.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">9. Privacy Policy</h2>
                        <p>
                            Please refer to our{" "}
                            <a
                                href="/privacypolicy"
                                className="text-blue-600 underline hover:text-blue-800"
                            >
                                Privacy Policy
                            </a>{" "}
                            for information on how we manage personal data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">
                            10. Changes to Terms and Conditions
                        </h2>
                        <p>
                            We may revise these terms from time to time. Continued use of the
                            website means you accept those changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">11. Contact Us</h2>
                        <p>For any questions, contact us at:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Email: info@mmrrealty.in</li>
                            <li>Phone: +91 9123853689</li>
                            <li>
                                Address: 3108 Rajdanga Main Road, Block EB, Plot 47 Kolkata –
                                700107
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
            <Footer phoneNumber="7439514475" />
        </>
    );
}
