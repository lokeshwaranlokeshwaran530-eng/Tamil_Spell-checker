/**
 * i18n Translations — English & Tamil
 * All UI strings for the Tamil Spell Checker application.
 */

export const translations = {
  en: {
    // ── Header ──
    header: {
      brandName: 'Tamil Spell Checker',
      brandSub: 'எழுத்துச் சரிபார்ப்பான்',
      statusLabel: 'AI Engine Active',
      badge: 'Enterprise Edition',
    },

    // ── Hero ──
    hero: {
      eyebrow: 'Powered by Advanced Linguistic AI',
      heading: 'Refine Your Tamil',
      headingAccent: ' Compositions',
      subheading:
        'Ensure grammatical accuracy and native structural clarity using customized language model rules for modern Tamil writing.',
      pills: ['Spell Check', 'Grammar Analysis', 'Vowel Correction', 'Sandhi Rules'],
    },

    // ── Editor Panel ──
    editor: {
      title: 'Composition Workspace',
      placeholder: 'Type or paste your Tamil text here…',
      charLimit: '5,000',
      characters: (n) => `${n.toLocaleString()} / 5,000`,
      clearBtn: 'Clear',
      sampleBtn: 'Sample Text',
      analyzeBtn: 'Analyze Text',
      analyzingBtn: 'Analyzing…',
    },

    // ── Analysis Panel ──
    analysis: {
      title: 'Analysis Results',
      badgeError: (n) => `${n} Issue${n !== 1 ? 's' : ''} Found`,
      badgeOk: '✓ Passed',

      // Empty state
      emptyTitle: 'Ready to Analyze',
      emptyDesc: 'Enter your Tamil text in the workspace, then click Analyze Text or press',
      emptyHints: ['Spell errors', 'Vowel length', 'Consonant forms', 'Sandhi rules'],

      // Loading
      loadingTitle: 'Analyzing composition…',
      loadingSubtitle: 'Running linguistic diagnostics',

      // Success clean
      cleanTitle: 'Composition Verified',
      cleanSubtitle: 'No spelling or grammar issues were detected.',

      // Corrected box
      correctedLabel: '✦ Corrected Text',
      copyBtn: 'Copy Text',
      copiedBtn: 'Copied!',

      // Errors
      issuesLabel: 'Issues Found',

      // Fault
      faultTitle: 'Analysis Failed',
    },

    // ── Anomaly Card ──
    anomaly: {
      types: {
        vowel: 'Vowel',
        consonant: 'Consonant',
        grammar: 'Grammar',
        spelling: 'Spelling',
        default: 'Spelling',
      },
    },

    // ── Stats Bar ──
    stats: [
      { icon: '🔤', label: 'Languages Supported', value: 'Tamil (தமிழ்)' },
      { icon: '⚡', label: 'Avg. Analysis Time',  value: '< 1.5 seconds' },
      { icon: '✅', label: 'Rule Categories',     value: '4 Linguistic Types' },
      { icon: '🔒', label: 'Privacy',             value: 'Client-Side Processing' },
    ],

    // ── Footer ──
    footer: {
      powered: 'Powered by Advanced Linguistic AI Engine',
      viewSource: 'View Source',
    },

    // ── Language Toggle ──
    langToggle: 'தமிழில் காண்க',
  },

  ta: {
    // ── Header ──
    header: {
      brandName: 'தமிழ் எழுத்துச் சரிபார்ப்பான்',
      brandSub: 'Tamil Spell Checker',
      statusLabel: 'AI பொறியி இயங்குகிறது',
      badge: 'நிறுவன பதிப்பு',
    },

    // ── Hero ──
    hero: {
      eyebrow: 'மேம்பட்ட மொழியியல் AI ஆல் இயக்கப்படுகிறது',
      heading: 'உங்கள் தமிழ்',
      headingAccent: ' இயற்றல்களை மேம்படுத்துங்கள்',
      subheading:
        'நவீன தமிழ் எழுத்துக்கான தனிப்பயன் மொழி மாதிரி விதிகளைப் பயன்படுத்தி இலக்கண துல்லியத்தையும் நேர்த்தியான கட்டமைப்பையும் உறுதி செய்யுங்கள்.',
      pills: ['எழுத்துப் பிழை சரிபார்ப்பு', 'இலக்கண பகுப்பாய்வு', 'உயிரெழுத்து திருத்தம்', 'சந்தி விதிகள்'],
    },

    // ── Editor Panel ──
    editor: {
      title: 'இயற்றல் பணியிடம்',
      placeholder: 'இங்கே உங்கள் தமிழ் வாக்கியங்களை தட்டச்சு செய்யவும்…',
      charLimit: '5,000',
      characters: (n) => `${n.toLocaleString()} / 5,000`,
      clearBtn: 'அழி',
      sampleBtn: 'மாதிரி உரை',
      analyzeBtn: 'உரையை பகுப்பாய்',
      analyzingBtn: 'பகுப்பாய்விடுகிறது…',
    },

    // ── Analysis Panel ──
    analysis: {
      title: 'பகுப்பாய்வு முடிவுகள்',
      badgeError: (n) => `${n} பிழை${n !== 1 ? 'கள்' : ''} கண்டுபிடிக்கப்பட்டது`,
      badgeOk: '✓ சரிபார்க்கப்பட்டது',

      // Empty state
      emptyTitle: 'பகுப்பாய்வுக்கு தயார்',
      emptyDesc: 'பணியிடத்தில் உங்கள் தமிழ் உரையை உள்ளிட்டு, "உரையை பகுப்பாய்" என்பதை கிளிக் செய்யவும் அல்லது',
      emptyHints: ['எழுத்துப் பிழைகள்', 'உயிரெழுத்து நீளம்', 'மெய்யெழுத்து வடிவங்கள்', 'சந்தி விதிகள்'],

      // Loading
      loadingTitle: 'இயற்றலை பகுப்பாய்விடுகிறது…',
      loadingSubtitle: 'மொழியியல் கண்டறிதல் இயங்குகிறது',

      // Success clean
      cleanTitle: 'இயற்றல் சரிபார்க்கப்பட்டது',
      cleanSubtitle: 'எந்த எழுத்துப் பிழையும் இலக்கண சிக்கல்களும் இல்லை.',

      // Corrected box
      correctedLabel: '✦ திருத்தப்பட்ட உரை',
      copyBtn: 'உரையை நகலெடு',
      copiedBtn: 'நகலெடுக்கப்பட்டது!',

      // Errors
      issuesLabel: 'கண்டுபிடிக்கப்பட்ட சிக்கல்கள்',

      // Fault
      faultTitle: 'பகுப்பாய்வு தோல்வியடைந்தது',
    },

    // ── Anomaly Card ──
    anomaly: {
      types: {
        vowel: 'உயிரெழுத்து',
        consonant: 'மெய்யெழுத்து',
        grammar: 'இலக்கணம்',
        spelling: 'எழுத்துப் பிழை',
        default: 'எழுத்துப் பிழை',
      },
    },

    // ── Stats Bar ──
    stats: [
      { icon: '🔤', label: 'ஆதரிக்கப்படும் மொழிகள்',  value: 'தமிழ் (Tamil)' },
      { icon: '⚡', label: 'சராசரி பகுப்பாய்வு நேரம்', value: '< 1.5 வினாடிகள்' },
      { icon: '✅', label: 'விதி வகைகள்',               value: '4 மொழியியல் வகைகள்' },
      { icon: '🔒', label: 'தனியுரிமை',                 value: 'வாடிக்கையாளர் பக்க செயலாக்கம்' },
    ],

    // ── Footer ──
    footer: {
      powered: 'மேம்பட்ட மொழியியல் AI பொறியி மூலம் இயக்கப்படுகிறது',
      viewSource: 'மூலக் குறியீட்டை காண்க',
    },

    // ── Language Toggle ──
    langToggle: 'View in English',
  },
};
