import { ADD_RECIPE, REMOVE_RECIPE, COOK } from "../constant";

const initState = [
  {
    recipeId: "master-001",
    recipeIngredients: [{ name: "Beef", quantity: 1 }],
    recipeMethod:
      "Whether they’re cooked on the BBQ, in a slow cooker, oven or even in a stew, this collection proves that rump steaks are a versatile, and flavourful dinner staple.",
  },
  {
    recipeId: "master-002",
    recipeIngredients: [
      { name: "Beef", quantity: 1 },
      { name: "Butter", quantity: 1 },
      { name: "Carrot", quantity: 3 },
    ],
    recipeMethod:
      "If you’re looking to satisfy your pork dumpling cravings, we’ve got you sorted with this collection, filled with all of our best variations of the juicy morsels that the whole family will love.",
  },
];

export default function recipesReducer(preState = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case ADD_RECIPE:
      return [
        { recipeId: `master-${preState.length + 2}`, ...payload },
        ...preState,
      ];
    case REMOVE_RECIPE:
      return preState.filter((x) => x.recipeId !== payload.recipeId);
    case COOK:
      const tmp = [...preState];
      const obj = tmp.find((p) => p.recipeId === payload.recipeId);
      if (obj) {
        if (!obj.cookTimes) {
          obj.cookTimes = [];
        }
        const datetime = new Date();
        obj.cookTimes.unshift(
          `${datetime.toLocaleDateString()} ${datetime.toLocaleTimeString()} You cooked & used ${payload.recipeIngredients
            .map((x) => x.name + " x " + x.quantity)
            .join(", ")}`
        );
      }
      return tmp;
    default:
      return preState;
  }
}
