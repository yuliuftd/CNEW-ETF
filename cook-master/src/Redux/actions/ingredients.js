import {
  ADD_INGREDIENTS,
  REMOVE_INGREDIENTS,
  STOCK_IN,
  STOCK_OUT,
} from "../constant";

export const stockInAction = (payload) => ({
  type: STOCK_IN,
  payload,
});
export const stockOutAction = (payload) => ({
  type: STOCK_OUT,
  payload,
});
export const addIngredientsAction = (payload) => ({
  type: ADD_INGREDIENTS,
  payload,
});
export const removeIngredientsAction = (payload) => ({
  type: REMOVE_INGREDIENTS,
  payload,
});
