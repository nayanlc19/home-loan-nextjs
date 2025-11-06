import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last Updated: November 5, 2025</p>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            {/* Business Information */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Business Information</h2>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Legal Entity Name:</strong> N Education</p>
                <p><strong>Operating Address:</strong> Hyderabad, India</p>
                <p><strong>Website:</strong> home-loan-nextjs.onrender.com</p>
                <p><strong>Contact Email:</strong> dmcpexam2020@gmail.com</p>
                <p><strong>Phone Number:</strong> +91 7021761291</p>
              </div>
            </section>

            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground">
                N Education ("we," "us," or "our") operates the Home Loan Toolkit website. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>

              <h3 className="text-lg font-semibold mt-4 mb-2">2.1 Personal Information</h3>
              <p className="text-muted-foreground mb-2">We collect the following personal information:</p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li><strong>Name:</strong> From your Google account during sign-in</li>
                <li><strong>Email Address:</strong> From your Google account (used for account identification and payment linking)</li>
                <li><strong>Payment Information:</strong> Transaction details processed through Cashfree Payment Gateway (we do not store credit card details)</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4 mb-2">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4 mb-2">2.3 Cookies and Tracking</h3>
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to track activity on our website and store certain information.
                You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
              </p>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-2">We use the collected information for:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Account Management:</strong> To create and manage your account</li>
                <li><strong>Payment Processing:</strong> To process your payment and grant access to paid content</li>
                <li><strong>Service Delivery:</strong> To provide access to strategies, calculators, and tools</li>
                <li><strong>Communication:</strong> To respond to your inquiries and provide customer support</li>
                <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our services</li>
                <li><strong>Security:</strong> To detect, prevent, and address technical issues and fraudulent activities</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
              </ul>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
              <p className="text-muted-foreground mb-3">We use the following third-party services:</p>

              <h3 className="text-lg font-semibold mt-3 mb-2">4.1 Google OAuth</h3>
              <p className="text-muted-foreground">
                We use Google OAuth for authentication. By signing in with Google, you agree to Google's Privacy Policy
                and Terms of Service. We receive your name and email address from Google.
              </p>

              <h3 className="text-lg font-semibold mt-3 mb-2">4.2 Cashfree Payment Gateway</h3>
              <p className="text-muted-foreground">
                Payments are processed through Cashfree, a PCI-DSS compliant payment gateway. Your payment information
                (credit card details, UPI details, etc.) is handled directly by Cashfree and is not stored on our servers.
                Please review Cashfree's Privacy Policy for more information.
              </p>

              <h3 className="text-lg font-semibold mt-3 mb-2">4.3 Supabase (Database)</h3>
              <p className="text-muted-foreground">
                We use Supabase for secure data storage. Your subscription status and payment records are stored in
                encrypted databases hosted by Supabase.
              </p>

              <h3 className="text-lg font-semibold mt-3 mb-2">4.4 Render (Hosting)</h3>
              <p className="text-muted-foreground">
                Our website is hosted on Render. Server logs may be maintained by Render for security and performance purposes.
              </p>
            </section>

            {/* Data Sharing and Disclosure */}
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground mb-2">We do not sell, trade, or rent your personal information. We may share information:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>With Service Providers:</strong> Third-party services mentioned above (Google, Cashfree, Supabase, Render)</li>
                <li><strong>For Legal Compliance:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure authentication via Google OAuth</li>
                <li>PCI-DSS compliant payment processing</li>
                <li>Encrypted database storage</li>
                <li>Regular security audits and updates</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                <li><strong>Account Information:</strong> Retained for the duration of your subscription plus 1 year</li>
                <li><strong>Payment Records:</strong> Retained for 7 years as required by tax laws</li>
                <li><strong>Usage Data:</strong> Retained for 2 years for analytics purposes</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Your Rights</h2>
              <p className="text-muted-foreground mb-2">You have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data (subject to legal retention requirements)</li>
                <li><strong>Objection:</strong> Object to processing of your personal data</li>
                <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                To exercise these rights, please contact us at: <strong>dmcpexam2020@gmail.com</strong>
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-xl font-semibold mb-3">9. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our Service is intended for users aged 18 and above. We do not knowingly collect personal information
                from individuals under 18. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            {/* International Data Transfers */}
            <section>
              <h2 className="text-xl font-semibold mb-3">10. International Data Transfers</h2>
              <p className="text-muted-foreground">
                Your information may be transferred to and processed in countries other than India where our service
                providers operate. We ensure appropriate safeguards are in place to protect your information.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-xl font-semibold mb-3">11. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this
                Privacy Policy periodically for any changes.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="mt-3 space-y-1">
                <p><strong>Legal Entity Name:</strong> N Education</p>
                <p><strong>Email:</strong> dmcpexam2020@gmail.com</p>
                <p><strong>Phone:</strong> +91 7021761291</p>
                <p><strong>Address:</strong> Hyderabad, India</p>
              </div>
            </section>

            {/* Links to Other Policies */}
            <section className="border-t pt-6 mt-6">
              <h3 className="font-semibold mb-3">Related Policies:</h3>
              <div className="flex flex-wrap gap-4">
                <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
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
