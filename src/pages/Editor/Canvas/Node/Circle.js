import React from 'react'

export default class CircleNode extends React.Component {
	render() {
		let { id, data, parent, mouseDownHandler } = this.props,
			{ cx, cy, rx, ry, rotate } = data.layout
		return (
			<ellipse
				ref={e => { if (data.id === id) parent.$CurNode = e }}
				cx={cx} cy={cy} rx={rx} ry={ry}
				fill="none"
				stroke="#000"
				strokeWidth="2"
				vectorEffect="non-scaling-stroke"
				strokeDasharray="none"
				transform={`rotate(${rotate} ${cx},${cy})`}
				onMouseDown={e => mouseDownHandler(e, data)}
			></ellipse>
		)
	}
}
