import subprocess
import tempfile
import time
import os
import psutil


BLOCKED_KEYWORDS = [
    "require('fs')",
    'require("fs")',
    "require('child_process')",
    'require("child_process")',
    "process.exit",
    "eval(",
]


def is_safe_javascript(code):
    lowered = code.lower()

    for keyword in BLOCKED_KEYWORDS:
        if keyword in lowered:
            return False, f"Blocked unsafe keyword: {keyword}"

    return True, None


def run_javascript(code: str, timeout: int = 5):
    safe, error = is_safe_javascript(code)

    if not safe:
        return {
            "success": False,
            "error": error,
            "time": 0,
            "memory": 0,
        }

    with tempfile.NamedTemporaryFile(delete=False, suffix=".js", mode="w", encoding="utf-8") as temp:
        temp.write(code)
        temp_path = temp.name

    process = psutil.Process(os.getpid())
    memory_before = process.memory_info().rss
    start = time.perf_counter()

    try:
        result = subprocess.run(
            ["node", temp_path],
            capture_output=True,
            text=True,
            timeout=timeout
        )

        end = time.perf_counter()
        memory_after = process.memory_info().rss

        return {
            "success": result.returncode == 0,
            "error": result.stderr if result.returncode != 0 else None,
            "time": round(end - start, 6),
            "memory": abs(memory_after - memory_before),
        }

    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "error": "Execution timed out. Infinite loop detected.",
            "time": timeout,
            "memory": 0,
        }

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)