//// The library of saved drawings. A drawing is a name and the source of its draw
//// function.
import gleam/dynamic/decode 
import gleam/json
import gleam/result

// ── localStorage (data_ffi.mjs) ───────────────────────────────────────────────

/// The string stored in localStorage under key, or an Error if there isn't one.
@external(javascript, "./data_ffi.mjs", "storageGet")
pub fn storage_get(key: String) -> Result(String, Nil)

/// Store value in localStorage under key, replacing anything already there. If that
/// isn't possible, this logs the reason to the browser console.
@external(javascript, "./data_ffi.mjs", "storageSet")
pub fn storage_set(key: String, value: String) -> Nil

// ── The new-drawing prompt (data_ffi.mjs) ─────────────────────────────────────

/// Prompt the user to name a new drawing; "" (empty string) means they
/// cancelled or left it blank.
@external(javascript, "./data_ffi.mjs", "promptDrawingName")
pub fn prompt_drawing_name() -> String

const storage_key = "animator"

pub fn save(library: List(#(String, String)), current: String) -> Nil {
    let drawings = json.array(library, fn(d) {
        json.object([#("name", json.string(d.0)), #("source", json.string(d.1))])
    })
    json.object([#("current", json.string(current)), #("drawing", drawings)])
    |> json.to_string
    |> storage_set(storage_key, _)
}

pub fn load() -> Result(#(List(#(String, String)), String), Nil) {
    use text <- result.try(storage_get(storage_key))
    let drawing = {
        use name <- decode.field("name", decode.string)
        use source <- decode.field("source", decode.string)
        decode.success(#(name, source))
    }
    let saved = {
        use current <- decode.field("current", decode.string)
        use drawings <- decode.field("drawing", decode.list(drawing))
        decode.success(#(drawings, current))
    }
    json.parse(text, saved) |> result.replace_error(Nil)
}