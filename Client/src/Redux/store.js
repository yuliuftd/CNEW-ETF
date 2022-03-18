import { createStore, combineReducers } from "redux";
import ingredientsReducer from "./reducers/ingredientsReducer";
import recipesReducer from "./reducers/recipesReducer";
import { composeWithDevTools } from "redux-devtools-extension";

// const STORAGE_KEY = "cook-maseter";
// export const save = (state) => {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.error(error);
//   }
// };

// export const load = () => {
//   if (!process.browser) {
//     return undefined;
//   }
//   let state;
//   try {
//     state = localStorage.getItem(STORAGE_KEY);
//     if (typeof state === "string") {
//       state = JSON.parse(state);
//     }
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.error(error);
//   }
//   return state || undefined;
// };

const allReducer = combineReducers({
  ingredientList: ingredientsReducer,
  recipesList: recipesReducer,
});

export default createStore(allReducer, composeWithDevTools());
