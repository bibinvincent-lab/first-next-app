// src/lib/validation.js

// Email validation regex (RFC 5322 compliant)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Password validation
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

// Name validation (letters, spaces, hyphens, apostrophes)
const NAME_REGEX = /^[a-zA-Z\s'-]{1,100}$/;

// Phone number validation (international format)
const PHONE_REGEX = /^\+?[\d\s\-\(\)]{10,20}$/;

// Roll number validation (alphanumeric)
const ROLLNO_REGEX = /^[a-zA-Z0-9]{1,20}$/;

// Validate and sanitize email
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'Email is required' };
  }

  const trimmedEmail = email.trim().toLowerCase();
  
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return { valid: false, message: 'Invalid email format' };
  }

  if (trimmedEmail.length > 254) { // RFC 5321 limit
    return { valid: false, message: 'Email is too long' };
  }

  return { valid: true, sanitized: trimmedEmail };
}

// Validate password
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return { valid: false, message: `Password must be less than ${PASSWORD_MAX_LENGTH} characters` };
  }

  // Check for common weak passwords
  const commonPasswords = ['password', '12345678', 'qwerty123', 'admin123'];
  if (commonPasswords.includes(password.toLowerCase())) {
    return { valid: false, message: 'Password is too common. Please choose a stronger password' };
  }

  // Check for at least one letter and one number
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain at least one letter and one number' };
  }

  return { valid: true };
}

// Validate name
export function validateName(name, fieldName = 'Name') {
  if (!name || typeof name !== 'string') {
    return { valid: false, message: `${fieldName} is required` };
  }

  const trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    return { valid: false, message: `${fieldName} cannot be empty` };
  }

  if (!NAME_REGEX.test(trimmedName)) {
    return { valid: false, message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }

  return { valid: true, sanitized: trimmedName };
}

// Validate phone number
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, message: 'Phone number is required' };
  }

  const trimmedPhone = phone.trim();
  
  if (!PHONE_REGEX.test(trimmedPhone)) {
    return { valid: false, message: 'Invalid phone number format' };
  }

  return { valid: true, sanitized: trimmedPhone };
}

// Validate roll number
export function validateRollNo(rollNo) {
  if (!rollNo || typeof rollNo !== 'string') {
    return { valid: false, message: 'Roll number is required' };
  }

  const trimmedRollNo = rollNo.trim();
  
  if (!ROLLNO_REGEX.test(trimmedRollNo)) {
    return { valid: false, message: 'Roll number can only contain letters and numbers' };
  }

  return { valid: true, sanitized: trimmedRollNo };
}

// Validate age
export function validateAge(age) {
  const numAge = parseInt(age);
  
  if (isNaN(numAge)) {
    return { valid: false, message: 'Age must be a number' };
  }

  if (numAge < 0 || numAge > 150) {
    return { valid: false, message: 'Age must be between 0 and 150' };
  }

  return { valid: true, sanitized: numAge };
}

// Sanitize HTML content (strips all HTML tags for server-side safety)
export function sanitizeHtml(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  return content.replace(/<[^>]*>/g, '');
}

// Validate and sanitize user data
export function validateUserData(data) {
  const errors = [];
  const sanitized = {};

  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) {
    errors.push(emailValidation.message);
  } else {
    sanitized.email = emailValidation.sanitized;
  }

  // Validate name
  if (data.name !== undefined) {
    const nameValidation = validateName(data.name);
    if (!nameValidation.valid) {
      errors.push(nameValidation.message);
    } else {
      sanitized.name = nameValidation.sanitized;
    }
  }

  // Validate phone
  if (data.phoneno !== undefined) {
    const phoneValidation = validatePhone(data.phoneno);
    if (!phoneValidation.valid) {
      errors.push(phoneValidation.message);
    } else {
      sanitized.phoneno = phoneValidation.sanitized;
    }
  }

  // Validate roll number
  if (data.rollno !== undefined) {
    const rollNoValidation = validateRollNo(data.rollno);
    if (!rollNoValidation.valid) {
      errors.push(rollNoValidation.message);
    } else {
      sanitized.rollno = rollNoValidation.sanitized;
    }
  }

  // Validate age
  if (data.age !== undefined) {
    const ageValidation = validateAge(data.age);
    if (!ageValidation.valid) {
      errors.push(ageValidation.message);
    } else {
      sanitized.age = ageValidation.sanitized;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized
  };
}

// Sanitize search parameters
export function sanitizeSearchParams(searchParams) {
  const sanitized = {};
  
  for (const [key, value] of searchParams.entries()) {
    // Remove potentially dangerous characters
    const sanitizedKey = key.replace(/[<>'"&]/g, '');
    const sanitizedValue = value.toString().replace(/[<>'"&]/g, '');
    
    // Validate numeric parameters
    if (sanitizedKey.includes('page') || sanitizedKey.includes('limit') || sanitizedKey.includes('offset')) {
      const num = parseInt(sanitizedValue);
      if (!isNaN(num) && num > 0 && num <= 1000) {
        sanitized[sanitizedKey] = num;
      }
    } else {
      sanitized[sanitizedKey] = sanitizedValue.slice(0, 100); // Limit length
    }
  }
  
  return sanitized;
}
