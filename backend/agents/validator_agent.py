from backend.validator import compare_metrics


class ValidatorAgent:
    def run(self, before, after):
        return compare_metrics(before, after)