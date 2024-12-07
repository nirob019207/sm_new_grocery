import { apiSlice } from "../../apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all products
    products: builder.query({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
    }),

    // Fetch a single product by ID
    singleProduct: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
    }),

    // Add a new product
    addProducts: builder.mutation({
      query: (productData) => ({
        url: `/products`,
        method: "POST",
        body: productData,
      }),
    }),

   
    updateProduct: builder.mutation({
      query: ({ id, productData }) => ({
        url: `/products/${id}`,
        method: "PUT", 
        body: productData,
      }),
    }),

    
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { 
  useProductsQuery, 
  useSingleProductQuery, 
  useAddProductsMutation, 
  useUpdateProductMutation, 
  useDeleteProductMutation 
} = productsApiSlice;
