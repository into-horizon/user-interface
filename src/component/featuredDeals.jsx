import React, { Children } from "react";
import ProductCardV2 from "./ProductCardV2";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProductView = ({ title, id, products }) => {
  const navigate = useNavigate();
  return (
    <div className="mt-4">
      <div className="mainDiv">
        <a href="/#">
          <h2 className="FH">{title}</h2>
        </a>
        <button
          className="FDB"
          onClick={() => navigate(`/products?parent_category_id=${id}`)}
        >{`View More >`}</button>
      </div>

      <Row className="my-5 align-items-center justify-content-center">
        {Children.toArray(
          products?.map((product) => (
            <Col xs={8} sm={6} md={6} lg={4} xl={4} xxl={3} className="my-2">
              <ProductCardV2 product={product} />
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default ProductView;
