//# sourceMappingURL=app.mjs.map
import * as $float from "../gleam_stdlib/gleam/float.mjs";
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import * as $lustre from "../lustre/lustre.mjs";
import * as $attr from "../lustre/lustre/attribute.mjs";
import * as $effect from "../lustre/lustre/effect.mjs";
import * as $element from "../lustre/lustre/element.mjs";
import * as $html from "../lustre/lustre/element/html.mjs";
import * as $keyed from "../lustre/lustre/element/keyed.mjs";
import * as $event from "../lustre/lustre/event.mjs";
import * as $builtins from "./builtins.mjs";
import * as $data from "./data.mjs";
import * as $drawing from "./drawing.mjs";
import * as $editor from "./editor.mjs";
import * as $errors from "./errors.mjs";
import * as $examples from "./examples.mjs";
import {
  Ok,
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
  makeError,
} from "./gleam.mjs";
import * as $parser from "./parser.mjs";
import * as $render from "./render.mjs";
import * as $shape from "./shape.mjs";

const FILEPATH = "src/app.gleam";

export class Model extends $CustomType {
  constructor(library, current, code_open, output, menu_key, shape_slider, speed) {
    super();
    this.library = library;
    this.current = current;
    this.code_open = code_open;
    this.output = output;
    this.menu_key = menu_key;
    this.shape_slider = shape_slider;
    this.speed = speed;
  }
}
export const Model$Model = (library, current, code_open, output, menu_key, shape_slider, speed) =>
  new Model(library, current, code_open, output, menu_key, shape_slider, speed);
export const Model$isModel = (value) => value instanceof Model;
export const Model$Model$library = (value) => value.library;
export const Model$Model$0 = (value) => value.library;
export const Model$Model$current = (value) => value.current;
export const Model$Model$1 = (value) => value.current;
export const Model$Model$code_open = (value) => value.code_open;
export const Model$Model$2 = (value) => value.code_open;
export const Model$Model$output = (value) => value.output;
export const Model$Model$3 = (value) => value.output;
export const Model$Model$menu_key = (value) => value.menu_key;
export const Model$Model$4 = (value) => value.menu_key;
export const Model$Model$shape_slider = (value) => value.shape_slider;
export const Model$Model$5 = (value) => value.shape_slider;
export const Model$Model$speed = (value) => value.speed;
export const Model$Model$6 = (value) => value.speed;

export class SetCode extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetCode = ($0) => new SetCode($0);
export const Msg$isSetCode = (value) => value instanceof SetCode;
export const Msg$SetCode$0 = (value) => value[0];

export class SelectDrawing extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SelectDrawing = ($0) => new SelectDrawing($0);
export const Msg$isSelectDrawing = (value) => value instanceof SelectDrawing;
export const Msg$SelectDrawing$0 = (value) => value[0];

export class NamedDrawing extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$NamedDrawing = ($0) => new NamedDrawing($0);
export const Msg$isNamedDrawing = (value) => value instanceof NamedDrawing;
export const Msg$NamedDrawing$0 = (value) => value[0];

export class SetShape extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetShape = ($0) => new SetShape($0);
export const Msg$isSetShape = (value) => value instanceof SetShape;
export const Msg$SetShape$0 = (value) => value[0];

export class SetSpeed extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetSpeed = ($0) => new SetSpeed($0);
export const Msg$isSetSpeed = (value) => value instanceof SetSpeed;
export const Msg$SetSpeed$0 = (value) => value[0];

export class ToggleCode extends $CustomType {}
export const Msg$ToggleCode$const = new ToggleCode();
export const Msg$ToggleCode = () => Msg$ToggleCode$const;
export const Msg$isToggleCode = (value) => value instanceof ToggleCode;

const default_code = "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(Point(0, 0), Point(100, 100)), 0, 10, 2)]\n}\n";

/**
 * Your app's public address, once you've deployed it in Problem 13, such as
 * "https://your-username.github.io/animator/".
 */
export const public_url = "";

/**
 * Set to True if you would like your app's URL included in the course gallery.
 */
export const include_app_in_gallery = false;

/**
 * A link to your video from Problem 14, which anyone with the link can watch.
 */
export const video_url = "";

/**
 * Set to True if you would like your video included in the course gallery.
 */
export const include_video_in_gallery = false;

function source_of(library, name) {
  return $result.unwrap($list.key_find(library, name), "");
}

function open_effects(source) {
  return $effect.batch(
    listPrepend(
      $editor.mount(source, (var0) => { return new SetCode(var0); }),
      listPrepend(
        $effect.from((dispatch) => { return dispatch(new SetCode(source)); }),
        $List$Empty$const,
      ),
    ),
  );
}

function initial_library() {
  let $ = $examples.all;
  let first_example;
  if ($ instanceof $Empty) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "app",
      80,
      "initial_library",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 2287,
        end: 2338,
        pattern_start: 2298,
        pattern_end: 2323
      }
    )
  } else {
    first_example = $.head[0];
  }
  let $1 = $data.load();
  if ($1 instanceof Ok) {
    let $2 = $1[0][0];
    if ($2 instanceof $Empty) {
      return [$examples.all, first_example];
    } else {
      let library = $2;
      let saved = $1[0][1];
      let first = $2.head[0];
      let $3 = $list.key_find(library, saved);
      if ($3 instanceof Ok) {
        return [library, first];
      } else {
        return [library, first];
      }
    }
  } else {
    return [$examples.all, first_example];
  }
}

export function init(_) {
  let $ = initial_library();
  let library = $[0];
  let current = $[1];
  let model = new Model(library, current, true, "", 0, 0, 1.0);
  return [model, open_effects(source_of(library, current))];
}

function set_source(library, name, text) {
  return $list.map(
    library,
    (d) => {
      let $ = d[0] === name;
      if ($) {
        return [name, text];
      } else {
        return d;
      }
    },
  );
}

function draw(paths) {
  return $effect.from(
    (_) => {
      let _pipe = paths;
      let _pipe$1 = $list.map(
        _pipe,
        (_capture) => { return $render.render_path(_capture, "black"); },
      );
      return $render.set_drawing(_pipe$1);
    },
  );
}

function run_source(shape_slider, source) {
  let $ = $parser.parse_program(source, $builtins.global_frame());
  if ($ instanceof Ok) {
    let program = $[0];
    let _pipe = $drawing.try_draw(shape_slider, program);
    return $result.map_error(_pipe, $errors.error_message);
  } else {
    return $;
  }
}

function switch_to(model, name, library) {
  return [
    new Model(
      library,
      name,
      model.code_open,
      model.output,
      model.menu_key + 1,
      model.shape_slider,
      model.speed,
    ),
    open_effects(source_of(library, name)),
  ];
}

export function update(model, msg) {
  if (msg instanceof SetCode) {
    let text = msg[0];
    let library = set_source(model.library, model.current, text);
    let save = $effect.from(
      (_) => { return $data.save(library, model.current); },
    );
    let $ = run_source(10, text);
    if ($ instanceof Ok) {
      let paths = $[0];
      return [
        new Model(
          library,
          model.current,
          model.code_open,
          "",
          model.menu_key,
          model.shape_slider,
          model.speed,
        ),
        $effect.batch(
          listPrepend(save, listPrepend(draw(paths), $List$Empty$const)),
        ),
      ];
    } else {
      let msg$1 = $[0];
      return [
        new Model(
          library,
          model.current,
          model.code_open,
          msg$1,
          model.menu_key,
          model.shape_slider,
          model.speed,
        ),
        $effect.none(),
      ];
    }
  } else if (msg instanceof SelectDrawing) {
    let $ = msg[0];
    if ($ === "") {
      return [
        model,
        $effect.from(
          (dispatch) => {
            return dispatch(new NamedDrawing($data.prompt_drawing_name()));
          },
        ),
      ];
    } else {
      let name = $;
      return switch_to(model, name, model.library);
    }
  } else if (msg instanceof NamedDrawing) {
    let $ = msg[0];
    if ($ === "") {
      return [
        new Model(
          model.library,
          model.current,
          model.code_open,
          model.output,
          model.menu_key + 1,
          model.shape_slider,
          model.speed,
        ),
        $effect.none(),
      ];
    } else {
      let name = $;
      let $1 = $list.key_find(model.library, name);
      if ($1 instanceof Ok) {
        return switch_to(model, name, model.library);
      } else {
        return switch_to(
          model,
          name,
          $list.append(
            model.library,
            listPrepend([name, default_code], $List$Empty$const),
          ),
        );
      }
    }
  } else if (msg instanceof SetShape) {
    let n = msg[0];
    let model$1 = new Model(
      model.library,
      model.current,
      model.code_open,
      model.output,
      model.menu_key,
      n,
      model.speed,
    );
    let $ = run_source(n, source_of(model$1.library, model$1.current));
    if ($ instanceof Ok) {
      let paths = $[0];
      return [
        new Model(
          model$1.library,
          model$1.current,
          model$1.code_open,
          "",
          model$1.menu_key,
          model$1.shape_slider,
          model$1.speed,
        ),
        draw(paths),
      ];
    } else {
      let msg$1 = $[0];
      return [
        new Model(
          model$1.library,
          model$1.current,
          model$1.code_open,
          msg$1,
          model$1.menu_key,
          model$1.shape_slider,
          model$1.speed,
        ),
        draw($List$Empty$const),
      ];
    }
  } else if (msg instanceof SetSpeed) {
    let rate = msg[0];
    return [
      new Model(
        model.library,
        model.current,
        model.code_open,
        model.output,
        model.menu_key,
        model.shape_slider,
        rate,
      ),
      $effect.from((_) => { return $render.set_speed(rate); }),
    ];
  } else {
    return [
      new Model(
        model.library,
        model.current,
        !model.code_open,
        model.output,
        model.menu_key,
        model.shape_slider,
        model.speed,
      ),
      $effect.none(),
    ];
  }
}

function view_reveal_code(model) {
  let $ = model.code_open;
  if ($) {
    return $element.none();
  } else {
    return $html.button(
      listPrepend(
        $attr.class$("icon-btn reveal-code"),
        listPrepend(
          $attr.attribute("title", "Show code"),
          listPrepend($event.on_click(Msg$ToggleCode$const), $List$Empty$const),
        ),
      ),
      listPrepend($html.text("⟩"), $List$Empty$const),
    );
  }
}

function view_anim(model) {
  return $html.div(
    listPrepend($attr.class$("canvas-area"), $List$Empty$const),
    listPrepend(
      view_reveal_code(model),
      listPrepend(
        $html.canvas(
          listPrepend(
            $attr.id("animation-canvas"),
            listPrepend($attr.class$("canvas"), $List$Empty$const),
          ),
        ),
        listPrepend(
          $html.input(
            listPrepend(
              $attr.type_("range"),
              listPrepend(
                $attr.min("0"),
                listPrepend(
                  $attr.max("100"),
                  listPrepend(
                    $attr.value($int.to_string(model.shape_slider)),
                    listPrepend(
                      $attr.attribute("data-test-id", "shape-slider"),
                      listPrepend(
                        $event.on_input(
                          (s) => {
                            return new SetShape(
                              $result.unwrap($int.parse(s), 10),
                            );
                          },
                        ),
                        $List$Empty$const,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          listPrepend(
            $html.input(
              listPrepend(
                $attr.type_("range"),
                listPrepend(
                  $attr.min("0"),
                  listPrepend(
                    $attr.max("20"),
                    listPrepend(
                      $attr.value($float.to_string(model.speed * 10.0)),
                      listPrepend(
                        $attr.attribute("data-test-id", "speed-slider"),
                        listPrepend(
                          $event.on_input(
                            (s) => {
                              return new SetSpeed(
                                $int.to_float($result.unwrap($int.parse(s), 10)) / 10.0,
                              );
                            },
                          ),
                          $List$Empty$const,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
            listPrepend(
              $html.pre(
                listPrepend($attr.class$("output"), $List$Empty$const),
                listPrepend($html.text(model.output), $List$Empty$const),
              ),
              $List$Empty$const,
            ),
          ),
        ),
      ),
    ),
  );
}

function view_menu(model) {
  let options = $list.append(
    $list.map(
      model.library,
      (d) => {
        return $html.option(
          listPrepend(
            $attr.value(d[0]),
            listPrepend(
              $attr.selected(d[0] === model.current),
              $List$Empty$const,
            ),
          ),
          d[0],
        );
      },
    ),
    listPrepend(
      $html.option(
        listPrepend($attr.value(""), $List$Empty$const),
        "+ New drawing",
      ),
      $List$Empty$const,
    ),
  );
  return $keyed.div(
    $List$Empty$const,
    listPrepend(
      [
        $int.to_string(model.menu_key),
        $html.select(
          listPrepend(
            $attr.attribute("data-test-id", "drawing-select"),
            listPrepend(
              $event.on_change((var0) => { return new SelectDrawing(var0); }),
              $List$Empty$const,
            ),
          ),
          options,
        ),
      ],
      $List$Empty$const,
    ),
  );
}

export function view(model) {
  let _block;
  let $ = model.code_open;
  if ($) {
    _block = "app";
  } else {
    _block = "app code-hidden";
  }
  let app_class = _block;
  return $html.div(
    listPrepend($attr.class$(app_class), $List$Empty$const),
    listPrepend(
      $html.div(
        listPrepend($attr.class$("code-col"), $List$Empty$const),
        listPrepend(
          view_menu(model),
          listPrepend(
            $editor.view_panel(Msg$ToggleCode$const),
            $List$Empty$const,
          ),
        ),
      ),
      listPrepend(view_anim(model), $List$Empty$const),
    ),
  );
}

export function main() {
  let app = $lustre.application(init, update, view);
  let $ = $lustre.start(app, "#app", undefined);
  if (!($ instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "app",
      291,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 9055,
        end: 9104,
        pattern_start: 9066,
        pattern_end: 9071
      }
    )
  }
  return undefined;
}
