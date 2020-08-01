import React from 'react'

import Container from '@material-ui/core/Container'

import Header from '../components/Header'
// import Footer from '../components/Footer'

const Layout = (props) => {
	const { businessName } = props

	return (
		<Container maxWidth="lg">
			<Header businessName={businessName} />
			<div>{props.children}</div>
			{/* <Footer /> */}
		</Container>
	)
}

export default Layout
