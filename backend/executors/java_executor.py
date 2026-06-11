import subprocess
import tempfile
import time
import os
import psutil
import shutil


BLOCKED_KEYWORDS = [
    "runtime.getruntime",
    "processbuilder",
    "system.exit",
    "java.io.file",
    "files.",
    "socket",
]


def is_safe_java(code):
    lowered = code.lower()

    for keyword in BLOCKED_KEYWORDS:
        if keyword in lowered:
            return False, f"Blocked unsafe keyword: {keyword}"

    return True, None


def run_java(code: str, timeout: int = 8):
    safe, error = is_safe_java(code)

    if not safe:
        return {"success": False, "error": error, "time": 0, "memory": 0}

    temp_dir = tempfile.mkdtemp()
    java_file = os.path.join(temp_dir, "Main.java")

    with open(java_file, "w", encoding="utf-8") as f:
        f.write(code)

    process = psutil.Process(os.getpid())
    memory_before = process.memory_info().rss
    start = time.perf_counter()

    try:
        compile_result = subprocess.run(
            ["javac", java_file],
            capture_output=True,
            text=True,
            timeout=timeout,
        )

        if compile_result.returncode != 0:
            return {
                "success": False,
                "error": compile_result.stderr,
                "time": 0,
                "memory": 0,
            }

        run_result = subprocess.run(
            ["java", "-cp", temp_dir, "Main"],
            capture_output=True,
            text=True,
            timeout=timeout,
        )

        end = time.perf_counter()
        memory_after = process.memory_info().rss

        return {
            "success": run_result.returncode == 0,
            "error": run_result.stderr if run_result.returncode != 0 else None,
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
        shutil.rmtree(temp_dir, ignore_errors=True)