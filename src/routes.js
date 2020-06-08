import HOME   from '@pages/HOME'
import Editor from '@pages/Editor'

const routes = [
	{
		name: 'HOME',
		path: '/',
		exact: true,
		component: HOME,
	},
	{
		name: 'Editor',
		path: '/editor',
		exact: true,
		component: Editor,
		// fetchInitialData: () => video.list()
	},
]

export default routes