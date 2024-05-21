const Boom = require("@hapi/boom");
const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");

const postPredictHandler = async (request, h) => {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    // Validasi ukuran gambar
    if (image.bytes > 1000000) {
      throw Boom.badRequest(
        "Payload content length greater than maximum allowed: 1000000"
      );
    }

    const { label, suggestion } = await predictClassification(model, image);

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      result: label,
      createdAt: createdAt,
      suggestion: suggestion,
      id: id,
    };

    await storeData(id, data);
    return {
      status: "success",
      message: "Model is predicted successfully",
      data: data,
    };
  } catch (error) {
    if (Boom.isBoom(error)) {
      throw error;
    } else {
      throw Boom.badRequest("Terjadi kesalahan dalam melakukan prediksi");
    }
  }
};

module.exports = postPredictHandler;
