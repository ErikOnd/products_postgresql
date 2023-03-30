import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductsModel from "./model.js";
import ProductCategoryModel from "./product_category_model.js";

const productRouter = express.Router();

productRouter.post("/", async (req, res, next) => {
  try {
    const { product_id } = await ProductsModel.create(req.body);
    if (req.body.categories) {
      await ProductCategoryModel.bulkCreate(
        req.body.categories.map((category) => {
          return { product_id: product_id, category_id: category };
        })
      );
    }
    res.status(201).send({ product_id });
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

    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const order = req.query.order ? req.query.order : "ASC";
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const products = await ProductsModel.findAndCountAll({
      where: { ...query },
      limit: limit,
      offset: offset,
      order: [["name", order]],
    });
    const totalPages = Math.ceil(products.count / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const nextLink = nextPage
      ? `${process.env.FE_URL}/products?page=${nextPage}&limit=${limit}`
      : null;

    const prevPage = page > 1 ? page - 1 : null;
    const prevLink = prevPage
      ? `${process.env.FE_URL}/products?page=${prevPage}&limit=${limit}`
      : null;

    res.send({
      products: products.rows,
      count: products.count,
      totalPages: totalPages,
      nextPage: nextLink,
      prevPage: prevLink,
    });
  } catch (error) {
    next(error);
  }
});

productRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.productId, {
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
    const [numberOfUpdatedRows, updatedRecords] = await ProductsModel.update(
      req.body,
      { where: { product_id: req.params.productId }, returning: true }
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
    const numberOfDeletedRows = await ProductsModel.destroy({
      where: { product_id: req.params.productId },
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
