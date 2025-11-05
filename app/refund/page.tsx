import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Refund & Cancellation Policy</CardTitle>
            <p className="text-muted-foreground">Last Updated: November 5, 2025</p>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            {/* Business Information */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Business Information</h2>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Business Name:</strong> N Education</p>
                <p><strong>Website:</strong> home-loan-nextjs.onrender.com</p>
                <p><strong>Contact Email:</strong> dmcpexam2020@gmail.com</p>
                <p><strong>Product Type:</strong> Digital Product (No Physical Shipping)</p>
              </div>
            </section>

            {/* No Refund Policy - Highlighted */}
            <section className="border-2 border-red-300 bg-red-50 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-red-900 mb-3">No Refund Policy</h2>
                  <p className="text-red-800 font-semibold mb-3">
                    All sales are final. We do not offer refunds or cancellations for any reason.
                  </p>
                  <p className="text-red-700">
                    Once payment is completed and access is granted, the transaction cannot be reversed, refunded, or cancelled.
                  </p>
                </div>
              </div>
            </section>

            {/* Why No Refunds */}
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Why We Don't Offer Refunds</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  The Home Loan Toolkit is a <strong>digital product</strong> that provides immediate access to all content
                  upon successful payment. Due to the nature of digital products:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Content is delivered instantly and cannot be "returned"</li>
                  <li>Access to all strategies, calculators, and tools is granted immediately</li>
                  <li>Users can view, use, and benefit from all content right away</li>
                  <li>Once accessed, the digital content cannot be "un-accessed"</li>
                </ul>
              </div>
            </section>

            {/* Free Trial Option */}
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Try Before You Buy</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>To help you make an informed decision, we offer:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Strategy #1 (Bi-Weekly) - FREE:</strong> Full access without payment</li>
                  <li><strong>Detailed Preview:</strong> See exactly what type of content and calculators we provide</li>
                  <li><strong>Sample Calculations:</strong> Try the calculator functionality before purchasing</li>
                </ul>
                <p className="mt-3 font-semibold">
                  We strongly recommend reviewing the free strategy before making a purchase to ensure our content
                  meets your expectations.
                </p>
              </div>
            </section>

            {/* No Cancellation Policy */}
            <section>
              <h2 className="text-xl font-semibold mb-3">3. No Cancellation Policy</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  Once you complete the payment process, the transaction is final and cannot be cancelled. This applies to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Completed payments</li>
                  <li>Active subscriptions</li>
                  <li>Partially used access periods</li>
                </ul>
              </div>
            </section>

            {/* Payment Issues */}
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Payment Issues and Technical Problems</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>If you experience technical issues:</p>

                <h3 className="font-semibold mt-4">4.1 Payment Deducted But No Access</h3>
                <p>
                  If your payment was deducted but you didn't receive access, this is usually a temporary issue.
                  Please contact us at <strong>dmcpexam2020@gmail.com</strong> with:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Your email address used for sign-in</li>
                  <li>Payment transaction ID</li>
                  <li>Screenshot of payment confirmation</li>
                </ul>
                <p className="mt-2">
                  We will investigate and grant access within 24-48 hours if payment is verified.
                </p>

                <h3 className="font-semibold mt-4">4.2 Technical Issues with Content</h3>
                <p>
                  If you face technical issues accessing the content (broken links, non-working calculators, etc.),
                  please report them to us. We will fix technical issues but will not provide refunds.
                </p>

                <h3 className="font-semibold mt-4">4.3 Duplicate Charges</h3>
                <p>
                  If you were charged multiple times for the same purchase due to a technical error, contact us with
                  proof of duplicate charges, and we will process a refund for the duplicate payment only.
                </p>
              </div>
            </section>

            {/* No Shipping Policy */}
            <section>
              <h2 className="text-xl font-semibold mb-3">5. No Shipping Policy</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="font-semibold">This is a 100% digital product.</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>No physical products will be shipped</li>
                  <li>No delivery charges apply</li>
                  <li>Access is granted instantly online upon payment verification</li>
                  <li>You can access the toolkit from any device with internet connection</li>
                  <li>No courier services or logistics are involved</li>
                </ul>
              </div>
            </section>

            {/* Chargeback Warning */}
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Chargeback Warning</h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="font-semibold text-orange-700">
                  Important: Please do not file a chargeback or dispute with your bank without contacting us first.
                </p>
                <p>
                  If you file a chargeback:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your access will be immediately revoked</li>
                  <li>Your account will be permanently banned</li>
                  <li>We will contest the chargeback with evidence of service delivery</li>
                </ul>
                <p className="mt-3">
                  If you have any concerns, please email us at <strong>dmcpexam2020@gmail.com</strong> and we will
                  work with you to resolve the issue.
                </p>
              </div>
            </section>

            {/* Subscription Validity */}
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Subscription Validity and Expiration</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>Access Period:</strong> 1 year from the date of payment</p>
                <p>
                  After 1 year, your access will expire. To continue using the toolkit, you will need to purchase again
                  at the then-current price. No partial refunds will be provided for unused time.
                </p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify this Refund & Cancellation Policy at any time. Changes will be effective
                immediately upon posting. The policy in effect at the time of your purchase applies to your transaction.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
              <p className="text-muted-foreground mb-3">
                For any questions or concerns regarding this policy:
              </p>
              <div className="space-y-1">
                <p className="font-semibold">Email: dmcpexam2020@gmail.com</p>
                <p className="text-muted-foreground">Business Name: N Education</p>
                <p className="text-muted-foreground">Response Time: Within 24-48 hours</p>
              </div>
            </section>

            {/* Agreement */}
            <section className="border-t pt-6 mt-6">
              <p className="text-muted-foreground font-semibold">
                By making a purchase, you acknowledge that you have read, understood, and agree to this No Refund & No Cancellation Policy.
              </p>
            </section>

            {/* Links to Other Policies */}
            <section className="mt-6">
              <h3 className="font-semibold mb-3">Related Policies:</h3>
              <div className="flex flex-wrap gap-4">
                <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                <Link href="/contact" className="text-blue-600 hover:underline">Contact Us</Link>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
