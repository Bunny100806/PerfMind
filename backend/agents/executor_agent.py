from backend.executors.router import run_by_language


class ExecutorAgent:
    def run(self, code, language="python"):
        return run_by_language(code, language)