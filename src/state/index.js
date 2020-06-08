module.exports = {
	CurNode:   null,	// 当前节点
	// 菜单信息
	Menu: {
		type:  '',		// 类型
		state: false,	// 是否显示
		pageX: 0,		// 鼠标坐标X轴
		pageY: 0,		// 鼠标坐标Y轴
	},
	// 节点信息
	NodeInfo: {
		Max: 0,
	},
	// 节点
	Nodes: {},
	// 画板
	Canvas: {
		width:  960,
		height: 540,
		// height: 360,
	},
}