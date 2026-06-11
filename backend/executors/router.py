from backend.executors.python_executor import run_python
from backend.executors.javascript_executor import run_javascript
from backend.executors.java_executor import run_java
from backend.executors.c_executor import run_c
from backend.executors.cpp_executor import run_cpp


def run_by_language(code: str, language: str):
    language = language.lower().strip()

    if language in ["python", "py", "python3"]:
        return run_python(code)

    if language in ["javascript", "js", "node", "nodejs"]:
        return run_javascript(code)

    if language == "java":
        return run_java(code)

    if language == "c":
        return run_c(code)

    if language in ["cpp", "c++"]:
        return run_cpp(code)

    return {
        "success": False,
        "error": f"Unsupported language: {language}",
        "time": 0,
        "memory": 0,
    }