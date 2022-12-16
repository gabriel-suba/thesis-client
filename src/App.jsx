import { useState, useEffect } from 'react'
import makePrediction from './model/makePrediction'
import './App.css'

function App() {
  const [inputs, setInputs] = useState({ area: 1000, finish: "1" })
  const [outputs, setOutputs] = useState({
    cement: 0,
    sand: 0,
    gravel: 0,
    steel: 0,
    paint: 0,
    bricks: 0,
    flooring: 0,
    cost: 0,
  })

  const renderCost = (val, type) => {
    let totalCost = 0;

    switch(type) {
      case "1": 
        totalCost = val.rough.toFixed(2);
        break;
      case "2":
        totalCost = val.standard.toFixed(2);
        break;
      case "3":
        totalCost = val.highend.toFixed(2);
        break;
      default:
        totalCost = val.rough.toFixed(2);
        break;
      }

      return totalCost;
  }

  const fetchPredicted = async (area) => {
    const result = await makePrediction(area)

    setOutputs({
      cement: result.cement.toFixed(2),
      sand: result.sand.toFixed(2),
      gravel: result.gravel.toFixed(2),
      steel: result.steel.toFixed(2),
      paint: result.paint.toFixed(2), 
      bricks: result.bricks.toFixed(2),
      flooring: result.flooring.toFixed(2),
      cost: renderCost(result, inputs.finish)
    })
  }

  useEffect(() => {
    fetchPredicted(1000)
  }, [])

  const handleChange = (e) => {
    const { target: { value, name } } = e

    if (name === 'area') setInputs(prev => ({ ...prev, [name]: value }))
    if (name === 'finish') setInputs(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    fetchPredicted(inputs.area)
  }

  return (
    <div className="App">
      <main className="main container">
      <form onSubmit={handleSubmit} className="form flex-1">
          <div className="form__group">
            <label className="form__label fw-300 text-gray" htmlFor="area">Built-up Area</label>
            <div className="input__wrapper">
              <input onChange={handleChange} value={inputs.area} className="flex-2" type="number" id="area" name="area" required />
              <span className="flex-1 text-center">ft&#178;</span>
            </div>
          </div>
          <div className="form__group">
            <h4 className="form__label fw-300 text-gray">Type of Finish</h4>
            <div className="radio__wrapper text-center">
              <input onChange={handleChange} type="radio" name="finish" id="rough" value="1" checked={inputs.finish === "1"} />
              <label htmlFor="rough">Rough Finish</label>
            </div>
            <div className="radio__wrapper text-center">
              <input onChange={handleChange} type="radio" name="finish" id="standard" value="2" />
              <label htmlFor="standard">Standard Finish</label>
            </div>
            <div className="radio__wrapper text-center">
              <input onChange={handleChange} type="radio" name="finish" id="highend" value="3" />
              <label htmlFor="highend">High-end Finish</label>
            </div>
          </div>
          <div className="button__wrapper">
            <button type="submit" className="btn submit">Submit</button>
            <button onClick={() => setInputs({ area: 0, finish: "1" })} type="button" className="btn reset">Reset</button>
          </div>
      </form>
      <div className="output flex-2">
        <div className="output__materials">
          <h2 className="form__label fw-300 text-gray">Quantity of materials needed for the project</h2>
          <div className="materials__table">
            <div className="table__col">
              <h4>Cement</h4>
              <h4>Sand</h4>
              <h4>Gravel</h4>
              <h4>Steel</h4>
              <h4>Paint</h4>
              <h4>Bricks</h4>
              <h4>Flooring</h4>
            </div>
            <div className="table__col">
              <h4>{parseFloat(outputs.cement).toLocaleString('en-us')} bags</h4>
              <h4>{parseFloat(outputs.sand).toLocaleString('en-us')} ton</h4>
              <h4>{parseFloat(outputs.gravel).toLocaleString('en-us')} ton</h4>
              <h4>{parseFloat(outputs.steel / 1000).toLocaleString('en-us')} ton</h4>
              <h4>{parseFloat(outputs.paint).toLocaleString('en-us')} lt</h4>
              <h4>{parseFloat(outputs.bricks).toLocaleString('en-us')} pcs</h4>
              <h4>{parseFloat(outputs.flooring).toLocaleString('en-us')} ft&#178;</h4>
            </div>
          </div>
        </div>
        <div className="output__cost">
          <h2 className="form__label fw-300 text-gray">Estimated cost of construction</h2>
          <h4>&#8369; {parseFloat(outputs.cost).toLocaleString('en-us')}</h4>
        </div>
      </div>
      </main>
    </div>
  )
}

export default App
