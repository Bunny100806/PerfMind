from backend.optimizer import optimize_code


class OptimizerAgent:
    def run(self, code, language="python"):
        return optimize_code(code, language)