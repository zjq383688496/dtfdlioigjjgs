const shiftMap = {
	// OK
	tl: {
		rel: 'br',	// 相对key
		dx:  -1,	// X轴缩放倍率
		dy:  -1,	// Y轴缩放倍率
		_sx: 0,		// X轴缩放偏移倍率
		_sy: 0,		// Y轴缩放偏移倍率
		_x:  true,	// X轴是否偏移
		_y:  true,	// Y轴是否偏移
	},
	// OK
	tm: {
		rel: 'bm',
		dx:  0,
		dy:  -1,
		_sx: 0,
		_sy: 0,
		_y:  true,
	},
	// OK
	tr: {
		rel: 'bl',
		dx:  1,
		dy:  -1,
		_sx: -1,
		_sy: 0,
		_x:  true,
		_y:  true,
	},
	// OK
	rm: {
		rel: 'lm',
		dx:  1,
		dy:  0,
		_sx: -1,
		_sy: 0,
		_x:  true,
	},
	// OK
	br: {
		rel: 'tl',
		dx:  1,
		dy:  1,
		_sx: -1,
		_sy: -1,
		_x:  true,
		_y:  true,
	},
	// OK
	bm: {
		rel: 'tm',
		dx:  0,
		dy:  1,
		_sx: 0,
		_sy: -1,
		_y:  true,
	},
	// OK
	bl: {
		rel: 'tr',
		dx:  -1,
		dy:  1,
		_sx: 0,
		_sy: -1,
		_x:  true,
		_y:  true,
	},
	// OK
	lm: {
		rel: 'rm',
		dx:  -1,
		dy:  0,
		_sx: 0,
		_sy: 0,
		_x:  true,
	},
}
export default shiftMap