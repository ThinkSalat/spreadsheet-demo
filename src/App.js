import React, { useState } from 'react';
import { cloneDeep } from 'lodash';
import './App.css';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';

function isValidEmail (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function App() {

	const data = [
		[
			{ value: 'First Name', disableEvents: true, isValid: true  },
			{ value: 'Last Name', disableEvents: true, isValid: true  },
			{ value: 'Email', disableEvents: true, isValid: true  },
		],
		[{}, {}, {}]
	]

	const [grid, setGrid] = useState(data)
	const [containsErrors, setContainsErrors] = useState(false)

	const validate = (value, type) => {
		if (type === 'name') return !!value
		if (type === 'email') return isValidEmail(value)
	}

	const renderCell = cell => {
		console.count('rendering cell')
		const { value, isValid = true } = cell
		const color = isValid ? 'black' : 'red'
		const style = {
			color

		}
		return <div style={style}>{value}{!isValid && '*'}</div>
	}

	// on cell deselect, validate contents
	const handleChange = changes => {
		const gridCopy = cloneDeep(grid)
		changes.forEach( ({ cell, row, col, value }) => {
			const type = col < 2 ? 'name' : 'email'
			const isValid = validate(value, type)
			if (!isValid) setContainsErrors(true)
			gridCopy[row][col] = {...grid[row][col], value, isValid }
		})
		setGrid(gridCopy)
	}
	
	
	console.log('rendering')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5vh' }}>
			<h2>Please enter the names and emails of your clinicians below</h2>
			<div>Please note, only valid entries will be saved.</div>
			{containsErrors && <div>Please correct any errors. </div>}
				{containsErrors &&	<div>valid emails can look like "email_email+email123@email.com"</div>}
			<ReactDataSheet
				data={grid}
				valueRenderer={renderCell}
				onCellsChanged={handleChange}
			/>
    </div>
  );
}

export default App;
