import sqlite3
from datetime import datetime


DB_NAME = "perfmind_history.db"


def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            language TEXT,
            code TEXT,
            analysis TEXT,
            optimized_code TEXT,
            original_time REAL,
            optimized_time REAL,
            original_memory INTEGER,
            optimized_memory INTEGER,
            success INTEGER,
            error TEXT,
            created_at TEXT
        )
    """)

    conn.commit()
    conn.close()


def save_history(
    language,
    code,
    analysis="",
    optimized_code="",
    original_time=0,
    optimized_time=0,
    original_memory=0,
    optimized_memory=0,
    success=0,
    error=""
):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO history (
            language,
            code,
            analysis,
            optimized_code,
            original_time,
            optimized_time,
            original_memory,
            optimized_memory,
            success,
            error,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        language,
        code,
        analysis,
        optimized_code,
        original_time,
        optimized_time,
        original_memory,
        optimized_memory,
        1 if success else 0,
        error,
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))

    conn.commit()
    conn.close()


def get_history():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            language,
            original_time,
            optimized_time,
            original_memory,
            optimized_memory,
            success,
            error,
            created_at
        FROM history
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    history = []

    for row in rows:
        history.append({
            "id": row[0],
            "language": row[1],
            "original_time": row[2],
            "optimized_time": row[3],
            "original_memory": row[4],
            "optimized_memory": row[5],
            "success": bool(row[6]),
            "error": row[7],
            "created_at": row[8],
        })

    return history