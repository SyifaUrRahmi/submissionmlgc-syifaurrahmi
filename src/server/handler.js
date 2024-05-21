// const predictClassification = require("../services/inferenceService");
// const crypto = require("crypto");

// async function postPredictHandler(request, h) {
//   const { image } = request.payload;
//   const { model } = request.server.app;

//   const { label, suggestion } = await predictClassification(model, image);

//   const id = crypto.randomUUID();
//   const createdAt = new Date().toISOString();

//   const data = {
//     result: label,
//     createdAt: createdAt,
//     suggestion: suggestion,
//     id: id,
//   };

//   const response = h.response({
//     status: "success",
//     message: "Model is predicted successfully.",
//     data,
//   });
//   response.code(201);
//   return response;
// }

// module.exports = postPredictHandler;
const Boom = require("@hapi/boom");
const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");

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

    return {
      status: "success",
      message: "Model is predicted successfully",
      data: data,
    };
  } catch (error) {
    // Tangani kesalahan dari model prediksi atau kesalahan lainnya
    if (Boom.isBoom(error)) {
      // Jika kesalahan berasal dari Boom, langsung kembalikan respons error yang dibuat oleh Boom
      throw error;
    } else {
      // Jika kesalahan bukan berasal dari Boom, tangani dengan pesan kesalahan yang sesuai
      throw Boom.badRequest("Terjadi kesalahan dalam melakukan prediksi");
    }
  }
};

module.exports = postPredictHandler;
