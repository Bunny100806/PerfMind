import ollama
import re


def extract_code(text):
    if not text:
        return ""

    match = re.search(
        r"```(?:python|javascript|js|java|c|cpp|c\+\+)?\s*(.*?)```",
        text,
        re.DOTALL
    )

    if match:
        return match.group(1).strip()

    text = text.replace("```python", "")
    text = text.replace("```javascript", "")
    text = text.replace("```js", "")
    text = text.replace("```java", "")
    text = text.replace("```c", "")
    text = text.replace("```cpp", "")
    text = text.replace("```c++", "")
    text = text.replace("```", "")

    return text.strip()


def language_rules(language):
    rules = {
        "python": """
Python optimization rules:
- Prefer list comprehensions over repeated append when appropriate
- Prefer sets/dictionaries for repeated membership checks
- Avoid unnecessary recursion
- Avoid generators if list output is required
- Avoid external libraries
- Preserve print/output behavior
""",
        "javascript": """
JavaScript optimization rules:
- Avoid generators unless the original code requires lazy iteration
- Avoid unnecessary closures and abstractions inside hot loops
- Prefer simple arrays and direct loops for speed
- Avoid changing console.log output behavior
- Do not use external packages
- Return plain executable JavaScript code
""",
        "java": """
Java optimization rules:
- Use primitive types and arrays where possible
- Avoid unnecessary object creation inside loops
- Keep the public class name as Main
- Preserve System.out.println output behavior
- Do not use external libraries
""",
        "c": """
C optimization rules:
- Preserve int main() structure
- Avoid unsafe functions
- Avoid unnecessary dynamic allocation
- Prefer simple loop optimization
- Preserve printf output behavior
- Do not use non-standard libraries
""",
        "cpp": """
C++ optimization rules:
- Prefer efficient STL usage only when helpful
- Avoid unnecessary heap allocation
- Avoid excessive abstraction
- Preserve main() structure
- Preserve cout/printf output behavior
- Do not use non-standard libraries
"""
    }

    return rules.get(language, "Optimize using best practices for this language.")


def optimize_code(code: str, language: str = "python"):
    rules = language_rules(language)

    prompt = f"""
You are a strict performance optimization engine.

Your task is to optimize {language} code for real execution speed and memory efficiency.

IMPORTANT:
The optimized code will be compiled/executed and benchmarked.
If your code is slower, invalid, or changes the output, it will be rejected.

GLOBAL RULES:
- Return ONLY executable {language} code
- No explanations
- No markdown outside code
- Preserve the exact same output behavior
- Do not change the programming language
- Do not use external third-party libraries
- Do not introduce unnecessary abstractions
- Do not make the code slower for readability
- Prefer simple, direct, benchmark-friendly code
- Optimize algorithmic complexity when possible
- Reduce memory usage when possible
- If no safe optimization is possible, return the original code unchanged

LANGUAGE-SPECIFIC RULES:
{rules}

Code:
{code}
"""

    try:
        response = ollama.chat(
            model="llama3",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        raw_output = response["message"]["content"]
        clean_code = extract_code(raw_output)

        if not clean_code or len(clean_code.strip()) == 0:
            return code

        return clean_code

    except Exception as e:
        print("Optimizer Error:", e)
        return code