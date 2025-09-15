// Smart password generation enhancements
// Memorable passwords, passphrases, and use-case suggestions

// Common word lists for passphrase generation (client-side)
const ADJECTIVES = [
  'ancient', 'brave', 'clever', 'daring', 'elegant', 'fierce', 'golden', 'happy',
  'infinite', 'jolly', 'keen', 'lively', 'mighty', 'noble', 'orange', 'peaceful',
  'quiet', 'rapid', 'silver', 'timeless', 'unique', 'valiant', 'wise', 'yellow',
  'zealous', 'bright', 'cosmic', 'dynamic', 'eternal', 'frozen', 'gentle', 'hidden',
  'crystal', 'electric', 'mystic', 'ocean', 'thunder', 'shadow', 'lunar', 'solar'
];

const NOUNS = [
  'anchor', 'bridge', 'castle', 'dragon', 'eagle', 'forest', 'galaxy', 'harbor',
  'island', 'jungle', 'knight', 'lighthouse', 'mountain', 'nebula', 'ocean', 'phoenix',
  'quest', 'river', 'sunset', 'tower', 'universe', 'valley', 'warrior', 'zenith',
  'arrow', 'beacon', 'compass', 'diamond', 'ember', 'falcon', 'glacier', 'horizon',
  'comet', 'storm', 'star', 'moon', 'thunder', 'crystal', 'phoenix', 'titan'
];

const VERBS = [
  'dance', 'explore', 'fly', 'guard', 'hunt', 'inspire', 'jump', 'kindle',
  'launch', 'master', 'navigate', 'overcome', 'protect', 'quest', 'rescue', 'soar',
  'travel', 'unite', 'venture', 'wander', 'excel', 'yield', 'zoom', 'achieve',
  'believe', 'create', 'discover', 'embrace', 'flourish', 'gather', 'harness'
];

// Use case specific configurations
export interface PasswordUseCase {
  id: string;
  name: string;
  description: string;
  icon: string;
  recommendations: {
    minLength: number;
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
    memorableOption?: boolean;
  };
  tips: string[];
}

export const USE_CASES: PasswordUseCase[] = [
  {
    id: 'email',
    name: 'Email Account',
    description: 'For personal or work email accounts',
    icon: 'Mail',
    recommendations: {
      minLength: 12,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: false,
      memorableOption: true
    },
    tips: [
      'Use a unique password for each email account',
      'Consider using a passphrase for easier memorization',
      'Enable two-factor authentication when available'
    ]
  },
  {
    id: 'banking',
    name: 'Banking & Finance',
    description: 'For online banking and financial services',
    icon: 'CreditCard',
    recommendations: {
      minLength: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      memorableOption: false
    },
    tips: [
      'Use maximum security for financial accounts',
      'Never reuse banking passwords elsewhere',
      'Store securely in a password manager',
      'Change regularly (every 3-6 months)'
    ]
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'For social networking accounts',
    icon: 'Users',
    recommendations: {
      minLength: 10,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: false,
      memorableOption: true
    },
    tips: [
      'Different password for each platform',
      'Be aware of account recovery options',
      'Review privacy settings regularly'
    ]
  },
  {
    id: 'work',
    name: 'Work/Corporate',
    description: 'For professional and corporate accounts',
    icon: 'Briefcase',
    recommendations: {
      minLength: 14,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      memorableOption: false
    },
    tips: [
      'Follow company password policies',
      'Never share work passwords',
      'Use VPN when accessing remotely'
    ]
  },
  {
    id: 'shopping',
    name: 'Online Shopping',
    description: 'For e-commerce and shopping sites',
    icon: 'ShoppingCart',
    recommendations: {
      minLength: 12,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: false,
      memorableOption: true
    },
    tips: [
      'Use unique passwords for sites with payment info',
      'Consider using virtual credit cards',
      'Check for secure connection (HTTPS)'
    ]
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'For gaming accounts and platforms',
    icon: 'Gamepad2',
    recommendations: {
      minLength: 12,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: false,
      memorableOption: true
    },
    tips: [
      'Protect accounts with valuable items/progress',
      'Enable Steam Guard or similar features',
      'Be cautious of phishing attempts'
    ]
  },
  {
    id: 'sensitive',
    name: 'Highly Sensitive',
    description: 'For cryptocurrency, medical, or government services',
    icon: 'ShieldCheck',
    recommendations: {
      minLength: 20,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      memorableOption: false
    },
    tips: [
      'Use maximum possible security',
      'Consider hardware security keys',
      'Enable all available security features',
      'Use a reputable password manager'
    ]
  }
];

// Generate a memorable passphrase
export function generatePassphrase(wordCount: number = 4, includeNumbers: boolean = true): string {
  const words: string[] = [];
  
  // Pattern: Adjective + Noun + Verb + Noun
  if (wordCount >= 4) {
    words.push(ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]);
    words.push(NOUNS[Math.floor(Math.random() * NOUNS.length)]);
    words.push(VERBS[Math.floor(Math.random() * VERBS.length)]);
    words.push(NOUNS[Math.floor(Math.random() * NOUNS.length)]);
  } else if (wordCount === 3) {
    words.push(ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]);
    words.push(NOUNS[Math.floor(Math.random() * NOUNS.length)]);
    words.push(VERBS[Math.floor(Math.random() * VERBS.length)]);
  } else {
    for (let i = 0; i < wordCount; i++) {
      const lists = [ADJECTIVES, NOUNS, VERBS];
      const list = lists[Math.floor(Math.random() * lists.length)];
      words.push(list[Math.floor(Math.random() * list.length)]);
    }
  }
  
  // Capitalize first letter of each word
  const capitalizedWords = words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  );
  
  // Add numbers if requested
  if (includeNumbers) {
    const randomNum = Math.floor(Math.random() * 100);
    capitalizedWords.push(randomNum.toString());
  }
  
  // Join with hyphens for readability
  return capitalizedWords.join('-');
}

// Generate a pronounceable password
export function generatePronounceable(length: number = 12): string {
  const consonants = 'bcdfghjklmnpqrstvwxyz';
  const vowels = 'aeiou';
  const numbers = '0123456789';
  let password = '';
  
  // Start with a capital letter
  password += consonants.charAt(Math.floor(Math.random() * consonants.length)).toUpperCase();
  
  // Alternate between consonants and vowels for pronounceability
  for (let i = 1; i < length - 2; i++) {
    if (i % 2 === 0) {
      password += consonants.charAt(Math.floor(Math.random() * consonants.length));
    } else {
      password += vowels.charAt(Math.floor(Math.random() * vowels.length));
    }
  }
  
  // Add two numbers at the end
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  
  return password;
}

// Generate password patterns for memorization
export function generatePattern(baseWord: string): string[] {
  const patterns: string[] = [];
  
  // Pattern 1: Leetspeak
  const leetspeak = baseWord
    .replace(/a/gi, '4')
    .replace(/e/gi, '3')
    .replace(/i/gi, '1')
    .replace(/o/gi, '0')
    .replace(/s/gi, '5');
  patterns.push(leetspeak + '!');
  
  // Pattern 2: First letter caps + year
  const currentYear = new Date().getFullYear();
  patterns.push(baseWord.charAt(0).toUpperCase() + baseWord.slice(1) + currentYear);
  
  // Pattern 3: Reverse + special char
  const reversed = baseWord.split('').reverse().join('');
  patterns.push(reversed + '@123');
  
  // Pattern 4: Alternating caps
  const alternating = baseWord.split('').map((char, i) => 
    i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
  ).join('');
  patterns.push(alternating + '#99');
  
  return patterns;
}

// Password strength explanation
export function explainStrength(password: string): {
  score: number;
  level: 'weak' | 'medium' | 'strong' | 'very-strong';
  feedback: string[];
  positives: string[];
  suggestions: string[];
} {
  let score = 0;
  const feedback: string[] = [];
  const positives: string[] = [];
  const suggestions: string[] = [];
  
  // Length scoring
  if (password.length >= 20) {
    score += 3;
    positives.push('Excellent length (20+ characters)');
  } else if (password.length >= 16) {
    score += 2;
    positives.push('Great length (16+ characters)');
  } else if (password.length >= 12) {
    score += 1;
    positives.push('Good length (12+ characters)');
  } else if (password.length >= 8) {
    feedback.push('Minimum acceptable length');
  } else {
    feedback.push('Too short (less than 8 characters)');
    suggestions.push('Increase length to at least 12 characters');
  }
  
  // Character variety
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
  
  if (hasUpper) {
    score += 1;
    positives.push('Contains uppercase letters');
  } else {
    suggestions.push('Add uppercase letters');
  }
  
  if (hasLower) {
    score += 1;
    positives.push('Contains lowercase letters');
  } else {
    suggestions.push('Add lowercase letters');
  }
  
  if (hasNumber) {
    score += 1;
    positives.push('Contains numbers');
  } else {
    suggestions.push('Add numbers');
  }
  
  if (hasSymbol) {
    score += 2;
    positives.push('Contains special characters');
  } else {
    suggestions.push('Add special characters for extra security');
  }
  
  // Pattern detection
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Contains repeated characters');
    suggestions.push('Avoid repeating characters');
    score -= 1;
  }
  
  if (/^[A-Z][a-z]+[0-9]+$/.test(password)) {
    feedback.push('Follows a common pattern');
    suggestions.push('Avoid predictable patterns');
    score -= 1;
  }
  
  if (/123|abc|qwerty|password/i.test(password)) {
    feedback.push('Contains common sequences');
    suggestions.push('Avoid common words or sequences');
    score -= 2;
  }
  
  // Determine level
  let level: 'weak' | 'medium' | 'strong' | 'very-strong';
  if (score >= 8) level = 'very-strong';
  else if (score >= 6) level = 'strong';
  else if (score >= 4) level = 'medium';
  else level = 'weak';
  
  return {
    score,
    level,
    feedback,
    positives,
    suggestions
  };
}

// Memory techniques for passwords
export function getMemoryTips(password: string): string[] {
  const tips: string[] = [];
  
  // Check if it's a passphrase
  if (password.includes('-') || password.includes(' ')) {
    tips.push('Create a mental image or story with the words');
    tips.push('Use the first letter of each word as a memory aid');
    tips.push('Associate each word with a personal memory');
  } else {
    tips.push('Break the password into chunks of 3-4 characters');
    tips.push('Create a pattern or rhythm when typing');
    tips.push('Associate numbers with dates or ages');
    
    if (/[!@#$%^&*]/.test(password)) {
      tips.push('Remember special characters by their keyboard position');
    }
  }
  
  tips.push('Practice typing it several times to build muscle memory');
  tips.push('Write it down temporarily and store securely until memorized');
  
  return tips;
}

// Generate alternative passwords based on a theme
export function generateThemePasswords(theme: string): string[] {
  const alternatives: string[] = [];
  const cleanTheme = theme.toLowerCase().replace(/[^a-z]/g, '');
  
  if (cleanTheme.length < 3) return alternatives;
  
  // Generate variations
  alternatives.push(...generatePattern(cleanTheme));
  
  // Add passphrase version
  const passphrase = generatePassphrase(3, true);
  alternatives.push(passphrase);
  
  // Add pronounceable version
  const pronounceable = generatePronounceable(14);
  alternatives.push(pronounceable);
  
  return alternatives.slice(0, 5);
}