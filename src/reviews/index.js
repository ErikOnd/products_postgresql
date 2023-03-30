import express from "express";
import createHttpError from "http-errors";
import { where } from "sequelize";
import ReviewModal from "./model.js";

const reviewRouter = express.Router();

reviewRouter.post("/", async (req, res, next) => {
  try {
    const { review_id } = await ReviewModal.create(req.body);
    res.status(201).send({ review_id });
  } catch (error) {
    next(error);
  }
});

reviewRouter.get("/:productId/product", async (req, res, next) => {
  try {
    const reviews = await ReviewModal.findAll({
      where: {
        product_id: req.params.productId,
      },
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

reviewRouter.get("/:reviewId", async (req, res, next) => {
  try {
    const review = await ReviewModal.findByPk(req.params.reviewId);
    if (review) {
      res.send(review);
    } else {
      next(
        createHttpError(404, `Review with id ${req.params.reviewId} not found!`)
      );
    }
    res.send(category);
  } catch (error) {
    next(error);
  }
});

reviewRouter.put("/:reviewId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ReviewModal.update(
      req.body,
      { where: { review_id: req.params.reviewId }, returning: true }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(404, `Review with id ${req.params.reviewId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewRouter.delete("/:reviewId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ReviewModal.destroy({
      where: { review_id: req.params.reviewId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Review with id ${req.params.reviewId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default reviewRouter;
