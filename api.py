from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.agents.analyzer_agent import AnalyzerAgent
from backend.agents.optimizer_agent import OptimizerAgent
from backend.agents.executor_agent import ExecutorAgent
from backend.agents.validator_agent import ValidatorAgent

from backend.database import init_db, save_history, get_history
from backend.report_generator import generate_pdf_report
from backend.chat_agent import ask_perfmind_ai


app = FastAPI(title="PerfMind API")

init_db()

analyzer_agent = AnalyzerAgent()
optimizer_agent = OptimizerAgent()
executor_agent = ExecutorAgent()
validator_agent = ValidatorAgent()

SUPPORTED_LANGUAGES = [
    "python",
    "javascript",
    "java",
    "c",
    "cpp"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CodeRequest(BaseModel):
    code: str
    language: str = "python"


class ReportRequest(BaseModel):
    result: dict


class ChatRequest(BaseModel):
    question: str
    code: str = ""
    language: str = "python"
    analysis: str = ""


def normalize_language(language: str):
    lang = language.lower().strip()

    aliases = {
        "py": "python",
        "python3": "python",
        "js": "javascript",
        "node": "javascript",
        "nodejs": "javascript",
        "c++": "cpp",
        "cc": "cpp",
        "cxx": "cpp",
    }

    return aliases.get(lang, lang)


def detect_language_from_filename(filename: str):
    name = filename.lower()

    if name.endswith(".py"):
        return "python"

    if name.endswith(".js"):
        return "javascript"

    if name.endswith(".java"):
        return "java"

    if name.endswith(".c"):
        return "c"

    if (
        name.endswith(".cpp")
        or name.endswith(".cc")
        or name.endswith(".cxx")
    ):
        return "cpp"

    return "python"


@app.get("/")
def home():
    return {
        "message": "PerfMind API Running",
        "status": "active",
        "backend": "FastAPI",
        "model": "Llama3 via Ollama",
        "architecture": "Multi-Agent Multi-Language Backend",
        "active_languages": SUPPORTED_LANGUAGES,
    }


@app.get("/history")
def history():
    return {
        "success": True,
        "history": get_history()
    }


@app.post("/export-report")
def export_report(request: ReportRequest):
    filepath = generate_pdf_report(request.result)

    return FileResponse(
        filepath,
        media_type="application/pdf",
        filename="perfmind_optimization_report.pdf"
    )


@app.post("/chat")
def chat(request: ChatRequest):
    answer = ask_perfmind_ai(
        question=request.question,
        code=request.code,
        language=request.language,
        analysis=request.analysis
    )

    return {
        "success": True,
        "answer": answer
    }


@app.post("/full-pipeline")
def full_pipeline(request: CodeRequest):
    logs = []
    language = normalize_language(request.language)

    try:
        logs.append("[System] Multi-agent pipeline started")
        logs.append(f"[System] Selected language: {language}")

        if language not in SUPPORTED_LANGUAGES:
            logs.append(f"[System] Unsupported language: {language}")

            save_history(
                language=language,
                code=request.code,
                success=False,
                error=f"Language '{language}' is not supported."
            )

            return {
                "success": False,
                "language": language,
                "error": f"Language '{language}' is not supported.",
                "logs": logs,
            }

        logs.append("[Executor Agent] Running original code")

        original_metrics = executor_agent.run(
            request.code,
            language
        )

        logs.append("[Executor Agent] Original code execution completed")

        if not original_metrics.get("success", False):
            logs.append("[Executor Agent] Original code failed")

            save_history(
                language=language,
                code=request.code,
                original_time=original_metrics.get("time", 0),
                original_memory=original_metrics.get("memory", 0),
                success=False,
                error=original_metrics.get(
                    "error",
                    "Original code execution failed"
                )
            )

            return {
                "success": False,
                "language": language,
                "error": original_metrics.get(
                    "error",
                    "Original code execution failed"
                ),
                "before": original_metrics,
                "logs": logs,
            }

        logs.append("[Analyzer Agent] Starting AI analysis")

        analysis = analyzer_agent.run(
            request.code,
            language
        )

        logs.append("[Analyzer Agent] Analysis completed")

        logs.append("[Optimizer Agent] Generating optimized code")

        optimized_code = optimizer_agent.run(
            request.code,
            language
        )

        logs.append("[Optimizer Agent] Optimized code generated")

        logs.append("[Executor Agent] Running optimized code")

        optimized_metrics = executor_agent.run(
            optimized_code,
            language
        )

        logs.append("[Executor Agent] Optimized code execution completed")

        if not optimized_metrics.get("success", False):
            logs.append("[Executor Agent] Optimized code failed")

            comparison = {
                "accepted": False,
                "message": "Optimized code execution failed.",
                "time_improvement": 0,
                "memory_improvement": 0,
            }

            save_history(
                language=language,
                code=request.code,
                analysis=analysis,
                optimized_code=optimized_code,
                original_time=original_metrics.get("time", 0),
                optimized_time=optimized_metrics.get("time", 0),
                original_memory=original_metrics.get("memory", 0),
                optimized_memory=optimized_metrics.get("memory", 0),
                success=False,
                error=optimized_metrics.get(
                    "error",
                    "Optimized code execution failed"
                )
            )

            return {
                "success": False,
                "language": language,
                "error": optimized_metrics.get(
                    "error",
                    "Optimized code execution failed"
                ),
                "analysis": analysis,
                "optimized_code": optimized_code,
                "before": original_metrics,
                "after": optimized_metrics,
                "comparison": comparison,
                "logs": logs,
            }

        logs.append("[Validator Agent] Comparing runtime metrics")

        comparison = validator_agent.run(
            original_metrics,
            optimized_metrics
        )

        logs.append("[Validator Agent] Validation completed")
        logs.append("[System] Pipeline completed successfully")

        save_history(
            language=language,
            code=request.code,
            analysis=analysis,
            optimized_code=optimized_code,
            original_time=original_metrics.get("time", 0),
            optimized_time=optimized_metrics.get("time", 0),
            original_memory=original_metrics.get("memory", 0),
            optimized_memory=optimized_metrics.get("memory", 0),
            success=True,
            error=""
        )

        return {
            "success": True,
            "language": language,
            "analysis": analysis,
            "optimized_code": optimized_code,
            "before": original_metrics,
            "after": optimized_metrics,
            "comparison": comparison,
            "logs": logs,
        }

    except Exception as e:
        logs.append(f"[System Error] {str(e)}")

        save_history(
            language=language,
            code=request.code,
            success=False,
            error=str(e)
        )

        return {
            "success": False,
            "language": language,
            "error": str(e),
            "logs": logs,
        }


@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()

    code = content.decode("utf-8")

    language = detect_language_from_filename(
        file.filename
    )

    return {
        "filename": file.filename,
        "language": language,
        "code": code,
    }