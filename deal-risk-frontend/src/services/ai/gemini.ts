import { CloseOpportunity } from "../../types";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
        temperature: 0.4,
        topP: 0.95,
        topK: 40,
    }
});

export class GeminiRiskAnalyzerService {
    static generatePrompt(deal: CloseOpportunity): string {
        const currentDate = new Date().toISOString();
        const statusLabel = deal.status_label || 'Unknown';
        const dateUpdated = deal.date_updated || 'Unknown';
        const dateCreated = deal.date_created || 'Unknown';
        const leadName = deal.lead_name || 'Unknown Lead';
        const userName = deal.user_name || 'Unknown Owner';
        const contactName = deal.contact_name || 'Unknown Contact';
        const pipelineName = deal.pipeline_name || 'Unknown Pipeline';
        const statusType = deal.status_type || 'Unknown';
        const confidence = deal.confidence || 50;
        const note = deal.note || 'No notes available';

        return `Analyze this sales deal and return ONLY a JSON object with no additional text.

Current Date: ${currentDate}
Lead: ${leadName}
Stage: ${statusLabel}
Pipeline: ${pipelineName}
Created: ${dateCreated}
Updated: ${dateUpdated}
Contact: ${contactName}
Owner: ${userName}
Confidence: ${confidence}%
Status: ${statusType}
Notes: ${note}

Calculate days since last update. Score 0-30 for low risk, 31-60 for medium risk, 61-100 for high risk based on time gaps, confidence level, deal progression, and notes content. Analyze the notes carefully for any red flags or positive signals.

Return only this JSON:
{"riskScore": number, "reason": "brief explanation", "recommendations": ["action 1", "action 2", "action 3"]}`;
    }

    static async analyzeRisk(deal: CloseOpportunity) {
        const prompt = this.generatePrompt(deal);

        try {
            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            });
            const response = result.response;
            const content = response.text();

            if (!content) {
                throw new Error('No response from AI');
            }

            const cleanContent = content
                .replace(/```json\n?/gi, '')
                .replace(/```\n?/gi, '')
                .trim();
            
            const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : cleanContent;
            
            const parsed = JSON.parse(jsonStr);
            
            return {
                riskScore: parsed.riskScore || 50,
                reason: parsed.reason || "Analysis completed",
                recommendations: parsed.recommendations || []
            };
        } catch (err: any) {
            console.error('Gemini API Error:', err);
            const isOverloaded = err.message?.includes('overloaded') || err.message?.includes('429') || err.message?.includes('503');
            return {
                riskScore: 50,
                reason: isOverloaded ? "AI service temporarily unavailable. Try again in a moment." : "AI analysis failed. Please try again.",
                recommendations: [
                    "Review deal manually",
                    "Contact the lead directly",
                    "Update deal status"
                ]
            };
        }
    }

    static async generateEmailContent(deal: CloseOpportunity) {
        const prompt = `Draft a professional email to the lead ${deal.lead_name || 'Valued Customer'} regarding their deal status. The email should be concise, polite, and encourage engagement. Use the following details to personalize the email:
- Lead Name: ${deal.lead_name || 'Valued Customer'}
- Deal Status: ${deal.status_label || 'Unknown'}
- Last Updated: ${deal.date_updated || 'Unknown'}
- Notes: ${deal.note || 'No notes available'}
    `;

        try {   
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const content = response.text();
            
            if (!content) {
                throw new Error('No response from AI');
            }
            
            return content.trim();
        } catch (err) {
            return `Dear ${deal.lead_name || 'Valued Customer'},

I hope this message finds you well. I wanted to touch base regarding your current deal status with us. Please feel free to reach out if you have any questions or need further assistance.
Best regards,
[Your Name]`;
        }
    }
}