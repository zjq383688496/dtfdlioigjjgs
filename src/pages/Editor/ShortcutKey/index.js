import React from 'react'

import { bindActionCreators } from 'redux'
import { connect }  from 'react-redux'
import * as actions from 'actions'

class ShortcutKey extends React.Component {
	constructor(props) {
		super(props)
		let pf = navigator.platform
		let os = 'win'
		if (/Mac\S+/.test(pf)) os = 'mac'
		// else if (/Win\S+/.test(pf)) os = 'win'
		this.state = {
			os,
			meta: false
		}
	}

	componentDidMount() {
		if (!this.state.os) return
		document.addEventListener('keydown',  this._handleKeyDown)
		document.addEventListener('keyup',    this._handleKeyUp)
		document.addEventListener('mouseout', this._handleKeyUp)
	}
	componentWillUnmount() {
		if (!this.state.os) return
		document.removeEventListener('keydown',  this._handleKeyDown)
		document.removeEventListener('keyup',    this._handleKeyUp)
		document.removeEventListener('mouseout', this._handleKeyUp)
	}
	_handleKeyDown = e => {
		let { meta, os } = this.state
		let key   = e.key.toLocaleLowerCase(),
			ctrl  = e.ctrlKey? 'ctrl_': '',
			comd  = meta? 'meta_': '',
			shift = e.shiftKey? 'shift_': '',
			str   = `key_${os === 'mac'? comd: ctrl}${shift}${key}`,
			Fn    = this[str]
		console.log(str)
		Fn && Fn(e)
	}
	_handleKeyUp = e => {
		let key = e.key.toLocaleLowerCase()
		if (key === 'meta') this.setState({ meta: false })
	}
	// OSX 下的command取代ctrl
	key_meta = e => {
		const { os } = this.state
		if (os != 'mac') return
		this.setState({ meta: true })
	}
	// 删除
	// key_delete = e => {
	// }
	// key_backspace = e => {
	// }

	render() {
		return null
	}
}

ShortcutKey.defaultProps = {}

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(actions, dispatch)
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ShortcutKey)