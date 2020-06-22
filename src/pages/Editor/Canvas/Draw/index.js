import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from 'actions'

import { getAngle, pointRotate } from '@utils/transform'

import './index.less'

var cursorMap = {

}
var pathData = {
	start: {
		c: [ 250, 250 ],
		n: [ 300, 350 ],
	},
	center: [
		{
			p: [ 400, 350 ],
			c: [ 500, 250 ],
			n: [ 650, 100 ],
		},
		{
			p: [ 700, 200 ],
			c: [ 750, 440 ],
			n: [ 800, 500 ],
		}
	],
	end: {
		p: [ 400, 500 ],
		c: [ 250, 250 ],
	},
}

class Draw extends React.Component {
	constructor(props) {
		super(props)
		let { ShortcutKey } = props.Config
		let path = deepCopy(pathData),
			fragment = this.pathFragment(path)
		this.state = {
			type: '',
			path,
			fragment,
			initX: 0,
			initY: 0,
			type: '',
			idx:  0,
			pos:  '',
			isMove: false,
			pathBak: null,
			ShortcutKey,
			selectIdx: -1,
			centerPoint: null,
		}
	}
	static getDerivedStateFromProps(nextProps, preState) {
		let { ShortcutKey } = nextProps.Config,
			isEqual = objEqual(ShortcutKey, preState.ShortcutKey)
		if (!isEqual) {
			return { ShortcutKey }
		}
		return null
	}
	// 是否对称
	isSymmetric() {
		let { key, type } = this.state.ShortcutKey
		return (type === 'down' && key === 'key_alt')
	}
	// 路径片段
	pathFragment(path) {
		let { start, center, end } = path,
			npath = [ start, ...center, end ],
			nlen  = npath.length,
			paths = []
		npath.forEach(({ c, n }, i) => {
			if (i >= nlen - 1) return
			let { p, c: nc } = npath[i + 1]
			paths.push({ start: c, startB: n, endB: p, end: nc })
		})
		return paths
	}
	onMouseDown = (e, type, idx, pos) => {
		let { path }  = this.state,
			symmetric = this.isSymmetric()
		// let { actions } = this.props
		// let { clientX, clientY, target } = e,
		// 	{ top, left } = getOffset(target),
		// 	initX = clientX - left,
		// 	initY = clientY - top
		let { clientX: initX, clientY: initY } = e
		this.setState({ symmetric, initX, initY, isMove: true, type, idx, pos, pathBak: deepCopy(path), selectIdx: -1 })
	}
	onMouseMove = e => {
		if (!this.state.isMove) return
		let path = this.globalMove(e)
		this.setState({ path })
	}
	onMouseUp = e => {
		if (!this.state.isMove) return
		let path     = this.globalMove(e),
			fragment = this.pathFragment(path)
		this.setState({ initX: 0, initY: 0, isMove: false, path, pathBak: null, fragment })
	}
	onSelect = (e, i) => {
		let { fragment } = this.state,
			centerPoint  = null
		if (i >= 0) {
			let $path  = this.refs[`$pathHelp_${i}`]
			let frag   = fragment[i]
			let total  = $path.getTotalLength()
			centerPoint = $path.getPointAtLength(total/2)
		}
		this.setState({ selectIdx: i, centerPoint })
	}
	// 添加中点
	addCenterPoint = () => {
		if (!this.isSymmetric()) return
		let { path, selectIdx, centerPoint } = this.state,
			{ center } = path,
			len = center.length,
			// method = 'unshift',
			point  = [ centerPoint.x, centerPoint.y ]
		// if (selectIdx === len) method = 'push'
		// splice
		// debugger
		center.splice(selectIdx, 0, {
			p: deepCopy(point),
			c: deepCopy(point),
			n: deepCopy(point),
		})
		let fragment = this.pathFragment(path)
		this.setState({ path, fragment, centerPoint: null })
	}
	globalMove = e => {
		if (!this.state.isMove) return
		let { initX, initY, pathBak, type, idx, pos, symmetric } = this.state,
			{ clientX, clientY } = e,
			diffX = clientX - initX,
			diffY = clientY - initY,
			cpath = deepCopy(pathBak)
		let cur   = cpath[type]
		// console.log(type, idx, pos)
		if (type === 'center') cur = cur[idx]
		else cur = { ...cpath.start, ...cpath.end }
		let p = cur['p'],
			c = cur['c'],
			n = cur['n']
		if (pos === 'c') {
			if (symmetric) {
				let x  = p[0] = c[0] + diffX,
					y  = p[1] = c[1] + diffY,
					nn = pointRotate(x, y, c[0], c[1], 180)
				n[0] = nn.x
				n[1] = nn.y
			} else {
				c[0] += diffX
				c[1] += diffY
				if (p) {
					p[0] += diffX
					p[1] += diffY
				}
				if (n) {
					n[0] += diffX
					n[1] += diffY
				}
			}
			if (type != 'center') {
				cpath.start = { c, n }
				cpath.end   = { p, c }
			}
		} else {
			let cu = cur[pos]
			cu[0] += diffX
			cu[1] += diffY
			if (symmetric) {
				let re = cur[pos === 'n'? 'p': 'n'],
					nn = pointRotate(cu[0], cu[1], c[0], c[1], 180)
				re[0] = nn.x
				re[1] = nn.y
			}
			if (type != 'center') {
				cpath.start = { c, n }
				cpath.end   = { p, c }
			}
		}
		return cpath
	}
	// 生成路径
	genPath(path) {
		let { start, center, end } = path,
			startStr  = '',
			centerStr = '',
			endStr    = ''
		if (start) {
			let { c, n } = start
			startStr = mergePos(c) + ' C' + mergePos(n)
		}
		if (center && center.length) {
			centerStr = center.map(({ p, c, n }, i) => {
				return mergePos(p) + ' ' + mergePos(c) + ' ' + mergePos(n)
			}).join(' ')
		}
		if (end) {
			let { p, c } = end
			endStr = mergePos(p) + ' ' + mergePos(c)
		}
		return 'M' + [ startStr, centerStr, endStr ].join(' ') + 'z'
	}
	// 渲染路径
	renderPath = () => {
		let { path } = this.state
		let d = this.genPath(path)
		return (
			<path
				ref="$path"
				d={d}
				stroke="#000"
				strokeWidth="1.5"
				fill="none"
			/>
		)
	}
	// 生成辅助路径
	genPathHelper(path) {
		let { start, center, end } = path,
			npath = [ start, ...center, end ],
			nlen  = npath.length,
			paths = []
		npath.forEach(({ c, n }, i) => {
			if (i >= nlen - 1) return
			let { p, c: nc } = npath[i + 1]
			paths.push(`M${mergePos(c)} C${mergePos(n)} ${mergePos(p)} ${mergePos(nc)}`)
		})
		return paths
	}
	// 渲染辅助路径
	renderPathHelper = () => {
		let { path, selectIdx, ShortcutKey } = this.state
		let ds = this.genPathHelper(path)
		return ds.map((d, i) => {
			let color = selectIdx === i? '#f00': 'rgba(0,0,0,0)',
				style = {
					cursor: selectIdx === i && this.isSymmetric()? 'cell': 'default',
				}
			return (
				<path
					key={i}
					ref={`$pathHelp_${i}`}
					d={d}
					stroke={color}
					strokeWidth="1.5"
					fill="none"
					style={style}
					onMouseOver={e => this.onSelect(e, i)}
					onMouseOut={e => this.onSelect(e, -1)}
					onClick={this.addCenterPoint}
				/>
			)
		})
	}
	// 渲染中点
	renderCenterPoint = () => {
		let { centerPoint } = this.state
		if (!centerPoint || !this.isSymmetric()) return
		let { x, y } = centerPoint
		return (
			<ellipse
				cx={x} cy={y} rx={3} ry={3}
				fill="#fff"
				stroke={'#f00'}
				strokeWidth="1.5"
				vectorEffect="non-scaling-stroke"
				strokeDasharray="none"
			></ellipse>
		)
	}
	// 渲染辅助
	renderHelper = () => {
		let { path } = this.state
		let { start, center, end } = path
		let startDom  = null,
			centerDom = null,
			endDom    = null,
			idx = -1
		if (start) {
			startDom = this.renderPointLine(start, ++idx, 'start')
		}
		if (end) {
			endDom = this.renderPointLine(end, ++idx, 'end')
		}
		if (center && center.length) {
			centerDom = center.map((_, i) => {
				return this.renderPointLine(_, ++idx, 'center', i)
			})
		}
		return [ startDom, ...centerDom, endDom ]
	}
	// 渲染点&线
	renderPointLine = ({ p, c, n }, key, type, idx) => {
		let pLine  = null,
			nLine  = null,
			pPoint = null,
			nPoint = null,
			cPoint = this.renderPoint(c, '#f00', type, idx, 'c')
		if (p) {
			pPoint = this.renderPoint(p, undefined, type, idx, 'p')
			pLine  = this.renderLine(p, c)
		}
		if (n) {
			nPoint = this.renderPoint(n, undefined, type, idx, 'n')
			nLine  = this.renderLine(n, c)
		}
		// console.log(key)
		return (
			<g key={key}>
				{pLine}
				{nLine}
				{pPoint}
				{nPoint}
				{cPoint}
			</g>
		)
	}
	// 渲染点
	renderPoint = ([ x, y ], color = '#000', type, idx, pos) => {
		let r = 4
		let style = {
			cursor: this.isSymmetric()? 'crosshair': 'default'
		}
		return (
			<ellipse
				cx={x} cy={y} rx={r} ry={r}
				fill={color}
				stroke={color}
				strokeWidth="1.5"
				vectorEffect="non-scaling-stroke"
				strokeDasharray="none"
				onMouseDown={e => this.onMouseDown(e, type, idx, pos)}
				style={style}
			></ellipse>
		)
	}
	// 渲染线
	renderLine([ x, y ], c) {
		let x1 = c[0],
			y1 = c[1]
		return (
			<line x1={x1} y1={y1} x2={x} y2={y} stroke="#000" strokeWidth="1.5" />
		)
	}
	render() {
		let { type } = this.props.Config.Control
		if (type != 'pen') return null
		let pathHelp  = this.renderPathHelper()
		let pathDom   = this.renderPath()
		let helper    = this.renderHelper()
		let centerDom = this.renderCenterPoint()
		return (
			<div
				className="pen-area"
				onMouseMove={this.onMouseMove}
				onMouseUp={this.onMouseUp}
			>
				<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
					<g style={{ pointerEvents: 'all' }} ref="svg_content">
						{ pathDom }
						{ pathHelp }
						{ helper }
						{ centerDom }
					</g>
				</svg>
			</div>
		)
	}
}
// 组合坐标
function mergePos([ x, y ]) {
	return `${x},${y}`
}

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(actions, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Draw)