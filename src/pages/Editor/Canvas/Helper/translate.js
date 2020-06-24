module.exports = {
	/* path相关方法 */
	path: {
		/**
		 * [moveEnd 移动结束]
		 * @param  {[Object]} CurNode [当前节点数据]
		 * @param  {[Object]} move    [偏移数据]
		 * @return {[Null]} [null]
		 */
		moveEnd(CurNode, move) {
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