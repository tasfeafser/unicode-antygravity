export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-600">
        Cookie Policy
      </h1>
      <p className="text-muted-foreground mb-12">Last updated: April 14, 2026</p>

      <div className="prose prose-invert max-w-none space-y-12 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">1. What are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device by websites that you visit. 
            They are widely used to make websites work more efficiently, as well as to provide 
            information to the owners of the site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Cookies</h2>
          <p>
            Unicode uses cookies for several reasons, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for the platform to function properly (e.g., authentication).</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how you use the platform via PostHog.</li>
            <li><strong>Preference Cookies:</strong> Remember your settings like theme and language.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">3. Managing Your Preferences</h2>
          <p>
            You can change your cookie preferences at any time by clicking the "Cookie Consent" button 
            at the bottom of our site. 您也可以在浏览器设置中禁用所有 cookie，但这可能会影响平台的部分功能。
          </p>
        </section>
      </div>
    </div>
  );
}
