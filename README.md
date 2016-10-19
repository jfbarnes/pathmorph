## pathmorph

Animate from one SVG path to another. Credit to [this CodePen](http://codepen.io/rachsmith/details/ONVQWv/) for initial ideas.

If you're using React and looking for an easy way to use this, try the [react-pathmorph component](https://github.com/jfbarnes/react-pathmorph).

### Usage

```cli
npm install --save pathmorph
```

Define your paths in a hidden svg element. There should be a 'from' and a 'to' path that pathmorph will animate between. The animation will be rendered in a canvas element that you also define:

```HTML
<svg viewBox="0 0 width height" style={display: 'none'}>
  <path id="from-path" ... />
  <path id="to-path" ... />
</svg>
<canvas id="my-canvas" width="width" height="height" />
```

The three IDs in the above example are the minimum required to use pathmorph:

```js
import Pathmorph from 'pathmorph'

const pm = new Pathmorph({
    canvasId: 'my-canvas',
    fromPathId: 'from-path',
    toPathId: 'to-path'
});
```

The pathmorph object exposes four methods for animating:

```js
// Animate paths from -> to
pm.forwards();

// Animate paths to -> from
pm.backwards();

// Start infinite looping between paths
pm.start();

// Stop looping between paths
pm.stop();
```

### Options

The pathmorph constructor accepts an options object containing the following:

* **canvasId** *(string, required)*: ID of the canvas to render the animation into

* **fromPathId** *(string, required)*: ID of the svg path that animation will begin at

* **toPathId** *(string, required)*: ID of the svg path that animation will morph to

* **fill** *(boolean, default false)*: Fills the path's shape if true. Uses a stroke if false

* **color** *(string, default '#000')*: Color of stroke/fill

* **sampleSteps** *(number, default 200)*: Number of sample points to take along each path. (Controls "resolution" of animation)

* **duration** *(number, default 500)*: Milliseconds to complete each animation

* **loop** *(boolean, default false)*: If true, looping starts immediately
