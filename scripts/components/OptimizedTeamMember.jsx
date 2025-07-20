import React from 'react';
import { useOptimizedImage, OptimizedImage } from '../../src/hooks/useOptimizedImage';
import Card, { 
  CardHeader, 
  CardBody, 
  CardTitle, 
  CardText, 
  CardFooter,
  CardActions,
  CardAvatar 
} from '../../src/components/Card';
import Button from '../../src/components/Button';
import { FiMail, FiLinkedin, FiMapPin, FiPhone, FiCalendar } from 'react-icons/fi';

/**
 * Production-ready team member component using optimized images
 * Demonstrates real-world usage with Jay Figueroa's data
 */
const OptimizedTeamMember = ({ showDebugInfo = false }) => {
  // Jay Figueroa's team member data
  const jayFigueroa = {
    user: "USR011",
    email: "jay.figueroa@company.com", 
    linkedin: "https://linkedin.com/in/jay-figueroa-sales",
    phone: "+1 (555) 123-4567",
    firstName: "Jay",
    lastName: "Figueroa", 
    birthday: "1988-02-14",
    role: "Senior Account Executive",
    region: "West Coast",
    department: "Enterprise Sales",
    joinDate: "2019-03-15",
    bio: "Results-driven sales professional with 8+ years experience in enterprise software solutions. Specializes in large-scale implementations and strategic account management. Passionate about building long-term client relationships and driving digital transformation initiatives.",
    skills: ["Enterprise Sales", "Account Management", "SaaS Solutions", "Contract Negotiation", "Customer Success"],
    achievements: [
      "Top performer for 3 consecutive years (2021-2023)",
      "Closed largest deal in company history ($2.5M)",
      "Maintained 95% customer retention rate",
      "Led expansion into Pacific Northwest market"
    ]
  };

  // Use optimized image hook for Jay's profile photo
  const profileImage = useOptimizedImage('JayFig', {
    sizes: '(max-width: 480px) 120px, (max-width: 768px) 150px, 200px',
    eager: true // Profile images should load immediately
  });

  // Handle email contact
  const handleEmailContact = () => {
    window.location.href = `mailto:${jayFigueroa.email}?subject=Sales Inquiry&body=Hi Jay,%0D%0A%0D%0AI'd like to discuss...`;
  };

  // Handle LinkedIn profile view
  const handleLinkedInView = () => {
    window.open(jayFigueroa.linkedin, '_blank', 'noopener,noreferrer');
  };

  // Format join date
  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate years of service
  const calculateYearsOfService = (joinDate) => {
    const join = new Date(joinDate);
    const now = new Date();
    const years = Math.floor((now - join) / (365.25 * 24 * 60 * 60 * 1000));
    return years;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Card variant="elevated" elevation="high">
        <CardHeader>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {/* Profile Image using OptimizedImage component */}
            <div style={{ flexShrink: 0 }}>
              <OptimizedImage
                name="JayFig"
                alt={`${jayFigueroa.firstName} ${jayFigueroa.lastName} - ${jayFigueroa.role}`}
                sizes="(max-width: 480px) 120px, (max-width: 768px) 150px, 200px"
                eager={true}
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  borderRadius: '12px',
                  objectFit: 'cover',
                  border: '3px solid var(--color-border-subtle)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '250px' }}>
              <CardTitle style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {jayFigueroa.firstName} {jayFigueroa.lastName}
              </CardTitle>
              
              <CardText style={{ 
                fontSize: '1.25rem', 
                color: 'var(--color-text-secondary)',
                marginBottom: '1rem'
              }}>
                {jayFigueroa.role}
              </CardText>

              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.5rem',
                fontSize: '0.95rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiMapPin aria-hidden="true" style={{ color: 'var(--color-text-secondary)' }} />
                  <span>{jayFigueroa.region} • {jayFigueroa.department}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiCalendar aria-hidden="true" style={{ color: 'var(--color-text-secondary)' }} />
                  <span>
                    Joined {formatJoinDate(jayFigueroa.joinDate)} 
                    ({calculateYearsOfService(jayFigueroa.joinDate)} years)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          {/* About Section */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              marginBottom: '1rem',
              color: 'var(--color-text-primary)'
            }}>
              About Jay
            </h3>
            <CardText style={{ lineHeight: 1.6 }}>
              {jayFigueroa.bio}
            </CardText>
          </section>

          {/* Skills Section */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              marginBottom: '1rem',
              color: 'var(--color-text-primary)'
            }}>
              Core Skills
            </h3>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.5rem' 
            }}>
              {jayFigueroa.skills.map((skill, index) => (
                <span 
                  key={index}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--color-primary-50)',
                    color: 'var(--color-primary-700)',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    border: '1px solid var(--color-primary-200)'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Achievements Section */}
          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              marginBottom: '1rem',
              color: 'var(--color-text-primary)'
            }}>
              Key Achievements
            </h3>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              margin: 0
            }}>
              {jayFigueroa.achievements.map((achievement, index) => (
                <li 
                  key={index}
                  style={{
                    padding: '0.75rem 0',
                    borderBottom: index < jayFigueroa.achievements.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}
                >
                  <span style={{ 
                    color: 'var(--color-success-500)',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    lineHeight: 1
                  }}>
                    ✓
                  </span>
                  <span style={{ flex: 1, lineHeight: 1.5 }}>
                    {achievement}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Contact Information */}
          <section>
            <h3 style={{ 
              fontSize: '1.25rem', 
              marginBottom: '1rem',
              color: 'var(--color-text-primary)'
            }}>
              Contact Information
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{ 
                padding: '1rem',
                backgroundColor: 'var(--color-background-subtle)',
                borderRadius: '8px',
                border: '1px solid var(--color-border-subtle)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <FiMail style={{ color: 'var(--color-primary-500)' }} />
                  <strong>Email</strong>
                </div>
                <a 
                  href={`mailto:${jayFigueroa.email}`}
                  style={{
                    color: 'var(--color-primary-600)',
                    textDecoration: 'none',
                    fontSize: '0.95rem'
                  }}
                  onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                >
                  {jayFigueroa.email}
                </a>
              </div>

              <div style={{ 
                padding: '1rem',
                backgroundColor: 'var(--color-background-subtle)',
                borderRadius: '8px',
                border: '1px solid var(--color-border-subtle)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <FiPhone style={{ color: 'var(--color-primary-500)' }} />
                  <strong>Phone</strong>
                </div>
                <a 
                  href={`tel:${jayFigueroa.phone}`}
                  style={{
                    color: 'var(--color-primary-600)',
                    textDecoration: 'none',
                    fontSize: '0.95rem'
                  }}
                  onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                >
                  {jayFigueroa.phone}
                </a>
              </div>
            </div>
          </section>
        </CardBody>

        <CardFooter>
          <CardActions justify="space-between">
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button
                variant="primary"
                onClick={handleEmailContact}
                leftIcon={<FiMail aria-hidden="true" />}
                aria-label={`Send email to ${jayFigueroa.firstName}`}
              >
                Send Email
              </Button>
              
              <Button
                variant="outline"
                onClick={handleLinkedInView}
                leftIcon={<FiLinkedin aria-hidden="true" />}
                aria-label={`View ${jayFigueroa.firstName}'s LinkedIn profile`}
              >
                LinkedIn
              </Button>
            </div>

            {showDebugInfo && (
              <Button
                variant="ghost"
                size="small"
                onClick={() => console.log('Image Debug Info:', profileImage)}
              >
                Debug Info
              </Button>
            )}
          </CardActions>
        </CardFooter>
      </Card>

      {/* Debug Information Panel */}
      {showDebugInfo && (
        <Card 
          variant="bordered" 
          style={{ 
            marginTop: '2rem',
            backgroundColor: 'var(--color-background-subtle)'
          }}
        >
          <CardHeader>
            <CardTitle style={{ fontSize: '1.1rem' }}>
              Image Optimization Debug Info
            </CardTitle>
          </CardHeader>
          
          <CardBody>
            <div style={{ 
              fontFamily: 'monospace', 
              fontSize: '0.85rem',
              backgroundColor: 'var(--color-background)',
              padding: '1rem',
              borderRadius: '4px',
              border: '1px solid var(--color-border-subtle)',
              overflow: 'auto'
            }}>
              <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Profile Image Optimization:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.5rem 1rem' }}>
                <strong>Source:</strong> 
                <span>{profileImage.src}</span>
                
                <strong>WebP Support:</strong> 
                <span style={{ color: profileImage.supportsWebP ? 'green' : 'orange' }}>
                  {profileImage.supportsWebP ? 'Yes ✓' : 'No (using fallback)'}
                </span>
                
                <strong>Loading:</strong> 
                <span>{profileImage.loading}</span>
                
                <strong>SrcSet:</strong> 
                <span style={{ wordBreak: 'break-all' }}>
                  {profileImage.srcSet || 'None'}
                </span>
                
                <strong>Sizes:</strong> 
                <span>{profileImage.sizes || 'None'}</span>
                
                <strong>WebP Source:</strong> 
                <span style={{ wordBreak: 'break-all' }}>
                  {profileImage.webpSrc || 'Not available'}
                </span>
                
                <strong>Original Source:</strong> 
                <span style={{ wordBreak: 'break-all' }}>
                  {profileImage.originalSrc}
                </span>
              </div>
              
              <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Performance Benefits:</h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>WebP format provides ~30-40% smaller file sizes</li>
                <li>Responsive images serve appropriate sizes for different screens</li>
                <li>Lazy loading improves initial page load performance</li>
                <li>Async decoding prevents UI blocking during image processing</li>
                <li>Automatic fallback ensures broad browser compatibility</li>
              </ul>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default OptimizedTeamMember;