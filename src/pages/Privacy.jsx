import React from 'react';
import { Link } from 'react-router-dom';
import './Privacy.css';

function Privacy() {
  return (
    <div className="privacy">
      <div className="container">
        <Link to="/" className="back-link">← back</Link>
        <h1>Privacy Policy</h1>
        <p className="updated">Last updated: June 7, 2026</p>

        <section>
          <h2>Overview</h2>
          <p>
            This privacy policy applies to Ruby, an AI assistant operated by
            Shadow, and covers the chaoscat.win website and all connected
            messaging channels including Facebook Messenger.
          </p>
        </section>

        <section>
          <h2>Data We Receive from Messenger</h2>
          <p>
            When you send a message to Ruby through Facebook Messenger, we
            receive:
          </p>
          <ul>
            <li>Your message text and any attachments (images, files)</li>
            <li>Your Messenger PSID (Page-Scoped ID) — a unique identifier
              assigned by Meta for this Page interaction</li>
            <li>Your display name as it appears on Facebook</li>
          </ul>
          <p>
            We do <strong>not</strong> receive your Facebook profile URL,
            email address, phone number, friend list, or any other profile
            data beyond name and PSID.
          </p>
        </section>

        <section>
          <h2>How We Use Your Data</h2>
          <p>
            Message content and sender info are used solely to process your
            request and generate a response. Specifically:
          </p>
          <ul>
            <li>Your message text is sent to an AI model to generate a reply</li>
            <li>Your PSID is used to route replies back to you and to
              identify you across conversations</li>
            <li>Your display name is used to personalize interactions</li>
          </ul>
          <p>
            We do <strong>not</strong> use your data for advertising,
            profiling, audience building, or any purpose unrelated to
            responding to your messages.
          </p>
        </section>

        <section>
          <h2>Data Storage and Retention</h2>
          <p>
            Message content is held in active session memory only for the
            duration needed to maintain conversation context and is not
            persistently stored in a database. Session data is automatically
            purged after the conversation ends or times out.
          </p>
          <p>
            Your PSID and display name may be retained in local agent memory
            files for continuity across sessions (e.g., remembering who you
            are next time you message). You can request deletion of this
            data at any time.
          </p>
        </section>

        <section>
          <h2>Data Sharing</h2>
          <p>
            We do <strong>not</strong> sell, rent, or share your personal
            data with third parties. Message content is processed by the AI
            model provider configured for this agent. No other third parties
            receive your messages or identifying information.
          </p>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>
            Messages are processed by an AI model provider. That provider's
            own privacy policy governs how they handle data during model
            inference. The AI model provider does not use your messages to
            train or improve their models.
          </p>
          <p>
            This service is hosted on Cloudflare infrastructure. Cloudflare
            may process request data (IP addresses, headers) as part of
            delivering the service. See{' '}
            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
              Cloudflare's privacy policy
            </a>.
          </p>
        </section>

        <section>
          <h2>Website Visitors</h2>
          <p>
            The chaoscat.win website is a static art gallery. We don't use
            cookies, analytics, tracking pixels, or advertising networks on
            the site. We don't collect personal data from website visitors.
          </p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of any
            personal data we hold about you at any time by messaging Ruby
            directly or emailing{' '}
            <a href="mailto:rubyrunsstuff@gmail.com">rubyrunsstuff@gmail.com</a>.
          </p>
        </section>

        <section>
          <h2>Children's Privacy</h2>
          <p>
            This service is a personal AI assistant and is not directed at
            children under 13. We don't knowingly collect information from
            children. If we learn that a child under 13 has sent messages,
            we will delete the data promptly.
          </p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. The "Last updated"
            date at the top always reflects the current version. Continued
            use of the service after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            For privacy questions or data requests:{' '}
            <a href="mailto:rubyrunsstuff@gmail.com">rubyrunsstuff@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Privacy;