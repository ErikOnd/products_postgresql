import express from "express";
import createHttpError from "http-errors";
import UsersModal from "./model.js";

const userRouter = express.Router();

userRouter.post("/", async (req, res, next) => {
  try {
    const { user_id } = await UsersModal.create(req.body);
    res.status(201).send({ user_id });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModal.findAll();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModal.findByPk(req.params.userId);
    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {}
});

userRouter.put("/:userId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await UsersModal.update(
      req.body,
      { where: { user_id: req.body.userId }, returning: true }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {}
});

userRouter.delete("/:userId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await UsersModal.destroy({
      where: { user_id: req.params.userId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
