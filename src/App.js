import React, { useState, useEffect } from 'react';
import { cloneDeep, filter, isUndefined, isNull } from 'lodash';
import './App.css';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';

function isValidEmail (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
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

	useEffect(() => {
		for (let row of grid) {
			for (let cell of row) {
				if (cell.isValid === false) {
					setContainsErrors(true)
					return () => {}
				}
			}
		}
		setContainsErrors(false)
	}, [grid])
	
	const addRow = () => {
		const gridCopy = cloneDeep(grid)
		gridCopy.push([{}, {}, {}])
		setGrid(gridCopy)
	}

	const validate = (value, type) => {
		if (type === 'name') return !!value
		if (type === 'email') return isValidEmail(value)
	}

	const renderCell = cell => {
		return cell.value
	}

	// on cell deselect, validate contents
	const handleChange = (changes, additions = []) => {
		let gridCopy = cloneDeep(grid)
		changes.forEach( ({ cell, row, col, value }) => {
			const type = col < 2 ? 'name' : 'email'
			const isValid = validate(value, type)
			if (!isValid) setContainsErrors(true)
			gridCopy[row][col] = {...grid[row][col], value: value.trim(), isValid }
		})
		
		additions.forEach( ({ row, col, value }) => {
			// const adjustedRow = row + 1
			const type = col < 2 ? 'name' : 'email'
			const isValid = validate(value, type)
			if (!isValid) setContainsErrors(true)
			if (!gridCopy[row]) gridCopy[row] = []
			gridCopy[row].push({ value: value.trim(), isValid })
		})

		setGrid(gridCopy)
	}

	const valueViewer = cell => {
		const { value, cell: { isValid = true }} = cell
		const isEmpty = !value
		const color = isValid ? 'black' : 'red'
		const style = { color }
		if (isEmpty && !isValid) style.backgroundColor = 'pink'
		return <div style={style}>{value}{!isValid && '*'}</div>
	}
	
	const parsePaste = string => {
		const parsed = filter(string.split(/\r\n|\n|\r/)
		.map((row) => filter(row.split('\t'))))

		const newRows = parsed.map( row => {
			const newRow = row.map( (value, col) => {
				const type = col < 2 ? 'name' : 'email'
				const isValid = validate(value, type)
				if (!isValid) setContainsErrors(true)
				return { value, isValid }
			})
			const { length } = newRow
			const numBlanksToAdd = 3 - length
			if (numBlanksToAdd > 0) {
				for (let i = 0; i < numBlanksToAdd; i++) {
					newRow.push({ value: '', isValid: false })
				}
			}
			return newRow
		})

		// this auto deletes empty rows - better to just let them do it themselves and not add empty rows when submitting
		// const gridCopy = grid.reduce( (newGrid, row) => {
		// 	if (row.every( ({ value }) => value)) newGrid.push(row)
		// 	return newGrid
		// }, [])
		setGrid(grid.concat(newRows))
	}


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5vh' }}>
			<h2>Please enter the names and emails of your clinicians below</h2>
			<div>Please note, only valid entries will be saved.</div>
			{containsErrors && <div>Please correct any errors. </div>}
			{containsErrors &&	<div>valid emails can look like "email_email+email123@email.com"</div>}
			{!containsErrors && <div>Congrats, there are no errors currently</div>}
			<button onClick={addRow}>+ Clinician</button>


			{/* DataSheet Component */}
			<div style={{ marginTop: 25 }}>
				<ReactDataSheet
					data={grid}
					valueRenderer={renderCell}
					onCellsChanged={handleChange}
					attributesRenderer={(cell) => ({'data-hint': cell.hint || {}}) }
					valueViewer={valueViewer}
					parsePaste={parsePaste}
				/>
			</div>


    </div>
  );
}

export default App
