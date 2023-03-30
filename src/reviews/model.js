import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import UserModel from "../users/model.js";
import ProductModal from "../products/model.js";

const ReviewModel = sequelize.define("review", {
  review_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

UserModel.hasMany(ReviewModel, {
  foreignKey: { name: "user_id ", allowNull: false },
});
ReviewModel.belongsTo(UserModel, {
  foreignKey: { name: "user_id ", allowNull: false },
});

ProductModal.hasMany(ReviewModel, {
  foreignKey: { name: "product_id  ", allowNull: false },
});
ReviewModel.belongsTo(ProductModal, {
  foreignKey: { name: "product_id  ", allowNull: false },
});

export default ReviewModel;
