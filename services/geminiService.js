const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        this.context = [];
    }

    async initializeContext(crawledData) {
        if (!crawledData || !Array.isArray(crawledData)) {
            throw new Error('Invalid crawled data format');
        }

        // Create a context string from crawled data
        const contextString = crawledData
            .map(page => {
                return `
                URL: ${page.url}
                Title: ${page.title}
                Content: ${page.content}
                `;
            })
            .join('\n');

        // Store context for future reference
        this.context = contextString;

        return {
            success: true,
            message: 'Context initialized successfully'
        };
    }

    async getResponse(userMessage) {
        try {
            // Construct the prompt with context
            const prompt = `
            Based on the following context about Trường Đại học Tài nguyên và Môi trường TPHCM:
            ${this.context}

            Please answer the following question:
            ${userMessage}

            If the answer cannot be found in the context, please respond with:
            "I apologize, but I don't have enough information from the university's website to answer that question accurately."
            `;

            // Get response from Gemini
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return {
                success: true,
                message: text
            };

        } catch (error) {
            console.error('Gemini API error:', error);
            return {
                success: false,
                error: 'Failed to get response from AI model'
            };
        }
    }

    // Method to clear context if needed
    clearContext() {
        this.context = [];
        return {
            success: true,
            message: 'Context cleared successfully'
        };
    }
}

module.exports = new GeminiService();
