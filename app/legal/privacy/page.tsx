export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-600">
        Privacy Policy
      </h1>
      <p className="text-muted-foreground mb-12">Last updated: April 14, 2026</p>

      <div className="prose prose-invert max-w-none space-y-12 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
          <p>
            Unicode collects information that you provide directly to us when you create an account, 
            complete a profile, or use our educational tools. This includes your name, email address, 
            and code snippets you write in our IDE.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide and improve the Unicode Platform, 
            personalize your learning experience, and communicate with you about your progress. 
            我们将数据用于优化 AI 模型的响应，确保您获得最准确的编程建议。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Sharing and Disclosure</h2>
          <p>
            We do not sell your personal data. We may share information with third-party service 
            providers (like Clerk for authentication and Supabase for storage) who perform 
            services on our behalf.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">4. Your Rights and Choices</h2>
          <p>
            You have the right to access, correct, or delete your personal information. 
            You can manage your account settings or contact us directly to exercise these rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">5. Security</h2>
          <p>
            We take reasonable measures to protect your information from loss, theft, 
            misuse, and unauthorized access. However, no data transmission over the internet 
            can be guaranteed to be 100% secure.
          </p>
        </section>
      </div>
    </div>
  );
}
