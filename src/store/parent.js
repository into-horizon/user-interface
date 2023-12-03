import ProductService from "../services/Product";
import { createSlice } from "@reduxjs/toolkit";

let Parent = createSlice({
  name: "parent",
  initialState: {
    parentCategory: [],
    childCategory: [],
    grandChildCategory: [],
    product: [],
    message: "",
  },
  reducers: {
    productAction(state, action) {
      return action.payload;
    },
  },
});

export const parentCategoryHandler = () => async (dispatch, state) => {
  try {
    let [parent, child, grandchild] = await Promise.all([
      ProductService.getParentCategory(),
      ProductService.getChildCategory(),
      ProductService.getGrandChildCategory(),
    ]);

    if (parent.length && child.length && grandchild.length) {
      dispatch(
        productAction({
          parentCategory: parent,
          childCategory: child,
          grandChildCategory: grandchild,
        })
      );
    } else {
      dispatch(productAction({ message: "something went wrong" }));
    }
  } catch (error) {
    throw new Error(error.message)
  }
};

export default Parent.reducer;
export const { productAction } = Parent.actions;
