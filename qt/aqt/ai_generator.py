# Copyright: Ankitects Pty Ltd and contributors
# License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html

"""
AI Example Generator Backend
Uses free Hugging Face API to generate example sentences
"""

import json
import urllib.request
import urllib.error
from typing import List, Optional
import re


class AIExampleGenerator:
    """Generate example sentences using AI models"""

    # Free Hugging Face models - updated with better free models
    MODELS = {
        "gpt2": "https://api-inference.huggingface.co/models/gpt2",
        "distilgpt2": "https://api-inference.huggingface.co/models/distilgpt2",
        "flan-t5": "https://api-inference.huggingface.co/models/google/flan-t5-base",
        "bloomz": "https://api-inference.huggingface.co/models/bigscience/bloomz-560m",
        "phi-2": "https://api-inference.huggingface.co/models/microsoft/phi-2",
    }

    def __init__(self, api_token: Optional[str] = None):
        """
        Initialize AI Example Generator

        Args:
            api_token: Optional Hugging Face API token for higher rate limits
                      Get free token from: https://huggingface.co/settings/tokens
        """
        self.api_token = api_token
        self.current_model = "gpt2"

    def set_model(self, model_name: str) -> None:
        """Set the AI model to use"""
        if model_name in self.MODELS:
            self.current_model = model_name
        else:
            raise ValueError(f"Unknown model: {model_name}")

    def generate_examples(
        self,
        word: str,
        count: int = 3,
        context: Optional[str] = None,
        max_length: int = 100,
    ) -> List[str]:
        """
        Generate example sentences for a word

        Args:
            word: The word to generate examples for
            count: Number of examples to generate
            context: Optional context to guide generation
            max_length: Maximum length of generated text

        Returns:
            List of example sentences
        """
        examples = []

        for i in range(count):
            try:
                prompt = self._create_prompt(word, i, context)
                example = self._call_api(prompt, max_length)

                if example and len(example.strip()) > 0:
                    cleaned = self._clean_text(example, prompt)
                    if cleaned:
                        examples.append(cleaned)
            except Exception as e:
                print(f"Error generating example {i+1}: {e}")
                continue

        # If no examples generated, return fallback
        if not examples:
            return self._get_fallback_examples(word)

        return examples

    def _create_prompt(self, word: str, variation: int, context: Optional[str]) -> str:
        """Create a prompt for the AI model"""
        prompts = [
            f'Write a clear example sentence using the word "{word}": ',
            f'Create a simple sentence with "{word}" in it: ',
            f'Example sentence using "{word}": ',
            f'Show how to use "{word}" in a sentence: ',
        ]

        prompt = prompts[variation % len(prompts)]

        if context:
            prompt = f"In the context of {context}, {prompt.lower()}"

        return prompt

    def _call_api(self, prompt: str, max_length: int) -> str:
        """Call Hugging Face Inference API"""
        url = self.MODELS[self.current_model]

        headers = {"Content-Type": "application/json"}

        # Add API token if available
        if self.api_token:
            headers["Authorization"] = f"Bearer {self.api_token}"

        data = {
            "inputs": prompt,
            "parameters": {
                "max_length": max_length,
                "temperature": 0.7,
                "do_sample": True,
                "top_p": 0.9,
                "repetition_penalty": 1.2,
            },
            "options": {"wait_for_model": True},
        }

        req = urllib.request.Request(
            url, data=json.dumps(data).encode("utf-8"), headers=headers
        )

        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read().decode("utf-8"))

                if isinstance(result, list) and len(result) > 0:
                    return result[0].get("generated_text", "")

        except urllib.error.HTTPError as e:
            print(f"HTTP Error: {e.code} - {e.reason}")
            raise
        except urllib.error.URLError as e:
            print(f"URL Error: {e.reason}")
            raise

        return ""

    def _clean_text(self, text: str, prompt: str) -> str:
        """Clean up generated text"""
        # Remove the prompt
        cleaned = text.replace(prompt, "").strip()

        # Take only the first sentence
        match = re.search(r"^[^.!?]*[.!?]", cleaned)
        if match:
            cleaned = match.group(0)
        else:
            # If no sentence ending found, add a period
            cleaned = cleaned.split("\n")[0].strip()
            if not cleaned.endswith((".", "!", "?")):
                cleaned += "."

        # Capitalize first letter
        if cleaned:
            cleaned = cleaned[0].upper() + cleaned[1:]

        # Remove extra whitespace
        cleaned = re.sub(r"\s+", " ", cleaned).strip()

        # Validate length
        if len(cleaned) < 10 or len(cleaned) > 200:
            return ""

        return cleaned

    def _get_fallback_examples(self, word: str) -> List[str]:
        """Fallback examples when API fails"""
        return [
            f'I need to learn the word "{word}".',
            f'The word "{word}" is important to remember.',
            f'Can you use "{word}" in a sentence?',
        ]


# Singleton instance
_generator: Optional[AIExampleGenerator] = None


def get_generator(api_token: Optional[str] = None) -> AIExampleGenerator:
    """Get or create the AI generator instance"""
    global _generator
    if _generator is None:
        _generator = AIExampleGenerator(api_token)
    return _generator


def generate_examples_for_card(
    word: str, count: int = 3, context: Optional[str] = None
) -> List[str]:
    """
    Generate examples for a card

    Args:
        word: Word to generate examples for
        count: Number of examples
        context: Optional context

    Returns:
        List of example sentences
    """
    generator = get_generator()
    return generator.generate_examples(word, count, context)
