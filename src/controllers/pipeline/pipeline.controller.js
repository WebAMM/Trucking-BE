//Model
const FacilityContact = require("../../models/FacilityContact.model");
const Pipeline = require("../../models/Pipeline.model");
//Responses and errors
const {
  error500,
  error409,
  error404,
  customError,
} = require("../../services/helpers/errors");
const { status200, success } = require("../../services/helpers/response");

// Create pipeline
const createPipeline = async (req, res, next) => {
  try {
    const user = req.user;
    const { name } = req.body

    await Pipeline.create({
      name: name,
      userId: user._id
    });

    return status200(res, "Pipeline created successfully");
  } catch (err) {
    return next(err);
  }
};

const allPipelines = async (req, res, next) => {
  try {
    const user = req.user;

    let data = await FacilityContact.find({ userId: user._id })
      .select("name email phoneNo status savedFacilityId pipelineId")
      .populate({
        path: "pipelineId",
        select: "_id name"
      })
      .populate({
        path: "savedFacilityId",
        select: "facilityId",
        populate: {
          path: "facilityId",
          select: "name"
        }
      });


    let groupedData = data.reduce((acc, contact) => {
      if (!acc[contact.pipelineId._id]) {
        acc[contact.pipelineId._id] = {
          pipelineId: contact.pipelineId._id,
          pipelineName: contact.pipelineId.name,
          contacts: []
        };
      }

      acc[contact.pipelineId._id].contacts.push({
        _id: contact._id,
        name: contact.name,
        email: contact.email,
        phoneNo: contact.phoneNo,
        status: contact.status,
        savedFacilityId: contact.savedFacilityId,
        facilityIdName: contact.savedFacilityId?.facilityId?.name,
      });

      return acc;
    }, {});

    groupedData = Object.values(groupedData);

    return success(res, 200, "All pipelines fetched successfully.", groupedData);


  } catch (err) {
    return next(err);
  }
};

const dragContact = async (req, res, next) => {
  try {
    const user = req.user;
    const { pipelineId } = req.body
    const { id } = req.params

    let pipeline = await Pipeline.findById(pipelineId)
    if (!pipeline) {
      return error404(res, "Pipeline not found");
    }

    let contact = await FacilityContact.findById(id)
    if (!contact) {
      return error404(res, "Contact not found");
    }

    await FacilityContact.findByIdAndUpdate(id, { pipelineId }, { new: true });

    return status200(res, `Contact successfully added to pipeline ${pipeline?.name}`);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createPipeline,
  allPipelines,
  dragContact
};
