import subprocess
import tempfile
import time
import os
import psutil
import shutil


BLOCKED_KEYWORDS = [
    "system(",
    "popen(",
    "fork(",
    "exec(",
    "#include <windows.h>",
    "#include<windows.h>",
]


def is_safe_c(code):
    lowered = code.lower()

    for keyword in BLOCKED_KEYWORDS:
        if keyword in lowered:
            return False, f"Blocked unsafe keyword: {keyword}"

    return True, None


def run_c(code: str, timeout: int = 8):
    safe, error = is_safe_c(code)

    if not safe:
        return {"success": False, "error": error, "time": 0, "memory": 0}

    temp_dir = tempfile.mkdtemp()
    source_file = os.path.join(temp_dir, "main.c")
    exe_file = os.path.join(temp_dir, "main.exe")

    with open(source_file, "w", encoding="utf-8") as f:
        f.write(code)

    process = psutil.Process(os.getpid())
    memory_before = process.memory_info().rss
    start = time.perf_counter()

    try:
        compile_result = subprocess.run(
            ["gcc", source_file, "-o", exe_file],
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
            [exe_file],
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