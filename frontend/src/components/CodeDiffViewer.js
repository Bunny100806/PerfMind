export default function CodeDiffViewer({ originalCode, optimizedCode }) {
  if (!optimizedCode) {
    return (
      <div className="code-diff-viewer">
        <div className="section-title">
          <h3>Code Diff Viewer</h3>
        </div>

        <div className="diff-empty">
          Run analysis to view code changes.
        </div>
      </div>
    );
  }

  const originalLines = originalCode.split("\n");
  const optimizedLines = optimizedCode.split("\n");

  return (
    <div className="code-diff-viewer">
      <div className="section-title">
        <h3>Code Diff Viewer</h3>
      </div>

      <div className="diff-grid">
        <div>
          <h4>Original Code</h4>

          <pre>
            {originalLines.map((line, index) => (
              <div className="diff-line removed" key={`old-${index}`}>
                <span>-</span>
                {line || " "}
              </div>
            ))}
          </pre>
        </div>

        <div>
          <h4>Optimized Code</h4>

          <pre>
            {optimizedLines.map((line, index) => (
              <div className="diff-line added" key={`new-${index}`}>
                <span>+</span>
                {line || " "}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}