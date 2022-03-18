import { ADD_RECIPE, REMOVE_RECIPE, COOK } from "../constant";

export const addRecipeAction = (payload) => ({ type: ADD_RECIPE, payload });
export const removeRecipeAction = (payload) => ({
  type: REMOVE_RECIPE,
  payload,
});
export const cookAction = (payload) => ({ type: COOK, payload });
