import React, { Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from 'actions'

import Selected from './Selected'
import DrawEdit from './DrawEdit'
import DrawAdd  from './DrawAdd'
import Circle   from './Node/Circle'
import Rect     from './Node/Rect'
import Path     from './Node/Path'

import Helper from './Helper'

import './index.less'

class Canvas extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selectMaskStatus: false,	// 选择遮罩状态
			editPathStatus: false,		// 编辑路径状态
			setectType:   null,
			setectParame: null,
			initX: 0,
			initY: 0,
			dbclick: {
				click: 0,
				x: 0,
				y: 0,
				start: 0
			}
		}
	}
	timeout_dbclick = null
	// 选中节点
	selectNode = (e, node) => {
		let { dbclick } = this.state
		if (node.name === 'path') this.dbclickTrigger(e, 'down')
		this._helper = new Helper(e, node, this)
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
	render_path = node => {
		let { id, editPathStatus } = this.state
		return (
			<Path
				parent={this}
				id={id}
				data={node}
				visible={!editPathStatus}
				mouseDownHandler={this.selectNode}
			/>
		)
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
		let { CurNode }  = this.props.Config
		if (!CurNode) return null

		if (CurNode.name === 'path') {
			this.dbclickTrigger(e, 'up', () => {
				this.setState({
					editPathStatus: true
				})
			})
		}
		this._helper.endInit(e)
	}
	// 双击初始化
	dbclickInit = e => {
		this.setState({ dbclick: { click: 0, x: 0, y: 0, start: 0 } })
	}
	dbclickTrigger = (e, type, cb) => {
		let { dbclick } = this.state,
			{ click, x, y, start } = dbclick,
			{ clientX, clientY } = e,
			now = Date.now()
		switch (type) {
			case 'down':
				if (!click) {
					this.timeout_dbclick = setTimeout(() => {
						clearTimeout(this.timeout_dbclick)
						this.dbclickInit()
					}, 600)
					dbclick.start = now
				}
				Object.assign(dbclick, {
					x: clientX,
					y: clientY
				})
				break
			case 'up':
				if (x === clientX || y === clientY) {
					Object.assign(dbclick, { click: click + 1 })
				}
				if (dbclick.click == 2) {
					clearTimeout(this.timeout_dbclick)
					this.dbclickInit()
					cb && cb()
					return
				}
				break
		}
		this.setState({ dbclick })
	}
	editPathClose = () => {
		this.setState({ editPathStatus: false })
	}
	render() {
		let { Canvas, Control } = this.props.Config,
			{ width, height } = Canvas,
			{ type } = Control,
			{ selectMaskStatus, editPathStatus } = this.state
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
						{
							!editPathStatus? selected: null
						}
						{
							/*<ellipse
								ref="hhh"
								title="辅助定位测试专用"
								cx={0} cy={0} rx={4} ry={4}
								fill="none"
								stroke="#000"
								strokeWidth="2"
								vectorEffect="non-scaling-stroke"
								strokeDasharray="none"
							></ellipse>*/
						}
					</svg>
					{
						type === 'closePath'? <DrawAdd />: null
					}
					{
						editPathStatus? <DrawEdit onFinish={this.editPathClose} />: null
					}
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