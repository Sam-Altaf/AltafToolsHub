// Text enhancement utilities - all client-side processing
// No external APIs - uses built-in browser capabilities and simple algorithms

interface TextAnalysis {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  averageWordLength: number;
  averageSentenceLength: number;
  readabilityScore: number; // Flesch Reading Ease
  readabilityLevel: string;
  commonWords: string[];
  complexWords: string[];
  passiveVoices: string[];
  suggestions: string[];
}

interface ToneOptions {
  formal: boolean;
  casual: boolean;
  professional: boolean;
  friendly: boolean;
  concise: boolean;
  detailed: boolean;
}

// Common words database for readability analysis
const COMMON_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
  'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
  'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
  'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
  'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work',
  'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
  'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has', 'had',
  'were', 'said', 'did', 'having', 'may', 'keep', 'does', 'let', 'put', 'seem'
]);

// Transition words for better flow
const TRANSITION_WORDS = {
  addition: ['furthermore', 'moreover', 'additionally', 'besides', 'also'],
  contrast: ['however', 'nevertheless', 'although', 'whereas', 'while'],
  cause: ['therefore', 'consequently', 'thus', 'hence', 'accordingly'],
  example: ['for instance', 'for example', 'specifically', 'namely', 'such as'],
  conclusion: ['in conclusion', 'to summarize', 'overall', 'finally', 'ultimately']
};

// Passive voice indicators
const PASSIVE_INDICATORS = [
  'was', 'were', 'been', 'being', 'is', 'are', 'am'
];

const PAST_PARTICIPLES = [
  'given', 'taken', 'made', 'done', 'written', 'seen', 'known',
  'shown', 'told', 'sent', 'received', 'found', 'used', 'needed'
];

export function analyzeText(text: string): TextAnalysis {
  const words = text.match(/\b\w+\b/g) || [];
  const sentences = text.match(/[.!?]+/g) || [];
  const paragraphs = text.split(/\n\n+/);
  
  const wordCount = words.length;
  const sentenceCount = Math.max(sentences.length, 1);
  const paragraphCount = paragraphs.filter(p => p.trim().length > 0).length;
  
  const averageWordLength = wordCount > 0 
    ? words.reduce((sum, word) => sum + word.length, 0) / wordCount 
    : 0;
    
  const averageSentenceLength = sentenceCount > 0 
    ? wordCount / sentenceCount 
    : 0;

  // Calculate Flesch Reading Ease score
  const syllableCount = countSyllables(text);
  const readabilityScore = calculateFleschScore(
    wordCount,
    sentenceCount,
    syllableCount
  );
  
  const readabilityLevel = getReadabilityLevel(readabilityScore);
  
  // Find common and complex words
  const commonWords: string[] = [];
  const complexWords: string[] = [];
  
  words.forEach(word => {
    const lowerWord = word.toLowerCase();
    if (COMMON_WORDS.has(lowerWord)) {
      if (!commonWords.includes(lowerWord)) commonWords.push(lowerWord);
    } else if (word.length > 8 || countSyllablesInWord(word) > 3) {
      if (!complexWords.includes(word)) complexWords.push(word);
    }
  });

  // Detect passive voice
  const passiveVoices = detectPassiveVoice(text);
  
  // Generate suggestions
  const suggestions = generateSuggestions({
    readabilityScore,
    averageSentenceLength,
    complexWords,
    passiveVoices,
    paragraphCount,
    wordCount
  });

  return {
    wordCount,
    sentenceCount,
    paragraphCount,
    averageWordLength,
    averageSentenceLength,
    readabilityScore,
    readabilityLevel,
    commonWords: commonWords.slice(0, 10),
    complexWords: complexWords.slice(0, 10),
    passiveVoices: passiveVoices.slice(0, 5),
    suggestions
  };
}

function countSyllables(text: string): number {
  const words = text.match(/\b\w+\b/g) || [];
  return words.reduce((total, word) => total + countSyllablesInWord(word), 0);
}

function countSyllablesInWord(word: string): number {
  word = word.toLowerCase();
  let count = 0;
  let previousWasVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = /[aeiouy]/.test(word[i]);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }
  
  // Adjust for silent e
  if (word.endsWith('e') && count > 1) {
    count--;
  }
  
  // Ensure at least one syllable
  return Math.max(count, 1);
}

function calculateFleschScore(words: number, sentences: number, syllables: number): number {
  if (words === 0 || sentences === 0) return 0;
  
  const avgSentenceLength = words / sentences;
  const avgSyllablesPerWord = syllables / words;
  
  // Flesch Reading Ease formula
  const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
  
  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, score));
}

function getReadabilityLevel(score: number): string {
  if (score >= 90) return 'Very Easy (5th grade)';
  if (score >= 80) return 'Easy (6th grade)';
  if (score >= 70) return 'Fairly Easy (7th grade)';
  if (score >= 60) return 'Standard (8-9th grade)';
  if (score >= 50) return 'Fairly Difficult (10-12th grade)';
  if (score >= 30) return 'Difficult (College)';
  return 'Very Difficult (Graduate)';
}

function detectPassiveVoice(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const passiveSentences: string[] = [];
  
  sentences.forEach(sentence => {
    const words = sentence.toLowerCase().split(/\s+/);
    
    for (let i = 0; i < words.length - 1; i++) {
      // Check for "to be" verb followed by past participle
      if (PASSIVE_INDICATORS.includes(words[i])) {
        const nextWord = words[i + 1];
        if (nextWord && (
          nextWord.endsWith('ed') || 
          nextWord.endsWith('en') ||
          PAST_PARTICIPLES.includes(nextWord)
        )) {
          passiveSentences.push(sentence.trim());
          break;
        }
      }
    }
  });
  
  return passiveSentences;
}

function generateSuggestions(analysis: any): string[] {
  const suggestions: string[] = [];
  
  // Readability suggestions
  if (analysis.readabilityScore < 30) {
    suggestions.push('Consider using shorter sentences and simpler words to improve readability');
  } else if (analysis.readabilityScore < 60) {
    suggestions.push('Good readability for educated audiences. Consider simplifying for broader appeal');
  }
  
  // Sentence length suggestions
  if (analysis.averageSentenceLength > 25) {
    suggestions.push('Your sentences are quite long. Try breaking them into shorter, clearer statements');
  } else if (analysis.averageSentenceLength < 10) {
    suggestions.push('Your sentences are very short. Consider combining some for better flow');
  }
  
  // Complex words suggestions
  if (analysis.complexWords.length > 5) {
    suggestions.push(`Consider simplifying complex words like: ${analysis.complexWords.slice(0, 3).join(', ')}`);
  }
  
  // Passive voice suggestions
  if (analysis.passiveVoices.length > 2) {
    suggestions.push('Reduce passive voice usage for more direct, engaging writing');
  }
  
  // Paragraph suggestions
  if (analysis.wordCount > 200 && analysis.paragraphCount < 2) {
    suggestions.push('Consider breaking your text into paragraphs for better readability');
  }
  
  // Add transition words suggestion
  const hasTransitions = Object.values(TRANSITION_WORDS).flat().some(word => 
    analysis.text?.toLowerCase().includes(word)
  );
  
  if (!hasTransitions && analysis.sentenceCount > 5) {
    suggestions.push('Add transition words to improve flow between sentences');
  }
  
  return suggestions;
}

export function enhanceText(text: string, tone: ToneOptions): string {
  let enhanced = text;
  
  // First, fix common grammar and spelling errors
  enhanced = fixGrammarAndSpelling(enhanced);
  
  // Apply tone adjustments
  if (tone.formal) {
    enhanced = makeFormal(enhanced);
  } else if (tone.casual) {
    enhanced = makeCasual(enhanced);
  }
  
  if (tone.concise) {
    enhanced = makeConcise(enhanced);
  } else if (tone.detailed) {
    enhanced = makeDetailed(enhanced);
  }
  
  if (tone.professional) {
    enhanced = makeProfessional(enhanced);
  } else if (tone.friendly) {
    enhanced = makeFriendly(enhanced);
  }
  
  // Final cleanup
  enhanced = cleanupText(enhanced);
  
  return enhanced;
}

function fixGrammarAndSpelling(text: string): string {
  let fixed = text;
  
  // Fix common misspellings
  const commonMisspellings: { [key: string]: string } = {
    'recieve': 'receive',
    'beleive': 'believe',
    'occured': 'occurred',
    'seperate': 'separate',
    'untill': 'until',
    'wich': 'which',
    'alot': 'a lot',
    'definately': 'definitely',
    'occassion': 'occasion',
    'concious': 'conscious',
    'experiance': 'experience',
    'enviroment': 'environment',
    'goverment': 'government',
    'necesary': 'necessary',
    'begining': 'beginning',
    'accomodate': 'accommodate',
    'acheive': 'achieve',
    'adress': 'address',
    'calender': 'calendar',
    'collegue': 'colleague',
    'comming': 'coming',
    'commitee': 'committee',
    'completly': 'completely',
    'concider': 'consider',
    'dissapear': 'disappear',
    'finaly': 'finally',
    'foward': 'forward',
    'futher': 'further',
    'happend': 'happened',
    'harrass': 'harass',
    'independant': 'independent',
    'knowlege': 'knowledge',
    'lenght': 'length',
    'maintainance': 'maintenance',
    'mispell': 'misspell',
    'noticable': 'noticeable',
    'paralel': 'parallel',
    'perfer': 'prefer',
    'publically': 'publicly',
    'realy': 'really',
    'refered': 'referred',
    'rember': 'remember',
    'resistent': 'resistant',
    'sence': 'sense',
    'succesful': 'successful',
    'suprise': 'surprise',
    'tommorrow': 'tomorrow',
    'tounge': 'tongue',
    'truely': 'truly',
    'unforseen': 'unforeseen',
    'unfortunatly': 'unfortunately',
    'usefull': 'useful',
    'wierd': 'weird',
    'todays': "today's",
    'grammer': 'grammar',
    'isnt': "isn't",
    'youll': "you'll",
    'differance': 'difference',
    'percieve': 'perceive',
    'weather': 'whether', // when used in context of choice
    'effects': 'affects', // when used as a verb
  };
  
  // Apply spelling corrections
  Object.entries(commonMisspellings).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    fixed = fixed.replace(regex, (match) => {
      // Preserve capitalization
      if (match[0] === match[0].toUpperCase()) {
        return correct.charAt(0).toUpperCase() + correct.slice(1);
      }
      return correct;
    });
  });
  
  // Fix common grammar issues
  const grammarFixes = [
    // your/you're
    { wrong: /\byour\s+(a|an|are|is)\b/gi, right: "you're $1" },
    // its/it's
    { wrong: /\bits\s+(a|an|is|was|been|not)\b/gi, right: "it's $1" },
    // their/there/they're
    { wrong: /\btheir\s+(is|are|was|were)\b/gi, right: "there $1" },
    { wrong: /\btheir\s+(going|coming|leaving)\b/gi, right: "they're $1" },
    // should/could/would of -> have
    { wrong: /\b(should|could|would|must)\s+of\b/gi, right: '$1 have' },
    // loose/lose
    { wrong: /\bloose\s+(weight|money|keys|focus)\b/gi, right: 'lose $1' },
    // then/than for comparisons
    { wrong: /\b(better|worse|more|less|greater|faster|slower|higher|lower)\s+then\b/gi, right: '$1 than' },
    // accept/except
    { wrong: /\baccept\s+for\b/gi, right: 'except for' },
    // affect/effect in common contexts
    { wrong: /\beffect\s+(the|a|an|my|your|his|her|our|their)\s+(change|outcome|result)\b/gi, right: 'affect $1 $2' },
    { wrong: /\baffects?\s+(of)\b/gi, right: 'effects $1' },
    // to/too
    { wrong: /\bto\s+(much|many|often|soon|late|early|far)\b/gi, right: 'too $1' },
    // Remove double spaces
    { wrong: /\s{2,}/g, right: ' ' },
    // Fix missing apostrophes in common contractions
    { wrong: /\bdont\b/gi, right: "don't" },
    { wrong: /\bcant\b/gi, right: "can't" },
    { wrong: /\bwont\b/gi, right: "won't" },
    { wrong: /\bwouldnt\b/gi, right: "wouldn't" },
    { wrong: /\bcouldnt\b/gi, right: "couldn't" },
    { wrong: /\bshouldnt\b/gi, right: "shouldn't" },
    { wrong: /\bdidnt\b/gi, right: "didn't" },
    { wrong: /\bdoesnt\b/gi, right: "doesn't" },
    { wrong: /\bhasnt\b/gi, right: "hasn't" },
    { wrong: /\bhavent\b/gi, right: "haven't" },
    { wrong: /\bhadnt\b/gi, right: "hadn't" },
    { wrong: /\bwerent\b/gi, right: "weren't" },
    { wrong: /\bwasnt\b/gi, right: "wasn't" },
    { wrong: /\barent\b/gi, right: "aren't" },
    { wrong: /\bisnt\b/gi, right: "isn't" },
  ];
  
  grammarFixes.forEach(({ wrong, right }) => {
    fixed = fixed.replace(wrong, right);
  });
  
  return fixed;
}

function cleanupText(text: string): string {
  let cleaned = text;
  
  // Fix sentence capitalization
  cleaned = cleaned.replace(/(^|\. |\! |\? )([a-z])/g, (match, p1, p2) => {
    return p1 + p2.toUpperCase();
  });
  
  // Remove repeated words
  cleaned = cleaned.replace(/\b(\w+)\s+\1\b/gi, '$1');
  
  // Fix multiple punctuation (except ellipsis)
  cleaned = cleaned.replace(/([.!?])\1+/g, '$1');
  cleaned = cleaned.replace(/\.{3,}/g, '...');
  
  // Remove extra spaces before punctuation
  cleaned = cleaned.replace(/\s+([.!?,;:])/g, '$1');
  
  // Add space after punctuation if missing
  cleaned = cleaned.replace(/([.!?,;:])([A-Za-z])/g, '$1 $2');
  
  // Fix spacing around quotes
  cleaned = cleaned.replace(/\s+"/g, ' "');
  cleaned = cleaned.replace(/"\s+/g, '" ');
  
  // Remove trailing whitespace
  cleaned = cleaned.replace(/\s+$/gm, '');
  
  // Ensure ending punctuation
  if (cleaned.trim() && !/[.!?]$/.test(cleaned.trim())) {
    cleaned = cleaned.trim() + '.';
  }
  
  return cleaned;
}

function makeFormal(text: string): string {
  const replacements: { [key: string]: string } = {
    "can't": "cannot",
    "won't": "will not",
    "don't": "do not",
    "doesn't": "does not",
    "isn't": "is not",
    "aren't": "are not",
    "wasn't": "was not",
    "weren't": "were not",
    "haven't": "have not",
    "hasn't": "has not",
    "hadn't": "had not",
    "shouldn't": "should not",
    "wouldn't": "would not",
    "couldn't": "could not",
    "didn't": "did not",
    "i'm": "I am",
    "you're": "you are",
    "we're": "we are",
    "they're": "they are",
    "it's": "it is",
    "that's": "that is",
    "there's": "there is",
    "here's": "here is",
    "what's": "what is",
    "who's": "who is",
    "let's": "let us",
    "gonna": "going to",
    "wanna": "want to",
    "gotta": "have to",
    "yeah": "yes",
    "yep": "yes",
    "nope": "no",
    "ok": "acceptable",
    "okay": "acceptable",
    "a lot": "numerous",
    "lots of": "many",
    "really": "significantly",
    "very": "extremely",
    "pretty": "quite",
    "kind of": "somewhat",
    "sort of": "somewhat"
  };
  
  let formal = text;
  Object.entries(replacements).forEach(([informal, formalWord]) => {
    const regex = new RegExp(`\\b${informal}\\b`, 'gi');
    formal = formal.replace(regex, formalWord);
  });
  
  // Capitalize first letter of sentences
  formal = formal.replace(/(^|\. )([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
  
  return formal;
}

function makeCasual(text: string): string {
  const replacements: { [key: string]: string } = {
    "cannot": "can't",
    "will not": "won't",
    "do not": "don't",
    "does not": "doesn't",
    "is not": "isn't",
    "are not": "aren't",
    "have not": "haven't",
    "has not": "hasn't",
    "therefore": "so",
    "however": "but",
    "perhaps": "maybe",
    "utilize": "use",
    "implement": "do",
    "facilitate": "help",
    "demonstrate": "show",
    "indicate": "show",
    "subsequently": "then",
    "nevertheless": "still",
    "furthermore": "also",
    "moreover": "also",
    "consequently": "so"
  };
  
  let casual = text;
  Object.entries(replacements).forEach(([formal, casualWord]) => {
    const regex = new RegExp(`\\b${formal}\\b`, 'gi');
    casual = casual.replace(regex, casualWord);
  });
  
  return casual;
}

function makeConcise(text: string): string {
  // Remove redundant phrases
  const redundancies: { [key: string]: string } = {
    "in order to": "to",
    "due to the fact that": "because",
    "in spite of the fact that": "although",
    "at this point in time": "now",
    "at the present time": "now",
    "in the near future": "soon",
    "in the event that": "if",
    "for the purpose of": "to",
    "with regard to": "about",
    "in regards to": "about",
    "as a matter of fact": "actually",
    "each and every": "every",
    "first and foremost": "first",
    "absolutely essential": "essential",
    "completely eliminate": "eliminate",
    "future plans": "plans",
    "past history": "history",
    "revert back": "revert",
    "brief summary": "summary",
    "end result": "result",
    "free gift": "gift",
    "in my opinion": "",
    "it is important to note that": "",
    "it should be noted that": "",
    "it goes without saying": ""
  };
  
  let concise = text;
  Object.entries(redundancies).forEach(([verbose, simple]) => {
    const regex = new RegExp(verbose, 'gi');
    concise = concise.replace(regex, simple);
  });
  
  // Remove extra spaces
  concise = concise.replace(/\s+/g, ' ').trim();
  
  return concise;
}

function makeDetailed(text: string): string {
  // Add clarifying phrases where appropriate
  let detailed = text;
  
  // Add examples after general statements
  detailed = detailed.replace(
    /\b(such as|including|like)\b/gi,
    '$1, for example,'
  );
  
  // Expand abbreviations
  const abbreviations: { [key: string]: string } = {
    "etc": "and so forth",
    "e.g.": "for example",
    "i.e.": "that is",
    "vs": "versus",
    "approx": "approximately"
  };
  
  Object.entries(abbreviations).forEach(([abbr, full]) => {
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    detailed = detailed.replace(regex, full);
  });
  
  return detailed;
}

function makeProfessional(text: string): string {
  let professional = makeFormal(text);
  
  // Replace casual business terms
  const businessTerms: { [key: string]: string } = {
    "deal with": "address",
    "figure out": "determine",
    "get": "obtain",
    "give": "provide",
    "help": "assist",
    "let": "allow",
    "make": "create",
    "need": "require",
    "show": "demonstrate",
    "start": "initiate",
    "stop": "discontinue",
    "talk about": "discuss",
    "think about": "consider",
    "try": "attempt",
    "use": "utilize",
    "want": "require"
  };
  
  Object.entries(businessTerms).forEach(([casual, prof]) => {
    const regex = new RegExp(`\\b${casual}\\b`, 'gi');
    professional = professional.replace(regex, prof);
  });
  
  return professional;
}

function makeFriendly(text: string): string {
  let friendly = text;
  
  // Add friendly phrases
  if (!friendly.toLowerCase().includes('thank')) {
    friendly = `Thank you for your interest! ${friendly}`;
  }
  
  // Replace formal phrases with friendly ones
  const friendlyPhrases: { [key: string]: string } = {
    "it is required": "we need",
    "you must": "please",
    "failure to": "if you don't",
    "mandatory": "important",
    "prohibited": "please don't",
    "shall": "will",
    "pursuant to": "according to",
    "prior to": "before",
    "subsequent to": "after"
  };
  
  Object.entries(friendlyPhrases).forEach(([formal, friendlyPhrase]) => {
    const regex = new RegExp(formal, 'gi');
    friendly = friendly.replace(regex, friendlyPhrase);
  });
  
  return friendly;
}

export function checkGrammar(text: string): string[] {
  const issues: string[] = [];
  
  // Check for common grammar issues
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  sentences.forEach(sentence => {
    // Check for double spaces
    if (/\s{2,}/.test(sentence)) {
      issues.push('Remove double spaces');
    }
    
    // Check for missing capital at start
    if (sentence.trim() && /^[a-z]/.test(sentence.trim())) {
      issues.push('Capitalize the first letter of sentences');
    }
    
    // Check for common word confusion
    const confusions = [
      { wrong: /\byour\s+a\b/gi, right: "you're a" },
      { wrong: /\bits\s+a\b/gi, right: "it's a" },
      { wrong: /\btheir\s+is\b/gi, right: "there is" },
      { wrong: /\bthen\s+I\b/gi, context: "Consider 'than I' for comparisons" },
      { wrong: /\beffect\s+the\b/gi, context: "Consider 'affect the' for verb usage" },
      { wrong: /\baccept\s+for\b/gi, right: "except for" },
      { wrong: /\bloose\s+weight\b/gi, right: "lose weight" },
      { wrong: /\bshould\s+of\b/gi, right: "should have" },
      { wrong: /\bcould\s+of\b/gi, right: "could have" },
      { wrong: /\bwould\s+of\b/gi, right: "would have" }
    ];
    
    confusions.forEach(({ wrong, right, context }) => {
      if (wrong.test(sentence)) {
        if (right) {
          issues.push(`Replace with "${right}"`);
        } else if (context) {
          issues.push(context);
        }
      }
    });
    
    // Check for repeated words
    const words = sentence.split(/\s+/);
    for (let i = 0; i < words.length - 1; i++) {
      if (words[i].toLowerCase() === words[i + 1].toLowerCase() &&
          words[i].length > 2) {
        issues.push(`Repeated word: "${words[i]}"`);
      }
    }
  });
  
  // Check for missing punctuation at end
  if (text.trim() && !/[.!?]$/.test(text.trim())) {
    issues.push('Add punctuation at the end');
  }
  
  return [...new Set(issues)]; // Remove duplicates
}

// Simple spell check using browser's built-in capabilities
export async function checkSpelling(text: string): Promise<string[]> {
  // This would normally use the browser's spellcheck API if available
  // For now, return a simple check against common misspellings
  const commonMisspellings: { [key: string]: string } = {
    'recieve': 'receive',
    'beleive': 'believe',
    'occured': 'occurred',
    'seperate': 'separate',
    'untill': 'until',
    'wich': 'which',
    'alot': 'a lot',
    'definately': 'definitely',
    'occassion': 'occasion',
    'concious': 'conscious',
    'experiance': 'experience',
    'enviroment': 'environment',
    'goverment': 'government',
    'necesary': 'necessary',
    'begining': 'beginning',
    'accomodate': 'accommodate',
    'acheive': 'achieve',
    'adress': 'address',
    'calender': 'calendar',
    'collegue': 'colleague',
    'comming': 'coming',
    'commitee': 'committee',
    'completly': 'completely',
    'concider': 'consider',
    'dissapear': 'disappear',
    'finaly': 'finally',
    'foward': 'forward',
    'futher': 'further',
    'happend': 'happened',
    'harrass': 'harass',
    'independant': 'independent',
    'knowlege': 'knowledge',
    'lenght': 'length',
    'maintainance': 'maintenance',
    'mispell': 'misspell',
    'noticable': 'noticeable',
    'paralel': 'parallel',
    'perfer': 'prefer',
    'publically': 'publicly',
    'realy': 'really',
    'refered': 'referred',
    'rember': 'remember',
    'resistent': 'resistant',
    'sence': 'sense',
    'succesful': 'successful',
    'suprise': 'surprise',
    'tommorrow': 'tomorrow',
    'tounge': 'tongue',
    'truely': 'truly',
    'unforseen': 'unforeseen',
    'unfortunatly': 'unfortunately',
    'usefull': 'useful',
    'wierd': 'weird'
  };
  
  const misspellings: string[] = [];
  const words = text.match(/\b\w+\b/g) || [];
  
  words.forEach(word => {
    const lower = word.toLowerCase();
    if (commonMisspellings[lower]) {
      misspellings.push(`"${word}" should be "${commonMisspellings[lower]}"`);
    }
  });
  
  return misspellings;
}