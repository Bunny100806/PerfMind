import ollama


def ask_perfmind_ai(question: str, code: str = "", language: str = "python", analysis: str = ""):
    prompt = f"""
You are PerfMind AI Assistant, an expert software performance tutor and code optimization assistant.

User is working with {language} code.

Context Code:
{code}

Existing AI Analysis:
{analysis}

User Question:
{question}

Answer clearly and practically.
Focus on:
- performance
- memory usage
- time complexity
- optimization ideas
- explaining code changes
- safe engineering advice

Do not rewrite the full code unless the user asks.
"""

    response = ollama.chat(
        model="llama3",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]