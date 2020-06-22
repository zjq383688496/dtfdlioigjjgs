var { random, round } = Math

/* window 扩展方法 */
module.exports = Object.assign(window, {
	// 获取真实数据类型
	getAttr(element) {
		return Object.prototype.toString.call(element).match(/[A-Z][a-z]*/)[0]
	},
	// 判断是否空对象
	isEmptyObject(obj) {
		try {
			return !Object.keys(obj).length
		} catch(e) {
			return false
		}
	},
	// 判断是否数组
	isNumber(num) {
		return typeof num === 'number'
	},
	// 深拷贝
	deepCopy(obj) {
		try {
			return JSON.parse(JSON.stringify(obj))
		} catch(e) {
			console.error(e)
			return obj
		}
	},
	// 对象是否相等
	objEqual(obj1, obj2) {
		try {
			return JSON.stringify(obj1) === JSON.stringify(obj2)
		} catch(e) {
			console.error(e)
			return false
		}
	},
	randomRange(num1 = 0, num2 = 100, digit = 3) {
		return round((num2 - num1) * random() + num1)
	},
	pad(num, digit = 3, space = '0') {
		var str    = new Array(digit).join(space) + space
		var numStr = `${str}${num}`.substr(-digit)
		return numStr
	},
	// 节流
	_throttle(action, delay = 160) {
		let last = 0
		return function() {
			var curr = +new Date()
			if (curr - last > delay) {
				action.apply(this, arguments)
				last = curr
			}
		}
	},
	// 防抖
	_debounce(action, delay = 160) {
		let timeout
		return e => {
			clearTimeout(timeout)
			e.persist && e.persist()
			timeout = setTimeout(() => {
				action(e)
			}, delay)
		}
	},

	// 创建遮罩层
	createMask() {
		window.removeMask()
		let mask = document.createElement('div')
		mask.className = 'help-mask'
		document.body.appendChild(mask)
		return mask
	},
	// 删除遮罩层
	removeMask() {
		let mk = document.querySelectorAll('.help-mask')
		if (!mk.length) return
		mk.forEach(m => document.body.removeChild(m))
	},
	// 获取元素的位置
	getOffset(element) {
		let top  = element.offsetTop,
			left = element.offsetLeft,
			cur  = element.offsetParent

		while (cur) {
			top  += cur.offsetTop
			left += cur.offsetLeft
			cur  = cur.offsetParent
		}

		return { top, left }
	}
})