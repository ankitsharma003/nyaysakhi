import { NextRequest, NextResponse } from 'next/server'
import { getChatbotResponse, detectLanguage } from '@/lib/multilingual-api'

interface ChatbotRequest {
  message: string
  language: 'en' | 'hi'
  userRole: 'user' | 'lawyer' | 'admin'
  context: {
    page: string
    userInfo: {
      name?: string
      role?: string
    }
  }
}

// Enhanced AI response with multilingual support
const getAIResponse = (request: ChatbotRequest): string => {
  const { message, language, userRole, context } = request

  // Auto-detect language if not specified
  const detectedLanguage = detectLanguage(message)
  const responseLanguage = language || detectedLanguage

  // Get response using multilingual service
  let response = getChatbotResponse(
    message,
    responseLanguage,
    userRole,
    context
  )

  // Add role-specific context
  if (userRole === 'lawyer') {
    if (responseLanguage === 'hi') {
      response +=
        '\n\nवकील के रूप में, आप अपने क्लाइंट्स और केसों का प्रबंधन भी कर सकते हैं।'
    } else {
      response += '\n\nAs a lawyer, you can also manage your clients and cases.'
    }
  }

  // Add page-specific context
  if (context.page.includes('/dashboard')) {
    if (responseLanguage === 'hi') {
      response += '\n\nडैशबोर्ड पर आप अपने सभी मुख्य कार्यों तक पहुँच सकते हैं।'
    } else {
      response +=
        '\n\nOn the dashboard, you can access all your main functions.'
    }
  }

  return response
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatbotRequest = await request.json()

    // Validate request
    if (!body.message || !body.language) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Simulate AI processing delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    )

    // Get AI response
    const response = getAIResponse(body)

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
      language: body.language,
      context: body.context,
    })
  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
