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

	ctrl_rect = key => {
		this.props.actions.addNode(key)
	}
	
	ctrl_circle = key => {
		this.props.actions.addNode(key)
	}

	render() {
		return (
			<div className="editor-tool">
				{
					tool.map(({ key, name }, i) => <a key={i} title={name} onClick={e => this.ctrlSelect(key)}>{name}</a>)
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