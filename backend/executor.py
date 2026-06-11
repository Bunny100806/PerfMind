import time
import psutil
import os
import multiprocessing


BLOCKED_KEYWORDS = [
    "import os",
    "import subprocess",
    "import socket",
    "import shutil",
    "from os",
    "from subprocess",
    "from socket",
    "open(",
    "eval(",
    "exec(",
    "__import__",
    "input(",
]


SAFE_BUILTINS = {
    "print": print,
    "range": range,
    "len": len,
    "sum": sum,
    "min": min,
    "max": max,
    "abs": abs,
    "list": list,
    "dict": dict,
    "set": set,
    "tuple": tuple,
    "enumerate": enumerate,
    "str": str,
    "int": int,
    "float": float,
    "bool": bool,
}


def is_safe_code(code):
    lowered = code.lower()

    for keyword in BLOCKED_KEYWORDS:
        if keyword in lowered:
            return False, f"Blocked unsafe keyword: {keyword}"

    return True, None


def execute_code(code, queue):
    try:
        safe_globals = {
            "__builtins__": SAFE_BUILTINS
        }

        exec(
            code,
            safe_globals,
            safe_globals
        )

        queue.put({
            "success": True,
            "error": None
        })

    except Exception as e:
        queue.put({
            "success": False,
            "error": str(e)
        })


def run_code(code: str, timeout: int = 5):
    safe, error = is_safe_code(code)

    if not safe:
        return {
            "success": False,
            "error": error,
            "time": 0,
            "memory": 0,
        }

    process = psutil.Process(os.getpid())
    memory_before = process.memory_info().rss
    start_time = time.perf_counter()

    queue = multiprocessing.Queue()

    worker = multiprocessing.Process(
        target=execute_code,
        args=(code, queue)
    )

    worker.start()
    worker.join(timeout)

    if worker.is_alive():
        worker.terminate()
        worker.join()

        return {
            "success": False,
            "error": "Execution timed out. Infinite loop detected.",
            "time": timeout,
            "memory": 0,
        }

    end_time = time.perf_counter()
    memory_after = process.memory_info().rss

    if not queue.empty():
        result = queue.get()
    else:
        result = {
            "success": False,
            "error": "Execution failed.",
        }

    return {
        "success": result["success"],
        "error": result["error"],
        "time": round(end_time - start_time, 6),
        "memory": abs(memory_after - memory_before),
    }