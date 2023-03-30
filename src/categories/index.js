import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import CategoriesModel from "./model.js";

const product_category = new express.Router();

product_category.post("/", async (req, res, next) => {
  try {
    const { category_id } = await CategoriesModel.create(req.body);
    res.status(201).send({ category_id });
  } catch (error) {
    next(error);
  }
});

product_category.get("/", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.findAll();
    res.send(categories);
  } catch (error) {}
});

product_category.get("/:categoryId", async (req, res, next) => {
  try {
    const category = await CategoriesModel.findByPk(req.params.categoryId);
    if (category) {
      res.send(category);
    } else {
      next(
        createHttpError(
          404,
          `Category with id ${req.params.categoryId} not found!`
        )
      );
    }
    res.send(category);
  } catch (error) {
    next(error);
  }
});

export default product_category;
