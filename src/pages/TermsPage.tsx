import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

export default function TermsPage() {
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
            <h1 className="text-xl font-semibold text-foreground">Terms and Conditions</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Terms and Conditions</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-6 text-foreground">
              <section>
                <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using this recipe application ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">2. Use License</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Permission is granted to temporarily download one copy of the materials on our recipe application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained in the application</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">3. User Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Users may submit recipes, reviews, and other content to the Service. By submitting content, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, modify, and display such content. You are responsible for ensuring that your content does not violate any third-party rights or applicable laws.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">4. Account Responsibility</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">5. Prohibited Uses</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  You may not use our Service:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>for any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>to infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>to submit false or misleading information</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">6. Disclaimer</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The materials on our recipe application are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">7. Limitations</h3>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our recipe application, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">8. Accuracy of Materials</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The materials appearing on our recipe application could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">9. Modifications</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may revise these terms of service for its application at any time without notice. By using this application, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">10. Contact Information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms and Conditions, please contact us through the application's support features.
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