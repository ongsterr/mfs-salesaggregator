import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
	root: {},
	panel: {
		height: '90vh',
		margin: theme.spacing(1),
		backgroundColor: '#cccccc',
	},
	button: {
		marginBottom: theme.spacing(1),
		padding: theme.spacing(2),
	},
}))

const ButtonPanel = ({ buttonOneClick }) => {
	const classes = useStyles()

	return (
		<div className={classes.panel}>
			<Paper elevation={0}>
				<Button
					variant="outlined"
					fullWidth
					className={classes.button}
					onClick={buttonOneClick}
				>
					Run Sales Aggregator
				</Button>
				<Button variant="outlined" fullWidth className={classes.button}>
					Placeholder
				</Button>
				<Button variant="outlined" fullWidth className={classes.button}>
					Placeholder
				</Button>
			</Paper>
		</div>
	)
}

export default ButtonPanel
