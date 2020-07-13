'use strict';

const {Router} = require(`express`);
const {validationResult} = require(`express-validator`);
const {newOfferFormFieldsRules} = require(`../form-validation`);
const {fileUploader} = require(`../file-uploader`);

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MEGABYTE_IN_BYTES = 1048576;

const upload = fileUploader.single(`picture`);

const getOffersRouter = (service) => {

  const offersRouter = new Router();

  offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));

  offersRouter.get(`/add`, async (req, res, next) => {
    try {
      const categories = await service.getAllCategories();
      return res.render(`new-ticket`, {categories});
    } catch (err) {
      return next(err);
    }
  });

  offersRouter.post(`/add`, upload, ...newOfferFormFieldsRules, async (req, res, next) => {
    try {
      const errorFormatter = ({msg}) => ({msg});
      const errors = validationResult(req).formatWith(errorFormatter).array();
      const file = req.file;
      let formFieldsData = req.body;

      if (!file || file.size > MAX_FILE_SIZE) {
        errors.push({
          msg: `Файл не выбран, неверный формат (только jpg/jpeg/png),
          большой размер файла (максимально: ${MAX_FILE_SIZE / MEGABYTE_IN_BYTES} мб)`
        });
      } else {
        formFieldsData = {
          ...formFieldsData,
          picture: {
            background: `01`,
            image: file.filename,
            image2x: file.filename
          }
        };
      }

      if (Object.keys(errors).length) {
        const categories = await service.getAllCategories();
        return res.render(`new-ticket`, {errors, categories, formFieldsData});
      }

      await service.createNewOffer(formFieldsData);

      return res.redirect(`/my`);
    } catch (err) {
      return next(err);
    }
  });

  offersRouter.get(`/edit/:id`, async (req, res, next) => {
    try {
      const offerId = req.params.id;
      const offer = await service.getOfferById(offerId);
      const categories = await service.getAllCategories();

      return res.render(`ticket-edit`, {offer, categories});
    } catch (err) {
      return next(err);
    }
  });

  offersRouter.get(`/:id`, (req, res) => res.render(`ticket`));

  return offersRouter;
};

module.exports = {getOffersRouter};
