import React from "react";
import { connect } from "react-redux";
import { Card, Row, Col, Button, Divider, Input } from "antd";
import PropTypes from "prop-types";
import {
  addRecipeAction,
  removeRecipeAction,
  cookAction,
} from "../../Redux/actions/recipes";
import { stockOutAction } from "../../Redux/actions/ingredients";
import "./index.css";

const { TextArea } = Input;
const Recipe = (props) => {
  const { ingredients, recipes } = props;
  const [Ingredient, setIngredient] = React.useState([
    { name: "", quantity: 0 },
  ]);
  const [recipeMethod, setRecipeMethod] = React.useState("");

  const onRemoveRecipe = (recipe) => {
    props.removeRecipe(recipe);
  };

  const updateIngredientAndQty = (index, field, value) => {
    const tmp = [...Ingredient];
    tmp[index][field] = value;
    setIngredient([...tmp]);
  };
  const startCook = (ingre) => {
    const { recipeIngredients } = ingre;
    recipeIngredients.forEach((p) => {
      const tmp = ingredients.find((obj) => obj.name === p.name);
      if (tmp) {
        for (let i = 0; i < p.quantity; i++) {
          props.decrease(tmp);
        }
      }
    });
    props.Cook(ingre);
  };
  const addIngredients = () => {
    const tmp = [...Ingredient];
    // name or qty is empty
    const notEmpty = tmp.filter((p) => !!p.name && !!p.quantity);
    if (notEmpty.length !== tmp.length) {
      alert("name or qty not empty");
      return;
    }
    // name is repeat
    const nameList = [];
    for (let i = 0; i < tmp.length; i++) {
      if (nameList.includes(tmp[i].name)) {
        alert("name repeat");
        return;
      }
      nameList.push(tmp[i].name);
    }
    tmp.push({ name: "", quantity: 0 });
    setIngredient(tmp);
  };
  const onSaveRecipe = () => {
    const data = { recipeMethod, recipeIngredients: Ingredient };
    if (!data.recipeMethod) {
      return alert("recipeMethod not empty");
    }
    const exists = recipes.find((p) => p.recipeMethod === data.recipeMethod);
    if (exists) {
      return alert("recipeMethod exists");
    }

    const tmpList = Ingredient.filter((p) => !!p.name && !!p.quantity);
    if (tmpList.length !== Ingredient.length) {
      return alert("enter name or qty");
    }

    const nameList = ingredients.map((p) => p.name);
    for (let i = 0; i < tmpList.length; i++) {
      if (!nameList.includes(tmpList[i].name)) {
        return alert(`line ${i + 1} name invalid`);
      }
    }
    props.addRecipe(data);
    setRecipeMethod("");
    setIngredient([{ name: "", quantity: 0 }]);
  };
  return (
    <div>
      <div className="site-card-border-less-wrapper">
        <h2>Here you can see all Cook-Master recipes list:</h2>
        {recipes &&
          recipes.map((x, index) => (
            <React.Fragment key={index + 1 * 1}>
              <Row style={{ marginBottom: 10 }}>
                <Col span={18}>
                  <Card title={`Cooking Recipe ${index + 1}`} bordered={false}>
                    <p>{x.recipeMethod}</p>
                    {x.recipeIngredients.map((y, index) => (
                      <p key={index + 1 * 1}>{`${index + 1}.  ${y.name} x ${
                        y.quantity
                      }`}</p>
                    ))}
                  </Card>
                </Col>
                <Col
                  span={6}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Row>
                    <Button
                      type="primary"
                      size="large"
                      style={{ width: "100%" }}
                      onClick={() => {
                        startCook(x);
                      }}
                    >
                      Cook
                    </Button>
                  </Row>
                  <Row>
                    <Button
                      type="danger"
                      size="large"
                      style={{ width: "100%" }}
                      onClick={() => onRemoveRecipe(x)}
                    >
                      remove
                    </Button>
                  </Row>
                </Col>
              </Row>
              <Row>
                {x.cookTimes &&
                  x.cookTimes.length > 0 &&
                  x.cookTimes.map((item, cIndex) => {
                    return (
                      <Col span={6} key={cIndex}>
                        {`${item}`}
                      </Col>
                    );
                  })}
              </Row>
            </React.Fragment>
          ))}
        <Divider></Divider>
        <Row>
          <Col span={18}>
            <Card title={`Add Recipe:`} bordered={false}>
              <TextArea
                rows={4}
                value={recipeMethod || ""}
                onChange={(e) => setRecipeMethod(e.target.value)}
              ></TextArea>
              <div>
                <Row>
                  <Col span={9}>
                    <h3>Ingredient:</h3>
                  </Col>
                  <Col span={9}>
                    <h3>Qty:</h3>
                  </Col>
                </Row>
              </div>
              <div>
                {Ingredient &&
                  Ingredient.length > 0 &&
                  Ingredient.map((item, index) => {
                    return (
                      <Row key={index}>
                        <Col span={9}>
                          <Input
                            placeholder="Input Ingredient"
                            value={item.name || ""}
                            onChange={(e) => {
                              updateIngredientAndQty(
                                index,
                                "name",
                                e.target.value.trim()
                              );
                            }}
                          ></Input>
                        </Col>
                        <Col span={9}>
                          <Input
                            type="number"
                            placeholder="Enter Qty"
                            value={item.quantity || 0}
                            min={1}
                            onChange={(e) => {
                              updateIngredientAndQty(
                                index,
                                "quantity",
                                Number(e.target.value)
                              );
                            }}
                          ></Input>
                        </Col>
                        <Col span={6}>
                          {index === Ingredient.length - 1 && (
                            <Button onClick={addIngredients}>Add</Button>
                          )}
                          {(index > 0 ||
                            (index === 0 && Ingredient.length > 0)) && (
                            <Button
                              onClick={() => {
                                const tmp = [...Ingredient];
                                tmp.splice(index, 1);
                                setIngredient(tmp);
                              }}
                            >
                              Delete
                            </Button>
                          )}
                        </Col>
                      </Row>
                    );
                  })}
                <Divider />
                <Row>
                  <Col span={18}>
                    <Button onClick={onSaveRecipe}>Save</Button>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
Recipe.propTyep = {
  recipes: PropTypes.array,
  ingrediennts: PropTypes.array,
  addRecipe: PropTypes.func,
  removeRecipe: PropTypes.func,
  Cook: PropTypes.func,
  decrease: PropTypes.func,
};
export default connect(
  (state) => ({
    recipes: state.recipesList,
    ingredients: state.ingredientList,
  }),
  {
    addRecipe: addRecipeAction,
    removeRecipe: removeRecipeAction,
    Cook: cookAction,
    decrease: stockOutAction,
  }
)(Recipe);
