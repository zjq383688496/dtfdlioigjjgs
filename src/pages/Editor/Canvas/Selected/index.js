import React from 'react'

import { arrowMap, getVertex, circleVertex } from '@var/vertexMap'

let vertexRect   = [ 'tl', 'tm', 'tr', 'rm', 'br', 'bm', 'bl', 'lm' ],
	vertexCircle = [ 'tl', 'tr', 'br', 'bl' ]

import { sVal, sValH } from '@var/shiftValue'

import './index.less'

export default class Selected extends React.Component {
	// 渲染选中辅助
	renderSelectedHelp = () => {
		let { parent } = this.props,
			{ refs, props } = parent,
			{ x, y, w, h, cx, cy, rotate } = props.Config.CurNode.layout,
			hw = w / 2,
			hh = h / 2
		let tl = { x, y },					// 上左
			tm = { x: x + hw, y },			// 上中
			tr = { x: x + w, y},			// 上右
			rm = { x: x + w, y: y + hh },	// 右中
			br = { x: x + w, y: y + h },	// 下右
			bm = { x: x + hw, y: y + h },	// 下中
			bl = { x, y: y + h },			// 下左
			lm = { x, y: y + hh }			// 左中
		let d = `M${tl.x},${tl.y} L${tr.x},${tr.y} ${br.x},${br.y} ${bl.x},${bl.y}z`
		let t = `rotate(${rotate} ${cx},${cy})`
		parent.setectPos = { tl, tm, tr, rm, br, bm, bl, lm }
		let vertex = getVertex(rotate)
		let circleHelp = this.renderHelpCircle(parent)
		let rectHelp   = this.renderHelpRect(parent, vertex)
		return (
			<g ref={e => refs.svg_select = e} transform={t}>
				<path ref={e => refs.help_path = e} fill="none" stroke="#4f80ff" shapeRendering="crispEdges" style={{ pointerEvents: 'none' }} d={d} onMouseDown={parent.setMoveStart}></path>
				<g display="inline">
					<rect onMouseDown={this.setMoveStart} ref="move" width={w} height={h} fill="none" stroke="rgba(0,0,0,0)" x={x} y={y}></rect>
					{ circleHelp }
					{ rectHelp }
				</g>
			</g>
		)
	}
	renderHelpCircle = parent => {
		let { setectPos, refs } = parent
		return vertexCircle.map((key, i) => {
			let node = setectPos[key],
				cv   = circleVertex[key],
				name = `rot_${key}`
			return (
				<circle
					key={i}
					onMouseDown={e => this.setRotateStart(e, key, parent)}
					ref={e => refs[name] = e}
					className="selector-circle"
					r={sVal}
					cx={node.x + sValH * cv.x}
					cy={node.y + sValH * cv.y}
				></circle>
			)
		})
	}
	renderHelpRect = (parent, vertex) => {
		let { setectPos, refs } = parent
		return vertexRect.map((key, i) => {
			let node = setectPos[key],
				name = `res_${key}`
			return (
				<rect
					key={i}
					onMouseDown={e => this.setScaleStart(e, key, parent)}
					ref={e => refs[name] = e}
					className="selector-rect"
					width={sVal}
					height={sVal}
					style={{ cursor: arrowMap[vertex[i]] }}
					x={node.x - sValH}
					y={node.y - sValH}
				></rect>
			)
		})
	}
	// 设置旋转
	setRotateStart = (e, type, parent) => {
		parent._helper.rotateStart(e, type)
	}
	// 设置缩放
	setScaleStart = (e, type, parent) => {
		parent._helper.scaleStart(e, type)
	}
	render() {
		let selected = this.renderSelectedHelp()
		return selected
	}
}
