import React from 'react'

import Layout from './hoc/Layout'
import ButtonPanel from './components/ButtonPanel'
import { headerMetadata } from './config/Metadata'

function App() {
	return (
		<div className="App">
			<Layout businessName={headerMetadata.name}>
				<ButtonPanel />
			</Layout>
		</div>
	)
}

export default App
