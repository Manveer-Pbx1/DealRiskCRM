import { CloseOpportunity } from "../../types";
import OpenAI from "openai";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export class OpenAIRiskAnalyzerService {
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
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are a sales risk analysis expert. Always respond with valid JSON only."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.4,
                max_tokens: 500,
                response_format: { type: "json_object" }
            });

            const content = completion.choices[0]?.message?.content;

            if (!content) {
                throw new Error('No response from AI');
            }

            const parsed = JSON.parse(content);
            
            return {
                riskScore: parsed.riskScore || 50,
                reason: parsed.reason || "Analysis completed",
                recommendations: parsed.recommendations || []
            };
        } catch (err: any) {
            console.error('OpenAI API Error:', err);
            const isRateLimited = err.message?.includes('429') || err.message?.includes('rate limit');
            return {
                riskScore: 50,
                reason: isRateLimited ? "AI service rate limit reached. Try again in a moment." : "AI analysis failed. Please try again.",
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
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional email writer for sales teams."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 400
            });
            
            const content = completion.choices[0]?.message?.content;
            
            if (!content) {
                throw new Error('No response from AI');
            }
            
            return content.trim();
        } catch (err) {
            console.error('OpenAI Email Generation Error:', err);
            return `Dear ${deal.lead_name || 'Valued Customer'},

I hope this message finds you well. I wanted to touch base regarding your current deal status with us. Please feel free to reach out if you have any questions or need further assistance.

Best regards,
[Your Name]`;
        }
    }
}
