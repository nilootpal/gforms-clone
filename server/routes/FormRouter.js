const router = require('express').Router();
const {
    formsGet,
    createForm,
    getFormById,
    deleteForm,
    editForm,
    getAllFormsOfUser,
    submitResponse,
    allResponses,
    getResponse
} = require('../services/FormService');

router.route('/create').post(createForm);
router.route('/forms').get(formsGet);
router.route('/form/:formId').get(getFormById);
router.route('/deleteform/:formId/:userId').delete(deleteForm);
router.route("/editform").put(editForm)
router.route("/getuserforms/:userId").get(getAllFormsOfUser)
router.route("/addresponse").post(submitResponse)
router.route("/responses").get(allResponses)
router.route("/getresponse/:formId").get(getResponse)

module.exports = router;