import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import CategoriesModel from "../categories/model.js";
import product_categoriesModel from "./product_category_model.js";

const ProductsModel = sequelize.define("product", {
  product_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

//Mayn to many realtionship (category and product)
ProductsModel.belongsToMany(CategoriesModel, {
  through: product_categoriesModel,
  foreignKey: { name: "product_id", allowNull: false },
});

CategoriesModel.belongsToMany(ProductsModel, {
  through: product_categoriesModel,
  foreignKey: { name: "category_id", allowNull: false },
});

export default ProductsModel;
