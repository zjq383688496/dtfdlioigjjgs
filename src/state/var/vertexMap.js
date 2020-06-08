var vertex = [ 'tl', 'tm', 'tr', 'rm', 'br', 'bm', 'bl', 'lm' ]

// 缩放操作hover样式
var arrowMap = {
	tl: 'nw-resize',
	tm: 'n-resize',
	tr: 'ne-resize',
	rm: 'e-resize',
	br: 'se-resize',
	bm: 's-resize',
	bl: 'sw-resize',
	lm: 'w-resize'
}

// 旋转操作点位偏移向量
var circleVertex = {
	tl: { x: -1, y: -1 },
	tr: { x: 1,  y: -1 },
	br: { x: 1,  y: 1 },
	bl: { x: -1, y: 1 },
}

module.exports = {
	arrowMap,
	getVertex,
	circleVertex
}

// 获取缩放操作hover向量顺序
function getVertex(angle) {
	let num = ~~((angle + 22.5) / 45),
		vx  = deepCopy(vertex)
	if (num < 0) num = 6
	if (!num) return vx
	for (var i = 0; i < num; i++) {
		vx.push(vx.shift())
	}
	console.log(vx)
	return vx
}
