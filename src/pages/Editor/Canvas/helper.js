import shiftMap  from '@var/shiftMap'
import { sValH } from '@var/shiftValue'

const { abs, atan, PI, sin, cos } = Math

// 选中节点初始化
export default class helper {
	constructor(e, _node, _ref) {
		this._node = _node
		this._ref  = _ref
		this.init(e, _ref, _node)
	}
	init(e, _ref, _node) {
		e.stopPropagation()
		let { actions } = _ref.props,
			{ id } = _node
		actions.selectNode(id)
		_ref.setState({ id, CurNode: _node, setectType: 'move', selectMaskStatus: true, ...this.initPosition(e) })
	}
	/* 初始化 - 开始 */
	// 数据初始化
	startInit = (e, setectType, setectParame, parame = {}) => {
		e.stopPropagation()
		let state = {
			selectMaskStatus: true,
			setectType,
			...this.initPosition(e),
			...parame
		}
		if (setectParame) state.setectParame = setectParame
		this._ref.setState(state)
	}
	// 初始化坐标
	initPosition = e => {
		let { top: offsetTop, left: offsetLeft } = getOffset(this._ref.refs.area),
			{ clientX: initX, clientY: initY } = e
		return {
			initX,
			initY,
			offsetTop,
			offsetLeft,
			scrollTop: document.documentElement.scrollTop
		}
	}
	/* 初始化 - 结束 */

	/* 操作开始 - 开始 */
	// 拖动开始 OK
	moveStart = e => {
		let { layout } = this._ref.state.CurNode,
			{ x, y, cx, cy } = layout
		this.startInit(e, 'move')
	}
	// 旋转开始 OK
	rotateStart(e, type) {
		let { $CurNode, state, setectPos } = this._ref,
			{ clientX: initX, clientY: initY } = e,
			{ CurNode, offsetTop, offsetLeft, scrollTop } = state,
			{ cx, cy }  = CurNode.layout,
			{ x, y } = setectPos.tm
		initX -= offsetLeft
		initY -= offsetTop - scrollTop
		let initAngle = getAngle(cx, cy, initX, initY, x, y)
		this.startInit(e, 'rotate', type, { initAngle })
	}
	// 缩放开始
	scaleStart = (e, type) => {
		this.startInit(e, 'scale', type)
	}
	/* 操作开始 - 结束 */

	/* 操作进行 - 开始 */
	moveInit(e) {
		e.stopPropagation()
		let { CurNode, initX, initY, setectType, setectParame } = this._ref.state,
			{ clientX, clientY } = e,
			moveFun = this[`${setectType}Move`]
		moveFun && moveFun(CurNode, initX, initY, clientX, clientY, setectParame)
	}
	// 拖动进行 OK
	moveMove = (CurNode, initX, initY, clientX, clientY) => {
		let move = this.moveGlobal(CurNode, initX, initY, clientX, clientY)
		if (!move) return
		let { cx, cy, rotate, diffX, diffY } = move,
			{ $CurNode, refs: { svg_select } } = this._ref
		resetTransform($CurNode, rotate, cx, cy, diffX, diffY)
		resetTransform(svg_select, rotate, cx, cy, diffX, diffY)
	}
	// 旋转进行 OK
	rotateMove = (CurNode, initX, initY, clientX, clientY) => {
		let { angle, cx, cy, rotate } = this.rotateGlobal(CurNode, initX, initY, clientX, clientY),
			{ $CurNode, refs: { svg_select } } = this._ref
		rotate += angle
		rotate = rotate % 360
		resetTransform($CurNode, rotate, cx, cy)
		resetTransform(svg_select, rotate, cx, cy)
	}
	// 缩放进行
	scaleMove = (CurNode, initX, initY, clientX, clientY, type) => {
		let { name } = CurNode
		let { $CurNode, refs: { help_path } } = this._ref,
			{ newSetectPos, rotate, w, h, x, y, cx, cy, rx, ry } = this.scaleGlobal(CurNode, initX, initY, clientX, clientY, type),
			{ tl, tr, br, bl } = newSetectPos

		let d = `M${tl.x},${tl.y} L${tr.x},${tr.y} ${br.x},${br.y} ${bl.x},${bl.y}z`
		help_path.setAttribute('d', d)
		$CurNode.setAttribute('x', x)
		$CurNode.setAttribute('y', y)

		if (name === 'circle') {
			$CurNode.setAttribute('cx', cx)
			$CurNode.setAttribute('cy', cy)
			$CurNode.setAttribute('rx', rx)
			$CurNode.setAttribute('ry', ry)
			resetTransform($CurNode, rotate, cx, cy)
		} else {
			$CurNode.setAttribute('width', w)
			$CurNode.setAttribute('height', h)
			resetTransform($CurNode, rotate, cx, cy)
		}
	}
	/* 操作进行 - 结束 */

	// 设置结束
	endInit = e => {
		e.stopPropagation()
		let { props, state } = this._ref,
			{ CurNode, initX, initY, setectType, setectParame } = state,
			{ actions } = props,
			{ clientX, clientY } = e,
			endFun = this[`${setectType}End`]

		endFun && endFun(actions, CurNode, initX, initY, clientX, clientY, setectParame)
		this._ref.setState({ selectMaskStatus: false, setectType: null, setectParame: null })
	}
	// 拖动结束 OK
	moveEnd = (actions, CurNode, initX, initY, clientX, clientY) => {
		let move = this.moveGlobal(CurNode, initX, initY, clientX, clientY)
		if (!move) return
		let { x, y, cx, cy, rotate, diffX, diffY } = move,
			{ $CurNode, refs: { svg_select } } = this._ref

		x  += diffX
		y  += diffY
		cx += diffX
		cy += diffY
		Object.assign(CurNode.layout, { x, y, cx, cy })
		resetTransform($CurNode, rotate, cx, cy)
		actions.updateNode(CurNode)
	}
	// 旋转结束 OK
	rotateEnd = (actions, CurNode, initX, initY, clientX, clientY) => {
		let { angle, cx, cy, rotate } = this.rotateGlobal(CurNode, initX, initY, clientX, clientY),
			{ $CurNode } = this._ref
		rotate += angle
		rotate = rotate % 360
		Object.assign(CurNode.layout, { rotate })
		actions.updateNode(CurNode)
	}
	// 缩放结束
	scaleEnd = (actions, CurNode, initX, initY, clientX, clientY, type) => {
		let { $CurNode, refs } = this._ref,
			{ x, y, cx, cy, rx, ry, w, h, rotate } = this.scaleGlobal(CurNode, initX, initY, clientX, clientY, type)

		Object.assign(CurNode.layout, { x, y, w, h, rx, ry, cx, cy })
		actions.updateNode(CurNode)
		// resetTransform($CurNode, rotate, cx, cy)
	}

	/* 通用方法 开始 */
	moveGlobal = (CurNode, initX, initY, clientX, clientY) => {
		let { x, y, cx, cy, rotate } = CurNode.layout
		return { x, y, cx, cy, rotate, diffX: clientX - initX, diffY: clientY - initY }
	}
	rotateGlobal = (CurNode, initX, initY, clientX, clientY) => {
		let { cx, cy, rotate } = CurNode.layout,
			{ offsetTop, offsetLeft, scrollTop, initAngle } = this._ref.state
		initX   -= offsetLeft
		initY   -= offsetTop - scrollTop
		clientX -= offsetLeft
		clientY -= offsetTop - scrollTop
		let angle = getAngle(cx, cy, initX, initY, clientX, clientY, initAngle)
		return { angle, cx, cy, rotate }
	}
	scaleGlobal = (CurNode, initX, initY, clientX, clientY, type) => {
		let { refs, setectPos } = this._ref,
			{ x, y, cx, cy, rx, ry, w, h, rotate } = CurNode.layout,
			{ svg_select } = refs,
			newSetectPos = deepCopy(setectPos),
			{ _x: shiftX, _y: shiftY, rel } = shiftMap[type],
			cur = newSetectPos[type],
			rev = newSetectPos[rel],
			_cx,		// X轴新坐标
			_cy,		// Y轴新坐标
			difoX = 0,	// X轴偏移量(原始)
			difoY = 0,	// Y轴偏移量(原始)
			diffX = 0,	// X轴偏移量
			diffY = 0,	// Y轴偏移量
			sx = 1,		// X轴缩放比例
			sy = 1		// Y轴缩放比例

		// 获取偏移量(原始)
		if (shiftX) difoX = clientX - initX
		if (shiftY) difoY = clientY - initY

		// 如果存在旋转角度 则重新计算当前坐标
		if (rotate) {
			let newClient = pointRotate(clientX, clientY, initX, initY, -rotate)
			clientX = newClient.x
			clientY = newClient.y
		}

		// 获取偏移量
		if (shiftX) diffX = clientX - initX
		if (shiftY) diffY = clientY - initY
		cur.x += diffX
		cur.y += diffY

		// 更新中心点坐标
		_cx = (cur.x + rev.x) / 2
		_cy = (cur.y + rev.y) / 2

		let { dx, dy } = shiftMap[type]
		sx += diffX / w * dx
		sy += diffY / h * dy
		w  = abs(w + diffX * dx)
		h  = abs(h + diffY * dy)
		rx = w / 2
		ry = h / 2

		Object.keys(newSetectPos).forEach(key => {
			let shf = shiftMap[key],
				pos = newSetectPos[key],
				hel = refs[`res_${key}`]
			if (shiftX) pos.x = _cx + rx * shf.x
			if (shiftY) pos.y = _cy + ry * shf.y
			hel.setAttribute('x', pos.x - sValH)
			hel.setAttribute('y', pos.y - sValH)
		})

		let { x: ncx, y: ncy } = pointRotate(_cx, _cy, cx, cy, rotate)
		x = ncx - rx
		y = ncy - ry
		return { newSetectPos, x, y, cx: ncx, cy: ncy, rx, ry, w, h, rotate }
	}
	/* 通用方法 结束 */
}

// 获取角度
function getAngle(cx, cy, x1, y1, x2, y2, shift = 0) {
	let dx1 = x1 - cx,
		dy1 = y1 - cy,
		dx2 = x2 - cx,
		dy2 = y2 - cy,
		px1 = (cx <= x1? 90: 270) - shift,	// 轴坐标 x 左 || 右
		px2 = cx <= x2? 90: 270,			// 轴坐标 x 左 || 右
		PI2 = 2 * PI
	let angle = abs(360 * (atan(dy1 / dx1) - atan(dy2 / dx2)) / PI2 + px1 - px2)
	angle -= shift
	return angle
}

function pointRotate(x, y, cx, cy, angle) {
	if (angle < 0) angle += 360
	angle %= 360
	let nx, ny
	nx = (x - cx) * cos(PI * angle / 180) - (y - cy) * sin(PI * angle / 180) + cx
	ny = (x - cx) * sin(PI * angle / 180) + (y - cy) * cos(PI * angle / 180) + cy
	return { x: nx, y: ny, angle }
}

// 重置位置
function resetTransform($CurNode, rotate, cx, cy, x, y) {
	let transform = ''
	if (x || y) transform += `translate(${x},${y})`
	transform += ` rotate(${rotate} ${cx},${cy})`
	if (!transform || !$CurNode) return
	$CurNode.setAttribute('transform', transform)
}
