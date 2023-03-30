import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const CategoriesModel = sequelize.define("category", {
  category_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

export default CategoriesModel;
