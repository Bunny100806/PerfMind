import ollama


def analyze_code(code: str, language: str = "python"):
    prompt = f"""
You are a senior software performance analysis assistant.

Analyze the following {language} code.

Identify:
1. Performance issues
2. Time complexity problems
3. Memory usage problems
4. Inefficient loops, data structures, or algorithms
5. Optimization suggestions specific to {language}

Important:
- Focus on {language} syntax and best practices.
- Do not assume the code is Python unless the language is Python.
- Give clear, structured, developer-friendly analysis.

Code:
{code}
"""

    response = ollama.chat(
        model="llama3",
        messages=[{"role": "user", "content": prompt}]
    )

    return response["message"]["content"]