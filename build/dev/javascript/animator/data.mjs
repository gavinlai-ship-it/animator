//# sourceMappingURL=data.mjs.map
import * as $json from "../gleam_json/gleam/json.mjs";
import * as $decode from "../gleam_stdlib/gleam/dynamic/decode.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import {
  storageGet as storage_get,
  storageSet as storage_set,
  promptDrawingName as prompt_drawing_name,
} from "./data_ffi.mjs";
import { List$Empty$const as $List$Empty$const, prepend as listPrepend } from "./gleam.mjs";

export { prompt_drawing_name, storage_get, storage_set };

const storage_key = "animator";

export function save(library, current) {
  let drawings = $json.array(
    library,
    (d) => {
      return $json.object(
        listPrepend(
          ["name", $json.string(d[0])],
          listPrepend(["source", $json.string(d[1])], $List$Empty$const),
        ),
      );
    },
  );
  let _pipe = $json.object(
    listPrepend(
      ["current", $json.string(current)],
      listPrepend(["drawing", drawings], $List$Empty$const),
    ),
  );
  let _pipe$1 = $json.to_string(_pipe);
  return ((_capture) => { return storage_set(storage_key, _capture); })(_pipe$1);
}

export function load() {
  return $result.try$(
    storage_get(storage_key),
    (text) => {
      let drawing = $decode.field(
        "name",
        $decode.string,
        (name) => {
          return $decode.field(
            "source",
            $decode.string,
            (source) => { return $decode.success([name, source]); },
          );
        },
      );
      let saved = $decode.field(
        "current",
        $decode.string,
        (current) => {
          return $decode.field(
            "drawings",
            $decode.list(drawing),
            (drawings) => { return $decode.success([drawings, current]); },
          );
        },
      );
      let _pipe = $json.parse(text, saved);
      return $result.replace_error(_pipe, undefined);
    },
  );
}
