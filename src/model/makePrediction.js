import model from './main_model.onnx'

const minMaxRef = () => {
	const materials = {
		cement: [],
		sand: [],
		gravel: [],
		steel: [],
		paint: [],
		bricks: [],
		flooring: [],
		rough: [],
		standard: [],
		highend: []
	}

	const min = 200
	const max = 2000

	materials.cement.push(min * 0.4)
	materials.cement.push(max * 0.4)

	materials.sand.push(min * 0.816)
	materials.sand.push(max * 0.816)

	materials.gravel.push(min * 0.608)
	materials.gravel.push(max * 0.608)

	materials.steel.push(min * 4.0)
	materials.steel.push(max * 4.0)

	materials.paint.push(min * 0.18)
	materials.paint.push(max * 0.18)

	materials.bricks.push(min * 8)
	materials.bricks.push(max * 8)

	materials.flooring.push(min * 1.3)
	materials.flooring.push(max * 1.3)

	materials.rough.push((min / 10.764) * 23000)
	materials.rough.push((max / 10.764) * 23000)

	materials.standard.push((min / 10.764) * 30000)
	materials.standard.push((max / 10.764) * 30000)

	materials.highend.push((min / 10.764) * 40000)
	materials.highend.push((max / 10.764) * 40000)

	return materials
}

function inverseTransform(fittedArr, y) {
	const min = Math.min(...fittedArr)
	const max = Math.max(...fittedArr)

	return y * (max - min) + min
}

function scaleUp(val) {
	const data = minMaxRef()

	const output = {
		cement: inverseTransform(data.cement, val),
		sand: inverseTransform(data.sand, val),
		gravel: inverseTransform(data.gravel, val),
		steel: inverseTransform(data.steel, val),
		paint: inverseTransform(data.paint, val),
		bricks: inverseTransform(data.bricks, val),
		flooring: inverseTransform(data.flooring, val),
		rough: inverseTransform(data.rough, val),
		standard: inverseTransform(data.standard, val),
		highend: inverseTransform(data.highend, val),
	}

	return output
}

const makePrediction = async (x) => {
	const ort = window.ort
	const session = await ort.InferenceSession.create(model)
	const x_arr = new Array(8).fill((x - 200) / (2000 - 200))
	const x_tensor = new ort.Tensor('float32', x_arr, [1, 8])
	const feeds = { actual_input: x_tensor }
	const results = await session.run(feeds)
	const output = results.output.data
	const output_s = scaleUp(output[0])

	return output_s
}

export default makePrediction;