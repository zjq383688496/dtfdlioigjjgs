var { getAngle, pointRotate } = require('@utils/transform')
var { mergePos } = require('../utils')

const translate = {
	/* 缩放中 */
	scaleMove: {
		/**
		 * [scaleMove 移动结束]
		 * @param  {[Object]}   CurNode  [当前节点数据]
		 * @param  {[Object]}   move     [偏移数据]
		 * @param  {[Document]} $CurNode [节点DOM]
		 * @param  {[String]}   transform [变形样式]
		 * @return {[Null]} [null]
		 */
		rect(CurNode, move, $CurNode, transform = '') {
			let { x, y, cx, cy, rotate, w, h } = move
			$CurNode.setAttribute('width', w)
			$CurNode.setAttribute('height', h)
		},
		circle(CurNode, move, $CurNode, transform = '') {
			let { x, y, cx, cy, rx, ry, rotate, w, h } = move
			$CurNode.setAttribute('cx', cx)
			$CurNode.setAttribute('cy', cy)
			$CurNode.setAttribute('rx', rx)
			$CurNode.setAttribute('ry', ry)
		},
		path(CurNode, move, $CurNode, transform = '') {
			let { layout, path } = CurNode
			let { x, y, sx, sy, cx, cy, rotate, w, h } = move
			let nw = pointRotate(x, y, cx, cy, rotate)
			if (sx < 0) x += w
			if (sy < 0) y += h
			let dx = x - layout.x,
				dy = y - layout.y
			let newPath = scalePath(path, x, y, dx, dy, sx, sy),
				d = genPath(newPath)
			$CurNode.setAttribute('d', d)
			return newPath
		}
	},
	/* 移动结束 */
	moveEnd: {
		/**
		 * [moveEnd 移动结束]
		 * @param  {[Object]} CurNode [当前节点数据]
		 * @param  {[Object]} move    [偏移数据]
		 * @return {[Null]} [null]
		 */
		path(CurNode, move) {
			let { path } = CurNode,
				{ start, center = [], end} = path,
				{ diffX, diffY } = move,
				arr = [start, ...center, end]
			arr.forEach(nodes => {
				Object.values(nodes).map(node => {
					node[0] += diffX
					node[1] += diffY
				})
			})
		}
	},
	/* 缩放结束 */
	scaleEnd: {
		/**
		 * [scaleEnd 缩放结束]
		 * @param  {[Object]}   CurNode  [当前节点数据]
		 * @param  {[Object]}   move     [偏移数据]
		 * @param  {[Document]} $CurNode [节点DOM]
		 * @param  {[String]}   transform [变形样式]
		 * @return {[Null]} [null]
		 */
		path(CurNode, move, $CurNode, transform = '') {
			CurNode.path = translate.scaleMove.path(...arguments)
		}
	}
}

module.exports = translate

// 重置位置
function resetTransform($CurNode, rotate, cx, cy, x, y) {
	let transform = ''
	if (x || y) transform += `translate(${x},${y})`
	transform += ` rotate(${rotate} ${cx},${cy})`
	if (!transform || !$CurNode) return
	$CurNode.setAttribute('transform', transform)
}

function scalePath(path, x, y, dx, dy, sx, sy) {
	let newPath = deepCopy(path)
	let { start, center, end } = newPath
	let list = [ start, ...center, end ]
	list.forEach(_ => {
		Object.keys(_).forEach(key => {
			let val        = _[key],
				[ _x, _y ] = val
			_x += dx
			_y += dy
			val[0] = parseFloat(((_x - x) * sx + x).toFixed(2))
			val[1] = parseFloat(((_y - y) * sy + y).toFixed(2))
		})
	})
	return newPath
}
function genPath(path) {
	var { start, center, end } = path
	
	var { c, n } = start,
		startStr = mergePos(c) + ' C' + mergePos(n)

	var { p, c } = end,
		endStr = mergePos(p) + ' ' + mergePos(c)

	var centerStr = center.map(({ p, c, n }, i) => {
		return mergePos(p) + ' ' + mergePos(c) + ' ' + mergePos(n)
	}).join(' ')

	return 'M' + [ startStr, centerStr, endStr ].join(' ') + 'z'
}