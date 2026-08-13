# Privacy Policy

**Last Updated:** August 13, 2026  
**Effective Date:** August 13, 2026

## Introduction

Welcome to WordForge ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our word puzzle game application.

This policy applies to all users of WordForge, regardless of location, and complies with the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and other applicable privacy laws.

## 1. Information We Collect

### 1.1 Information You Provide Directly

When you create an account, we collect:

- **Account Information**: Email address, username (optional), first name, last name
- **Profile Information**: Bio, avatar/profile picture, theme preferences
- **Game Data**: Your gameplay history, scores, guesses, achievements, statistics
- **Settings**: Sound, display, accessibility preferences
- **Communications**: Messages you send through support or report features

### 1.2 Information Collected Automatically

When you use WordForge, we automatically collect:

- **Usage Data**: Game sessions, features used, time spent, interaction patterns
- **Device Information**: Browser type, operating system, screen resolution
- **Technical Data**: IP address (anonymized), session identifiers
- **Performance Data**: Error logs, crash reports, application performance metrics

### 1.3 Information from Third Parties

We receive information from our authentication provider:

- **Clerk Authentication**: Email verification status, OAuth profile information (if you sign in with Google/GitHub), security events

## 2. How We Use Your Information

We use your personal data for the following purposes:

### 2.1 Service Provision
- Create and manage your account
- Enable gameplay and track your progress
- Calculate scores, rankings, and leaderboards
- Provide personalized game recommendations
- Sync your data across devices

### 2.2 Service Improvement
- Analyze usage patterns to improve features
- Debug technical issues and prevent abuse
- Test new features and game modes
- Optimize performance and user experience

### 2.3 Communication
- Send service-related notifications (game results, achievements)
- Respond to your support requests
- Send security alerts and account updates

### 2.4 Security & Compliance
- Prevent fraud, cheating, and abuse
- Enforce our Terms of Service
- Comply with legal obligations
- Rate limiting and spam prevention (using anonymized IP addresses)

### 2.5 Legal Basis (GDPR)

We process your data based on:

- **Contract Performance**: Necessary to provide the service you requested
- **Legitimate Interest**: Fraud prevention, service improvement, security
- **Consent**: Marketing communications (if you opt-in)
- **Legal Obligation**: Compliance with applicable laws

## 3. How We Share Your Information

We do **not** sell your personal data. We share information only in the following limited circumstances:

### 3.1 Service Providers (Data Processors)

We work with trusted third-party service providers who process data on our behalf:

| Provider | Purpose | Data Shared | Location | Privacy Policy |
|----------|---------|-------------|----------|----------------|
| **Clerk** | Authentication & user management | Email, name, authentication data | United States | [Clerk Privacy Policy](https://clerk.com/legal/privacy) |
| **Neon** | Database hosting | All user data (encrypted at rest) | United States (AWS) | [Neon Privacy Policy](https://neon.tech/privacy-policy) |
| **Vercel** | Application hosting & CDN | Technical logs, IP addresses (anonymized) | Global edge network | [Vercel Privacy Policy](https://vercel.com/legal/privacy-policy) |

All processors have signed Data Processing Agreements (DPAs) and comply with GDPR.

### 3.2 Legal Requirements

We may disclose your information if required by law, court order, or government request, or to:

- Enforce our Terms of Service
- Protect our rights, property, or safety
- Prevent fraud or security threats
- Comply with legal processes

### 3.3 Business Transfers

If WordForge is involved in a merger, acquisition, or sale of assets, your information may be transferred. We will notify you via email and/or a prominent notice on our website before your data is transferred and becomes subject to a different privacy policy.

### 3.4 Public Information

Information you choose to make public (username, public profile, leaderboard rankings) may be visible to other users. Do not include sensitive information in public fields.

## 4. Data Retention

We retain your personal data only as long as necessary for the purposes outlined in this policy:

### 4.1 Active Accounts
- **Account data**: Retained while your account is active
- **Game history**: Retained for statistical analysis and leaderboards
- **Audit logs**: Retained for 1 year for security purposes

### 4.2 Inactive Accounts
- Accounts inactive for **2 years** will be automatically anonymized or deleted
- You will receive email notifications at 18 and 22 months of inactivity

### 4.3 Deleted Accounts
- Upon account deletion, your personal data is **permanently deleted within 30 days**
- Anonymized statistical data (e.g., aggregate game statistics) may be retained
- Backup copies deleted within 90 days

### 4.4 Legal Obligations
- Data required for legal compliance (e.g., audit logs for fraud investigations) may be retained longer as required by law

## 5. Your Privacy Rights

Depending on your location, you have the following rights:

### 5.1 GDPR Rights (EEA, UK, Switzerland)

You have the right to:

- ✅ **Access**: Request a copy of your personal data → Visit `/api/user/export`
- ✅ **Rectification**: Correct inaccurate data → Update in account settings
- ✅ **Erasure** ("Right to be Forgotten"): Delete your account → Contact support or delete via Clerk
- ✅ **Data Portability**: Export your data in JSON format → `/api/user/export`
- ✅ **Restrict Processing**: Limit how we use your data → Contact support
- ✅ **Object**: Object to processing based on legitimate interests → Contact support
- ✅ **Withdraw Consent**: Opt out of marketing emails → Account settings

### 5.2 CCPA Rights (California Residents)

You have the right to:

- **Know**: What personal information we collect and how we use it
- **Access**: Request your personal data (up to twice per year)
- **Delete**: Request deletion of your personal data
- **Opt-Out**: We do not sell personal data, so no opt-out is needed
- **Non-Discrimination**: We will not discriminate against you for exercising your rights

### 5.3 How to Exercise Your Rights

**Data Export:**
- Log in to your account
- Visit: `https://your-domain.vercel.app/api/user/export`
- Download your data in JSON format

**Account Deletion:**
- Log in to Clerk account settings
- Select "Delete Account"
- Confirm deletion
- All data will be permanently deleted within 30 days

**Other Requests:**
- Email: privacy@wordforge.com (replace with your support email)
- We will respond within 30 days (GDPR) or 45 days (CCPA)

## 6. Data Security

We implement industry-standard security measures to protect your data:

### 6.1 Technical Safeguards
- ✅ **Encryption**: Data encrypted in transit (TLS 1.3) and at rest (AES-256)
- ✅ **Authentication**: Secure authentication via Clerk with MFA support
- ✅ **Access Control**: Role-based access, principle of least privilege
- ✅ **IP Anonymization**: IP addresses hashed with SHA-256 before storage
- ✅ **Rate Limiting**: Protection against brute force and DDoS attacks
- ✅ **CSRF Protection**: Origin validation on all state-changing operations
- ✅ **Input Validation**: All inputs sanitized to prevent injection attacks

### 6.2 Organizational Safeguards
- Regular security audits and penetration testing
- Employee training on data protection
- Incident response plan for data breaches
- Secure development practices (OWASP guidelines)

### 6.3 Data Breach Notification

In the event of a data breach affecting your personal data, we will:
- Notify you within **72 hours** (GDPR requirement)
- Inform relevant supervisory authorities
- Provide details about the breach and steps to protect yourself

## 7. International Data Transfers

WordForge is hosted in the United States. If you access our service from outside the US, your data will be transferred to and processed in the United States.

We ensure adequate protection through:
- **Standard Contractual Clauses (SCCs)**: Approved by the European Commission
- **Data Processing Agreements**: With all processors
- **Security Measures**: Encryption and access controls

## 8. Children's Privacy

WordForge is **not directed to children under 13** (or 16 in the EEA). We do not knowingly collect personal information from children.

If we learn we have collected data from a child without parental consent, we will delete it immediately. Parents who believe their child's data has been collected should contact us at privacy@wordforge.com.

## 9. Cookies and Tracking

### 9.1 Essential Cookies

We use strictly necessary cookies for:
- **Authentication**: Clerk session cookies (HttpOnly, Secure, SameSite)
- **Security**: CSRF tokens and rate limiting

These cookies are required for the service to function and do not require consent.

### 9.2 Optional Cookies

We do **not** currently use:
- Marketing cookies
- Analytics cookies (Google Analytics, etc.)
- Social media tracking pixels

If we add optional cookies in the future, we will ask for your explicit consent via a cookie banner.

### 9.3 Do Not Track

We respect Do Not Track (DNT) signals. If your browser sends a DNT signal, we will not track your activity across websites.

## 10. Third-Party Links

WordForge may contain links to third-party websites (e.g., Clerk login, social media). We are not responsible for the privacy practices of these sites. Please review their privacy policies before providing personal information.

## 11. Changes to This Privacy Policy

We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of material changes by:

- Posting the updated policy with a new "Last Updated" date
- Sending an email notification (for significant changes)
- Displaying a prominent notice in the app

Your continued use of WordForge after changes indicates your acceptance of the updated policy.

## 12. Contact Us

If you have questions, concerns, or requests regarding this Privacy Policy or your personal data:

**Email:** privacy@wordforge.com (replace with your email)  
**Data Protection Officer:** dpo@wordforge.com (if applicable)  
**Address:** [Your business address]

**GDPR Representative (if applicable):**  
[EU representative name and address]

### Supervisory Authority

If you are in the EEA and believe we have not addressed your concerns, you have the right to lodge a complaint with your local data protection authority.

## 13. Consent

By creating an account and using WordForge, you acknowledge that you have read, understood, and agree to this Privacy Policy.

For marketing communications, we will ask for your explicit opt-in consent separately.

---

**Last reviewed:** August 13, 2026  
**Version:** 1.0
