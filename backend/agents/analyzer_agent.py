from backend.analyzer import analyze_code


class AnalyzerAgent:
    def run(self, code, language="python"):
        return analyze_code(code, language)