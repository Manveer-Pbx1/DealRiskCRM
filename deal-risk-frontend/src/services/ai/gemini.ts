import { CloseOpportunity } from "../../types";

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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
        const leadEmail = deal.lead_email || 'No email';
        const leadPhone = deal.lead_phone || 'No phone';
        const leadDescription = deal.lead_description || 'No description';

        return `Analyze this sales deal and return ONLY a JSON object with no additional text.

Current Date: ${currentDate}
Lead: ${leadName}
Email: ${leadEmail}
Phone: ${leadPhone}
Description: ${leadDescription}
Stage: ${statusLabel}
Pipeline: ${pipelineName}
Created: ${dateCreated}
Updated: ${dateUpdated}
Contact: ${contactName}
Owner: ${userName}
Confidence: ${confidence}%
Status: ${statusType}
Notes: ${note}

Total view of the data: ${JSON.stringify(deal)}

Calculate days since last update. Score 0-30 for low risk, 31-60 for medium risk, 61-100 for high risk based on time gaps, confidence level, deal progression, and notes content. Analyze the notes (denoted by a field called "note" or "notes" under opportunities array/object) carefully for any red flags or positive signals. Do not mention deal value in your analysis.

Return only this JSON:
{"riskScore": number, "reason": "brief explanation", "recommendations": ["action 1", "action 2", "action 3"]}`;
    }

    static async analyzeRisk(deal: CloseOpportunity) {
        const prompt = this.generatePrompt(deal);

        try {
            const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        topP: 0.8,
                        topK: 40
                    }
                }),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Gemini API Error: ${response.status}`);
            }
            
            const data = await response.json();
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!content) {
                throw new Error('No response from AI');
            }

            const cleanContent = content
                .replace(/```json\n?/gi, '')
                .replace(/```\n?/gi, '')
                .trim();
            
            const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : cleanContent;
            
            return JSON.parse(jsonStr);
        } catch (err) {
            return {
                riskScore: 50,
                reason: "AI analysis failed. Please try again.",
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
            const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                    }
                }),
            }); 
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Gemini API Error: ${response.status}`);
            }
            const data = await response.json();
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
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