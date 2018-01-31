import Nav from '../components/Nav'
import PersistentDrawer from '../components/material/PersistentDrawer'

const MainLayout = (props) => (
	<div>
		<Nav />
		{props.children}
	</div>



)

export default MainLayout
