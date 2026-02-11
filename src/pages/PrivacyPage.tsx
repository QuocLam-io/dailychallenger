import { NavSpacer } from "@/components/shared";

export default function PrivacyPage() {
  return (
    <>
      <NavSpacer />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Effective Date: October 01, 2025</p>

        <div className="space-y-6 text-gray-800">
          <p>
            We value your privacy and make every effort to respect your wishes
            and personal information. Please read this policy carefully to
            understand how we collect, use, and manage your phone numbers.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              Collection of Phone Numbers
            </h2>
            <p>
              We collect your phone numbers only when you voluntarily provide
              them to us, for example, during transactions, inquiries, or when
              you sign up for our promotional messages. You can opt in to
              receive these SMS messages by providing your phone number during
              our onboarding process.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              Use of Phone Numbers for SMS
            </h2>
            <p>
              Your phone numbers are primarily used to provide you with
              notifications when training is due, and can be used to reply if
              you have questions about specific training materials. SMS
              messaging charges may be applied by your carrier. We will only
              share your phone number with our SMS provider, subject to their
              privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              Opting Out of Marketing Messages
            </h2>
            <p>
              If at any time you wish to stop receiving messages from us, you
              can opt out by texting STOP.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              Privacy of Phone Numbers
            </h2>
            <p>
              Once you have opted out, we will not send you any more SMS
              messages, nor will we sell or transfer your phone number to
              another party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              Changes to This Policy
            </h2>
            <p>
              We may periodically update this policy. We will notify you about
              significant changes in the way we treat your information by
              placing a prominent notice on our site.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p>
              We thank you for your understanding and cooperation. If you have
              any questions or concerns about this policy, please feel free to
              contact us via the form on our site.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
