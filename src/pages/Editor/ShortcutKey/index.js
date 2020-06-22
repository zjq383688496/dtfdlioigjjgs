import React from 'react'

import { bindActionCreators } from 'redux'
import { connect }  from 'react-redux'
import * as actions from 'actions'

var downFilter = {
	alt:     1,
	control: 1,
	ctrl:    1,
	meta:    1,
	shift:   1
}

class ShortcutKey extends React.Component {
	constructor(props) {
		super(props)
		let pf = navigator.platform
		let os = 'win'
		if (/Mac\S+/.test(pf)) os = 'mac'
		// else if (/Win\S+/.test(pf)) os = 'win'
		this.state = {
			os,
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
	keyCompose(e, meta, type) {
		let { ctrlKey, altKey, shiftKey } = e,
			keys = ['key'],
			key  = e.key.toLocaleLowerCase()
		if (key === 'control') key = 'ctrl'
		if (ctrlKey)  keys.push('ctrl')
		// if (meta)     keys.push('meta')
		if (altKey)   keys.push('alt')
		if (shiftKey) keys.push('shift')
		if (key) {
			if (type === 'down' && !downFilter[key]) keys.push(key)
			if (type === 'up') keys = keys.filter(_ => _ != key)
		}
		return keys.length > 1? keys.join('_'): ''
	}
	_handleKeyDown = e => {
		let { actions } = this.props
		let { meta } = this.state
		let key = this.keyCompose(e, meta, 'down')
			// Fn  = this[key]
		actions.changeShortcutKey({ key, type: 'down' })
		// console.log('keydown', key)
		// Fn && Fn(e)
	}
	_handleKeyUp = e => {
		if (!e.key) return
		let { actions } = this.props
		let key = this.keyCompose(e, undefined, 'up')
		actions.changeShortcutKey({ key, type: 'up' })
		// console.log('keyup', key)
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