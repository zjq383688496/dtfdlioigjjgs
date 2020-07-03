import React from 'react'
import './index.less'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from 'actions'

import tool from '@var/tool'

class Tool extends React.Component {
	constructor(props) {
		super(props)
	}

	ctrlSelect = key => {
		let ctrl = this[`ctrl_${key}`]
		ctrl && ctrl(key)
	}

	// 使用选择工具
	ctrl_select = key => {
		this.props.actions.changeControlType(key)
	}

	// 创建矩形
	ctrl_rect = key => {
		this.props.actions.addNode(key)
	}
	
	// 创建圆
	ctrl_circle = key => {
		this.props.actions.addNode(key)
	}

	// 使用闭合路径
	ctrl_closePath = key => {
		this.props.actions.changeControlType(key)
	}

	render() {
		return (
			<div className="editor-tools">
				{
					tool.map(({ key, name, icon, onActive }, i) => {
						let active = onActive? onActive.bind(this)(): false
						return (
							<a
								key={i}
								className={active? 's-active': ''}
								title={name}
								onClick={e => this.ctrlSelect(key)}
							>
								{
									icon
									?
									<img src={require(`assets/img/icon/${icon}.png`)} />
									: name
								}
							</a>
						)
					})
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
)(Tool)