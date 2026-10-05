function App() {
  const [text, setText] = React.useState("north a@northline.example harbor");
  const [report, setReport] = React.useState(null);
  const [error, setError] = React.useState("");

  async function run(event) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const body = await response.json();
    if (!response.ok) setError(body.error || "failed");
    else setReport(body);
  }

  const output = report
    ? (report.stages || []).map((stage) => `${stage.name}\t${stage.ok ? "ok" : "fail"}\t${stage.out}`).join("\n")
    : "";

  return (
    <div className="wrap">
      <header>
        <h1>forge</h1>
        <p>One input. Each language runs a stage. The output box is the combined result.</p>
      </header>
      <div className="grid">
        <form className="panel" onSubmit={run}>
          <label>Input</label>
          <textarea value={text} onChange={(event) => setText(event.target.value)} />
          <button type="submit">Run pipeline</button>
          {error && <p className="bad">{error}</p>}
        </form>
        <section className="panel">
          <label>Output</label>
          <pre>{output || "Run the pipeline. Each line is a language, then ok or fail, then its result."}</pre>
          {report && (
            <table>
              <tbody>
                {(report.stages || []).map((stage) => (
                  <tr key={stage.name}>
                    <td>{stage.name}</td>
                    <td className={stage.ok ? "ok" : "bad"}>{stage.ok ? "ok" : "fail"}</td>
                    <td>{stage.out}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
