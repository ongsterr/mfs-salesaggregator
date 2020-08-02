import React from 'react'

import Layout from './hoc/Layout'
import ButtonPanel from './components/ButtonPanel'
import { headerMetadata } from './config/Metadata'

import platformSalesAggregator from './functions/sales-aggregator'

function App() {
	return (
		<div className="App">
			<Layout businessName={headerMetadata.name}>
				<ButtonPanel buttonOneClick={platformSalesAggregator} />
			</Layout>
		</div>
	)
}

export default App
