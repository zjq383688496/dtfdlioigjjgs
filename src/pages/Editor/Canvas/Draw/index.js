import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from 'actions'

import './index.less'

class Draw extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			type: '',
			path: {
				start: {
					c: [ 250, 250 ],
					n: [ 300, 350 ],
				},
				center: [
					{
						p: [ 400, 350 ],
						c: [ 500, 250 ],
						n: [ 650, 100 ],
					}
				],
				end: {
					p: [ 700, 200 ],
					c: [ 750, 440 ],
				},
			},
			initX: 0,
			initY: 0,
			type: '',
			idx:  0,
			pos:  '',
			isMove: false,
			pathBak: null
		}
	}
	onMouseDown = (e, type, idx, pos) => {
		let { path } = this.state
		// let { actions } = this.props
		// let { clientX, clientY, target } = e,
		// 	{ top, left } = getOffset(target),
		// 	initX = clientX - left,
		// 	initY = clientY - top
		console.log(pos)
		let { clientX: initX, clientY: initY } = e
		this.setState({ initX, initY, isMove: true, type, idx, pos, pathBak: deepCopy(path) })
	}
	onMouseMove = e => {
		if (!this.state.isMove) return
		let path = this.globalMove(e)
		this.setState({ path })
	}
	onMouseUp = e => {
		if (!this.state.isMove) return
		let path = this.globalMove(e)
		this.setState({ initX: 0, initY: 0, isMove: false, path, pathBak: null })
	}
	globalMove = e => {
		if (!this.state.isMove) return
		let { initX, initY, pathBak, type, idx, pos } = this.state,
			{ clientX, clientY } = e,
			diffX = clientX - initX,
			diffY = clientY - initY,
			cpath = deepCopy(pathBak)
		let cur   = cpath[type]
		if (type === 'center') cur = cur[idx]
		let p = cur['p'],
			c = cur['c'],
			n = cur['n']
		if (pos === 'c') {
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
		} else {
			let cu = cur[pos]
			cu[0] += diffX
			cu[1] += diffY
		}
		return cpath
	}
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
		// let d = path.map(({ d, t }) => {
		// 	let queue = d.map(({ x, y }) => `${x},${y}`).join(' ')
		// 	return `${t || ''}${queue}`
		// }).join(' ')
		return 'M' + [ startStr, centerStr, endStr ].join(' ') + 'z'
	}
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
		// let ellipse = path.map(({ d, t }, i) => {
		// 	let len = d.length
		// 	let queue = d.map(({ x, y }, j) => {
		// 		let color = '#000'
		// 		return (
		// 			<ellipse
		// 				key={j}
		// 				cx={x} cy={y} rx={r} ry={r}
		// 				fill={color}
		// 				stroke={color}
		// 				strokeWidth="1.5"
		// 				vectorEffect="non-scaling-stroke"
		// 				strokeDasharray="none"
		// 				onMouseDown={e => this.onMouseDown(e, i, j)}
		// 			></ellipse>
		// 		)
		// 	})
		// 	return <g key={i}>{queue}</g>
		// })
		return [ startDom, ...centerDom, endDom ]
	}
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
				{cPoint}
				{nPoint}
			</g>
		)
	}
	renderPoint([ x, y ], color = '#000', type, idx, pos) {
		let r = 6
		return (
			<ellipse
				cx={x} cy={y} rx={r} ry={r}
				fill={color}
				stroke={color}
				strokeWidth="1.5"
				vectorEffect="non-scaling-stroke"
				strokeDasharray="none"
				onMouseDown={e => this.onMouseDown(e, type, idx, pos)}
			></ellipse>
		)
	}
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
		let pathDom = this.renderPath()
		let helper  = this.renderHelper()
		return (
			<div
				className="pen-area"
				onMouseMove={this.onMouseMove}
				onMouseUp={this.onMouseUp}
			>
				<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
					<g style={{ pointerEvents: 'all' }} ref="svg_content">
						{ pathDom }
						{ helper }
					</g>
				</svg>
			</div>
		)
	}
}

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