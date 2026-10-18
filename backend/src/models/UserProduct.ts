
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import Product from "./Product";
import User from "./User";

@Table({
  tableName: "user_products",
  timestamps: false,
})
class UserProduct extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare userId: number;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare productId: number;

  @BelongsTo(() => User)
  declare user?: User;

  @BelongsTo(() => Product)
  declare product?: Product;
}

export default UserProduct;
