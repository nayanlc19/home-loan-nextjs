import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-muted-foreground">Last Updated: November 5, 2025</p>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            {/* Business Information */}
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Business Information</h2>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Business Name:</strong> N Education</p>
                <p><strong>Website:</strong> home-loan-nextjs.onrender.com</p>
                <p><strong>Contact Email:</strong> dmcpexam2020@gmail.com</p>
                <p><strong>Product:</strong> Home Loan Toolkit - Digital educational content and calculators</p>
              </div>
            </section>

            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using the Home Loan Toolkit ("Service"), you accept and agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            {/* Description of Service */}
            <section>
              <h2 className="text-xl font-semibold mb-3">3. Description of Service</h2>
              <p className="text-muted-foreground">
                N Education provides a Home Loan Toolkit that includes:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                <li>11 home loan optimization strategies</li>
                <li>Interactive calculators for EMI, tax benefits, and personalized rates</li>
                <li>Bank comparison tools</li>
                <li>Educational guides and tips</li>
              </ul>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Payment Terms</h2>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Price:</strong> ₹99 (one-time payment)</p>
                <p><strong>Access Period:</strong> 1 year from the date of payment</p>
                <p><strong>Payment Methods:</strong> UPI, Credit/Debit Cards, Net Banking, Wallets via Cashfree Payment Gateway</p>
                <p><strong>Currency:</strong> Indian Rupees (INR)</p>
                <p>All payments are processed securely through Cashfree Payment Gateway, a PCI-DSS compliant payment processor.</p>
              </div>
            </section>

            {/* No Refund Policy */}
            <section>
              <h2 className="text-xl font-semibold mb-3">5. No Refund Policy</h2>
              <div className="space-y-2 text-muted-foreground">
                <p className="font-semibold text-red-600">
                  All sales are final. We do not offer refunds or cancellations.
                </p>
                <p>
                  As this is a digital product with immediate access upon payment, we cannot offer refunds once access has been granted.
                  Please review the free Strategy #1 (Bi-Weekly) before purchasing to ensure the content meets your expectations.
                </p>
              </div>
            </section>

            {/* No Shipping Policy */}
            <section>
              <h2 className="text-xl font-semibold mb-3">6. No Shipping Policy</h2>
              <p className="text-muted-foreground">
                This is a <strong>digital product</strong> delivered entirely online. There is no physical shipping involved.
                Access to the toolkit is granted immediately upon successful payment verification through your online account.
              </p>
            </section>

            {/* User Account and Access */}
            <section>
              <h2 className="text-xl font-semibold mb-3">7. User Account and Access</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You must sign in with Google to access the paid content</li>
                <li>Your access is linked to the email address used for payment</li>
                <li>Access persists across sign-ins for the validity period (1 year)</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>Account sharing or reselling access is strictly prohibited</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content, including text, graphics, calculators, strategies, and software, is the property of N Education
                and is protected by copyright laws. You may not reproduce, distribute, modify, or create derivative works without
                explicit written permission.
              </p>
            </section>

            {/* Disclaimer */}
            <section>
              <h2 className="text-xl font-semibold mb-3">9. Disclaimer</h2>
              <div className="space-y-2 text-muted-foreground">
                <p className="font-semibold">Educational Purpose Only:</p>
                <p>
                  The information provided in the Home Loan Toolkit is for educational and informational purposes only.
                  It should not be considered as professional financial advice. We recommend consulting with a qualified
                  financial advisor before making any financial decisions.
                </p>
                <p className="font-semibold mt-3">No Guarantee:</p>
                <p>
                  While we strive to provide accurate and up-to-date information, we make no guarantees about the results
                  you may achieve by using our strategies and calculators. Actual savings may vary based on individual circumstances.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-xl font-semibold mb-3">10. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                N Education shall not be liable for any indirect, incidental, special, consequential, or punitive damages
                resulting from your use or inability to use the Service, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-xl font-semibold mb-3">11. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon
                posting to the website. Your continued use of the Service after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-xl font-semibold mb-3">12. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising
                from these terms shall be subject to the exclusive jurisdiction of the courts in India.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-semibold mb-3">13. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-2 font-semibold">dmcpexam2020@gmail.com</p>
            </section>

            {/* Links to Other Policies */}
            <section className="border-t pt-6 mt-6">
              <h3 className="font-semibold mb-3">Related Policies:</h3>
              <div className="flex flex-wrap gap-4">
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                <Link href="/refund" className="text-blue-600 hover:underline">Refund Policy</Link>
                <Link href="/contact" className="text-blue-600 hover:underline">Contact Us</Link>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
