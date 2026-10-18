import Product from "../models/Product";
import User from "../models/User";
import UserProduct from "../models/UserProduct";
//create User
export const createUser =  async(
    name:string,
    email:string
)=>{
    const user = await User.create({
        name,email,
    });
    return user
};
//create product
export const createProduct = async (
    name:string,
    price:number
)=>{
    return await Product.create({
        name,
        price,
    });
};

export const getProducts = async()=>{
    return await Product.findAll({
        order:[["id","DESC"]]
    })
}
//connect user and the product 
export const assignProductToUser = async (
    userId:number,
    productId:number
)=>{
    return await UserProduct.create({
        userId,
        productId
    });
}