import { useMutation, useQuery } from "@tanstack/react-query";



import { assignProductToUser, createProduct, createUser, getProducts } from "../lib/sequelizeApi";
// get products uses the use query
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
};
// remaining uses the useMutation
// create user
export const useCreateUser = () => {
  return useMutation({
    mutationFn: ({
      name,
      email,
    }: {
      name: string;
      email: string;
    }) => createUser(name, email),
  });
};
// create products
export const useCreateProduct =()=>{
    return useMutation({
        mutationFn:({
            name,
            price,}
            :{
                name:string;
                price:number;
        })=> createProduct(name,price),
    })
}
//assign the users to the products 
 export const useAssignProductToUser=()=>{
    return useMutation({
        mutationFn:({
            userId,
            productId,}:{
                userId:number,
                productId:number;
        })=>assignProductToUser(
            userId,productId
        ),
    })
 }


