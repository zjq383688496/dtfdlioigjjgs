import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from 'actions'

import Tool      from './Tool'
import Quick     from './Quick'
import Canvas    from './Canvas'
import Attribute from './Attribute'

import './index.less'

class Editor extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<div className="editor">
				<div className="editor-t">
					<Quick/>
				</div>
				<div className="editor-c">
					<div className="editor-c-l">
						<Tool/>
					</div>
					<div className="editor-c-c">
						<Canvas/>
					</div>
					<div className="editor-c-r">
						<Attribute/>
					</div>
				</div>
				<div className="editor-b"></div>
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
)(Editor)