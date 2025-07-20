import './App.scss';
import { ThemeProvider } from './contexts/ThemeContext';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Button, { ButtonGroup } from './components/Button';
import Clock from './components/Clock';
import TeamSalesChart from './components/TeamSalesChart';
import Section from './components/Section';
import Modal from './components/Modal';
import Form, { 
  FormInput, 
  FormTextarea, 
  FormSelect, 
  FormCheckbox, 
  FormRadioGroup, 
  FormRadio, 
  FormFileUpload, 
  FormRange, 
  FormSwitch, 
  FormActions 
} from './components/Form';
import { FiArrowRight, FiDownload, FiHeart, FiSettings, FiFileText } from 'react-icons/fi';

// Configuration imports
import { navigationConfig, companyConfig, sectionConfig, demoConfig } from './config';

// Custom hooks
import { useFormDemo } from './hooks/demo/useFormDemo';
import { useButtonDemo } from './hooks/demo/useButtonDemo';
import { useNavigation } from './hooks/demo/useNavigation';

function App() {
  // Custom hooks for demo functionality
  const {
    isFormModalOpen,
    formData,
    handleFormSubmit,
    handleFormChange,
    openFormModal,
    closeFormModal
  } = useFormDemo();

  const {
    isDisabled,
    loading,
    handleClick,
    handleSubmit,
    toggleDisabled
  } = useButtonDemo();

  const { handleNavClick, handleNewsletterSubmit } = useNavigation(openFormModal);


  return (
    <ThemeProvider>
      <div className="App">
        <Nav 
          logo={navigationConfig.logo}
          items={navigationConfig.items}
          fixed={navigationConfig.fixed}
          onItemClick={handleNavClick}
        />
        
        <main role="main" aria-labelledby="main-title" id="main-content">
          {/* Hero Section */}
          <header className="app-header" role="banner">
            <h1 id="main-title">{sectionConfig.hero.title}</h1>
            <p className="app-tagline">
              {sectionConfig.hero.tagline}
            </p>
            
            {/* Form Demo Call-to-Action */}
            <div className="hero-actions" style={{ 
              marginTop: '2rem', 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
            </div>
            
            {/* Screen reader description */}
            <p id="form-demo-desc" className="sr-only">
              Open an interactive demonstration of all form components including inputs, selects, checkboxes, and validation features. When opened, focus will automatically move to the first form input for accessibility demonstration.
            </p>
          </header>
          <Section
            id={sectionConfig.sections[6].id}
            title={sectionConfig.sections[6].title}
            variant={sectionConfig.sections[6].variant}
            spacing={sectionConfig.sections[6].spacing}
          >
            <Clock />
          </Section>
          <Section
            id={sectionConfig.sections[0].id}
            title={sectionConfig.sections[0].title}
            variant={sectionConfig.sections[0].variant}
            hasGroup={sectionConfig.sections[0].hasGroup}
            groupLabel={sectionConfig.sections[0].groupLabel}
            descriptions={demoConfig.buttonDescriptions}
          >
            <Button 
              variant="primary" 
              aria-describedby="primary-desc"
              data-seo-element="primary-button"
            >
              Primary
            </Button>
            <Button 
              variant="secondary"
              aria-describedby="secondary-desc"
              data-seo-element="secondary-button"
            >
              Secondary
            </Button>
            <Button 
              variant="success"
              aria-describedby="success-desc"
              data-seo-element="success-button"
            >
              Success
            </Button>
            <Button 
              variant="danger"
              aria-describedby="danger-desc"
              data-seo-element="danger-button"
            >
              Danger
            </Button>
            <Button 
              variant="ghost"
              aria-describedby="ghost-desc"
              data-seo-element="ghost-button"
            >
              Ghost
            </Button>
            <Button 
              variant="outline"
              aria-describedby="outline-desc"
              data-seo-element="outline-button"
            >
              Outline
            </Button>
          </Section>

          <Section
            title={sectionConfig.sections[1].title}
            variant={sectionConfig.sections[1].variant}
            hasGroup={sectionConfig.sections[1].hasGroup}
            groupLabel={sectionConfig.sections[1].groupLabel}
            descriptions={demoConfig.sizeDescriptions}
          >
            <Button 
              size="small"
              data-seo-element="small-button"
              aria-describedby="small-desc"
            >
              Small
            </Button>
            <Button 
              size="medium"
              data-seo-element="medium-button"
              aria-describedby="medium-desc"
            >
              Medium
            </Button>
            <Button 
              size="large"
              data-seo-element="large-button"
              aria-describedby="large-desc"
            >
              Large
            </Button>
          </Section>

          <Section
            title={sectionConfig.sections[2].title}
            variant={sectionConfig.sections[2].variant}
            hasGroup={sectionConfig.sections[2].hasGroup}
            groupLabel={sectionConfig.sections[2].groupLabel}
            descriptions={demoConfig.iconDescriptions}
          >
            <Button 
              leftIcon={<FiDownload aria-hidden="true" />}
              data-seo-element="download-button"
              aria-describedby="download-desc"
            >
              Download
            </Button>
            <Button 
              rightIcon={<FiArrowRight aria-hidden="true" />}
              data-seo-element="continue-button"
              aria-describedby="continue-desc"
            >
              Continue
            </Button>
            <Button 
              leftIcon={<FiHeart aria-hidden="true" />} 
              variant="danger"
              data-seo-element="like-button"
              aria-describedby="like-desc"
            >
              Like
            </Button>
            <Button 
              iconOnly 
              onClick={handleClick}
              ariaLabel="Download file"
              variant="ghost"
              data-seo-element="icon-only-button"
              tabIndex={0}
            >
              <FiDownload aria-hidden="true" />
            </Button>
          </Section>

          <Section
            title={sectionConfig.sections[3].title}
            variant={sectionConfig.sections[3].variant}
            hasGroup={sectionConfig.sections[3].hasGroup}
            groupLabel={sectionConfig.sections[3].groupLabel}
            descriptions={demoConfig.stateDescriptions}
          >
            <Button 
              onClick={handleClick}
              data-seo-element="clickable-button"
              aria-describedby="clickable-desc"
            >
              Clickable
            </Button>
            <Button 
              disabled={isDisabled}
              data-seo-element="disabled-button"
              aria-describedby="disabled-desc"
            >
              {isDisabled ? 'Disabled' : 'Enabled'}
            </Button>
            <Button 
              variant="secondary" 
              onClick={toggleDisabled}
              leftIcon={<FiSettings aria-hidden="true" />}
              data-seo-element="settings-button"
              aria-describedby="settings-desc"
            >
              Toggle Disabled State
            </Button>
            <Button 
              loading={loading} 
              onClick={handleSubmit}
              data-seo-element="loading-button"
              aria-describedby="loading-desc"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
            <Button 
              fullWidth 
              variant="secondary"
              data-seo-element="full-width-button"
              aria-describedby="full-width-desc"
            >
              Full Width
            </Button>
          </Section>

          {/* Form Components Demo Section */}
          <Section
            id="forms-demo"
            title="Interactive Form Components"
            variant="highlight"
            spacing="large"
          >
            <div style={{ 
              textAlign: 'center', 
              maxWidth: '600px', 
              margin: '0 auto' 
            }}>
              <p style={{ 
                fontSize: '1.1rem', 
                marginBottom: '2rem', 
                color: 'var(--color-text-secondary)' 
              }}>
                Explore our comprehensive form component library with all input types, 
                validation, and accessibility features. Try the interactive demo to see 
                components in action.
              </p>
              
              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                marginBottom: '1rem'
              }}>
                <Button
                  variant="success"
                  size="large"
                  onClick={openFormModal}
                  leftIcon={<FiFileText aria-hidden="true" />}
                  rightIcon={<FiArrowRight aria-hidden="true" />}
                  data-seo-element="form-demo-main"
                  aria-describedby="form-features-desc"
                >
                  Open Form Demo
                </Button>
              </div>

              {/* Feature highlights */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                gap: '1rem', 
                marginTop: '2rem',
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)'
              }}>
                <div>✓ All Input Types</div>
                <div>✓ Form Validation</div>
                <div>✓ Focus Management</div>
                <div>✓ Accessibility Ready</div>
                <div>✓ Mobile Responsive</div>
              </div>
              
              {/* Screen reader description */}
              <p id="form-features-desc" className="sr-only">
                Interactive form demonstration featuring text inputs, textareas, selects, 
                checkboxes, radio buttons, file uploads, range sliders, switches, and 
                comprehensive validation with full accessibility support. Focus demo automatically 
                highlights the first input field when the modal opens to demonstrate proper focus management.
              </p>
            </div>
          </Section>

          <Section
            title={sectionConfig.sections[4].title}
            variant={sectionConfig.sections[4].variant}
            descriptions={demoConfig.groupDescriptions}
          >
            <ButtonGroup aria-label="Grouped button options" data-seo-element="button-group">
              <Button 
                variant="outline"
                data-seo-element="group-left-button"
                aria-describedby="group-left-desc"
              >
                Left
              </Button>
              <Button 
                variant="outline"
                data-seo-element="group-center-button"
                aria-describedby="group-center-desc"
              >
                Center
              </Button>
              <Button 
                variant="outline"
                data-seo-element="group-right-button"
                aria-describedby="group-right-desc"
              >
                Right
              </Button>
            </ButtonGroup>
          </Section>

          <Section
            id={sectionConfig.sections[7].id}
            title={sectionConfig.sections[7].title}
            variant={sectionConfig.sections[7].variant}
            spacing={sectionConfig.sections[7].spacing}
          >
            <TeamSalesChart />
          </Section>
        </main>

        {/* Form Demo Modal */}
        <Modal
          isOpen={isFormModalOpen}
          onClose={closeFormModal}
          title="Form Components Demo"
          size="large"
          ariaLabel="Form components demonstration modal"
        >
          <Form onSubmit={handleFormSubmit}>
            <FormInput
              label="Full Name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              placeholder="Enter your full name"
              helperText="This field is required"
            />

            <FormInput
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
            />

            <FormSelect
              label="Category"
              required
              value={formData.category}
              onChange={(e) => handleFormChange('category', e.target.value)}
              placeholder="Select a category"
            >
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="billing">Billing Question</option>
              <option value="feedback">Feedback</option>
            </FormSelect>

            <FormTextarea
              label="Message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) => handleFormChange('message', e.target.value)}
              placeholder="Please describe your inquiry"
              helperText="Minimum 10 characters required"
              maxLength={500}
            />

            <FormRadioGroup
              legend="Priority Level"
              name="priority"
              required
            >
              <FormRadio
                label="Low"
                name="priority"
                value="low"
                checked={formData.priority === 'low'}
                onChange={(e) => handleFormChange('priority', e.target.value)}
              />
              <FormRadio
                label="Medium"
                name="priority"
                value="medium"
                checked={formData.priority === 'medium'}
                onChange={(e) => handleFormChange('priority', e.target.value)}
              />
              <FormRadio
                label="High"
                name="priority"
                value="high"
                checked={formData.priority === 'high'}
                onChange={(e) => handleFormChange('priority', e.target.value)}
              />
            </FormRadioGroup>

            <FormRange
              label="Volume Preference"
              min={0}
              max={100}
              value={formData.volume}
              onChange={(e) => handleFormChange('volume', e.target.value)}
              showValue
            />

            <FormCheckbox
              label="Subscribe to newsletter"
              checked={formData.newsletter}
              onChange={(e) => handleFormChange('newsletter', e.target.checked)}
            />

            <FormSwitch
              label="Enable notifications"
              checked={formData.notifications}
              onChange={(e) => handleFormChange('notifications', e.target.checked)}
            />

            <FormFileUpload
              label="Attach file (optional)"
              accept=".pdf,.doc,.docx,.txt"
              helperText="Supported formats: PDF, DOC, DOCX, TXT (max 5MB)"
            />

            <FormActions align="right">
              <Button
                type="button"
                variant="secondary"
                onClick={closeFormModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                Submit Form
              </Button>
            </FormActions>
          </Form>
        </Modal>
        
        <Footer 
          company={companyConfig}
          onNewsletterSubmit={handleNewsletterSubmit}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;