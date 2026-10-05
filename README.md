# forge

One pipeline, several languages. Node is the gateway. React is the page. The other languages are stages.

- C: FNV checksum and byte count
- C++: token count
- Java: email tokens vs other tokens
- Lua: reverse the word order
- Luau: reject the input if it contains "game"
- C#: title-case
- Python: wrap the stage results in one JSON report
- TypeScript: `ts/report.ts`, the report shape the page is built against

Lua, Luau, and C# need `lua`, `luau`, and `dotnet` on the machine. If one is missing, that stage fails and the rest still run. C, C++, and Java are compiled by the gateway when you hit Run.

## Run

```bat
cd forge
npm install
node gateway/server.js
```

Open http://127.0.0.1:8090
