--!strict
local function allowed(text: string): boolean
    local lower = string.lower(text)
    if string.find(lower, "game", 1, true) ~= nil then
        return false
    end
    return #text > 0
end

local text = io.read("*a") or ""
if allowed(text) then
    io.write("allow")
else
    io.write("reject")
end
