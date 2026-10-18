
import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

import Product from "./Product";
import UserProduct from "./UserProduct";

@Table({
  tableName: "users",
  timestamps: false,
})
class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare email: string;
  

  @BelongsToMany(() => Product, () => UserProduct)
  declare products?: Product[];
}

export default User;
