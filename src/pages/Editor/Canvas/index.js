import React, { Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from 'actions'

import shiftMap  from '@var/shiftMap'
import { arrowMap, getVertex, circleVertex } from '@var/vertexMap'
import { sVal, sValH } from '@var/shiftValue'

let vertexRect   = [ 'tl', 'tm', 'tr', 'rm', 'br', 'bm', 'bl', 'lm' ],
	vertexCircle = [ 'tl', 'tr', 'br', 'bl' ]

import helper from './helper'

import './index.less'

let { abs, min, atan, PI } = Math

class Canvas extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selectMaskStatus: false,
			setectType: null,
			setectParame: null,
			initX: 0,
			initY: 0
		}
	}
	// 选中节点
	selelcNode = (e, node) => {
		this._helper = new helper(e, node, this)
	}
	// 渲染节点
	renderNode = () => {
		let { Config } = this.props,
			{ Nodes }  = Config

		let nodes = Object.values(Nodes).map((node, i) => {
			let shape = this[`render_${node.name}`],
				dom   = shape? shape(node, i): null
			return dom? <Fragment key={i}>{ dom }</Fragment>: null
		})
		return (
			<svg id="svgContent" width="100%" height="100%" overflow="hidden" xmlns="http://www.w3.org/2000/svg">
				<g style={{ pointerEvents: 'all' }} ref="svg_content">{ nodes }</g>
			</svg>
		)
	}
	// 创建圆
	render_circle = node => {
		let { id: _id } = this.state,
			{ id, layout } = node,
			{ cx, cy, rx, ry, rotate } = layout
		return (
			<ellipse
				ref={e => { if (id === _id) this.$CurNode = e }}
				cx={cx} cy={cy} rx={rx} ry={ry}
				fill="none"
				stroke="#000"
				strokeWidth="1.5"
				vectorEffect="non-scaling-stroke"
				strokeDasharray="none"
				transform={`rotate(${rotate} ${cx},${cy})`}
				onMouseDown={e => this.selelcNode(e, node)}
			></ellipse>
		)
	}
	// 创建矩形
	render_rect = node => {
		let { id: _id } = this.state,
			{ id, layout } = node,
			{ x, y, w, h, cx, cy, rotate } = layout
		return (
			<rect
				ref={e => { if (id === _id) this.$CurNode = e }}
				x={x}
				y={y}
				width={w}
				height={h}
				fill="none"
				stroke="#000"
				strokeWidth="1.5"
				strokeDasharray="none"
				vectorEffect="non-scaling-stroke"
				transform={`rotate(${rotate} ${cx},${cy})`}
				onMouseDown={e => this.selelcNode(e, node)}
			></rect>
		)
	}
	// 渲染选中辅助
	renderSelectedHelp = () => {
		let { Config }  = this.props,
			{ CurNode, Canvas } = Config
		if (!CurNode) return null
		let { layout }  = CurNode,
			{ x, y, w, h, cx, cy, rotate } = layout,
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
		this.setectPos = { tl, tm, tr, rm, br, bm, bl, lm }
		let vertex = getVertex(rotate)
		let circleHelp = this.renderHelpCircle()
		let rectHelp   = this.renderHelpRect(vertex)
		return (
			<g ref="svg_select" transform={t}>
				<path ref="help_path" fill="none" stroke="#4f80ff" shapeRendering="crispEdges" style={{ pointerEvents: 'none' }} d={d} onMouseDown={this.setMoveStart}></path>
				<g display="inline">
					<rect onMouseDown={this.setMoveStart} ref="move" width={w} height={h} fill="none" stroke="rgba(0,0,0,0)" x={x} y={y}></rect>
					{ circleHelp }
					{ rectHelp }
				</g>
			</g>
		)
					// <circle onMouseDown={e => this.setRotateStart(e, 'tl')} ref="rot_tl" className="selector-circle" fill="#000" r={sVal} stroke="#000" fillOpacity="0" strokeOpacity="0" strokeWidth="0" cx={tl.x - sValH} cy={tl.y - sValH}></circle>
					// <circle onMouseDown={e => this.setRotateStart(e, 'tr')} ref="rot_tr" className="selector-circle" fill="#000" r={sVal} stroke="#000" fillOpacity="0" strokeOpacity="0" strokeWidth="0" cx={tr.x + sValH} cy={tr.y - sValH}></circle>
					// <circle onMouseDown={e => this.setRotateStart(e, 'br')} ref="rot_br" className="selector-circle" fill="#000" r={sVal} stroke="#000" fillOpacity="0" strokeOpacity="0" strokeWidth="0" cx={br.x + sValH} cy={br.y + sValH}></circle>
					// <circle onMouseDown={e => this.setRotateStart(e, 'bl')} ref="rot_bl" className="selector-circle" fill="#000" r={sVal} stroke="#000" fillOpacity="0" strokeOpacity="0" strokeWidth="0" cx={bl.x - sValH} cy={bl.y + sValH}></circle>
					// <rect   onMouseDown={e => this.setScaleStart(e, 'tl')}  ref="res_tl" width={sVal} height={sVal} fill="#4F80FF" stroke="rgba(0,0,0,0)" style={{ cursor: arrowMap[vertex[0]] }} x={tl.x - sValH} y={tl.y - sValH}></rect>
					// <rect   onMouseDown={e => this.setScaleStart(e, 'tm')}  ref="res_tm" width={sVal} height={sVal} fill="#4F80FF" stroke="rgba(0,0,0,0)" style={{ cursor: arrowMap[vertex[1]] }} x={tm.x - sValH} y={tm.y - sValH}></rect>
					// <rect   onMouseDown={e => this.setScaleStart(e, 'tr')}  ref="res_tr" width={sVal} height={sVal} fill="#4F80FF" stroke="rgba(0,0,0,0)" style={{ cursor: arrowMap[vertex[2]] }} x={tr.x - sValH} y={tr.y - sValH}></rect>
					// <rect   onMouseDown={e => this.setScaleStart(e, 'rm')}  ref="res_rm" width={sVal} height={sVal} fill="#4F80FF" stroke="rgba(0,0,0,0)" style={{ cursor: arrowMap[vertex[3]] }} x={rm.x - sValH} y={rm.y - sValH}></rect>
					// <rect   onMouseDown={e => this.setScaleStart(e, 'br')}  ref="res_br" width={sVal} height={sVal} fill="#4F80FF" stroke="rgba(0,0,0,0)" style={{ cursor: arrowMap[vertex[4]] }} x={br.x - sValH} y={br.y - sValH}></rect>
					// <rect   onMouseDown={e => this.setScaleStart(e, 'bm')}  ref="res_bm" width={sVal} height={sVal} fill="#4F80FF" stroke="rgba(0,0,0,0)" style={{ cursor: arrowMap[vertex[5]] }} x={bm.x - sValH} y={bm.y - sValH}></rect>
					// <rect   onMouseDown={e => this.setScaleStart(e, 'bl')}  ref="res_bl" width={sVal} height={sVal} fill="#4F80FF" stroke="rgba(0,0,0,0)" style={{ cursor: arrowMap[vertex[6]] }} x={bl.x - sValH} y={bl.y - sValH}></rect>
					// <rect   onMouseDown={e => this.setScaleStart(e, 'lm')}  ref="res_lm" width={sVal} height={sVal} fill="#4F80FF" stroke="rgba(0,0,0,0)" style={{ cursor: arrowMap[vertex[7]] }} x={lm.x - sValH} y={lm.y - sValH}></rect>
	}
	renderHelpCircle = () => {
		let { setectPos } = this
		return vertexCircle.map((key, i) => {
			let node = setectPos[key],
				cv   = circleVertex[key]
			return (
				<circle
					key={i}
					onMouseDown={e => this.setRotateStart(e, key)}
					ref={`rot_${key}`}
					className="selector-circle"
					r={sVal}
					cx={node.x + sValH * cv.x}
					cy={node.y + sValH * cv.y}
				></circle>
			)
		})
	}
	renderHelpRect = vertex => {
		let { setectPos } = this
		return vertexRect.map((key, i) => {
			let node = setectPos[key]
			return (
				<rect
					key={i}
					onMouseDown={e => this.setScaleStart(e, key)}
					ref={`res_${key}`}
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
	setRotateStart = (e, type) => {
		this._helper.rotateStart(e, type)
	}
	// 设置缩放
	setScaleStart = (e, type) => {
		this._helper.scaleStart(e, type)
	}
	// 设置拖动
	setMoveStart = e => {
		this._helper.moveStart(e)
	}
	// 设置进行
	setMove = e => {
		this._helper.moveInit(e)
	}
	// 设置结束
	setEnd = e => {
		this._helper.endInit(e)
	}
	render() {
		let { width, height } = this.props.Config.Canvas,
			{ selectMaskStatus } = this.state
		let content  = this.renderNode(),
			selected = this.renderSelectedHelp(),
			style    = { width, height }
		return (
			<div className="editor-canvas">
				<div ref="area" className="ed-area" style={style}>
					<svg id="svgBox" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
						<svg id="svgContent" width="100%" height="100%" overflow="hidden" xmlns="http://www.w3.org/2000/svg">
							{ content }
						</svg>
						{ selected }
						<ellipse ref="help1" fill="#000" cx="0" cy="0" rx="5" ry="5"></ellipse>
					</svg>
				</div>
				{
					selectMaskStatus
					?
					<div className="e-mask" onMouseMove={this.setMove} onMouseUp={this.setEnd}></div>
					: null
				}
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
)(Canvas)