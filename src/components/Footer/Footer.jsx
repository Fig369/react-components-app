import { FiGithub, FiTwitter, FiLinkedin, FiFacebook, FiMail, FiPhone, FiMapPin, FiExternalLink } from 'react-icons/fi';
import styles from './Footer.module.scss';

/**
 * Accessible Footer Component
 * 
 * Features:
 * - Multiple layout options (columns, sections)
 * - Social media links with proper ARIA labels
 * - Newsletter signup form
 * - Copyright and legal links
 * - Semantic HTML5 structure
 * - Screen reader friendly
 * - Mobile responsive
 * 
 * @param {Object} props - Component props
 * @param {Object} props.company - Company information
 * @param {Array} props.links - Footer link sections
 * @param {Array} props.social - Social media links
 * @param {boolean} props.showNewsletter - Show newsletter signup
 * @param {Function} props.onNewsletterSubmit - Newsletter submit handler
 * @param {string} props.className - Additional CSS classes
 */
const Footer = ({
  company = {
    name: 'Company Name',
    description: 'Building amazing products with modern technology.',
    copyright: `© ${new Date().getFullYear()} Company Name. All rights reserved.`
  },
  links = [],
  social = [],
  showNewsletter = true,
  onNewsletterSubmit,
  className = '',
  ...props
}) => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    if (onNewsletterSubmit) {
      onNewsletterSubmit(email);
    }
  };

  // Handle placeholder links to prevent page refresh
  const handlePlaceholderLink = (e, href) => {
    // If it's a placeholder link (# or starts with #), prevent default behavior
    if (href === '#' || (href.startsWith('#') && !document.querySelector(href))) {
      e.preventDefault();
      console.log(`Placeholder link clicked: ${href}`);
      return false;
    }
  };

  // Default social media links if none provided
  const defaultSocial = social.length > 0 ? social : [
    { 
      id: 'github',
      icon: FiGithub, 
      href: '#github', 
      label: 'GitHub',
      ariaLabel: 'Visit our GitHub profile (placeholder link)'
    },
    { 
      id: 'twitter',
      icon: FiTwitter, 
      href: '#twitter', 
      label: 'Twitter',
      ariaLabel: 'Follow us on Twitter (placeholder link)'
    },
    { 
      id: 'linkedin',
      icon: FiLinkedin, 
      href: '#linkedin', 
      label: 'LinkedIn',
      ariaLabel: 'Connect on LinkedIn (placeholder link)'
    },
    { 
      id: 'facebook',
      icon: FiFacebook, 
      href: '#facebook', 
      label: 'Facebook',
      ariaLabel: 'Like us on Facebook (placeholder link)'
    }
  ];

  // Default link sections if none provided
  const defaultLinks = links.length > 0 ? links : [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Documentation', href: '#docs' },
        { label: 'API', href: '#api' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Blog', href: '#blog' },
        { label: 'Careers', href: '#careers', badge: 'Hiring' },
        { label: 'Press', href: '#press' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#help' },
        { label: 'Contact Us', href: '#contact' },
        { label: 'Status', href: '#status' },
        { label: 'Terms of Service', href: '#terms' }
      ]
    }
  ];

  return (
    <footer 
      className={`${styles.footer} ${className}`}
      role="contentinfo"
      aria-label="Site footer"
      {...props}
    >
      <div className={styles.footerContent}>
        {/* Top Section */}
        <div className={styles.footerTop}>
          {/* Company Info */}
          <div className={styles.companySection}>
            <h2 className={styles.companyName}>
              {company.name}
            </h2>
            
            {/* Contact Info */}
            {company.contact && (
              <address className={styles.contactInfo}>
                {company.contact.email && (
                  <a 
                    href={`mailto:${company.contact.email}`}
                    className={styles.contactLink}
                    aria-label="Email us"
                    data-seo-element="contact-email"
                  >
                    <FiMail aria-hidden="true" />
                    {company.contact.email}
                  </a>
                )}
                {company.contact.phone && (
                  <a 
                    href={`tel:${company.contact.phone}`}
                    className={styles.contactLink}
                    aria-label="Call us"
                    data-seo-element="contact-phone"
                  >
                    <FiPhone aria-hidden="true" />
                    {company.contact.phone}
                  </a>
                )}
              </address>
            )}
          </div>

          {/* Link Sections */}
          <nav 
            className={styles.linkSections}
            aria-label="Footer navigation"
          >
            {defaultLinks.map((section, index) => (
              <div key={index} className={styles.linkSection}>
                <h3 className={styles.linkSectionTitle}>
                  {section.title}
                </h3>
                <ul className={styles.linkList}>
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className={styles.footerLink}
                        onClick={(e) => handlePlaceholderLink(e, link.href)}
                        data-seo-element={`footer-${section.title.toLowerCase()}-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {link.label}
                        {link.badge && (
                          <span className={styles.badge} aria-label={link.badge}>
                            {link.badge}
                          </span>
                        )}
                        {link.external && (
                          <FiExternalLink 
                            className={styles.externalIcon} 
                            aria-label="Opens in new window"
                          />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Newsletter Section */}
          {showNewsletter && (
            <div className={styles.newsletterSection}>
              <h3 className={styles.newsletterTitle}>
                Subscribe to our newsletter
              </h3>
              <p className={styles.newsletterDescription}>
                Get the latest updates and news delivered to your inbox.
              </p>
              <form 
                className={styles.newsletterForm}
                onSubmit={handleNewsletterSubmit}
                aria-label="Newsletter signup"
              >
                <div className={styles.formGroup}>
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className={styles.newsletterInput}
                    aria-describedby="newsletter-desc"
                    data-seo-element="newsletter-input"
                  />
                  <button 
                    type="submit"
                    className={styles.newsletterButton}
                    data-seo-element="newsletter-submit"
                  >
                    Subscribe
                  </button>
                </div>
                <p id="newsletter-desc" className={styles.newsletterNote}>
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
              
              {/* Social Media Links */}
              <nav aria-label="Social media links">
                <ul className={styles.socialLinks}>
                  {defaultSocial.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <a
                          href={item.href}
                          className={styles.socialLink}
                          onClick={(e) => handlePlaceholderLink(e, item.href)}
                          aria-label={item.ariaLabel || item.label}
                          target={item.href.startsWith('#') ? '_self' : '_blank'}
                          rel={item.href.startsWith('#') ? '' : 'noopener noreferrer'}
                          data-seo-element={`social-${item.id}`}
                        >
                          <Icon aria-hidden="true" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className={styles.footerBottom}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              {company.copyright}
            </p>
            
            {/* Legal Links */}
            <nav aria-label="Legal links">
              <ul className={styles.legalLinks}>
                <li>
                  <a 
                    href="#privacy"
                    className={styles.legalLink}
                    onClick={(e) => handlePlaceholderLink(e, '#privacy')}
                    data-seo-element="privacy-policy"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a 
                    href="#terms"
                    className={styles.legalLink}
                    onClick={(e) => handlePlaceholderLink(e, '#terms')}
                    data-seo-element="terms-of-service"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a 
                    href="#cookies"
                    className={styles.legalLink}
                    onClick={(e) => handlePlaceholderLink(e, '#cookies')}
                    data-seo-element="cookie-policy"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a 
                    href="#sitemap"
                    className={styles.legalLink}
                    onClick={(e) => handlePlaceholderLink(e, '#sitemap')}
                    data-seo-element="sitemap"
                  >
                    Sitemap
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Address at bottom */}
          {company.contact?.address && (
            <div className={styles.addressSection}>
              <address className={styles.address}>
                <FiMapPin aria-hidden="true" className={styles.addressIcon} />
                {company.contact.address}
              </address>
            </div>
          )}
        </div>
      </div>

      {/* Back to top button (optional) */}
      <button
        className={styles.backToTop}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        data-seo-element="back-to-top"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;