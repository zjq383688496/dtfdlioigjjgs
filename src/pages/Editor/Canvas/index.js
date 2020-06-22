import React, { Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from 'actions'

import Selected from './Selected'
import Draw     from './Draw'
import Circle   from './Node/Circle'
import Rect     from './Node/Rect'

import helper from './helper'

import './index.less'

class Canvas extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selectMaskStatus: false,
			setectType:   null,
			setectParame: null,
			initX: 0,
			initY: 0
		}
	}
	// 选中节点
	selectNode = (e, node) => {
		this._helper = new helper(e, node, this)
	}
	cancelSelect = () => {
		let { actions } = this.props
		this._helper  = null
		this.$CurNode = null
		actions.selectNode(null)
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
			<g style={{ pointerEvents: 'all' }} ref="svg_content">{ nodes }</g>
		)
	}
	// 创建圆
	render_circle = node => {
		let { id } = this.state
		return (
			<Circle
				parent={this}
				id={id}
				data={node}
				mouseDownHandler={this.selectNode}
			/>
		)
	}
	// 创建矩形
	render_rect = node => {
		let { id } = this.state
		return (
			<Rect
				parent={this}
				id={id}
				data={node}
				mouseDownHandler={this.selectNode}
			/>
		)
	}
	// 创建路径
	render_pen = node => {
		let { id } = this.state
		return null
	}
	// 渲染选中辅助
	renderSelectedHelp = () => {
		let { Config }  = this.props,
			{ CurNode, Canvas } = Config
		if (!CurNode) return null
		return <Selected parent={this}/>
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
			<div className="editor-canvas" onMouseDown={this.cancelSelect}>
				<div ref="area" className="ed-area" style={style}>
					<svg id="svgBox" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
						<svg id="svgContent" width="100%" height="100%" overflow="hidden" xmlns="http://www.w3.org/2000/svg">
							{ content }
						</svg>
						{ selected }
					</svg>
					<Draw />
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