import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductsModal from "./modal.js";

const productRouter = express.Router();

productRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductsModal.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

productRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.search) {
      query[Op.or] = [
        { description: { [Op.iLike]: `%${req.query.search}%` } },
        { name: { [Op.iLike]: `%${req.query.search}%` } },
      ];
    }
    if (req.query.minPrice && req.query.maxPrice) {
      query.price = { [Op.between]: [req.query.minPrice, req.query.maxPrice] };
    }
    if (req.query.category) {
      query.category = { [Op.iLike]: `%${req.query.category}%` };
    }

    const products = await ProductsModal.findAndCountAll({
      where: { ...query },
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
});

productRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModal.findByPk(req.params.productId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductsModal.update(
      req.body,
      { where: { id: req.params.productId }, returning: true }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productRouter.delete("/:productId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ProductsModal.destroy({
      where: { id: req.params.productId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default productRouter;
