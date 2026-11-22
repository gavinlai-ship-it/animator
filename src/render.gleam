//// Convert each shape into a list of points called a RenderPath.
import gleam/int
import gleam/list
import gleam/string
import shape.{type Path, type Point, Circle, ColorLine, Line, Point}

/// One path as canvas.mjs setDrawing consumes it (field by field): the
/// polyline, stroke colour/width, and the start and end times (in tenths of a second)
/// between which the reveal runs — so the renderer's clock needs no shape
/// knowledge.
pub type RenderPath {
  RenderPath(
    points: List(Point),
    thickness: Float,
    color: String,
    start: Float,
    end: Float,
  )
}

// ── The canvas (canvas.mjs) ───────────────────────────────────────────────────

/// Replace the drawing being animated in the page's
/// `<canvas id="animation-canvas">` element. If that element doesn't appear within
/// about 10 seconds, this logs an error to the browser console. This keeps the
/// current time, so a drawing that replaces a finished one appears complete. To
/// animate it from the start, also call reset_clock.
@external(javascript, "./canvas.mjs", "setDrawing")
pub fn set_drawing(paths: List(RenderPath)) -> Nil

/// Set the animation's speed, as a multiple of its normal speed: 1.0 is normal and
/// is where it starts, 0.0 pauses, and a negative rate plays it backward.
/// Time stops at the start of the drawing and when its last path finishes, so
/// playing a finished drawing again takes a call to reset_clock.
@external(javascript, "./canvas.mjs", "setSpeed")
pub fn set_speed(rate: Float) -> Nil

/// Jump the animation back to its start, where the canvas is empty.
@external(javascript, "./canvas.mjs", "resetClock")
pub fn reset_clock() -> Nil

pub fn render_path(path: Path, color: String) -> RenderPath {
  case path.shape {
    Line(a, b) ->
      RenderPath([a, b], path.thickness, color, path.start, path.end)
    ColorLine(a, b, c) -> 
      RenderPath([a, b], path.thickness, hex_color(c), path.start, path.end)
    Circle(center, radius, c) ->
      RenderPath(
        circle_points(center, radius),
        path.thickness, 
        hex_color(c),
        path.start,
        path.end,
      )
  }
}

fn hex_color(n: Int) -> String {
  "#" <> string.pad_start(int.to_base16(int.bitwise_and(n, 0xFFFFFF)), 6, "0")
}

const cos_step = 0.9914448613738104
const sin_step = 0.1305261922200516

fn circle_points(center: Point, radius: Float) -> List(Point) {
  circle_loop(center, radius, 0.0, 48, [])
}

fn circle_loop(
  center: Point,
  x: Float,
  y: Float,
  left: Int,
  acc: List(Point),
) -> List(Point) {
  let p = Point(center.x +. x, center.y +. y)
  case left == 0 {
    True -> list.reverse([p, ..acc])
    False ->
      circle_loop(
        center,
        x *. cos_step -. y *. sin_step,
        x *. sin_step -. y *. cos_step,
        left - 1,
        [p, ..acc]
      )
  }
}