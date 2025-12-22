import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-20">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Privacy Policy</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Privacy Policy</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-6 text-foreground">
              <section>
                <h3 className="text-lg font-semibold mb-3">1. Information We Collect</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We collect information you provide directly to us, such as when you create an account, submit recipes, or contact us. This may include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Name and contact information (phone number)</li>
                  <li>Account credentials (username and password)</li>
                  <li>Food preferences and interests</li>
                  <li>Recipe content, photos, and reviews</li>
                  <li>Usage data and preferences</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">2. How We Use Your Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Create and manage your account</li>
                  <li>Personalize your experience and content recommendations</li>
                  <li>Communicate with you about our services</li>
                  <li>Ensure the security and integrity of our platform</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">3. Information Sharing</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>With your explicit consent</li>
                  <li>To comply with legal requirements or court orders</li>
                  <li>To protect our rights, property, or safety, or that of our users</li>
                  <li>In connection with a business transfer or merger</li>
                  <li>With service providers who assist us in operating our platform</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">4. Data Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">5. Data Retention</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account and associated data at any time.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">6. Your Rights</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Access to your personal information</li>
                  <li>Correction of inaccurate or incomplete information</li>
                  <li>Deletion of your personal information</li>
                  <li>Restriction of processing</li>
                  <li>Data portability</li>
                  <li>Objection to processing</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">7. Cookies and Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and improve our services. You can control cookie settings through your browser preferences, though some features may not function properly if cookies are disabled.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">8. Children's Privacy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">9. International Data Transfers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">10. Changes to This Policy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our service after such changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">11. Contact Us</h3>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us through the application's support features. We will respond to your inquiries in a timely manner.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}