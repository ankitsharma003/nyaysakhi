/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const { pool } = require('../config/database')

const seedFAQs = async () => {
  try {
    console.log('🌱 Seeding FAQ data...')

    const faqs = [
      // English FAQs
      {
        question: 'What is bail and how can I get it?',
        answer:
          'Bail is a legal mechanism that allows an accused person to be released from custody while awaiting trial. To get bail, you need to file a bail application in the appropriate court. The court considers factors like the nature of the offense, evidence against you, and your criminal history before granting bail.',
        category: 'Criminal Law',
        language: 'en',
        tags: ['bail', 'criminal', 'arrest', 'trial'],
      },
      {
        question: 'What are my rights when arrested by police?',
        answer:
          'When arrested, you have several fundamental rights: 1) Right to know the reason for arrest, 2) Right to legal representation, 3) Right to inform family/friends, 4) Right to medical examination, 5) Right to remain silent, 6) Right to be produced before a magistrate within 24 hours.',
        category: 'Criminal Law',
        language: 'en',
        tags: ['arrest', 'rights', 'police', 'legal'],
      },
      {
        question: 'How to file a complaint in consumer court?',
        answer:
          'To file a consumer complaint: 1) Identify the appropriate consumer forum based on the value of your claim, 2) Prepare necessary documents (bills, receipts, correspondence), 3) Fill out the complaint form, 4) Pay the required fee, 5) Submit the complaint with supporting documents. The forum will then issue notice to the opposite party.',
        category: 'Consumer Rights',
        language: 'en',
        tags: ['consumer', 'complaint', 'court', 'rights'],
      },
      {
        question: 'What is the difference between civil and criminal cases?',
        answer:
          'Civil cases involve disputes between individuals/organizations over rights, property, or contracts. Criminal cases involve violations of criminal law and are prosecuted by the state. Civil cases result in monetary compensation or injunctions, while criminal cases can result in imprisonment, fines, or both.',
        category: 'General',
        language: 'en',
        tags: ['civil', 'criminal', 'law', 'difference'],
      },
      {
        question: 'How to register a property in India?',
        answer:
          'Property registration involves: 1) Verify property documents and title, 2) Pay stamp duty and registration fees, 3) Execute sale deed in presence of witnesses, 4) Submit documents to sub-registrar office, 5) Get property registered and receive registration certificate. The process varies slightly by state.',
        category: 'Property Law',
        language: 'en',
        tags: ['property', 'registration', 'deed', 'stamp duty'],
      },

      // Hindi FAQs
      {
        question: 'जमानत क्या है और इसे कैसे प्राप्त करें?',
        answer:
          'जमानत एक कानूनी तंत्र है जो किसी आरोपी व्यक्ति को मुकदमे की प्रतीक्षा के दौरान हिरासत से रिहा करने की अनुमति देता है। जमानत प्राप्त करने के लिए, आपको उपयुक्त अदालत में जमानत आवेदन दाखिल करना होगा। अदालत जमानत देने से पहले अपराध की प्रकृति, आपके खिलाफ साक्ष्य और आपके आपराधिक इतिहास जैसे कारकों पर विचार करती है।',
        category: 'आपराधिक कानून',
        language: 'hi',
        tags: ['जमानत', 'आपराधिक', 'गिरफ्तारी', 'मुकदमा'],
      },
      {
        question: 'पुलिस द्वारा गिरफ्तारी के समय मेरे अधिकार क्या हैं?',
        answer:
          'गिरफ्तारी के समय आपके कई मौलिक अधिकार हैं: 1) गिरफ्तारी का कारण जानने का अधिकार, 2) कानूनी प्रतिनिधित्व का अधिकार, 3) परिवार/दोस्तों को सूचित करने का अधिकार, 4) चिकित्सा परीक्षा का अधिकार, 5) चुप रहने का अधिकार, 6) 24 घंटे के भीतर मजिस्ट्रेट के सामने पेश होने का अधिकार।',
        category: 'आपराधिक कानून',
        language: 'hi',
        tags: ['गिरफ्तारी', 'अधिकार', 'पुलिस', 'कानूनी'],
      },
      {
        question: 'उपभोक्ता अदालत में शिकायत कैसे दर्ज करें?',
        answer:
          'उपभोक्ता शिकायत दर्ज करने के लिए: 1) अपने दावे के मूल्य के आधार पर उपयुक्त उपभोक्ता मंच की पहचान करें, 2) आवश्यक दस्तावेज तैयार करें (बिल, रसीदें, पत्राचार), 3) शिकायत फॉर्म भरें, 4) आवश्यक शुल्क का भुगतान करें, 5) सहायक दस्तावेजों के साथ शिकायत जमा करें। मंच तब विपरीत पक्ष को नोटिस जारी करेगा।',
        category: 'उपभोक्ता अधिकार',
        language: 'hi',
        tags: ['उपभोक्ता', 'शिकायत', 'अदालत', 'अधिकार'],
      },
    ]

    // Clear existing FAQs
    await pool.query('DELETE FROM faqs')

    // Insert new FAQs
    for (const faq of faqs) {
      await pool.query(
        `INSERT INTO faqs (question, answer, category, language, tags)
         VALUES ($1, $2, $3, $4, $5)`,
        [faq.question, faq.answer, faq.category, faq.language, faq.tags]
      )
    }

    console.log('✅ FAQ data seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding FAQ data:', error)
  }
}

const seedSampleLawyers = async () => {
  try {
    console.log('🌱 Seeding sample lawyer data...')

    const lawyers = [
      {
        name: 'Adv. Rajesh Kumar',
        email: 'rajesh.kumar@law.com',
        phone: '9876543210',
        bar_council_number: 'DL/1234/2020',
        practice_areas: ['Criminal Law', 'Civil Law', 'Family Law'],
        districts: ['New Delhi', 'Gurgaon', 'Noida'],
        languages: ['Hindi', 'English'],
        experience: 8,
        rating: 4.5,
        verified: true,
        bio: 'Experienced criminal lawyer with 8+ years of practice in Delhi courts. Specializes in bail applications and criminal defense.',
      },
      {
        name: 'Adv. Priya Sharma',
        email: 'priya.sharma@law.com',
        phone: '9876543211',
        bar_council_number: 'MH/5678/2019',
        practice_areas: ['Consumer Rights', 'Property Law', 'Civil Law'],
        districts: ['Mumbai', 'Pune', 'Thane'],
        languages: ['Hindi', 'English', 'Marathi'],
        experience: 6,
        rating: 4.3,
        verified: true,
        bio: 'Consumer rights specialist with expertise in property disputes and civil litigation.',
      },
      {
        name: 'Adv. Amit Singh',
        email: 'amit.singh@law.com',
        phone: '9876543212',
        bar_council_number: 'UP/9012/2021',
        practice_areas: ['Family Law', 'Divorce', 'Child Custody'],
        districts: ['Lucknow', 'Kanpur', 'Agra'],
        languages: ['Hindi', 'English'],
        experience: 5,
        rating: 4.2,
        verified: true,
        bio: 'Family law expert helping clients with divorce, custody, and matrimonial disputes.',
      },
    ]

    // Clear existing lawyers
    await pool.query('DELETE FROM lawyers')

    // Insert sample lawyers
    for (const lawyer of lawyers) {
      await pool.query(
        `INSERT INTO lawyers (name, email, phone, bar_council_number, practice_areas, 
                             districts, languages, experience, rating, verified, bio)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          lawyer.name,
          lawyer.email,
          lawyer.phone,
          lawyer.bar_council_number,
          lawyer.practice_areas,
          lawyer.districts,
          lawyer.languages,
          lawyer.experience,
          lawyer.rating,
          lawyer.verified,
          lawyer.bio,
        ]
      )
    }

    console.log('✅ Sample lawyer data seeded successfully')
  } catch (error) {
    console.error('❌ Error seeding lawyer data:', error)
  }
}

const seedData = async () => {
  try {
    await seedFAQs()
    await seedSampleLawyers()
    console.log('🎉 All seed data created successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  seedData()
}

module.exports = { seedData, seedFAQs, seedSampleLawyers }
