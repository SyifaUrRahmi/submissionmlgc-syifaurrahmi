const tf = require("@tensorflow/tfjs-node");

async function predictClassification(model, image) {
  const tensor = tf.node
    .decodeJpeg(image)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat();

  const prediction = model.predict(tensor);
  const score = await prediction.data();

  const classes = ["Non-cancer", "Cancer"];

  const classResult = score[0] > 0.5 ? 1 : 0;
  const label = classes[classResult];

  const suggestions = {
    Cancer: "Segera periksa ke dokter!",
    "Non-cancer": "Anda sehat!",
  };

  const suggestion = suggestions[label];

  return { label, suggestion };
}
module.exports = predictClassification;
