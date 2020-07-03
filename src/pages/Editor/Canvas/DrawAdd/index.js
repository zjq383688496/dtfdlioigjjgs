import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from 'actions'

import { getAngle, pointRotate } from '@utils/transform'
import { mergePos } from '../utils'

import './index.less'

var pathData = {}

class DrawAdd extends React.Component {
	constructor(props) {
		super(props)
		let { data, Config } = props,
			{ ShortcutKey }  = Config,
			path     = {},
			fragment = []
		if (!data) 
		this.state = {
			type: '',
			path,
			fragment,
			initX: 0,
			initY: 0,
			isMove: false,
			pathBak: null,
			ShortcutKey,
			idx: -1,
			complete: false,
		}
	}
	componentDidUpdate() {
		let { complete } = this.state
		if (!complete) return
		let { path, fragment } = this.state,
			{ actions } = this.props,
			layout      = this.getLayout()
		if (fragment.length > 3) actions.addNode('path', { path, layout })
		actions.changeControlType('')
	}
	static getDerivedStateFromProps(nextProps, preState) {
		let { ShortcutKey } = nextProps.Config,
			isEqual = objEqual(ShortcutKey, preState.ShortcutKey)
		if (!isEqual) {
			return { ShortcutKey }
		}
		return null
	}
	// 路径片段
	pathFragment(path) {
		let { start, center = [], end } = path,
			npath = [ start, ...center, end ],
			nlen  = npath.length,
			paths = []
		npath.forEach(({ c, n }, i) => {
			if (i >= nlen - 1) return
			let { p, c: nc } = npath[i + 1]
			paths.push({
				p0: c,
				p1: n,
				p2: p,
				p3: nc
			})
		})
		return paths
	}
	onMouseDown = e => {
		e.stopPropagation()
		let { clientX, clientY, target } = e,
			{ top, left } = getOffset(target),
			initX = clientX - left,
			initY = clientY - top,
			{ path }  = this.state,
			{ start, center } = path,
			layout = this.getLayout(),
			fragment
		if (!start) {
			path.start = {
				c: [ initX, initY ],
				n: [ initX, initY ],
			}
			path.end = {
				p: [ initX, initY ],
				c: [ initX, initY ],
			}
		} else {
			if (!center) center = path.center = []
			center.push({
				p: [ initX, initY ],
				c: [ initX, initY ],
				n: [ initX, initY ],
			})
		}
		fragment = this.pathFragment(path)
		this.setState({
			initX,
			initY,
			clientX,
			clientY,
			isMove: true,
			pathBak: deepCopy(path),
			fragment,
			idx: fragment.length - 1,
			layout
		})
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
		console.log('type: ', e.type)
		this.setState({ initX: 0, initY: 0, isMove: false, path, pathBak: null, fragment })
	}
	onContextMenu = e => {
		e.preventDefault()
		e.stopPropagation()
		let { path, fragment } = this.state,
			{ center }  = path,
			{ actions } = this.props
		if (fragment.length > 3) {
			if (center && center.length) center.pop()
		}
		this.setState({ complete: true, path, fragment })
	}
	globalMove = e => {
		if (!this.state.isMove) return
		let { clientX, clientY, pathBak, idx } = this.state,
			diffX = e.clientX - clientX,
			diffY = e.clientY - clientY,
			cpath = deepCopy(pathBak),
			type  = idx? 'center': 'start'
		let cur   = cpath[type]
		if (type === 'center') cur = cur[idx - 1]
		else cur = { ...cpath.start, ...cpath.end }

		let p = cur['p'],
			c = cur['c'],
			n = cur['n']
		let x  = p[0] = c[0] + diffX,
			y  = p[1] = c[1] + diffY,
			nn = pointRotate(x, y, c[0], c[1], 180)
		n[0] = nn.x
		n[1] = nn.y

		if (type != 'center') {
			cpath.start = { c, n }
			cpath.end   = { p, c }
		}
		return cpath
	}
	getLayout() {
		let { $path } = this.refs
		if (!$path) return {}
		let { x, y, width: w, height: h } = $path.getBBox(),
			layout = {
				x, y, w, h,
				cx: x + w / 2,
				cy: y + h / 2,
				rotate: 0,
			}
		return layout
	}
	// 生成路径 OK
	genPath(path) {
		let { complete } = this.state
		let { start, center, end } = path,
			startStr  = '',
			centerStr = '',
			endStr    = ''
		if (start) {
			let { c, n } = start
			startStr = mergePos(c)
			if (center && center.length) startStr += ' C' + mergePos(n)
		}
		if (center && center.length) {
			let len = center.length
			let centerList = center.map(({ p, c, n }, i) => {
				let strList = [ mergePos(p), mergePos(c) ]
				if (i < len - 1 || complete) strList.push(mergePos(n))
				return strList.join(' ')
			})
			centerStr = centerList.join(' ')
		}
		if (end && complete) {
			let { p, c } = end
			endStr = mergePos(p) + ' ' + mergePos(c)
		}
		if (!(startStr+centerStr+endStr)) return ''
		return 'M' + [ startStr, centerStr, endStr ].join(' ')
	}
	// 渲染路径 OK
	renderPath = () => {
		let { path } = this.state
		let d = this.genPath(path)
		if (!d) return null
		return (
			<path
				ref="$path"
				d={d}
				stroke="#000"
				strokeWidth="2"
				fill="none"
			/>
		)
	}
	// 渲染辅助
	renderHelper = () => {
		let { path } = this.state
		let { start, center, end } = path
		let sDom = null,
			cDom = [],
			eDom = null,
			idx  = 0
		if (start) {
			sDom = this.renderPointLine(start, idx, 'start')
		}
		if (end) {
			eDom = this.renderPointLine(end, ++idx, 'end')
		}
		if (center && center.length) {
			cDom = center.map(_ => this.renderPointLine(_, ++idx, 'center'))
		}
		return [ sDom, ...cDom, eDom ]
	}
	// 渲染点&线
	renderPointLine = ({ p, c, n }, key, type) => {
		let pLine  = null,
			nLine  = null,
			pPoint = null,
			nPoint = null,
			cPoint = null
		cPoint = this.renderPoint(c, '#f00', type, 'c')
		if (p) {
			pPoint = this.renderPoint(p, undefined, type, 'p')
			pLine  = this.renderLine(p, c)
		}
		if (n) {
			nPoint = this.renderPoint(n, undefined, type, 'n')
			nLine  = this.renderLine(n, c)
		}
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
	renderPoint = ([ x, y ], color = '#000', type, pos) => {
		let r = 4
		let style = {
			pointerEvents: 'none'
		}
		return (
			<ellipse
				cx={x} cy={y} rx={r} ry={r}
				fill={color}
				stroke={color}
				strokeWidth="1.5"
				vectorEffect="non-scaling-stroke"
				strokeDasharray="none"
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
		if (type != 'closePath') return null
		let pathDom = this.renderPath()
		let helper  = this.renderHelper()
		return (
			<div
				className="pen-area"
				onMouseDown={this.onMouseDown}
				onMouseMove={this.onMouseMove}
				onMouseUp={this.onMouseUp}
				onContextMenu={this.onContextMenu}
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

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(actions, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DrawAdd)