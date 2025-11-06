import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Mail, Building2, Globe, Clock } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Contact Us</CardTitle>
            <p className="text-muted-foreground">Get in touch with us for any questions or support</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Business Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Business Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Legal Entity Name</h3>
                    <p className="text-muted-foreground">N Education</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Operating Address</h3>
                    <p className="text-muted-foreground">Maharashtra, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <Globe className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Website</h3>
                    <p className="text-muted-foreground">home-loan-nextjs.onrender.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:dmcpexam2020@gmail.com" className="text-blue-600 hover:underline">
                      dmcpexam2020@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone Number</h3>
                    <a href="tel:+917021761291" className="text-blue-600 hover:underline">
                      +91 7021761291
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Response Time</h3>
                    <p className="text-muted-foreground">Within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </section>

            {/* What We Can Help With */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">What We Can Help With</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4 py-2">
                  <h3 className="font-semibold mb-1">Payment Issues</h3>
                  <p className="text-muted-foreground text-sm">
                    Payment deducted but no access, duplicate charges, transaction verification
                  </p>
                </div>

                <div className="border-l-4 border-green-600 pl-4 py-2">
                  <h3 className="font-semibold mb-1">Access Problems</h3>
                  <p className="text-muted-foreground text-sm">
                    Can't sign in, subscription not showing, strategies locked
                  </p>
                </div>

                <div className="border-l-4 border-purple-600 pl-4 py-2">
                  <h3 className="font-semibold mb-1">Technical Support</h3>
                  <p className="text-muted-foreground text-sm">
                    Broken calculators, non-loading pages, display issues
                  </p>
                </div>

                <div className="border-l-4 border-orange-600 pl-4 py-2">
                  <h3 className="font-semibold mb-1">General Inquiries</h3>
                  <p className="text-muted-foreground text-sm">
                    Questions about strategies, content, features, or pricing
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Guidelines */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Before You Contact Us</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
                <p className="font-semibold text-blue-900">Please include the following information in your email:</p>
                <ul className="list-disc pl-6 space-y-2 text-blue-800 text-sm">
                  <li><strong>Your Name:</strong> As registered on the platform</li>
                  <li><strong>Email Address:</strong> The email you used to sign in/purchase</li>
                  <li><strong>Issue Description:</strong> Detailed explanation of your problem</li>
                  <li><strong>Screenshots:</strong> If applicable (payment confirmation, error messages)</li>
                  <li><strong>Transaction ID:</strong> For payment-related queries</li>
                  <li><strong>Browser/Device:</strong> For technical issues</li>
                </ul>
                <p className="text-blue-700 text-sm mt-4">
                  Providing complete information helps us resolve your issue faster!
                </p>
              </div>
            </section>

            {/* FAQ Link */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Common Questions</h2>
              <p className="text-muted-foreground mb-4">
                Before reaching out, check if your question is answered in our policies:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/terms">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Terms of Service</h3>
                      <p className="text-sm text-muted-foreground">
                        Service terms, pricing, and usage guidelines
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/refund">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Refund Policy</h3>
                      <p className="text-sm text-muted-foreground">
                        Information about our no-refund policy
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/privacy">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">Privacy Policy</h3>
                      <p className="text-sm text-muted-foreground">
                        How we handle your data and privacy
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </section>

            {/* Product Information */}
            <section className="border-t pt-6">
              <h2 className="text-2xl font-semibold mb-4">About Our Product</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong>Product:</strong> Home Loan Toolkit - Digital educational content and calculators
                </p>
                <p>
                  <strong>Type:</strong> Digital Product (No Physical Shipping)
                </p>
                <p>
                  <strong>Price:</strong> ₹99 (One-time payment)
                </p>
                <p>
                  <strong>Access:</strong> 1 year from payment date
                </p>
                <p>
                  <strong>Free Trial:</strong> Strategy #1 (Bi-Weekly) available without payment
                </p>
              </div>
            </section>

            {/* Direct Email CTA */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">Ready to Get in Touch?</h2>
              <p className="mb-6 opacity-90">
                We're here to help! Send us an email and we'll respond within 24-48 hours.
              </p>
              <a
                href="mailto:dmcpexam2020@gmail.com"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Email Us Now
              </a>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
