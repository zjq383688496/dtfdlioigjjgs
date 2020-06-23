import React from 'react'

export default class RectNode extends React.Component {
	render() {
		let { id, data, parent, mouseDownHandler } = this.props,
			{ x, y, w, h, cx, cy, rotate } = data.layout
		return (
			<rect
				ref={e => { if (data.id === id) parent.$CurNode = e }}
				x={x}
				y={y}
				width={w}
				height={h}
				fill="none"
				stroke="#000"
				strokeWidth="2"
				strokeDasharray="none"
				vectorEffect="non-scaling-stroke"
				transform={`rotate(${rotate} ${cx},${cy})`}
				onMouseDown={e => mouseDownHandler(e, data)}
			></rect>
		)
	}
}
