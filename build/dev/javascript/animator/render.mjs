//# sourceMappingURL=render.mjs.map
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import {
  setDrawing as set_drawing,
  setSpeed as set_speed,
  resetClock as reset_clock,
} from "./canvas.mjs";
import {
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
} from "./gleam.mjs";
import * as $shape from "./shape.mjs";
import { Circle, ColorLine, Line, Point } from "./shape.mjs";

export { reset_clock, set_drawing, set_speed };

export class RenderPath extends $CustomType {
  constructor(points, thickness, color, start, end) {
    super();
    this.points = points;
    this.thickness = thickness;
    this.color = color;
    this.start = start;
    this.end = end;
  }
}
export const RenderPath$RenderPath = (points, thickness, color, start, end) =>
  new RenderPath(points, thickness, color, start, end);
export const RenderPath$isRenderPath = (value) => value instanceof RenderPath;
export const RenderPath$RenderPath$points = (value) => value.points;
export const RenderPath$RenderPath$0 = (value) => value.points;
export const RenderPath$RenderPath$thickness = (value) => value.thickness;
export const RenderPath$RenderPath$1 = (value) => value.thickness;
export const RenderPath$RenderPath$color = (value) => value.color;
export const RenderPath$RenderPath$2 = (value) => value.color;
export const RenderPath$RenderPath$start = (value) => value.start;
export const RenderPath$RenderPath$3 = (value) => value.start;
export const RenderPath$RenderPath$end = (value) => value.end;
export const RenderPath$RenderPath$4 = (value) => value.end;

const cos_step = 0.9914448613738104;

const sin_step = 0.1305261922200516;

function hex_color(n) {
  return "#" + $string.pad_start(
    $int.to_base16($int.bitwise_and(n, 0xFFFFFF)),
    6,
    "0",
  );
}

function circle_loop(loop$center, loop$x, loop$y, loop$left, loop$acc) {
  while (true) {
    let center = loop$center;
    let x = loop$x;
    let y = loop$y;
    let left = loop$left;
    let acc = loop$acc;
    let p = new Point(center.x + x, center.y + y);
    let $ = left === 0;
    if ($) {
      return $list.reverse(listPrepend(p, acc));
    } else {
      loop$center = center;
      loop$x = (x * cos_step) - (y * sin_step);
      loop$y = (x * sin_step) - (y * cos_step);
      loop$left = left - 1;
      loop$acc = listPrepend(p, acc);
    }
  }
}

function circle_points(center, radius) {
  return circle_loop(center, radius, 0.0, 48, $List$Empty$const);
}

export function render_path(path, color) {
  let $ = path.shape;
  if ($ instanceof Line) {
    let a = $.start;
    let b = $.end;
    return new RenderPath(
      listPrepend(a, listPrepend(b, $List$Empty$const)),
      path.thickness,
      color,
      path.start,
      path.end,
    );
  } else if ($ instanceof ColorLine) {
    let a = $.start;
    let b = $.end;
    let c = $.color;
    return new RenderPath(
      listPrepend(a, listPrepend(b, $List$Empty$const)),
      path.thickness,
      hex_color(c),
      path.start,
      path.end,
    );
  } else {
    let center = $.center;
    let radius = $.radius;
    let c = $.color;
    return new RenderPath(
      circle_points(center, radius),
      path.thickness,
      hex_color(c),
      path.start,
      path.end,
    );
  }
}
