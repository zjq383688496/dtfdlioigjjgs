module.exports = {
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
			$CurNode.setAttribute('x', x)
			$CurNode.setAttribute('y', y)
			$CurNode.setAttribute('width', w)
			$CurNode.setAttribute('height', h)
			resetTransform($CurNode, rotate, cx, cy)
		},
		circle(CurNode, move, $CurNode, transform = '') {
			let { x, y, cx, cy, rx, ry, rotate, w, h } = move
			$CurNode.setAttribute('x', x)
			$CurNode.setAttribute('y', y)
			$CurNode.setAttribute('cx', cx)
			$CurNode.setAttribute('cy', cy)
			$CurNode.setAttribute('rx', rx)
			$CurNode.setAttribute('ry', ry)
			resetTransform($CurNode, rotate, cx, cy)
		},
		path(CurNode, move, $CurNode, transform = '') {
			
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
	}
}

// 重置位置
function resetTransform($CurNode, rotate, cx, cy, x, y) {
	let transform = ''
	if (x || y) transform += `translate(${x},${y})`
	transform += ` rotate(${rotate} ${cx},${cy})`
	if (!transform || !$CurNode) return
	$CurNode.setAttribute('transform', transform)
}