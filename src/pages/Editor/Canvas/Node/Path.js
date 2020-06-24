import React from 'react'

import { mergePos } from '../utils'

export default class PathNode extends React.Component {
	// 生成路径
	genPath(path) {
		let { start, center, end } = path,
			startStr  = '',
			centerStr = '',
			endStr    = ''
		if (start) {
			let { c, n } = start
			startStr = mergePos(c) + ' C' + mergePos(n)
		}
		if (center && center.length) {
			centerStr = center.map(({ p, c, n }, i) => {
				return mergePos(p) + ' ' + mergePos(c) + ' ' + mergePos(n)
			}).join(' ')
		}
		if (end) {
			let { p, c } = end
			endStr = mergePos(p) + ' ' + mergePos(c)
		}
		return 'M' + [ startStr, centerStr, endStr ].join(' ') + 'z'
	}
	render() {
		let { id, data, parent, mouseDownHandler } = this.props,
			{ layout, path }   = data,
			{ cx, cy, rotate } = layout,
			d = this.genPath(path)
		return (
			<path
				ref={e => { if (data.id === id) parent.$CurNode = e }}
				d={d}
				fill="none"
				stroke="#000"
				strokeWidth="2"
				vectorEffect="non-scaling-stroke"
				strokeDasharray="none"
				transform={`rotate(${rotate} ${cx},${cy})`}
				onMouseDown={e => mouseDownHandler(e, data)}
			></path>
		)
	}
}