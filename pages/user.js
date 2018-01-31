import { bindActionCreators } from 'redux'
import withRedux from 'next-redux-wrapper'
import configureStore from '../store/configureStore'
import checkTangleUsers from '../actions/checkTangleUsers'
import fetchOffTangleUserList from '../actions/fetchOffTangleUserList'
import fetchClaims from '../actions/fetchClaims'
import createClaim from '../actions/createClaim'
import transformToQRCode from '../utils/transformToQRCode'
//import Layout from '../layouts/Main'
import Layout from '../layouts/material/Main'
import SimpleForm from '../components/SimpleForm'

const UserPage = (props) => {
	const { claims, user, createClaim, isLoading } = props
	const { pk, sk, id, claim, qrcode, } = user
	const handleSubmit = (values) => {
		const params = Object.assign({
			uuid: id,
			partA: '',
			partB: '',
			expDate: '',
			claimPic: '',
		}, values)
		createClaim(params)
	}
	return (
		<Layout isLoading={isLoading}>
			<h2>{claim.firstName}</h2>
			<img src={qrcode} alt="QRCode of id and public key"/>
			<div>
				<p>id: {id}</p>
				<p>public key: {pk}</p>
			</div>
			<div>
				<p>private key: {sk}</p>
			</div>
			<div>
				<h3>Claims about this user</h3>
				{claims.length === 0 && (
					<p>No Claims</p>
				)}
				{claims.length !== 0 && (
					<ul>
						{claims.map((c) => (
							<li key={`claim-${c}`}>
							claim: {c}
							</li>
						))}
					</ul>
				)}
			</div>
			<SimpleForm
				name="signClaim"
				handleSubmit={handleSubmit}
				meta={{
					inputs: [{
						name: 'msg',
						label: 'message',
					}],
					submit: {
						text: 'Sign & Attach'
					}
				}}
			/>
		</Layout>
	)
}

UserPage.getInitialProps = async (context) => {
	const { store } = context
	const { id } = context.query
	await store.dispatch(fetchOffTangleUserList())
	await store.dispatch(checkTangleUsers([{ id }]))
	await store.dispatch(fetchClaims(id))
	const { users } = store.getState()
	const { offTangleData, validData, claims } = users
	const validIds = validData.map(v => v.id)
	// TODO: Use selector to get better performance
	const userList = offTangleData.filter(d => validIds.indexOf(d.id) !== -1)
	const user = userList.find(u => u.id === id)
	const { pk } = user
	user.qrcode = await transformToQRCode(JSON.stringify({pk, id}))
	return {
		id,
		user,
		claims,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		createClaim: bindActionCreators(createClaim, dispatch)
	}
}

const mapStateToProps = (state, ownProps) => {
	const { user, claims } = ownProps
	const { isLoading } = state.users
	return { user, claims, isLoading}
}

export default withRedux(configureStore, mapStateToProps, mapDispatchToProps)(UserPage)
