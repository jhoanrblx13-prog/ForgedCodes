local function fold(text)
    local out = {}
    for word in string.gmatch(text, "%S+") do
        table.insert(out, 1, word)
    end
    return table.concat(out, " ")
end

local text = io.read("*a") or ""
io.write(fold(text))
