import React, { useState } from 'react';
import { cloneDeep } from 'lodash';
import './App.css';
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';

function isValidEmail (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function App() {

	const data = [
		// [
		// 	{ value: 'First Name', disableEvents: true, isValid: true  },
		// 	{ value: 'Last Name', disableEvents: true, isValid: true  },
		// 	{ value: 'Email', disableEvents: true, isValid: true  },
		// ],
		[{value: 'edit one of these'}, {value: 'edit one of these'}, {value: 'edit one of these'}]
	]

	const [grid, setGrid] = useState(data)
	const [containsErrors, setContainsErrors] = useState(false)

	const validate = (value, type) => {
		if (type === 'name') return !!value
		if (type === 'email') return isValidEmail(value)
	}

	const renderCell = cell => {
		console.count('rendering cell')
		if (true) return <div>{cell.value}</div>
	}

	// on cell deselect, validate contents
	const handleChange = changes => {
		const gridCopy = cloneDeep(grid)
		changes.forEach( ({ cell, row, col, value }) => {
			// const type = col < 2 ? 'name' : 'email'
			// const isValid = validate(value, type)
			// if (!isValid) setContainsErrors(true)
			gridCopy[row][col] = {...grid[row][col], value: value.trim() }
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

class App2 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      grid: [
        [{value:  1}, {value:  3}],
        [{value:  2}, {value:  4}]
      ]
    }
  }
  render () {
    return (
      <ReactDataSheet
        data={this.state.grid}
        valueRenderer={(cell) => {
					console.log('rendering')
					if (true) return cell.value
				}}
        onCellsChanged={changes => {
          const grid = this.state.grid.map(row => [...row])
          changes.forEach(({cell, row, col, value}) => {
            grid[row][col] = {...grid[row][col], value}
          })
          this.setState({grid})
        }}
      />
    )
  }
}

export default App
