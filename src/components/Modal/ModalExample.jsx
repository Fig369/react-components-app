import { useModalState } from '../../hooks';
import Modal from './Modal';
import Button from '../Button';
import Card, { CardHeader, CardBody, CardTitle, CardText, CardFooter, CardActions } from '../Card';
import { FiInfo, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

/**
 * Example component demonstrating Modal usage
 * Shows different modal sizes and configurations
 */
const ModalExample = () => {
  const smallModal = useModalState();
  const mediumModal = useModalState();
  const largeModal = useModalState();
  const fullscreenModal = useModalState();
  const customModal = useModalState();

  return (
    <div style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      <h2>Modal Component Examples</h2>
      
      {/* Trigger Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
        <Button onClick={smallModal.openModal}>Small Modal</Button>
        <Button onClick={mediumModal.openModal}>Medium Modal</Button>
        <Button onClick={largeModal.openModal}>Large Modal</Button>
        <Button onClick={fullscreenModal.openModal}>Fullscreen Modal</Button>
        <Button onClick={customModal.openModal}>Custom Modal</Button>
      </div>

      {/* Small Modal */}
      <Modal
        isOpen={smallModal.isOpen}
        onClose={smallModal.closeModal}
        size="small"
        title="Small Modal"
        ariaLabel="Small notification modal"
      >
        <div style={{ textAlign: 'center' }}>
          <FiCheckCircle size={48} style={{ color: 'var(--color-success-500)', marginBottom: '1rem' }} />
          <p>This is a small modal perfect for simple notifications or confirmations.</p>
          <Button onClick={smallModal.closeModal} style={{ marginTop: '1rem' }}>
            Got it!
          </Button>
        </div>
      </Modal>

      {/* Medium Modal */}
      <Modal
        isOpen={mediumModal.isOpen}
        onClose={mediumModal.closeModal}
        size="medium"
        title="Medium Modal"
        ariaLabel="Medium information modal"
      >
        <Card>
          <CardHeader>
            <CardTitle>Information</CardTitle>
          </CardHeader>
          <CardBody>
            <CardText>
              This is a medium-sized modal that can contain more content like forms, 
              detailed information, or moderate amounts of data. It's the default size 
              and works well for most use cases.
            </CardText>
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--color-info-50)', borderRadius: '8px' }}>
              <FiInfo style={{ marginRight: '0.5rem' }} />
              <strong>Tip:</strong> You can customize the modal content with any React components.
            </div>
          </CardBody>
          <CardFooter>
            <CardActions justify="end">
              <Button variant="outline" onClick={mediumModal.closeModal}>Cancel</Button>
              <Button onClick={mediumModal.closeModal}>Confirm</Button>
            </CardActions>
          </CardFooter>
        </Card>
      </Modal>

      {/* Large Modal */}
      <Modal
        isOpen={largeModal.isOpen}
        onClose={largeModal.closeModal}
        size="large"
        title="Large Modal"
        ariaLabel="Large content modal"
      >
        <Card>
          <CardHeader>
            <CardTitle>Large Modal Content</CardTitle>
          </CardHeader>
          <CardBody>
            <CardText>
              Large modals are perfect for complex forms, detailed views, or when you need 
              to display substantial amounts of information. They provide more horizontal space 
              while maintaining good readability.
            </CardText>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Feature 1</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Responsive design that adapts to different screen sizes.
                </p>
              </div>
              <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Feature 2</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Accessibility-first design with proper focus management.
                </p>
              </div>
              <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Feature 3</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Multiple closing methods: ESC, overlay click, or buttons.
                </p>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <CardActions justify="space-between">
              <Button variant="ghost" onClick={largeModal.closeModal}>Learn More</Button>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="outline" onClick={largeModal.closeModal}>Cancel</Button>
                <Button onClick={largeModal.closeModal}>Save Changes</Button>
              </div>
            </CardActions>
          </CardFooter>
        </Card>
      </Modal>

      {/* Fullscreen Modal */}
      <Modal
        isOpen={fullscreenModal.isOpen}
        onClose={fullscreenModal.closeModal}
        size="fullscreen"
        title="Fullscreen Modal"
        ariaLabel="Fullscreen application modal"
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CardHeader>
              <CardTitle>Fullscreen Experience</CardTitle>
            </CardHeader>
            <CardBody style={{ flex: 1, overflow: 'auto' }}>
              <CardText>
                Fullscreen modals are perfect for complex applications, detailed editors, 
                or when you need maximum space for content. On mobile devices, they take 
                up the entire viewport for an immersive experience.
              </CardText>
              
              <div style={{ marginTop: '2rem' }}>
                <h3>Sample Content</h3>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} style={{ 
                    padding: '1rem', 
                    margin: '1rem 0', 
                    backgroundColor: 'var(--color-surface-secondary)', 
                    borderRadius: '8px' 
                  }}>
                    <h4>Section {i + 1}</h4>
                    <p>
                      This is sample content to demonstrate scrolling behavior in a fullscreen modal. 
                      The modal content is scrollable when it exceeds the viewport height.
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
            <CardFooter>
              <CardActions justify="end">
                <Button variant="outline" onClick={fullscreenModal.closeModal}>Cancel</Button>
                <Button onClick={fullscreenModal.closeModal}>Done</Button>
              </CardActions>
            </CardFooter>
          </Card>
        </div>
      </Modal>

      {/* Custom Modal */}
      <Modal
        isOpen={customModal.isOpen}
        onClose={customModal.closeModal}
        size="medium"
        showCloseButton={false}
        closeOnOverlay={false}
        closeOnEscape={false}
        ariaLabel="Custom configuration modal"
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <FiAlertTriangle size={64} style={{ color: 'var(--color-warning-500)', marginBottom: '1rem' }} />
          <h3 style={{ margin: '0 0 1rem 0' }}>Custom Modal</h3>
          <p style={{ marginBottom: '2rem' }}>
            This modal has custom settings: no close button, no ESC key closing, 
            and no overlay click closing. You must use the button below.
          </p>
          <Button onClick={customModal.closeModal} variant="danger">
            Force Close
          </Button>
        </div>
      </Modal>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--color-info-50)', borderRadius: '8px' }}>
        <h3>Testing Instructions:</h3>
        <ul>
          <li><strong>ESC Key:</strong> Press ESC to close any modal (except the custom one)</li>
          <li><strong>Click Outside:</strong> Click on the dark overlay to close the modal</li>
          <li><strong>X Button:</strong> Click the X button in the top-right corner</li>
          <li><strong>Close Button:</strong> Use any Close/Cancel button in the modal</li>
        </ul>
      </div>
    </div>
  );
};

export default ModalExample;