module.exports = {
	/**
	 * [mergePos 合并坐标]
	 * @param  {[Array]}  position    [坐标数组]
	 * @param  {[Number]} position[0] [坐标X]
	 * @param  {[Number]} position[1] [坐标Y]
	 * @return {[String]} [结果]
	 */
	mergePos([ x, y ]) {
		return `${x.toFixed(2)},${y.toFixed(2)}`
	}
}