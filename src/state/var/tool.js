const tool = [
	{
		key:  'select',
		name: '选择',
		icon: '2D',
		onActive() {
			let { type } = this.props.Config.Control
			return type === 'select'
		}
	},
	{
		key:  'rect',
		name: '矩形',
		icon: 'rect'
	},
	{
		key:  'circle',
		name: '圆',
		icon: 'circle'
	},
	{
		key:  'closePath',
		name: '闭合路径',
		icon: 'pen',
		onActive() {
			let { type } = this.props.Config.Control
			return type === 'closePath'
		}
	},
	{
		key:  'store',
		name: '收藏',
		icon: ''
	},
	{
		key:  'text',
		name: '文本',
		icon: ''
	},
]

export default tool