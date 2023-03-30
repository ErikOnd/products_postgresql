import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const UserModal = sequelize.define("user", {
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  surename: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

export default UserModal;
