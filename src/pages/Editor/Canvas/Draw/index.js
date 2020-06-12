import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from 'actions'

import './index.less'

class Draw extends React.Component {
	constructor(props) {
		super(props)
	}
	onMouseDown = (e) => {
		let { actions } = this.props
		let { clientX, clientY, target } = e,
			{ top, left } = getOffset(target),
			initX = clientX - left,
			initY = clientY - top
		console.log(initX, initY)
		// actions.addNode('pen')
	}
	onMouseMove = () => {

	}
	onMouseUp = () => {

	}
	render() {
		let { type } = this.props.Config.Control
		if (type != 'pen') return null
		return (
			<div
				className="pen-area"
				onMouseDown={this.onMouseDown}
				onMouseMove={this.onMouseMove}
				onMouseUp={this.onMouseUp}
			>
				<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
					<g style={{ pointerEvents: 'all' }} ref="svg_content"></g>
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
)(Draw)