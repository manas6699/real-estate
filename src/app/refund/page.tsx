import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const CancellationRefundPolicyPage = () => {
    return (
        <>
        <Navbar source="home-mmr" />
            <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Cancellation & Refund Policy
                </h1>

                <p className="mb-6">
                    At <strong>MMR Realty LLP</strong>, customer satisfaction is our top
                    priority. We understand that investing in real estate is a significant
                    decision, and we strive to offer transparency and flexibility. Below is
                    our cancellation and refund policy for all real estate transactions:
                </p>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-2">1. Cancellation Policy</h2>
                        <div className="space-y-3">
                            <p>
                                <strong>Pre-Booking Cancellation:</strong> Customers who wish to
                                cancel their booking before the execution of the sale agreement
                                may do so without any penalty. A nominal administrative fee may be
                                deducted to cover processing costs.
                            </p>
                            <p>
                                <strong>Post-Booking Cancellation:</strong> Once the sale
                                agreement is signed, cancellation requests will be subject to the
                                terms outlined in the agreement. In most cases, a percentage of
                                the booking amount will be forfeited as a cancellation fee. The
                                exact forfeiture amount will depend on the project, stage of
                                construction, and date of cancellation in relation to the payment
                                schedule.
                            </p>
                            <p>
                                <strong>Transfer of Booking:</strong> In cases where a buyer
                                wishes to transfer their booking to another person, this may be
                                allowed subject to approval by MMR Realty LLP and any applicable
                                transfer fees.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">2. Refund Policy</h2>
                        <div className="space-y-3">
                            <p>
                                <strong>Pre-Agreement Refund:</strong> If the booking is canceled
                                before signing the sale agreement, the customer is eligible for a
                                refund of the amount paid, minus any applicable administrative
                                fees.
                            </p>
                            <p>
                                <strong>Post-Agreement Refund:</strong> In the event of
                                cancellation after the sale agreement has been executed, refunds
                                will be governed by the terms and conditions of the agreement.
                                Generally, a portion of the paid amount may be retained as a
                                cancellation charge, and the remaining amount will be refunded.
                            </p>
                            <p>
                                <strong>Construction-Linked Plan Refunds:</strong> If the customer
                                has opted for a construction-linked payment plan, refunds will be
                                based on the milestones achieved at the time of cancellation. Any
                                payments made for completed milestones are typically
                                non-refundable.
                            </p>
                            <p>
                                <strong>Delay in Possession:</strong> In the rare event that MMR
                                Realty LLP is unable to deliver possession of the property within
                                the stipulated time, customers may be entitled to a refund or
                                compensation as outlined in the sale agreement.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">3. Refund Process</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>
                                All refund requests must be made in writing and submitted to MMR
                                Realty LLP’s customer support team.
                            </li>
                            <li>
                                Upon approval, the refund will be processed within 30–60 business
                                days, depending on banking and transaction procedures.
                            </li>
                            <li>
                                Refunds will be made via the original payment method unless
                                otherwise agreed upon by both parties.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">4. Force Majeure</h2>
                        <p>
                            MMR Realty LLP shall not be held liable for delays in processing
                            cancellations or refunds due to unforeseen circumstances, such as
                            natural disasters, government interventions, or other force majeure
                            events.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">5. Dispute Resolution</h2>
                        <p>
                            In case of any disputes related to cancellation or refund, MMR
                            Realty LLP encourages amicable resolution through mutual discussion.
                            If unresolved, disputes will be subject to the jurisdiction of the
                            Kolkata courts, as per applicable laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
                        <p>
                            For any questions or further clarification regarding the
                            cancellation and refund policy, please contact us:
                        </p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
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
};

export default CancellationRefundPolicyPage;
