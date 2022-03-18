import {
  ADD_INGREDIENTS,
  REMOVE_INGREDIENTS,
  STOCK_IN,
  STOCK_OUT,
} from "../constant";
const initState = [
  {
    id: "testData-001",
    name: "Carrot",
    quantity: 10,
  },
  {
    id: "testData-002",
    name: "Butter",
    quantity: 13,
  },
  {
    id: "testData-003",
    name: "Beef",
    quantity: 4,
  },
];

const edit = (x, row, type) => {
  const tmp = [...x];
  const a = tmp.find((p) => p.id === row.id);
  a.quantity += type;
  if (a.quantity <= 0) {
    a.quantity = 0;
  }
  return tmp;
};

export default function ingredientsReducer(preState = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case STOCK_IN:
      return edit(preState, payload, 1);
    case STOCK_OUT:
      return edit(preState, payload, -1);
    case ADD_INGREDIENTS:
      const tmp = [...preState];
      const exists = tmp.find((p) => p.name === payload.name);
      if (!exists) {
        tmp.push(payload);
      } else {
        exists.quantity = exists.quantity * 1 + payload.quantity * 1;
      }
      return tmp;
    case REMOVE_INGREDIENTS:
      return preState.filter((x) => x.id !== payload.id);
    default:
      return preState;
  }
}
