import TWEEN from 'tween.js';

const defaultOpts = {
	fill: false,
	loop: false,
	color: '#000',
	sampleSteps: 200,
	duration: 500
};

/*
 Sample the path with given id in the given number of steps
 (Forces the path arrays into the same number of co-ordinates)
*/
function samplePath(id, sampleSteps) {
	const path = document.getElementById(id);
	const length = path.getTotalLength();
	const points = [];
	for(let i = 0; i < sampleSteps; i++) {
		points.push(path.getPointAtLength(length * i / sampleSteps));
	}
	return points;
}

/*
 Draw the path with the given points on the supplied canvas context.
 If fill = true then attempts to close the path and fill it. If the start
 and end points don't connect setting fill to true in the options could
 result in some strange shapes. Fill/stroke with supplied color.
*/
function drawPathToCanvas(ctx, points, fill, color) {

	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	const end = points[points.length - 1];

	// Draw points
	ctx.beginPath();
	ctx.moveTo(end.x, end.y);
	points.map(p => ctx.lineTo(p.x, p.y));
	ctx.closePath();
	if(fill) {
		ctx.fill();
	} else {
		ctx.stroke();
	}

}

/*
 Clear the supplied canvas
*/
function clearCanvas(canvas) {
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export default class PathMorph {

	constructor(opts) {

		if(!opts.canvasId && !opts.fromPathId && !opts.toPathId) {
			console.error(`PathMorph classes must be instantiated with at least:
				canvasId, fromPathId and toPathId in the supplied options`);
		}

		this.opts = Object.assign({}, defaultOpts, opts);

		// Set main information
		this.canvas = document.getElementById(this.opts.canvasId);
		this.ctx = this.canvas.getContext('2d');
		this.interpolationPoint = { percentage: 0 };

		// Sample the from and to paths
		this.pathPointsFrom = samplePath(this.opts.fromPathId, this.opts.sampleSteps);
		this.pathPointsTo = samplePath(this.opts.toPathId, this.opts.sampleSteps);

		// Draw initial path
		drawPathToCanvas(this.ctx, this.pathPointsFrom, this.opts.fill, this.opts.color);

		if(opts.loop) {
			this.startLoop();
		}
	}

	/*
	 Get the array of points for the current percentage transition point betweeen the paths
	*/
	interpolatePaths() {
		const points = [];
		const from = this.pathPointsFrom;
		const to = this.pathPointsTo;

		for(let i = 0; i < this.opts.sampleSteps; i++) {
			points.push({
				x: from[i].x + (to[i].x - from[i].x) * this.interpolationPoint.percentage,
				y: from[i].y + (to[i].y - from[i].y) * this.interpolationPoint.percentage
			});
		}
		return points;
	}

	/*
	 Tween the percentage interpolation value over the supplied duration. Move from 0 -> 1
	 if reverse is false, otherwise return from 1 to 0
	*/
	stepInterpolationPercentage(reverse = false) {
		new TWEEN.Tween(this.interpolationPoint)
			.to({ percentage: reverse ? 0 : 1 }, this.opts.duration)
			.easing(TWEEN.Easing.Cubic.InOut)
			.start();
	}

	/*
	 Draw the current interpolated points path and update the Tweening function
	 (keeps things in sync)
	*/
	animate(time) {

		// If looping and have reached 0 or 100 percent of the interpolation,
		// we go back in the other direction
		if(this.looping) {
			if(this.interpolationPoint.percentage === 0) {
				this.stepInterpolationPercentage();
			} else if(this.interpolationPoint.percentage === 1) {
				this.stepInterpolationPercentage(/* reverse */ true)
			}
		}

		if(this.looping || performance.now() <= this.endTime) {
			clearCanvas(this.canvas);
			drawPathToCanvas(this.ctx, this.interpolatePaths(), this.opts.fill, this.opts.color);
			window.requestAnimationFrame(this.animate.bind(this));
			TWEEN.update(time);
		}
	}

	/*
	 Animate from the 'from' path to the 'to' path
	*/
	forwards() {
		this.stepInterpolationPercentage();
		this.endTime = performance.now() + this.opts.duration;
		this.animate();
	}

	startLoop() {
		this.looping = true;
		this.animate();
	}

	/*
	 Animate from the 'to' path to the 'from' path
	*/
	backwards() {
		this.stepInterpolationPercentage(/* reverse */ true);
		this.endTime = performance.now() + this.opts.duration;
		this.animate();
	}

	stopLoop() {
		this.looping = false;

		// Jump to closest path
		clearCanvas(this.canvas);
		if(this.interpolationPoint.percentage < 0.5) {
			drawPathToCanvas(this.ctx, this.pathPointsFrom, this.opts.fill, this.opts.color);
		} else {
			drawPathToCanvas(this.ctx, this.pathPointsTo, this.opts.fill, this.opts.color);
		}
	}

}
