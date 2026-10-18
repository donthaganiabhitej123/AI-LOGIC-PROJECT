
import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import User from "./User";
import UserProduct from "./UserProduct";

@Table({
  tableName: "products",
  timestamps: false,
})
class Product extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  declare price: number;

  @AllowNull(true)
@Column(DataType.STRING)
declare description: string | null;

  @BelongsToMany(() => User, () => UserProduct)
  declare users?: User[];
}

export default Product;
