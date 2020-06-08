import * as types from '../constants'
import state from '@state'
import nodes from '@node'

var initialState = state
var { max, round } = Math

export default function business(state = initialState, action) {
	let {
		_this,
		node_id,
		node_key,
		node_data,
	} = action
	let {
		Canvas,
		CurNode,
		Nodes,
		NodeInfo
	} = state,
	{ Max } = NodeInfo
	switch (action.type) {
		case types.ADD_NODE:
			let node = nodes[node_key]
			if (!node) return ReduxUpdate()
			positionReset.init(node, Canvas)
			createId(node)
			return ReduxUpdate({ Nodes })

		case types.UPDATE_NODE:
			let { id } = node_data
			Nodes[id]  = node_data
			return ReduxUpdate({ Nodes })

		case types.SELECT_NODE:
			CurNode = Nodes[node_id] || null
			// if (!CurNode) return ReduxUpdate()
			return ReduxUpdate({ CurNode })

		default:
			return ReduxUpdate()
	}
	function ReduxUpdate(o = {}) {
		let newState = Object.assign({}, state, o)
		// window.__Redux__.Config = newState
		// autoSave(newState)
		return newState
	}
	function createId(node) {
		let id = ++NodeInfo.Max
		Nodes[id] = Object.assign({ id }, deepCopy(node))
	}
}


function autoSave(o) {
	var newData = Object.assign({}, { ...o })
	newData.Self       = null
	newData.CurPane    = null
	newData.CurModular = null
	newData.CurNode    = null
	localStorage.setItem('temporaryData', JSON.stringify(newData))
}
// function getSave() {
// 	var data = localStorage.getItem('temporaryData')
// 	return data? JSON.parse(data): null
// }

var positionReset = {
	init(node, canvas) {
		let reset = this[`reset_${node.name}`]
		if (reset) reset(node, canvas)
	},
	reset_rect({ layout }, { width, height }) {
		let { w, h } = layout,
			x  = width  / 2 - w / 2,
			y  = height / 2 - h / 2,
			// x = 0,
			// y = 0,
			cx = x + w / 2,
			cy = y + h / 2
		Object.assign(layout, { cx, cy, x, y })
	},
	reset_circle({ layout }, { width, height }) {
		let { rx, ry } = layout,
			cx = width  / 2,
			cy = height / 2,
			x  = cx - rx,
			y  = cy - ry,
			w  = rx * 2,
			h  = ry * 2
		Object.assign(layout, { cx, cy, w, h, x, y })
	}
}