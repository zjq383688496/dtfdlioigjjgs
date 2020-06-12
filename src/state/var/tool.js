const tool = [
	{
		key:  'select',
		name: '选择',
		icon: '2D',
		activeFun() {
			let { type } = this.props.Config.Control
			return type === 'select'
		}
	},
	{
		key:  'route',
		name: '路径',
		icon: ''
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
		key:  'pen',
		name: '钢笔',
		icon: 'pen',
		activeFun() {
			let { type } = this.props.Config.Control
			return type === 'pen'
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