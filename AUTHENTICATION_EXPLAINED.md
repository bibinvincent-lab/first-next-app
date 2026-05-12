# Complete Authentication System Explained
*A Simple Guide for Everyone*

## Table of Contents
1. [What is Authentication?](#what-is-authentication)
2. [How Our System Works: The Big Picture](#how-our-system-works-the-big-picture)
3. [Session Management](#session-management)
4. [User Registration](#user-registration)
5. [User Login](#user-login)
6. [Session Checking](#session-checking)
7. [User Logout](#user-logout)
8. [Security Features](#security-features)
9. [Frontend Components](#frontend-components)
10. [Database Structure](#database-structure)

---

## What is Authentication?

**Authentication** is like showing your ID card to prove who you are. In our website, it's the process that ensures:

- Users are who they claim to be
- Only authorized users can access certain pages
- User data stays private and secure

Think of it like a building with security guards:
- **Registration**: Getting your ID card made
- **Login**: Showing your ID to enter the building
- **Session**: The time you're allowed inside
- **Logout**: Leaving the building and returning your ID

---

## How Our System Works: The Big Picture

```
User → Frontend (React) → API Routes (Server) → Database → Security Checks
```

1. **User Interface**: Beautiful forms where users type their email/password
2. **API Routes**: Security guards that check everything
3. **Database**: Secure storage for user information
4. **Security Features**: Extra protection against bad guys

---

## Session Management

### File: `src/lib/session.js`

This file is like the **building's access control system**. It manages how long users can stay logged in.

#### Configuration Settings (Lines 5-10)
```javascript
export const SESSION_CONFIG = {
  EXPIRY_MINUTES: 30,        // Users automatically logout after 30 minutes
  INACTIVITY_MINUTES: 15,   // Users logout if idle for 15 minutes
  TOKEN_LENGTH: 64,          // Length of the secret passcode
  MAX_CONCURRENT_SESSIONS: 3 // Max devices logged in at once
};
```

**Why these settings matter:**
- **30-minute timeout**: Prevents others from using your computer if you forget to logout
- **15-minute inactivity**: Logs you out if you walk away from your computer
- **64-character tokens**: Makes it impossible for hackers to guess your session code

#### Session Token Generation (Lines 13-15)
```javascript
export const generateSessionToken = () => {
  return randomBytes(SESSION_CONFIG.TOKEN_LENGTH).toString('hex');
};
```

**What this does:**
- Creates a super-secret random code (like a temporary password)
- Uses computer's built-in randomness generator
- Converts it to readable letters and numbers
- This token is stored in your browser's cookie

#### Session Expiry Check (Lines 18-22)
```javascript
export const calculateSessionExpiry = () => {
  const now = new Date();
  const expiry = new Date(now.getTime() + SESSION_CONFIG.EXPIRY_MINUTES * 60 * 1000);
  return expiry;
};
```

**Simple explanation:**
- Takes current time
- Adds 30 minutes
- Returns the exact time when session should end

#### Session Validation (Lines 25-41)
```javascript
export const isSessionExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};

export const isValidSessionToken = (token) => {
  return typeof token === 'string' && 
         token.length === SESSION_CONFIG.TOKEN_LENGTH * 2 && 
         /^[a-f0-9]+$/i.test(token);
};
```

**What these check:**
- `isSessionExpired`: Has the 30-minute timer run out?
- `isValidSessionToken`: Is this a real token from our system?
  - Must be a string (text)
  - Must be exactly 128 characters long (64 × 2)
  - Must only contain letters a-f and numbers 0-9

#### Database Cleanup (Lines 44-55)
```javascript
export const cleanExpiredSessions = async (connection) => {
  try {
    const [result] = await connection.execute(
      'DELETE FROM user_sessions WHERE expires_at < NOW() OR last_activity < DATE_SUB(NOW(), INTERVAL ? MINUTE)',
      [SESSION_CONFIG.INACTIVITY_MINUTES]
    );
    return result.affectedRows;
  } catch (error) {
    console.error('Error cleaning expired sessions:', error);
    return 0;
  }
};
```

**Why this is important:**
- Removes old, expired sessions from database
- Keeps database clean and fast
- Prevents memory leaks
- Like cleaning up old visitor passes

---

## User Registration

### File: `src/app/api/auth/register/route.js`

This is like the **ID card application office** where new users get their credentials.

#### Rate Limiting (Lines 7-19)
```javascript
const rateLimitResult = await checkRateLimit(req, 'REGISTER');
if (!rateLimitResult.allowed) {
  if (rateLimitResult.blocked) {
    const clientId = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    await logRateLimitViolation(req, 'REGISTER', clientId);
  }
  return NextResponse.json(
    { success: false, message: rateLimitResult.message },
    { status: 429 }
  );
}
```

**What this prevents:**
- Someone creating hundreds of fake accounts quickly
- Automated bots from overwhelming our system
- Spam registrations
- Like limiting how many applications one person can submit

#### Input Validation (Lines 23-28)
```javascript
if (!email || !email.includes('@') || !password || password.length < 8) {
  return NextResponse.json(
    { success: false, message: 'Email must be valid and password must be at least 8 characters' },
    { status: 400 }
  );
}
```

**Security checks:**
- Email must exist and contain @ symbol
- Password must be at least 8 characters long
- Prevents empty or invalid data
- Like checking if application form is properly filled

#### Duplicate Check (Lines 33-40)
```javascript
const [existingUsers] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
if (existingUsers.length > 0) {
  return NextResponse.json(
    { success: false, message: 'A user with this email already exists' },
    { status: 409 }
  );
}
```

**Why this matters:**
- Prevents multiple accounts with same email
- Each email is like a unique identifier
- Like ensuring each person gets only one ID card

#### Password Hashing (Lines 42-44)
```javascript
const saltRounds = 10;
const passwordHash = await bcrypt.hash(password, saltRounds);
```

**This is SUPER important for security:**
- **Never stores actual passwords** in database
- Uses bcrypt algorithm (industry standard)
- `saltRounds = 10` means password is scrambled 10 times
- Even if database is stolen, passwords remain safe
- Like storing a fingerprint of your password, not the password itself

#### User Creation (Lines 46-50)
```javascript
await connection.execute(
  'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
  [email, passwordHash, 'user']
);
```

**What gets stored:**
- Email address
- Hashed password (scrambled, not real password)
- Default role: 'user' (regular user, not admin)

---

## User Login

### File: `src/app/api/auth/login/route.js`

This is the **security checkpoint** where users prove their identity.

#### Rate Limiting (Lines 14-25)
Same as registration - prevents brute force attacks where hackers try thousands of passwords.

#### Input Validation (Lines 29-34)
```javascript
if (!email || !email.includes('@') || !password) {
  return NextResponse.json(
    { success: false, message: 'Email and password are required' },
    { status: 400 }
  );
}
```

#### User Lookup (Lines 42-56)
```javascript
const [users] = await connection.execute(
  'SELECT id, email, password_hash, role FROM users WHERE email = ?',
  [email]
);

if (users.length === 0) {
  // Simulate bcrypt comparison timing
  await bcrypt.compare(password, '$2b$10$dummyhashfordummyuserdummyhashfordummyuser');
  return NextResponse.json(
    { success: false, message: 'Invalid credentials' },
    { status: 401 }
  );
}
```

**Security feature - Timing Attack Prevention:**
- Always runs password comparison, even if user doesn't exist
- Prevents hackers from timing responses to find valid emails
- Like security guard taking same time to check fake vs real IDs

#### Password Verification (Lines 60-67)
```javascript
const isValidPassword = await bcrypt.compare(password, user.password_hash);
if (!isValidPassword) {
  return NextResponse.json(
    { success: false, message: 'Invalid credentials' },
    { status: 401 }
  );
}
```

**How this works:**
- Takes user's typed password
- Hashes it the same way as stored password
- Compares the hashes
- Only allows login if hashes match
- Never reveals if email or password is wrong (says "invalid credentials")

#### Session Management (Lines 69-82)
```javascript
// Delete all previous sessions for this user (one device login only)
await connection.execute(
  'DELETE FROM user_sessions WHERE user_id = ?',
  [user.id]
);

// Create new session
const sessionToken = generateSessionToken();
const expiresAt = calculateSessionExpiry();

await connection.execute(
  'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
  [user.id, sessionToken, expiresAt]
);
```

**Session policy:**
- **One device per user**: Logging in on new device logs out old devices
- Creates unique session token
- Sets expiration time
- Stores session in database

#### Secure Cookie Setting (Lines 96-102)
```javascript
response.cookies.set('sessionToken', sessionToken, {
  httpOnly: true,                    // JavaScript can't access this cookie
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict',                // Prevents cross-site attacks
  maxAge: SESSION_CONFIG.EXPIRY_MINUTES * 60,   // 30 minutes
  path: '/',                         // Available on entire site
});
```

**Cookie security features:**
- `httpOnly`: Prevents JavaScript theft (XSS protection)
- `secure`: Only sends over HTTPS (prevents interception)
- `sameSite`: Prevents cross-site request forgery (CSRF)
- `maxAge`: Auto-expires after 30 minutes

#### Role-Based Redirect (Lines 121-132)
```javascript
function getRedirectPath(role) {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'manager': return '/manager/dashboard';
    case 'user': return '/user/dashboard';
    default: return '/user/dashboard';
  }
}
```

**Smart redirection:**
- Admins go to admin dashboard
- Managers go to manager dashboard
- Regular users go to user dashboard
- Personalized experience based on user role

---

## Session Checking

### File: `src/app/api/auth/check/route.js`

This is like the **periodic ID check** while you're inside the building.

#### Cookie Retrieval (Lines 12-20)
```javascript
const cookieStore = await cookies();
const sessionToken = cookieStore.get("sessionToken")?.value;

if (!sessionToken) {
  return NextResponse.json(
    { authenticated: false, message: 'No session token' },
    { status: 200 }
  );
}
```

**What this does:**
- Looks for session token in browser cookies
- If no token, user is not logged in
- Returns authenticated: false

#### Session Validation (Lines 29-42)
```javascript
const [sessions] = await connection.execute(
  `SELECT s.expires_at, s.last_activity, u.email, u.role 
   FROM user_sessions s 
   JOIN users u ON s.user_id = u.id 
   WHERE s.session_token = ?`,
  [sessionToken]
);

if (sessions.length === 0) {
  return NextResponse.json(
    { authenticated: false, message: 'Invalid session' },
    { status: 200 }
  );
}
```

**Database verification:**
- Finds session in database
- Joins with user table to get user info
- If session not found, it's invalid

#### Expiration & Inactivity Check (Lines 46-61)
```javascript
const expired = isSessionExpired(session.expires_at);
const inactive = isSessionInactive(session.last_activity);

if (expired || inactive) {
  // Remove expired session
  await connection.execute(
    'DELETE FROM user_sessions WHERE session_token = ?',
    [sessionToken]
  );
  
  return NextResponse.json(
    { authenticated: false, message: 'Session expired' },
    { status: 200 }
  );
}
```

**Session cleanup:**
- Checks if session is too old (30 minutes)
- Checks if user has been inactive (15 minutes)
- Removes expired sessions from database
- Forces user to login again

#### Activity Update (Lines 63-67)
```javascript
await connection.execute(
  'UPDATE user_sessions SET last_activity = NOW() WHERE session_token = ?',
  [sessionToken]
);
```

**Keeps session alive:**
- Updates last activity timestamp
- Prevents inactivity timeout
- Extends session life

---

## User Logout

### File: `src/app/api/auth/logout/route.js`

This is the **exit process** when users leave the building.

#### Session Removal (Lines 9-23)
```javascript
if (sessionToken) {
  const connection = await createConnection();
  
  try {
    // Remove session from database
    await connection.execute(
      'DELETE FROM user_sessions WHERE session_token = ?',
      [sessionToken]
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
```

**Complete logout:**
- Removes session from database
- Prevents session reuse
- Ensures clean logout

#### Cookie Clearing (Lines 31-37)
```javascript
response.cookies.set('sessionToken', '', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 0, // Expire immediately
  path: '/'
});
```

**Cookie destruction:**
- Sets cookie value to empty string
- `maxAge: 0` makes it expire immediately
- Removes cookie from browser
- Complete logout

---

## Security Features

### File: `src/lib/security.js`

This is the **advanced security system** with multiple layers of protection.

#### Token Generation (Lines 8-10)
```javascript
export function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}
```

**Cryptographically secure tokens:**
- Uses computer's best random number generator
- Creates unpredictable tokens
- Used for email verification, password reset, etc.

#### Device Fingerprinting (Lines 13-25)
```javascript
export function generateDeviceFingerprint(req) {
  const userAgent = req.headers.get('user-agent') || '';
  const acceptLanguage = req.headers.get('accept-language') || '';
  const acceptEncoding = req.headers.get('accept-encoding') || '';
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  
  const fingerprint = crypto
    .createHash('sha256')
    .update(`${ip}:${userAgent}:${acceptLanguage}:${acceptEncoding}`)
    .digest('hex');
  
  return fingerprint;
}
```

**Device identification:**
- Creates unique identifier for each device
- Based on IP address, browser, language settings
- Helps detect suspicious login from new devices
- Like tracking which devices have your building access card

#### Security Event Logging (Lines 28-40)
```javascript
export async function logSecurityEvent(eventType, severity, userId, ipAddress, userAgent, description, metadata = null) {
  try {
    const connection = await createConnection();
    await connection.execute(
      `INSERT INTO security_events (event_type, severity, user_id, ip_address, user_agent, description, metadata) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [eventType, severity, userId, ipAddress, userAgent, description, metadata ? JSON.stringify(metadata) : null]
    );
    connection.release();
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}
```

**Security monitoring:**
- Records all important security events
- Tracks failed logins, suspicious activity
- Helps detect attack patterns
- Like security guard writing incident reports

#### Failed Login Tracking (Lines 43-54)
```javascript
export async function logFailedLogin(email, ipAddress, userAgent, reason) {
  try {
    const connection = await createConnection();
    await connection.execute(
      'INSERT INTO failed_login_attempts (email, ip_address, user_agent, reason) VALUES (?, ?, ?, ?)',
      [email, ipAddress, userAgent, reason]
    );
    connection.release();
  } catch (error) {
    console.error('Failed to log failed login:', error);
  }
}
```

**Attack prevention:**
- Tracks every failed login attempt
- Records IP address, time, reason
- Helps identify brute force attacks
- Can block suspicious IPs

#### Account Locking (Lines 57-76)
```javascript
export async function isUserLocked(email) {
  try {
    const connection = await createConnection();
    const [attempts] = await connection.execute(
      `SELECT COUNT(*) as count, MAX(attempt_time) as last_attempt 
       FROM failed_login_attempts 
       WHERE email = ? AND attempt_time > DATE_SUB(NOW(), INTERVAL 15 MINUTE)`,
      [email]
    );
    connection.release();

    if (attempts[0].count >= 5) {
      return { locked: true, until: attempts[0].last_attempt };
    }
    return { locked: false };
  } catch (error) {
    console.error('Failed to check user lock status:', error);
    return { locked: false };
  }
}
```

**Account protection:**
- Locks account after 5 failed attempts in 15 minutes
- Prevents brute force password guessing
- Temporary lock to stop automated attacks
- Like security guard denying entry after too many failed attempts

#### File Upload Security (Lines 257-272)
```javascript
export function validateFileUpload(file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'], maxSize = 5 * 1024 * 1024) {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File too large' };
  }

  return { valid: true };
}
```

**File security:**
- Only allows safe file types (images)
- Limits file size to prevent server overload
- Prevents malicious file uploads
- Like security guard checking packages before entry

### File: `src/lib/sanitizer.js`

This is the **content filter** that removes dangerous code from user input.

#### HTML Sanitization (Lines 4-117)
```javascript
export function sanitizeHTML(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Remove dangerous tags and attributes
  let sanitized = content
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // ... more dangerous tag removals
```

**XSS Protection:**
- Removes JavaScript code
- Removes dangerous HTML tags
- Allows only safe formatting tags
- Prevents Cross-Site Scripting attacks
- Like removing dangerous weapons from packages

#### Input Sanitization (Lines 120-131)
```javascript
export function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
}
```

**Input cleaning:**
- Removes HTML brackets
- Removes JavaScript protocols
- Removes event handlers
- Limits input length
- Prevents injection attacks

---

## Frontend Components

### File: `src/hooks/useAuth.js`

This is the **user interface controller** that manages authentication in the browser.

#### State Management (Lines 5-9)
```javascript
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [isLoading, setIsLoading] = useState(true);
const [user, setUser] = useState(null);
```

**What these track:**
- `isAuthenticated`: Is user logged in?
- `isLoading`: Is authentication check in progress?
- `user`: Current user information

#### Session Checking (Lines 12-40)
```javascript
const checkSession = useCallback(async () => {
  try {
    setIsLoading(true);
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.authenticated && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  } catch (error) {
    console.error('Session check failed:', error);
    setIsAuthenticated(false);
    setUser(null);
  } finally {
    setIsLoading(false);
  }
}, []);
```

**Automatic session verification:**
- Checks with server if user is still logged in
- Updates UI based on authentication status
- Handles network errors gracefully
- Runs automatically when app starts

#### Login Function (Lines 43-76)
```javascript
const login = useCallback(async (email, password) => {
  try {
    setIsLoading(true);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      setIsAuthenticated(true);
      setUser(data.user);
      
      // Redirect based on role
      if (data.redirectTo) {
        router.push(data.redirectTo);
      }
      
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, message: 'Login failed' };
  } finally {
    setIsLoading(false);
  }
}, [router]);
```

**User login process:**
- Sends email/password to server
- Handles success/failure responses
- Updates UI state
- Redirects to appropriate dashboard
- Shows error messages to user

#### Role-Based Access (Lines 128-154)
```javascript
const requireRole = useCallback((requiredRole) => {
  if (!isLoading) {
    if (!isAuthenticated) {
      router.push('/login');
      return false;
    }
    
    if (user?.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user's role
      switch (user?.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'manager':
          router.push('/manager/dashboard');
          break;
        case 'user':
          router.push('/user/dashboard');
          break;
        default:
          router.push('/login');
      }
      return false;
    }
  }
  return true;
}, [isLoading, isAuthenticated, user, router]);
```

**Access control:**
- Ensures only authorized roles access certain pages
- Redirects users to appropriate dashboards
- Prevents unauthorized access
- Like security guard checking clearance levels

### File: `src/app/(auth)/login/page.js`

This is the **login form** that users see and interact with.

#### Form Validation (Lines 49-75)
```javascript
const handleSubmit = async (event) => {
  event.preventDefault();
  setError("");

  const data = new FormData(event.currentTarget);
  const email = data.get("email");
  const password = data.get("password");

  if (!email || !email.includes("@")) {
    setEmailError(true);
    return;
  } else {
    setEmailError(false);
  }

  if (!password || password.length < 8) {
    setPasswordError(true);
    return;
  } else {
    setPasswordError(false);
  }

  const result = await login(email, password);
  if (!result.success) {
    setError(result.message || "Login failed");
  }
};
```

**Client-side validation:**
- Checks email format before sending to server
- Ensures password meets minimum requirements
- Shows immediate feedback to users
- Prevents unnecessary server requests

#### UI Components (Lines 77-138)
```javascript
return (
  <>
    <CssBaseline />
    <SignInContainer>
      <StyledCard>
        <Typography variant="h4" textAlign="center">
          Sign In
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <FormLabel>Email</FormLabel>
            <TextField
              id="email"
              name="email"
              type="email"
              error={emailError}
              helperText={emailError && "Enter a valid email"}
              placeholder="you@example.com"
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel>Password</FormLabel>
            <TextField
              id="password"
              name="password"
              type="password"
              error={passwordError}
              helperText={passwordError && "Min 8 characters"}
              placeholder="••••••"
            />
          </FormControl>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
        </Box>
      </StyledCard>
    </SignInContainer>
  </>
);
```

**User-friendly interface:**
- Clean, modern design
- Real-time validation feedback
- Loading states during authentication
- Error messages for failed attempts
- Links to registration and password reset

### File: `src/app/(auth)/logout/page.js`

This is the **logout page** that handles the logout process.

#### Automatic Logout (Lines 12-19)
```javascript
useEffect(() => {
  // Perform logout
  const performLogout = async () => {
    await logout();
  };

  performLogout();
}, [logout]);
```

**Seamless logout:**
- Automatically calls logout function
- Shows loading indicator during process
- Redirects to login page when complete
- No user interaction required

---

## Database Structure

Based on the code, our authentication system uses these database tables:

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'manager', 'admin') DEFAULT 'user',
  last_login TIMESTAMP NULL,
  login_attempts INT DEFAULT 0,
  locked_until TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  session_token VARCHAR(128) UNIQUE NOT NULL,
  device_fingerprint VARCHAR(64),
  expires_at TIMESTAMP NOT NULL,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Failed Login Attempts Table
```sql
CREATE TABLE failed_login_attempts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  reason VARCHAR(255),
  attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Security Events Table
```sql
CREATE TABLE security_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_type VARCHAR(100) NOT NULL,
  severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
  user_id INT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  description TEXT NOT NULL,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### User Devices Table
```sql
CREATE TABLE user_devices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  device_fingerprint VARCHAR(64) UNIQUE NOT NULL,
  device_name VARCHAR(255),
  device_type VARCHAR(100),
  browser VARCHAR(100),
  platform VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent TEXT,
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Security Best Practices Implemented

### 1. Password Security
- **Never store plain text passwords**
- Use bcrypt with 10 salt rounds
- Minimum 8-character password requirement

### 2. Session Security
- HttpOnly cookies (prevent XSS theft)
- Secure cookies (HTTPS only in production)
- SameSite strict (prevent CSRF)
- Short session duration (30 minutes)
- Inactivity timeout (15 minutes)

### 3. Rate Limiting
- Prevent brute force attacks
- Limit registration attempts
- Block suspicious IPs
- Log security violations

### 4. Input Validation
- Server-side validation always
- Client-side validation for UX
- Sanitize all user inputs
- Prevent injection attacks

### 5. Error Handling
- Generic error messages
- Don't reveal sensitive information
- Log errors securely
- Graceful degradation

### 6. Monitoring & Logging
- Track all security events
- Monitor failed login attempts
- Device fingerprinting
- Account lockout protection

### 7. Data Protection
- Encrypt sensitive data
- Secure database connections
- Regular cleanup of expired data
- Backup and recovery procedures

---

## How to Use This System

### For Users:
1. **Register**: Create account with email and password
2. **Login**: Enter credentials to access the system
3. **Access**: Navigate to pages based on your role
4. **Logout**: Securely end your session

### For Developers:
1. **Import useAuth hook**: `const { login, logout, user } = useAuth();`
2. **Protect routes**: Use `requireAuth()` and `requireRole()`
3. **Check authentication**: Use `isAuthenticated` state
4. **Handle loading states**: Use `isLoading` for UI feedback

### For Administrators:
1. **Monitor security events**: Check security_events table
2. **Review failed attempts**: Monitor failed_login_attempts table
3. **Manage user accounts**: Update roles and lock status
4. **Track device usage**: Monitor user_devices table

---

## Common Questions & Answers

**Q: Why can't I see my password in the database?**
A: For security! We store only a "hash" (fingerprint) of your password, not the actual password.

**Q: Why do I get logged out after 30 minutes?**
A: This is a security feature to protect your account if you forget to logout.

**Q: Why can't I login from multiple devices?**
A: Currently, our system allows only one device per user for security reasons.

**Q: What happens if I forget my password?**
A: The system includes password reset functionality (not shown in these files).

**Q: How does the system know if someone is trying to hack my account?**
A: It tracks failed login attempts, unusual locations, and suspicious behavior patterns.

---

## Final Notes

This authentication system is designed with security as the top priority while maintaining a good user experience. It implements industry-standard security practices and includes multiple layers of protection against common attacks.

The system is:
- **Secure**: Uses modern cryptography and best practices
- **User-friendly**: Clean interface with helpful error messages
- **Scalable**: Designed to handle many users efficiently
- **Maintainable**: Well-organized code with clear separation of concerns
- **Auditable**: Comprehensive logging and monitoring capabilities

Remember: Security is an ongoing process, not a one-time setup. Regular updates, monitoring, and improvements are essential to maintain a secure authentication system.
