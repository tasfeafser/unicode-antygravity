import { ScrollArea } from "@/components/ui/scroll-area";

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        Terms of Service
      </h1>
      <p className="text-muted-foreground mb-12">Last updated: April 14, 2026</p>

      <div className="prose prose-invert max-w-none space-y-12 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Unicode Platform, you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
          <p>
            Unicode provides an AI-powered Computer Science education platform, including an IDE, 
            terminal simulation, and various educational tools. We reserve the right to modify or 
            discontinue parts of the service at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account information. 
            You must provide accurate and complete information when creating an account. 
            Unicode serves users globally but complies with international data standards.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">4. Acceptable Use</h2>
          <p>
            You agree not to use the service for any illegal or unauthorized purpose. 
            滥用系统资源, 如对AI模型进行压力测试或试图绕过安全性限制, 是严格禁止的。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">5. Intellectual Property</h2>
          <p>
            The Unicode Platform and its original content, features, and functionality are and will remain 
            the exclusive property of Unicode and its licensors. User-generated code remains 
            the property of the user, subject to our privacy policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">6. Limitation of Liability</h2>
          <p>
            In no event shall Unicode be liable for any indirect, incidental, special, consequential 
            or punitive damages resulting from your use of the service.
          </p>
        </section>
      </div>
    </div>
  );
}
