## pathmorph

Animate from one SVG path to another. Credit to [this CodePen](http://codepen.io/rachsmith/details/ONVQWv/) for initial ideas.

If you're using React and looking for an easy way to use this, try the [react-pathmorph component](https://github.com/jfbarnes/react-pathmorph).

### Usage

Define your paths in a hidden svg element. There should be a 'from' and a 'to' path that pathmorph will animate between. The animation will be rendered in a canvas element that you also define:

```HTML
<svg viewBox="0 0 width height" style={display: 'none'}>
  <path id="from-path" ... />
  <path id="to-path" ... />
</svg>
<canvas id="my-canvas" width="width" height="height" /> 
```

The three IDs in the above example are the minimum required to use PathMorph:

```js
import Pathmorph from 'pathmorph'

const pm = new Pathmorph({
    canvasId: 'my-canvas',
    fromPathId: 'from-path',
    toPathId: 'to-path'
});
```

The pathmorph object exposes two methods for animating:

```js
// Animate paths from -> to
pm.forwards();

// Animate paths to -> from
pm.backwards();
```

### Options

The pathmorph constructor accepts an options object containing the following:

* **canvasId** *(required)*: String, ID of the canvas to render the animation into
* **fromPathId** *(required)*: String, ID of the svg path that animation will begin at
* **toPathId** *(required)*: String, ID of the svg path that animation will morph to
* **fill**: Boolean, default false. Fills the path's shape if true. Uses a stroke if false
* **color**: String, default '#000'. Color of stroke/fill
* **sampleSteps**: Number, default 200. Number of sample points to take along each path. (Controls "resolution" of animation)
* **duration**: Number, default 500. Milliseconds to complete each animation

### Todo
* Implement looping functionality (+ expose start / stop functions)
* Add support for more than just two paths
* Only fill paths if they start and end at the same point
