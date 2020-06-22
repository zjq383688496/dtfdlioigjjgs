'use strict';

import * as types from '../constants'

// 添加节点
export const addNode = node_key => ({
	type: types.ADD_NODE,
	node_key
})

// 选择节点
export const selectNode = node_id => ({
	type: types.SELECT_NODE,
	node_id
})

// 更新节点
export const updateNode = node_data => ({
	type: types.UPDATE_NODE,
	node_data
})

// 切换操作状态
export const changeControlType = control_type => ({
	type: types.CHANGE_CONTORL_TYPE,
	control_type
})

// 更新快捷键
export const changeShortcutKey = shortcut_key => ({
	type: types.CHANGE_SHORTCUT_KEY,
	shortcut_key
})


export const nodeDisconnect = node_disconnect => ({
	type: types.NODE_DISCONTENT,
	node_disconnect
})
