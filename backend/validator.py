def compare_metrics(original, optimized):
    if not optimized["success"]:
        return {
            "accepted": False,
            "message": "Optimized code failed during execution.",
            "time_improvement": 0,
            "memory_improvement": 0
        }

    time_improvement = original["time"] - optimized["time"]
    memory_improvement = original["memory"] - optimized["memory"]

    accepted = time_improvement > 0 or memory_improvement > 0

    return {
        "accepted": accepted,
        "message": "Optimization accepted." if accepted else "Optimization did not improve performance.",
        "time_improvement": round(time_improvement, 6),
        "memory_improvement": memory_improvement
    }