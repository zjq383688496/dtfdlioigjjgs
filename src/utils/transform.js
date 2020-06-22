const { abs, atan, PI, sin, cos } = Math

module.exports = {
	/**
	 * [getAngle 获取角度]
	 * @param  {[type]} cx [中点坐标X]
	 * @param  {[type]} cy [中点坐标Y]
	 * @param  {[type]} x1 [参考点1坐标X]
	 * @param  {[type]} y1 [参考点1坐标Y]
	 * @param  {[type]} x2 [参考点2坐标X]
	 * @param  {[type]} y2 [参考点2坐标Y]
	 * @param  {[type]} shiftAngle [偏移角度]
	 * @return {[type]}       [角度]
	 */
	getAngle(cx, cy, x1, y1, x2, y2, shiftAngle = 0) {
		let dx1 = x1 - cx,
			dy1 = y1 - cy,
			dx2 = x2 - cx,
			dy2 = y2 - cy,
			px1 = (cx <= x1? 90: 270) - shiftAngle,	// 轴坐标 x 左 || 右
			px2 = cx <= x2? 90: 270,			// 轴坐标 x 左 || 右
			PI2 = 2 * PI
		let angle = abs(360 * (atan(dy1 / dx1) - atan(dy2 / dx2)) / PI2 + px1 - px2)
		angle -= shiftAngle
		return angle
	},
	/**
	 * [pointRotate 绕点旋转]
	 * @param  {[type]} x  [原始点坐标X]
	 * @param  {[type]} y  [原始点坐标Y]
	 * @param  {[type]} cx [中点坐标X]
	 * @param  {[type]} cy [中点坐标Y]
	 * @param  {[type]} angle [旋转角度]
	 * @return {[type]}       [Object]
	 * @return {[type]} x     [变化后坐标X]
	 * @return {[type]} y     [变化后坐标Y]
	 * @return {[type]} angle [变化后角度]
	 */
	pointRotate(x, y, cx, cy, angle) {
		if (angle < 0) angle += 360
		angle %= 360
		let nx, ny
		nx = (x - cx) * cos(PI * angle / 180) - (y - cy) * sin(PI * angle / 180) + cx
		ny = (x - cx) * sin(PI * angle / 180) + (y - cy) * cos(PI * angle / 180) + cy
		return { x: nx, y: ny, angle }
	}
}