// Copyright: Ankitects Pty Ltd and contributors
// License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

/**
 * AI Example Generator for Anki
 * Uses free Hugging Face models to generate example sentences
 */

interface AIConfig {
    apiEndpoint: string;
    model: string;
    maxLength: number;
    temperature: number;
}

// Free Hugging Face models we can use
const AI_MODELS = {
    // GPT-2 based models (fast, good quality)
    gpt2: {
        apiEndpoint: 'https://api-inference.huggingface.co/models/gpt2',
        model: 'gpt2',
        maxLength: 100,
        temperature: 0.7,
    },
    // Smaller, faster model
    distilgpt2: {
        apiEndpoint: 'https://api-inference.huggingface.co/models/distilgpt2',
        model: 'distilgpt2',
        maxLength: 80,
        temperature: 0.7,
    },
    // Better for educational content
    flan_t5: {
        apiEndpoint: 'https://api-inference.huggingface.co/models/google/flan-t5-base',
        model: 'google/flan-t5-base',
        maxLength: 100,
        temperature: 0.6,
    },
};

// Default model to use
let currentModel: AIConfig = AI_MODELS.gpt2;

// Cache for generated examples
const exampleCache = new Map<string, string[]>();

/**
 * Set the AI model to use
 */
export function setAIModel(modelName: keyof typeof AI_MODELS): void {
    if (AI_MODELS[modelName]) {
        currentModel = AI_MODELS[modelName];
        console.log(`AI Model set to: ${modelName}`);
    } else {
        console.error(`Unknown model: ${modelName}`);
    }
}

/**
 * Generate example sentences for a word or phrase
 */
export async function generateExamples(
    word: string,
    count = 3,
    context?: string
): Promise<string[]> {
    // Check cache first
    const cacheKey = `${word}-${count}-${context || ''}`;
    if (exampleCache.has(cacheKey)) {
        return exampleCache.get(cacheKey)!;
    }

    try {
        const examples: string[] = [];

        for (let i = 0; i < count; i++) {
            // Create prompt for generating example
            const prompt = createPrompt(word, i, context);

            // Call Hugging Face API
            const example = await callHuggingFaceAPI(prompt);

            if (example && example.trim().length > 0) {
                examples.push(example.trim());
            }
        }

        // Cache the results
        if (examples.length > 0) {
            exampleCache.set(cacheKey, examples);
        }

        return examples;
    } catch (error) {
        console.error('Error generating examples:', error);
        return getFallbackExamples(word);
    }
}

/**
 * Create a prompt for the AI model
 */
function createPrompt(word: string, variation: number, context?: string): string {
    const prompts = [
        `Write a clear example sentence using the word "${word}": `,
        `Create a simple sentence with "${word}" in it: `,
        `Example sentence using "${word}": `,
        `Show how to use "${word}" in a sentence: `,
    ];

    let prompt = prompts[variation % prompts.length];

    if (context) {
        prompt = `In the context of ${context}, ${prompt.toLowerCase()}`;
    }

    return prompt;
}

/**
 * Call Hugging Face Inference API
 */
async function callHuggingFaceAPI(prompt: string): Promise<string> {
    const response = await fetch(currentModel.apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Note: For production, you should use an API key
            // Get free API key from https://huggingface.co/settings/tokens
            // 'Authorization': 'Bearer YOUR_HF_TOKEN',
        },
        body: JSON.stringify({
            inputs: prompt,
            parameters: {
                max_length: currentModel.maxLength,
                temperature: currentModel.temperature,
                do_sample: true,
                top_p: 0.9,
                repetition_penalty: 1.2,
            },
            options: {
                wait_for_model: true,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    // Extract generated text
    if (Array.isArray(result) && result.length > 0) {
        const generatedText = result[0].generated_text;

        // Clean up the generated text
        return cleanGeneratedText(generatedText, prompt);
    }

    return '';
}

/**
 * Clean up generated text
 */
function cleanGeneratedText(text: string, prompt: string): string {
    // Remove the prompt from the result
    let cleaned = text.replace(prompt, '').trim();

    // Take only the first sentence
    const sentenceEnd = cleaned.search(/[.!?]\s+/);
    if (sentenceEnd > 0) {
        cleaned = cleaned.substring(0, sentenceEnd + 1);
    }

    // Ensure it ends with punctuation
    if (!/[.!?]$/.test(cleaned)) {
        cleaned += '.';
    }

    // Capitalize first letter
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

    return cleaned;
}

/**
 * Fallback examples when API fails
 */
function getFallbackExamples(word: string): string[] {
    return [
        `I need to learn the word "${word}".`,
        `The word "${word}" is important to remember.`,
        `Can you use "${word}" in a sentence?`,
    ];
}

/**
 * Add AI example generator button to card
 */
export function addAIGeneratorButton(): void {
    const qa = document.getElementById('qa');
    if (!qa) {
        return;
    }

    // Check if button already exists
    if (document.getElementById('ai-example-btn')) {
        return;
    }

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'ai-example-container';
    buttonContainer.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        z-index: 1000;
    `;

    // Create button
    const button = document.createElement('button');
    button.id = 'ai-example-btn';
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            <path d="M12 8v8m-4-4h8"/>
        </svg>
        <span style="margin-left: 8px;">Generate Examples</span>
    `;
    button.style.cssText = `
        display: flex;
        align-items: center;
        padding: 12px 20px;
        background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    // Hover effects
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
    });

    // Click handler
    button.addEventListener('click', async () => {
        await handleGenerateExamples(button);
    });

    buttonContainer.appendChild(button);
    document.body.appendChild(buttonContainer);
}

/**
 * Handle generate examples button click
 */
async function handleGenerateExamples(button: HTMLButtonElement): Promise<void> {
    // Get the word/phrase from the card
    const qa = document.getElementById('qa');
    if (!qa) {
        return;
    }

    // Try to extract the word being studied
    const word = extractWordFromCard(qa);
    if (!word) {
        showNotification('Could not find word to generate examples for', 'error');
        return;
    }

    // Update button state
    const originalText = button.innerHTML;
    button.innerHTML = `
        <div style="display: flex; align-items: center;">
            <div class="spinner" style="
                width: 16px;
                height: 16px;
                border: 3px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            "></div>
            <span style="margin-left: 8px;">Generating...</span>
        </div>
    `;
    button.disabled = true;

    try {
        // Generate examples
        const examples = await generateExamples(word, 3);

        // Display examples
        displayExamples(word, examples);

        // Restore button
        button.innerHTML = originalText;
        button.disabled = false;

        showNotification('Examples generated successfully!', 'success');
    } catch (error) {
        console.error('Error:', error);
        button.innerHTML = originalText;
        button.disabled = false;
        showNotification('Failed to generate examples. Please try again.', 'error');
    }
}

/**
 * Extract word from card content
 */
function extractWordFromCard(element: HTMLElement): string | null {
    // Try to find bold text (often used for the main word)
    const boldElement = element.querySelector('strong, b');
    if (boldElement) {
        return boldElement.textContent?.trim() || null;
    }

    // Try to find the first significant text
    const text = element.textContent?.trim();
    if (text) {
        // Get first word or phrase (up to 3 words)
        const words = text.split(/\s+/).slice(0, 3).join(' ');
        return words || null;
    }

    return null;
}

/**
 * Display generated examples
 */
function displayExamples(word: string, examples: string[]): void {
    // Remove existing examples
    const existing = document.getElementById('ai-examples-display');
    if (existing) {
        existing.remove();
    }

    // Create examples display
    const display = document.createElement('div');
    display.id = 'ai-examples-display';
    display.style.cssText = `
        position: fixed;
        bottom: 150px;
        right: 20px;
        max-width: 400px;
        background: white;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 999;
        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    const title = document.createElement('h3');
    title.textContent = `Examples for "${word}"`;
    title.style.cssText = `
        margin: 0 0 15px 0;
        font-size: 16px;
        font-weight: 700;
        color: #1e40af;
    `;

    display.appendChild(title);

    examples.forEach((example, index) => {
        const exampleDiv = document.createElement('div');
        exampleDiv.style.cssText = `
            margin: 10px 0;
            padding: 12px;
            background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
            border-radius: 8px;
            font-size: 14px;
            line-height: 1.6;
            color: #1e3a8a;
        `;
        exampleDiv.textContent = `${index + 1}. ${example}`;
        display.appendChild(exampleDiv);
    });

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        border: none;
        background: #ef4444;
        color: white;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    closeBtn.addEventListener('click', () => display.remove());

    display.appendChild(closeBtn);
    document.body.appendChild(display);
}

/**
 * Show notification
 */
function showNotification(message: string, type: 'success' | 'error'): void {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

// Export for global access
declare global {
    interface Window {
        aiExampleGenerator: {
            generateExamples: typeof generateExamples;
            setAIModel: typeof setAIModel;
            addButton: typeof addAIGeneratorButton;
        };
    }
}

window.aiExampleGenerator = {
    generateExamples,
    setAIModel,
    addButton: addAIGeneratorButton,
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        addAIGeneratorButton();
    });
} else {
    addAIGeneratorButton();
}
