import { forwardRef, useId, useState, useRef, useEffect } from 'react';
import styles from './Form.module.scss';

/**
 * Accessible Form component with built-in validation and error handling
 * Follows WCAG 2.1 AA standards for accessibility
 */
const Form = forwardRef(({
  children,
  onSubmit,
  className = '',
  noValidate = true,
  autoComplete = 'on',
  method = 'post',
  action,
  id,
  ...props
}, ref) => {
  const formId = useId();
  const actualId = id || formId;
  
  const handleSubmit = (e) => {
    if (onSubmit) {
      e.preventDefault();
      onSubmit(e);
    }
  };
  
  return (
    <form
      ref={ref}
      id={actualId}
      className={`${styles.form} ${className}`}
      onSubmit={handleSubmit}
      noValidate={noValidate}
      autoComplete={autoComplete}
      method={method}
      action={action}
      {...props}
    >
      {children}
    </form>
  );
});

Form.displayName = 'Form';

// Form Field Container
export const FormField = ({ children, className = '', ...props }) => (
  <div className={`${styles.formField} ${className}`} {...props}>
    {children}
  </div>
);

// Form Label with required indicator
export const FormLabel = ({ 
  children, 
  htmlFor, 
  required = false,
  srOnly = false,
  className = '', 
  ...props 
}) => (
  <label 
    htmlFor={htmlFor}
    className={`${styles.formLabel} ${srOnly ? styles.srOnly : ''} ${className}`}
    {...props}
  >
    {children}
    {required && <span className={styles.required} aria-label="required">*</span>}
  </label>
);

// Text Input with full accessibility
export const FormInput = forwardRef(({
  type = 'text',
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  readOnly = false,
  className = '',
  id,
  name,
  autoComplete,
  inputMode,
  pattern,
  placeholder,
  maxLength,
  minLength,
  ...props
}, ref) => {
  const inputId = useId();
  const actualId = id || inputId;
  const errorId = error ? `${actualId}-error` : undefined;
  const helperId = helperText ? `${actualId}-helper` : undefined;
  
  return (
    <FormField>
      {label && (
        <FormLabel htmlFor={actualId} required={required}>
          {label}
        </FormLabel>
      )}
      <input
        ref={ref}
        id={actualId}
        name={name || actualId}
        type={type}
        className={`${styles.formInput} ${error ? styles.hasError : ''} ${className}`}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        pattern={pattern}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
        {...props}
      />
      {helperText && (
        <FormHelperText id={helperId}>{helperText}</FormHelperText>
      )}
      {error && (
        <FormError id={errorId}>{error}</FormError>
      )}
    </FormField>
  );
});

FormInput.displayName = 'FormInput';

// Textarea with auto-resize option
export const FormTextarea = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  readOnly = false,
  rows = 4,
  autoResize = false,
  className = '',
  id,
  name,
  maxLength,
  ...props
}, ref) => {
  const textareaId = useId();
  const actualId = id || textareaId;
  const errorId = error ? `${actualId}-error` : undefined;
  const helperId = helperText ? `${actualId}-helper` : undefined;
  const textareaRef = useRef(null);
  const combinedRef = ref || textareaRef;
  
  useEffect(() => {
    if (autoResize && combinedRef.current) {
      const textarea = combinedRef.current;
      const adjustHeight = () => {
        // Use requestAnimationFrame to batch DOM operations
        requestAnimationFrame(() => {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        });
      };
      adjustHeight();
      textarea.addEventListener('input', adjustHeight);
      return () => textarea.removeEventListener('input', adjustHeight);
    }
  }, [autoResize, combinedRef]);
  
  return (
    <FormField>
      {label && (
        <FormLabel htmlFor={actualId} required={required}>
          {label}
        </FormLabel>
      )}
      <textarea
        ref={combinedRef}
        id={actualId}
        name={name || actualId}
        className={`${styles.formTextarea} ${error ? styles.hasError : ''} ${className}`}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
        {...props}
      />
      {maxLength && (
        <FormCharCount current={props.value?.length || 0} max={maxLength} />
      )}
      {helperText && (
        <FormHelperText id={helperId}>{helperText}</FormHelperText>
      )}
      {error && (
        <FormError id={errorId}>{error}</FormError>
      )}
    </FormField>
  );
});

FormTextarea.displayName = 'FormTextarea';

// Select dropdown
export const FormSelect = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  multiple = false,
  children,
  placeholder,
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const selectId = useId();
  const actualId = id || selectId;
  const errorId = error ? `${actualId}-error` : undefined;
  const helperId = helperText ? `${actualId}-helper` : undefined;
  
  return (
    <FormField>
      {label && (
        <FormLabel htmlFor={actualId} required={required}>
          {label}
        </FormLabel>
      )}
      <select
        ref={ref}
        id={actualId}
        name={name || actualId}
        className={`${styles.formSelect} ${error ? styles.hasError : ''} ${className}`}
        disabled={disabled}
        required={required}
        multiple={multiple}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      {helperText && (
        <FormHelperText id={helperId}>{helperText}</FormHelperText>
      )}
      {error && (
        <FormError id={errorId}>{error}</FormError>
      )}
    </FormField>
  );
});

FormSelect.displayName = 'FormSelect';

// Checkbox
export const FormCheckbox = forwardRef(({
  label,
  error,
  required = false,
  disabled = false,
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const checkboxId = useId();
  const actualId = id || checkboxId;
  const errorId = error ? `${actualId}-error` : undefined;
  
  return (
    <FormField className={styles.checkboxField}>
      <div className={styles.checkboxWrapper}>
        <input
          ref={ref}
          type="checkbox"
          id={actualId}
          name={name || actualId}
          className={`${styles.formCheckbox} ${error ? styles.hasError : ''} ${className}`}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId || undefined}
          {...props}
        />
        {label && (
          <FormLabel htmlFor={actualId} required={required} className={styles.checkboxLabel}>
            {label}
          </FormLabel>
        )}
      </div>
      {error && (
        <FormError id={errorId}>{error}</FormError>
      )}
    </FormField>
  );
});

FormCheckbox.displayName = 'FormCheckbox';

// Radio Group
export const FormRadioGroup = ({ 
  legend,
  error,
  required = false,
  children,
  className = '',
  name,
  ...props 
}) => {
  const groupId = useId();
  const errorId = error ? `${groupId}-error` : undefined;
  
  return (
    <FormField>
      <fieldset 
        className={`${styles.radioGroup} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId || undefined}
        {...props}
      >
        <legend className={styles.radioLegend}>
          {legend}
          {required && <span className={styles.required} aria-label="required">*</span>}
        </legend>
        <div className={styles.radioOptions}>
          {children}
        </div>
      </fieldset>
      {error && (
        <FormError id={errorId}>{error}</FormError>
      )}
    </FormField>
  );
};

// Radio Button
export const FormRadio = forwardRef(({
  label,
  disabled = false,
  className = '',
  id,
  name,
  value,
  ...props
}, ref) => {
  const radioId = useId();
  const actualId = id || radioId;
  
  return (
    <div className={styles.radioWrapper}>
      <input
        ref={ref}
        type="radio"
        id={actualId}
        name={name}
        value={value}
        className={`${styles.formRadio} ${className}`}
        disabled={disabled}
        {...props}
      />
      {label && (
        <label htmlFor={actualId} className={styles.radioLabel}>
          {label}
        </label>
      )}
    </div>
  );
});

FormRadio.displayName = 'FormRadio';

// File Upload
export const FormFileUpload = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  accept,
  multiple = false,
  className = '',
  id,
  name,
  onChange,
  ...props
}, ref) => {
  const fileId = useId();
  const actualId = id || fileId;
  const errorId = error ? `${actualId}-error` : undefined;
  const helperId = helperText ? `${actualId}-helper` : undefined;
  const [fileName, setFileName] = useState('');
  
  const handleChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setFileName(
        multiple 
          ? `${files.length} file(s) selected`
          : files[0].name
      );
    } else {
      setFileName('');
    }
    if (onChange) onChange(e);
  };
  
  return (
    <FormField>
      {label && (
        <FormLabel htmlFor={actualId} required={required}>
          {label}
        </FormLabel>
      )}
      <div className={styles.fileUploadWrapper}>
        <input
          ref={ref}
          type="file"
          id={actualId}
          name={name || actualId}
          className={styles.fileInput}
          disabled={disabled}
          required={required}
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          {...props}
        />
        <label htmlFor={actualId} className={styles.fileLabel}>
          <span className={styles.fileButton}>Choose File</span>
          <span className={styles.fileName}>
            {fileName || 'No file chosen'}
          </span>
        </label>
      </div>
      {helperText && (
        <FormHelperText id={helperId}>{helperText}</FormHelperText>
      )}
      {error && (
        <FormError id={errorId}>{error}</FormError>
      )}
    </FormField>
  );
});

FormFileUpload.displayName = 'FormFileUpload';

// Range Slider
export const FormRange = forwardRef(({
  label,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  disabled = false,
  className = '',
  id,
  name,
  value,
  ...props
}, ref) => {
  const rangeId = useId();
  const actualId = id || rangeId;
  
  return (
    <FormField>
      {label && (
        <FormLabel htmlFor={actualId}>
          {label}
        </FormLabel>
      )}
      <div className={styles.rangeWrapper}>
        <input
          ref={ref}
          type="range"
          id={actualId}
          name={name || actualId}
          className={`${styles.formRange} ${className}`}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          value={value}
          {...props}
        />
        {showValue && (
          <output className={styles.rangeValue} htmlFor={actualId}>
            {value || min}
          </output>
        )}
      </div>
    </FormField>
  );
});

FormRange.displayName = 'FormRange';

// Switch Toggle
export const FormSwitch = forwardRef(({
  label,
  disabled = false,
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const switchId = useId();
  const actualId = id || switchId;
  
  return (
    <FormField className={styles.switchField}>
      <div className={styles.switchWrapper}>
        <input
          ref={ref}
          type="checkbox"
          id={actualId}
          name={name || actualId}
          className={styles.switchInput}
          disabled={disabled}
          role="switch"
          {...props}
        />
        <label htmlFor={actualId} className={styles.switchLabel}>
          <span className={styles.switchTrack}>
            <span className={styles.switchThumb} />
          </span>
          {label && <span className={styles.switchText}>{label}</span>}
        </label>
      </div>
    </FormField>
  );
});

FormSwitch.displayName = 'FormSwitch';

// Helper Components
export const FormHelperText = ({ children, id, className = '', ...props }) => (
  <p id={id} className={`${styles.helperText} ${className}`} {...props}>
    {children}
  </p>
);

export const FormError = ({ children, id, className = '', ...props }) => (
  <p id={id} className={`${styles.errorText} ${className}`} role="alert" {...props}>
    {children}
  </p>
);

export const FormCharCount = ({ current, max }) => (
  <p className={styles.charCount} aria-live="polite">
    {current}/{max} characters
  </p>
);

export const FormFieldset = ({ legend, children, className = '', ...props }) => (
  <fieldset className={`${styles.fieldset} ${className}`} {...props}>
    {legend && <legend className={styles.legend}>{legend}</legend>}
    {children}
  </fieldset>
);

export const FormActions = ({ children, align = 'right', className = '', ...props }) => (
  <div 
    className={`${styles.formActions} ${className}`}
    data-align={align}
    {...props}
  >
    {children}
  </div>
);

export default Form;