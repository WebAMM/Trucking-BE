const router = require("express").Router();
//controllers
const pipelineController = require("../controllers/pipeline/pipeline.controller");
//middlewares
const { verifyToken } = require("../middlewares/auth.middleware");
const { validateCreatePipeline } = require("../middlewares/pipelineValidator");

//Create pipeline
router.post("/create", verifyToken, validateCreatePipeline, pipelineController.createPipeline);

//Get All pipeline
router.get("/all", verifyToken, pipelineController.allPipelines);

//Get All pipeline, id is contact id
router.patch("/drag/:id", verifyToken, pipelineController.dragContact);

module.exports = router;
