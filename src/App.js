import React from 'react'
import { Switch, Route } from 'react-router-dom'

import routes from './routes'

import '@utils'
import 'assets/common.less'

export default class App extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<Switch>
				{
					routes.map(({ name, path, exact, component: Component, ...rest }) => (
						<Route key={path} path={path} exact={exact} render={props => <Component {...props} {...rest} />} />
					))
				}
			</Switch>
		)
	}
}