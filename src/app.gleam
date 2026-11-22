//// Animator -- an application for program-generated drawings.

import builtins
import data 
import drawing
import editor
import errors
import examples
import gleam/float
import gleam/int
import gleam/list
import gleam/result
import lustre
import lustre/attribute as attr
import lustre/effect.{type Effect}
import lustre/element.{type Element}
import lustre/element/html
import lustre/element/keyed
import lustre/event
import parser
import render
import shape.{type Path}

/// Your app's public address, once you've deployed it in Problem 13, such as
/// "https://your-username.github.io/animator/".
pub const public_url = ""

/// Set to True if you would like your app's URL included in the course gallery.
pub const include_app_in_gallery = False

/// A link to your video from Problem 14, which anyone with the link can watch.
pub const video_url = ""

/// Set to True if you would like your video included in the course gallery.
pub const include_video_in_gallery = False

const default_code = "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(Point(0, 0), Point(100, 100)), 0, 10, 2)]\n}\n"

// ── Model ──────────────────────────────────────────────────────────────────────

pub type Model {
  Model(
    library: List(#(String, String)),
    current: String, 
    code_open: Bool,
    output: String,
    menu_key: Int,
    shape_slider: Int, 
    speed: Float,
  )
}

pub type Msg {
  SetCode(String)
  SelectDrawing(String)
  NamedDrawing(String)
  SetShape(Int)
  SetSpeed(Float)
  // Layout controls
  ToggleCode
}

// ── Init ───────────────────────────────────────────────────────────────────────

pub fn init(_flags: Nil) -> #(Model, Effect(Msg)) {
  let #(library, current) = initial_library()
  let model = Model(
    library: library,
    current: current,
    code_open: True,
    output: "",
    menu_key: 0,
    shape_slider: 0,
    speed: 1.0,
  )
  #(model, open_effects(source_of(library, current)))
}

fn initial_library() -> #(List(#(String, String)), String){
  let assert [#(first_example, _), ..] = examples.all
  case data.load() {
    Ok(#([#(first, _), ..] as library, saved)) ->
      case list.key_find(library, saved){
        Ok(_) -> #(library, first)
        Error(Nil) -> #(library, first)
      } 
      _ -> #(examples.all, first_example)
  }
}

fn source_of(library: List(#(String, String)), name: String) -> String {
  result.unwrap(list.key_find(library, name), "")
}

fn set_source(
  library: List(#(String, String)),
  name: String, 
  text: String,
) -> List(#(String, String)) {
  list.map(library, fn(d) {
    case d.0 == name {
      True -> #(name, text)
      False -> d
    }
  })
}

fn open_effects(source: String) -> Effect(Msg) {
  effect.batch([editor.mount(source, SetCode), 
  effect.from(fn(dispatch) { dispatch(SetCode(source)) }),
  ])
}
fn draw(paths: List(Path)) -> Effect(Msg) {
  effect.from(fn(_dispatch) {
    paths |> list.map(render.render_path(_, "black")) |> render.set_drawing
  })
}


// Parse and evaluate a draw function at the given shape-slider value, returning
// the rendered paths on success, or a human-readable message on failure.
fn run_source(shape_slider: Int, source: String) -> Result(List(Path), String) {
  case parser.parse_program(source, builtins.global_frame()) {
    Error(msg) -> Error(msg)
    Ok(program) ->
      drawing.try_draw(shape_slider, program)
      // Convert Error(EvalError) to Error(String) with a useful error message.
      |> result.map_error(errors.error_message)
  }
}

// ── Update ─────────────────────────────────────────────────────────────────────

pub fn update(model: Model, msg: Msg) -> #(Model, Effect(Msg)) {
  case msg {
    ToggleCode -> #(Model(..model, code_open: !model.code_open), effect.none())

    // After each keystroke in the editor, evaluate user code and report errors.
    SetCode(text) -> {
      let library = set_source(model.library, model.current, text)
      let save = effect.from(fn(_dispatch) {data.save(library, model.current)})
      case run_source(10, text) {
        // Parsed and evaluated: show the result.
        Ok(paths) -> #(
          Model(..model, library: library, output: ""),
          effect.batch([save, draw(paths)]),
        )
        // Broken (parse or evaluation): show the error.
        Error(msg) -> #(
          Model(..model, library: library, output: msg),
          effect.none(),
        )
      }
  }

  SetShape(n) -> {
    let model = Model(..model, shape_slider: n)
    case run_source(n, source_of(model.library, model.current)) {
      Ok(paths) -> #(Model(..model, output: ""), draw(paths))
      Error(msg) -> #(Model(..model, output: msg), draw([]))
    }
  }
  SetSpeed(rate) -> #(
    Model(..model, speed: rate),
    effect.from(fn(_dispatch) { render.set_speed(rate) }),
  )
  SelectDrawing("") -> #(
    model, 
    effect.from(fn(dispatch) {
      dispatch(NamedDrawing(data.prompt_drawing_name()))
    }),
  )
  SelectDrawing(name) -> switch_to(model, name, model.library)
  NamedDrawing("") -> #(
    Model(..model, menu_key: model.menu_key + 1), effect.none(),
  )
  NamedDrawing(name) ->
    case list.key_find(model.library, name) {
      Ok(_) -> switch_to(model, name, model.library)
      Error(Nil) ->
        switch_to(model, name, list.append(model.library, [#(name, default_code)]),
        )
    }  
  }
}

fn switch_to(
  model: Model, 
  name: String,
  library: List(#(String, String)),
) -> #(Model, Effect(Msg)) {
  #(Model(..model,
   library: library, 
   current: name, 
   menu_key: model.menu_key + 1
   ), open_effects(source_of(library, name)),
  )
}

// ── View ──────────────────────────────────────────────────────────────────
//
// Two side-by-side panes: the code editor on the left and its rendered output on
// the right. The code column can be hidden to expand the right pane.


pub fn view(model: Model) -> Element(Msg) {
  let app_class = case model.code_open {
    True -> "app"
    False -> "app code-hidden"
  }
  // The code column still exists even when hidden (CSS collapses it) so the
  // mounted CodeMirror editor keeps its state across show/hide.
  html.div([attr.class(app_class)], [
    html.div([attr.class("code-col")], [
      view_menu(model),
      editor.view_panel(ToggleCode),
    ]),
    view_anim(model),
  ])
}

fn view_anim(model: Model) -> Element(Msg) {
  html.div([attr.class("canvas-area")], [
    view_reveal_code(model),
    html.canvas([attr.id("animation-canvas"), attr.class("canvas")]),
    html.input([
      attr.type_("range"),
      attr.min("0"),
      attr.max("100"),
      attr.value(int.to_string(model.shape_slider)),
      attr.attribute("data-test-id", "shape-slider"),
      event.on_input(fn(s) { SetShape(result.unwrap(int.parse(s), 10)) }),
    ]),
    html.input([
      attr.type_("range"),
      attr.min("0"),
      attr.max("20"),
      attr.value(float.to_string(model.speed *. 10.0)),
      attr.attribute("data-test-id", "speed-slider"),
      event.on_input(fn(s) {
        SetSpeed(int.to_float(result.unwrap(int.parse(s), 10)) /. 10.0)
      }),
    ]),
    html.pre([attr.class("output")], [html.text(model.output)]),
  ])
}

fn view_menu(model: Model) -> Element(Msg) {
  let options = 
    list.append(
        list.map(model.library, fn(d){
          html.option(
            [attr.value(d.0), attr.selected(d.0 == model.current)] , 
            d.0,
          )
        }),
        [html.option([attr.value("")], "+ New drawing")],
      )
  keyed.div([], [
    #(int.to_string(model.menu_key), html.select([
      attr.attribute("data-test-id", "drawing-select"),
      event.on_change(SelectDrawing)
    ],
    options,
    ))
  ])
}

// The button that brings the code column back, overlaid on the top-left of the
// right pane. Nothing is rendered while the column is already showing (its own
// header holds the button that hides it).
fn view_reveal_code(model: Model) -> Element(Msg) {
  case model.code_open {
    True -> element.none()
    False ->
      html.button(
        [
          attr.class("icon-btn reveal-code"),
          attr.attribute("title", "Show code"),
          event.on_click(ToggleCode),
        ],
        [html.text("⟩")],
      )
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

pub fn main() -> Nil {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", Nil)
  Nil
}
