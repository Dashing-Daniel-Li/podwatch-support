// The hero's moving parts: a slow GPU-utilization trace behind it, and the popover's gauges
// drifting a little, as a live pod's would. Both stay still for reduced motion.
(function () {
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var canvas = document.querySelector(".hero-trace");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var t = 0;
    var size = function () {
      var dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    var sample = function (i) {
      return 0.55 + 0.22 * Math.sin(i * 0.09) + 0.12 * Math.sin(i * 0.31 + 1.3) + 0.06 * Math.sin(i * 1.7);
    };
    var draw = function () {
      var w = canvas.clientWidth, h = canvas.clientHeight, step = 6, n = Math.ceil(w / step) + 2;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(187,182,253,0.07)";
      ctx.lineWidth = 1;
      for (var y = 0.25; y < 1; y += 0.25) { ctx.beginPath(); ctx.moveTo(0, h * y); ctx.lineTo(w, h * y); ctx.stroke(); }
      var path = new Path2D();
      for (var i = 0; i < n; i++) {
        var x = i * step, py = h - sample(i + t) * h * 0.85;
        if (i) path.lineTo(x, py); else path.moveTo(x, py);
      }
      var fill = new Path2D(path);
      fill.lineTo(w, h); fill.lineTo(0, h); fill.closePath();
      var g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "rgba(93,41,240,0.28)"); g.addColorStop(1, "rgba(93,41,240,0)");
      ctx.fillStyle = g; ctx.fill(fill);
      var lg = ctx.createLinearGradient(0, 0, w, 0);
      lg.addColorStop(0, "#5d29f0"); lg.addColorStop(0.55, "#9289fe"); lg.addColorStop(1, "#bbb6fd");
      ctx.strokeStyle = lg; ctx.lineWidth = 2; ctx.stroke(path);
    };
    var frame = function () { t += 0.04; draw(); requestAnimationFrame(frame); };
    size(); draw();
    addEventListener("resize", function () { size(); draw(); });
    if (!still) requestAnimationFrame(frame);
  }

  if (!still) {
    var bars = document.querySelectorAll(".g i b"), vals = document.querySelectorAll(".g em");
    setInterval(function () {
      bars.forEach(function (bar, k) {
        var base = +bar.dataset.w, v = Math.max(5, Math.min(99, Math.round(base + (Math.random() * 10 - 5))));
        bar.style.setProperty("--w", v + "%");
        vals[k].textContent = v + "%";
      });
    }, 2600);
  }
})();
