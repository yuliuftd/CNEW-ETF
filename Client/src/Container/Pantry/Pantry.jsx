import { Button, Row, Col, Input } from "antd";
import React, { useState } from "react";
import { nanoid } from "nanoid";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  addIngredientsAction,
  removeIngredientsAction,
  stockOutAction,
  stockInAction,
} from "../../Redux/actions/ingredients";

function Pantry(props) {
  const { ingredients } = props;
  const [value, setValue] = useState("");
  const [qty, setQty] = useState(0);
  const addIngredients = () => {
    //qty need to be nubmer, or you will get an error when cook customized ingredient
    const ingredientToAdd = {
      id: nanoid(),
      name: value,
      quantity: parseInt(qty),
    };
    props.add(ingredientToAdd);
    setValue("");
    setQty("");
  };
  const deleteIngredients = (ingre) => {
    props.remove(ingre);
  };
  const addStock = (ingre) => {
    props.increase(ingre);
  };
  const stockOut = (ingre) => {
    props.decrease(ingre);
  };
  return (
    <div>
      <h2>Let's see what we'v got here!</h2>
      {ingredients.map((x, index) => (
        <React.Fragment key={index + 1 * 1}>
          <Row>
            <Col span={6}>
              <Button
                key={x.id}
                type="primary"
                size="large"
                style={{ width: "100%", marginBottom: 10 }}
              >
                {x.name}
              </Button>
            </Col>
            <Col span={6} style={{ textAlign: "center" }}>
              <h4>{`Stock: ${x.quantity}`}</h4>
            </Col>
            <Col span={6} style={{ display: "flex", justifyContent: "center" }}>
              <Button
                key={`${x.id}-add`}
                type="primary"
                size="large"
                shape="round"
                onClick={() => {
                  addStock(x);
                }}
              >
                +
              </Button>
              <Button
                key={`${x.id}-out`}
                type="primary"
                size="large"
                shape="round"
                onClick={() => stockOut(x)}
              >
                -
              </Button>
            </Col>
            <Col span={6} style={{ textAlign: "right" }}>
              <Button
                key={`${x.id}-del`}
                type="primary"
                size="large"
                shape="round"
                onClick={() => deleteIngredients(x)}
              >
                Delete
              </Button>
            </Col>
          </Row>
        </React.Fragment>
      ))}
      <h2>Add ingredients you want:</h2>
      <Row>
        <Col span={12}>
          <h3>Ingredient:</h3>
        </Col>
        <Col span={6}>
          <h3>Qty:</h3>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Input
            size="large"
            placeholder="Input ingredient you want to add"
            value={value}
            onChange={(e) => {
              setValue(e.target.value.trim());
            }}
            required={true}
            type="text"
          ></Input>
        </Col>
        <Col span={6} style={{ textAlign: "center" }}>
          <Input
            size="large"
            placeholder="Input ingredient QTY"
            value={qty}
            onChange={(ev) => setQty(ev.target.value.trim())}
            required={true}
            type="number"
          ></Input>
        </Col>
        <Col span={6} style={{ textAlign: "center" }}>
          <Button type="primary" size="large" onClick={addIngredients}>
            Add
          </Button>
        </Col>
      </Row>
    </div>
  );
}
Pantry.propTypes = {
  ingredientList: PropTypes.array,
  increase: PropTypes.func,
  decrease: PropTypes.func,
  add: PropTypes.func,
  remove: PropTypes.func,
};
export default connect((state) => ({ ingredients: state.ingredientList }), {
  increase: stockInAction,
  decrease: stockOutAction,
  add: addIngredientsAction,
  remove: removeIngredientsAction,
})(Pantry);
