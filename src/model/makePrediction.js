import model from "./main_model.onnx";

/**
 * Function: `minMaxRef`
 *
 * Description:
 * This function calculates the minimum and maximum value of different construction materials and the cost.
 * It returns an object `materials` containing the calculated minimum and maximum values of each material.
 *
 * Outputs:
 * An object `materials` containing the calculated minimum and maximum values of each material.
 * The object has the following structure:
 */

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
    highend: [],
  };

  const min = 200;
  const max = 2000;

  materials.cement.push(min * 0.4);
  materials.cement.push(max * 0.4);

  materials.sand.push(min * 0.816);
  materials.sand.push(max * 0.816);

  materials.gravel.push(min * 0.608);
  materials.gravel.push(max * 0.608);

  materials.steel.push(min * 4.0);
  materials.steel.push(max * 4.0);

  materials.paint.push(min * 0.18);
  materials.paint.push(max * 0.18);

  materials.bricks.push(min * 8);
  materials.bricks.push(max * 8);

  materials.flooring.push(min * 1.3);
  materials.flooring.push(max * 1.3);

  materials.rough.push((min / 10.764) * 23000);
  materials.rough.push((max / 10.764) * 23000);

  materials.standard.push((min / 10.764) * 30000);
  materials.standard.push((max / 10.764) * 30000);

  materials.highend.push((min / 10.764) * 40000);
  materials.highend.push((max / 10.764) * 40000);

  return materials;
};

/**
 * Function: `inverseTransform`
 *
 * Description:
 * This function performs an inverse transformation on a given value `y` based on a fitted array `fittedArr`. It first
 * calculates the minimum and maximum values of the `fittedArr` and then applies a reverse linear scaling operation on `y`
 * to obtain the corresponding original value.
 *
 * Inputs:
 * `fittedArr`: An array containing the fitted values.
 * `y`: The value to perform the inverse transformation on.
 *
 * Outputs:
 * The original value corresponding to the given `y` after performing the inverse transformation based on the
 * `fittedArr`.
 */

function inverseTransform(fittedArr, y) {
  const min = Math.min(...fittedArr);
  const max = Math.max(...fittedArr);

  return y * (max - min) + min;
}

/**
 * Function: `scaleUp`
 *
 * Description:
 * This function scales up a given value `val` to obtain the corresponding original values of different construction
 * materials such as cement, sand, gravel, steel, paint, bricks, and flooring and their cost rough, standard, highend.
 * It first calls the `minMaxRef()` function to obtain the minimum and maximum values of each material and then
 * performs an inverse transformation on `val` using the `inverseTransform()` function to obtain the corresponding
 * original values.
 *
 * Inputs:
 * `val`: The value to be scaled up. This is also the output sequence of the model.
 *
 * Outputs:
 * An object `output` containing the original values of each construction material corresponding to the given `val`.
 * The object has the following structure:
 */

function scaleUp(val) {
  const data = minMaxRef();

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
  };

  return output;
}

/**
 * Function: `makePrediction`
 *
 * Description:
 * This asynchronous function makes a prediction for a given input value `x` using a trained machine learning model
 * loaded in the `ort` object available in the `window` global object. It first creates an `InferenceSession` object
 * with the trained model and then prepares the input data by scaling it to a range of [0,1] using the formula
 * (x - 200) / (2000 - 200). It then creates a tensor from the input data and feeds it to the `InferenceSession` object
 * to obtain the predicted output. The predicted output is then scaled up to obtain the original values of different
 * construction materials and their cost using the `scaleUp()` function.
 *
 * Inputs:
 * `x`: The input value for which the prediction is to be made.
 *
 * Outputs:
 * A promise containing an object `output_s` representing the predicted original values of different construction
 * materials and its costs corresponding to the given `x`.
 */

const makePrediction = async (x) => {
  const ort = window.ort;
  const session = await ort.InferenceSession.create(model);
  const x_arr = new Array(8).fill((x - 200) / (2000 - 200));
  const x_tensor = new ort.Tensor("float32", x_arr, [1, 8]);
  const feeds = { actual_input: x_tensor };
  const results = await session.run(feeds);
  const output = results.output.data;
  const output_s = scaleUp(output[0]);

  return output_s;
};

export default makePrediction;
