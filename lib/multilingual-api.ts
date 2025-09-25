/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/multilingual-api.ts
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
export interface MultilingualResponse {
  en: string
  hi?: string
  bn?: string
  te?: string
  mr?: string
  ta?: string
  ur?: string
  gu?: string
  kn?: string
  ml?: string
  pa?: string
  or?: string
  as?: string
  sd?: string
  ks?: string
  sa?: string
}

export interface MultilingualContent {
  [key: string]: MultilingualResponse
}

// Common UI text translations
export const UI_TEXT: MultilingualContent = {
  // Navigation
  dashboard: {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    bn: 'ড্যাশবোর্ড',
    te: 'డాష్‌బోర్డ్',
    mr: 'डॅशबोर्ड',
    ta: 'டாஷ்போர்டு',
    ur: 'ڈیش بورڈ',
    gu: 'ડેશબોર્ડ',
    kn: 'ಡ್ಯಾಶ್ಬೋರ್ಡ್',
    ml: 'ഡാഷ്ബോർഡ്',
    pa: 'ਡੈਸ਼ਬੋਰਡ',
    or: 'ଡ୍ୟାଶବୋର୍ଡ',
  },
  documents: {
    en: 'Documents',
    hi: 'दस्तावेज़',
    bn: 'ডকুমেন্ট',
    te: 'పత్రాలు',
    mr: 'दस्तऐवज',
    ta: 'ஆவணங்கள்',
    ur: 'دستاویزات',
    gu: 'દસ્તાવેજો',
    kn: 'ದಾಖಲೆಗಳು',
    ml: 'രേഖകൾ',
    pa: 'ਦਸਤਾਵੇਜ਼',
    or: 'ଦଲିଲ',
  },
  lawyers: {
    en: 'Lawyers',
    hi: 'वकील',
    bn: 'আইনজীবী',
    te: 'న్యాయవాదులు',
    mr: 'वकील',
    ta: 'வழக்கறிஞர்கள்',
    ur: 'وکیل',
    gu: 'વકીલો',
    kn: 'ವಕೀಲರು',
    ml: 'വക്കീലന്മാർ',
    pa: 'ਵਕੀਲ',
    or: 'ଓକିଲ',
  },
  help: {
    en: 'Help',
    hi: 'सहायता',
    bn: 'সহায়তা',
    te: 'సహాయం',
    mr: 'मदत',
    ta: 'உதவி',
    ur: 'مدد',
    gu: 'મદદ',
    kn: 'ಸಹಾಯ',
    ml: 'സഹായം',
    pa: 'ਮਦਦ',
    or: 'ସାହାଯ୍ୟ',
  },
  settings: {
    en: 'Settings',
    hi: 'सेटिंग्स',
    bn: 'সেটিংস',
    te: 'అమరికలు',
    mr: 'सेटिंग्ज',
    ta: 'அமைப்புகள்',
    ur: 'سیٹنگز',
    gu: 'સેટિંગ્સ',
    kn: 'ಸೆಟ್ಟಿಂಗ್ಸ್',
    ml: 'ക്രമീകരണങ്ങൾ',
    pa: 'ਸੈਟਿੰਗਜ਼',
    or: 'ସେଟିଂସ୍',
  },
  knowledge: {
    en: 'Knowledge Base',
    hi: 'ज्ञान आधार',
    bn: 'জ্ঞানভান্ডার',
    te: 'జ్ఞాన భాండాగారం',
    mr: 'ज्ञानकोश',
    ta: 'அறிவு தளம்',
    ur: 'نالج بیس',
    gu: 'જ્ઞાનભંડાર',
    kn: 'ಜ್ಞಾನಕೋಶ',
    ml: 'ജ്ഞാന അടുക്ക്',
    pa: 'ਗਿਆਨ ਅਧਾਰ',
    or: 'ଜ୍ଞାନ ଭଣ୍ଡାର',
  },

  // Actions
  upload: {
    en: 'Upload',
    hi: 'अपलोड करें',
    bn: 'আপলোড',
    te: 'అప్‌లోడ్',
    mr: 'अपलोड',
    ta: 'பதிவேற்றம்',
    ur: 'اپ لوڈ',
    gu: 'અપલોડ',
    kn: 'ಅಪ್ಲೋಡ್',
    ml: 'അപ്‌ലോഡ്',
    pa: 'ਅੱਪਲੋਡ',
    or: 'ଅପଲୋଡ୍',
  },
  search: {
    en: 'Search',
    hi: 'खोजें',
    bn: 'খুঁজুন',
    te: 'శోధన',
    mr: 'शोधा',
    ta: 'தேடு',
    ur: 'تلاش',
    gu: 'શોધો',
    kn: 'ಹುಡುಕಿ',
    ml: 'തിരയുക',
    pa: 'ਖੋਜੋ',
    or: 'ଖୋଜନ୍ତୁ',
  },
  view: {
    en: 'View',
    hi: 'देखें',
    bn: 'দেখুন',
    te: 'చూడండి',
    mr: 'पहा',
    ta: 'பார்வை',
    ur: 'دیکھیں',
    gu: 'જુઓ',
    kn: 'ನೋಡಿ',
    ml: 'കാണുക',
    pa: 'ਵੇਖੋ',
    or: 'ଦେଖନ୍ତୁ',
  },
  edit: {
    en: 'Edit',
    hi: 'संपादित करें',
    bn: 'সম্পাদনা',
    te: 'సవరించు',
    mr: 'संपादन',
    ta: 'திருத்து',
    ur: 'ترمیم',
    gu: 'ફેરફાર',
    kn: 'ಸಂಪಾದಿಸಿ',
    ml: 'തിരുത്തുക',
    pa: 'ਸੰਪਾਦਿਤ ਕਰੋ',
    or: 'ସମ୍ପାଦନ କରନ୍ତୁ',
  },
  save: {
    en: 'Save',
    hi: 'सेव करें',
    bn: 'সংরক্ষণ',
    te: 'సేవ్',
    mr: 'जतन करा',
    ta: 'சேமி',
    ur: 'محفوظ کریں',
    gu: 'સાચવો',
    kn: 'ಉಳಿಸಿ',
    ml: 'സംരക്ഷിക്കുക',
    pa: 'ਸੰਭਾਲੋ',
    or: 'ସେଭ୍ କରନ୍ତୁ',
  },
  cancel: {
    en: 'Cancel',
    hi: 'रद्द करें',
    bn: 'বাতিল',
    te: 'రద్దు',
    mr: 'रद्द करा',
    ta: 'ரத்துசெய்',
    ur: 'منسوخ کریں',
    gu: 'રદ કરો',
    kn: 'ರದ್ದುಮಾಡಿ',
    ml: 'റദ്ദാക്കുക',
    pa: 'ਰੱਦ ਕਰੋ',
    or: 'ବାତିଲ୍ କରନ୍ତୁ',
  },
  delete: {
    en: 'Delete',
    hi: 'हटाएं',
    bn: 'মুছে ফেলুন',
    te: 'తొలగించు',
    mr: 'हटवा',
    ta: 'அழி',
    ur: 'حذف کریں',
    gu: 'કાઢી નાંખો',
    kn: 'ಅಳಿಸಿ',
    ml: 'ഇല്ലാതാക്കുക',
    pa: 'ਹਟਾਓ',
    or: 'ମିଟାନ୍ତୁ',
  },

  // Status
  loading: {
    en: 'Loading...',
    hi: 'लोड हो रहा है...',
    bn: 'লোড হচ্ছে...',
    te: 'లోడ్ అవుతోంది...',
    mr: 'लोड होत आहे...',
    ta: 'ஏற்றுகிறது...',
    ur: 'لوڈ ہو رہا ہے...',
    gu: 'લોડ થઈ રહ્યું છે...',
    kn: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    ml: 'ലോഡുചെയ്യുന്നു...',
    pa: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    or: 'ଲୋଡ୍ ହେଉଛି...',
  },
  saving: {
    en: 'Saving...',
    hi: 'सेव हो रहा है...',
    bn: 'সংরক্ষণ করা হচ্ছে...',
    te: 'సేవ్ చేస్తున్నాం...',
    mr: 'जतन होत आहे...',
    ta: 'சேமித்து வருகிறது...',
    ur: 'محفوظ کیا جا رہا ہے...',
    gu: 'સાચવી રહ્યું છે...',
    kn: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
    ml: 'സംരക്ഷിക്കുന്നു...',
    pa: 'ਸੰਭਾਲਿਆ ਜਾ ਰਿਹਾ ਹੈ...',
    or: 'ସେଭ୍ ହେଉଛି...',
  },
  success: {
    en: 'Success',
    hi: 'सफलता',
    bn: 'সফল',
    te: 'విజయం',
    mr: 'यश',
    ta: 'வெற்றி',
    ur: 'کامیابی',
    gu: 'સફળતા',
    kn: 'ಯಶಸ್ಸು',
    ml: 'വിജയം',
    pa: 'ਸਫਲਤਾ',
    or: 'ସଫଳତା',
  },
  error: {
    en: 'Error',
    hi: 'त्रुटि',
    bn: 'ত্রুটি',
    te: 'లోపం',
    mr: 'त्रुटी',
    ta: 'பிழை',
    ur: 'خرابی',
    gu: 'ભૂલ',
    kn: 'ದೋಷ',
    ml: 'പിശക്',
    pa: 'ਗਲਤੀ',
    or: 'ତ୍ରୁଟି',
  },

  // Chatbot
  chatbot: {
    en: 'AI Assistant',
    hi: 'AI सहायक',
    bn: 'AI সহকারী',
    te: 'AI సహాయకుడు',
    mr: 'AI सहाय्यक',
    ta: 'AI உதவியாளர்',
    ur: 'AI معاون',
    gu: 'AI સહાયક',
    kn: 'AI ಸಹಾಯಕ',
    ml: 'AI സഹായി',
    pa: 'AI ਸਹਾਇਕ',
    or: 'AI ସହାୟକ',
  },
  chatbotWelcome: {
    en: "Hello! I'm here to help you with legal assistance. How can I help you today?",
    hi: 'नमस्ते! मैं आपकी कानूनी सहायता के लिए यहाँ हूँ। आप कैसे मदद कर सकता हूँ?',
    bn: 'হ্যালো! আমি আপনার আইনি সহায়তায় সাহায্য করতে এখানে আছি। আজ আপনাকে কীভাবে সাহায্য করতে পারি?',
    te: 'హలో! నేను మీకు చట్టపరమైన సహాయం కోసం ఇక్కడ ఉన్నాను. నేను ఈరోజు మీకు ఎలా సహాయం చేయగలను?',
    mr: 'नमस्कार! मी तुम्हाला कायदेशीर मदतीसाठी येथे आहे. मी आज तुम्हाला कशी मदत करू शकतो?',
    ta: 'வணக்கம்! உங்கள் சட்ட உதவிக்காக நான் இங்கே இருக்கிறேன். இன்று நான் உங்களுக்கு எவ்வாறு உதவலாம்?',
    ur: 'ہیلو! میں آپ کی قانونی معاونت کے لیے حاضر ہوں۔ آج میں آپ کی کیسے مدد کر سکتا ہوں؟',
    gu: 'હેલો! હું તમારી કાનૂની મદદ માટે અહીં છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?',
    kn: 'ಹಲೋ! ನಾನು ನಿಮ್ಮ ಕಾನೂನು ಸಹಾಯಕ್ಕಾಗಿ ಇಲ್ಲಿದ್ದೇನೆ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
    ml: 'ഹലോ! നിങ്ങളുടെ നിയമ സഹായത്തിനായി ഞാൻ ഇവിടെ ഇരിക്കുന്നു. ഇന്ന് എങ്ങനെ സഹായിക്കാം?',
    pa: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡੀ ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ ਲਈ ਹਾਜ਼ਰ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
    or: 'ନମସ୍କାର! ଆପଣଙ୍କ ଆଇନି ସହାଯ୍ୟ ପାଇଁ ମୁଁ ଏଠାରେ ଅଛି। ଆଜି ମୁଁ କିପରି ସହାଯ୍ୟ କରିପାରିବି?',
  },
  chatbotTyping: {
    en: 'Typing...',
    hi: 'टाइप कर रहा है...',
  },
  chatbotClear: {
    en: 'Clear chat',
    hi: 'चैट साफ़ करें',
  },

  // Legal terms
  legalAdvice: {
    en: 'Legal Advice',
    hi: 'कानूनी सलाह',
  },
  documentAnalysis: {
    en: 'Document Analysis',
    hi: 'दस्तावेज़ विश्लेषण',
  },
  caseManagement: {
    en: 'Case Management',
    hi: 'केस प्रबंधन',
  },
  clientManagement: {
    en: 'Client Management',
    hi: 'क्लाइंट प्रबंधन',
  },

  // User roles
  user: {
    en: 'User',
    hi: 'उपयोगकर्ता',
  },
  lawyer: {
    en: 'Lawyer',
    hi: 'वकील',
  },
  admin: {
    en: 'Admin',
    hi: 'प्रशासक',
  },

  // App header/common
  appName: {
    en: 'Nyāy Sakhi',
    hi: 'न्याय सखी',
    bn: 'ন্যায় সখী',
    te: 'న్యాయ సఖి',
    mr: 'न्याय सखी',
    ta: 'ந்யாய் சகி',
    ur: 'نیاۓ سखी',
    gu: 'ન્યાય સખી',
    kn: 'ನ್ಯಾಯ ಸಾಕಿ',
    ml: 'ന്യായ സഖി',
    pa: 'ਨਿਆਇ ਸਖੀ',
    or: 'ନ୍ୟାୟ ସଖୀ',
  },
  signIn: {
    en: 'Sign In',
    hi: 'लॉगिन करें',
    bn: 'সাইন ইন',
    te: 'సైన్ ఇన్',
    mr: 'साइन इन',
    ta: 'உள்நுழை',
    ur: 'سائن ان',
    gu: 'સાઇન ઇન',
    kn: 'ಸೈನ್ ಇನ್',
    ml: 'സൈൻ ഇൻ',
    pa: 'ਸਾਈਨ ਇਨ',
    or: 'ସାଇନ୍ ଇନ୍',
  },
  signUp: {
    en: 'Sign Up',
    hi: 'रजिस्टर करें',
    bn: 'সাইন আপ',
    te: 'సైన్ అప్',
    mr: 'साइन अप',
    ta: 'பதிவு செய்',
    ur: 'سائن اپ',
    gu: 'સાઇન અપ',
    kn: 'ಸೈನ್ ಅಪ್',
    ml: 'സൈൻ അപ്പ്',
    pa: 'ਸਾਈਨ ਅੱਪ',
    or: 'ସାଇନ୍ ଅପ୍',
  },
}

// Get translated text based on language
export type SupportedLang =
  | 'en'
  | 'hi'
  | 'bn'
  | 'te'
  | 'mr'
  | 'ta'
  | 'ur'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or'
  | 'as'
  | 'sd'
  | 'ks'
  | 'sa'

export function getText(key: string, language: SupportedLang): string {
  const content = UI_TEXT[key]
  if (!content) {
    console.warn(`Translation missing for key: ${key}`)
    return key
  }
  // try requested language, fallback to hi, then en
  return (content[language] as string) || content.hi || content.en
}

// Get all translations for a key
export function getTranslations(key: string): MultilingualResponse | null {
  return UI_TEXT[key] || null
}

// Chatbot responses based on context and language
export const CHATBOT_RESPONSES: MultilingualContent = {
  // Document upload help
  documentUploadHelp: {
    en: 'To upload documents: 1) Go to the Documents page 2) Click "Upload New Document" button 3) Select your file (PDF, DOC, JPG, PNG) 4) Click Upload button. Our AI system will analyze your document.',
    hi: 'दस्तावेज़ अपलोड करने के लिए: 1) दस्तावेज़ पेज पर जाएं 2) "नया दस्तावेज़ अपलोड करें" बटन पर क्लिक करें 3) अपनी फ़ाइल चुनें (PDF, DOC, JPG, PNG) 4) अपलोड बटन पर क्लिक करें। हमारा AI सिस्टम आपके दस्तावेज़ का विश्लेषण करेगा।',
  },

  // Lawyer search help
  lawyerSearchHelp: {
    en: 'To find lawyers: 1) Go to the Lawyers page 2) Select your location and legal area 3) Click search button 4) Choose from the list of lawyers 5) View their profiles and contact them.',
    hi: 'वकील खोजने के लिए: 1) वकील पेज पर जाएं 2) अपना स्थान और कानूनी क्षेत्र चुनें 3) खोज बटन पर क्लिक करें 4) वकीलों की सूची में से चुनें 5) उनकी प्रोफ़ाइल देखें और संपर्क करें।',
  },

  // Legal advice
  legalAdviceResponse: {
    en: 'I can provide general legal information, but for specific legal advice, please consult with a qualified lawyer. You can search for lawyers in your area on our lawyer search page.',
    hi: 'मैं आपको सामान्य कानूनी जानकारी प्रदान कर सकता हूँ, लेकिन विशिष्ट कानूनी सलाह के लिए कृपया एक योग्य वकील से परामर्श करें। आप हमारे वकील खोज पेज पर जाकर अपने क्षेत्र के वकीलों को खोज सकते हैं।',
  },

  // Rights information
  rightsInfo: {
    en: 'Your fundamental rights under the Indian Constitution: 1) Right to Equality 2) Right to Freedom 3) Right against Exploitation 4) Right to Freedom of Religion 5) Cultural and Educational Rights 6) Right to Constitutional Remedies. Check the Knowledge Base for detailed information.',
    hi: 'भारतीय संविधान के अनुसार आपके मौलिक अधिकार: 1) समानता का अधिकार 2) स्वतंत्रता का अधिकार 3) शोषण के विरुद्ध अधिकार 4) धार्मिक स्वतंत्रता का अधिकार 5) सांस्कृतिक और शैक्षिक अधिकार 6) संवैधानिक उपचार का अधिकार। विस्तृत जानकारी के लिए ज्ञान आधार देखें।',
  },

  // General help
  generalHelp: {
    en: "I'm here to help you! You can ask me about: how to upload documents, how to find lawyers, legal advice, your rights, or information about any page.",
    hi: 'मैं आपकी सहायता के लिए यहाँ हूँ! आप मुझसे पूछ सकते हैं: दस्तावेज़ अपलोड कैसे करें, वकील कैसे खोजें, कानूनी सलाह, आपके अधिकार, या किसी भी पेज के बारे में जानकारी।',
  },

  // Default response
  defaultResponse: {
    en: "I'm here to help you. Please provide more details about your question or ask about any of the following: document upload, lawyer search, legal advice, or your rights.",
    hi: 'मैं आपकी सहायता करने के लिए यहाँ हूँ। कृपया अपना प्रश्न अधिक विस्तार से बताएं या निम्नलिखित में से कोई भी पूछें: दस्तावेज़ अपलोड, वकील खोज, कानूनी सलाह, या आपके अधिकार।',
  },
}

// Get chatbot response based on message content/context
export function getChatbotResponse(
  message: string,
  language: SupportedLang,
  userRole: 'user' | 'lawyer' | 'admin',
  context: { page?: string } = {}
): string {
  const lowerMessage = message.toLowerCase()

  // Document upload help
  if (
    lowerMessage.includes('upload') ||
    lowerMessage.includes('document') ||
    lowerMessage.includes('अपलोड') ||
    lowerMessage.includes('दस्तावेज')
  ) {
    return (
      CHATBOT_RESPONSES.documentUploadHelp[language] ||
      CHATBOT_RESPONSES.documentUploadHelp.hi ||
      CHATBOT_RESPONSES.documentUploadHelp.en
    )
  }

  // Lawyer search help
  if (
    lowerMessage.includes('lawyer') ||
    lowerMessage.includes('find') ||
    lowerMessage.includes('वकील') ||
    lowerMessage.includes('खोज')
  ) {
    return (
      CHATBOT_RESPONSES.lawyerSearchHelp[language] ||
      CHATBOT_RESPONSES.lawyerSearchHelp.hi ||
      CHATBOT_RESPONSES.lawyerSearchHelp.en
    )
  }

  // Legal advice
  if (
    lowerMessage.includes('legal advice') ||
    lowerMessage.includes('कानूनी सलाह')
  ) {
    return (
      CHATBOT_RESPONSES.legalAdviceResponse[language] ||
      CHATBOT_RESPONSES.legalAdviceResponse.hi ||
      CHATBOT_RESPONSES.legalAdviceResponse.en
    )
  }

  // Rights information
  if (lowerMessage.includes('rights') || lowerMessage.includes('अधिकार')) {
    return (
      CHATBOT_RESPONSES.rightsInfo[language] ||
      CHATBOT_RESPONSES.rightsInfo.hi ||
      CHATBOT_RESPONSES.rightsInfo.en
    )
  }

  // General help
  if (lowerMessage.includes('help') || lowerMessage.includes('सहायता')) {
    return (
      CHATBOT_RESPONSES.generalHelp[language] ||
      CHATBOT_RESPONSES.generalHelp.hi ||
      CHATBOT_RESPONSES.generalHelp.en
    )
  }

  // Default
  return (
    CHATBOT_RESPONSES.defaultResponse[language] ||
    CHATBOT_RESPONSES.defaultResponse.hi ||
    CHATBOT_RESPONSES.defaultResponse.en
  )
}

// Language detection utility (heuristic using Unicode blocks)
export function detectLanguage(text: string): SupportedLang {
  if (!text || typeof text !== 'string') return 'en'
  const ranges: Array<{ re: RegExp; lang: SupportedLang }> = [
    { re: /[\u0900-\u097F]/, lang: 'hi' }, // Devanagari (hi, mr, sa)
    { re: /[\u0980-\u09FF]/, lang: 'bn' }, // Bengali/Assamese
    { re: /[\u0C00-\u0C7F]/, lang: 'te' }, // Telugu
    { re: /[\u0B80-\u0BFF]/, lang: 'ta' }, // Tamil
    { re: /[\u0600-\u06FF]/, lang: 'ur' }, // Arabic block for Urdu
    { re: /[\u0A80-\u0AFF]/, lang: 'gu' }, // Gujarati
    { re: /[\u0C80-\u0CFF]/, lang: 'kn' }, // Kannada
    { re: /[\u0D00-\u0D7F]/, lang: 'ml' }, // Malayalam
    { re: /[\u0A00-\u0A7F]/, lang: 'pa' }, // Gurmukhi (Punjabi)
    { re: /[\u0B00-\u0B7F]/, lang: 'or' }, // Odia
  ]

  for (const { re, lang } of ranges) {
    if (re.test(text)) return lang
  }
  return 'en'
}

// Format text based on language (hook point for language-specific tweaks)
export function formatText(text: string, language: SupportedLang): string {
  // Placeholder — extend for custom formatting needs per language
  return text
}

// Placeholder translation function (async so you can plug in a real provider)
export async function translateText(
  text: string,
  from: SupportedLang,
  to: SupportedLang
): Promise<string> {
  if (!text || from === to) return text
  // TODO: Integrate Google Translate / AWS Translate / in-house service
  // For now return original text (no-op)
  return text
}
