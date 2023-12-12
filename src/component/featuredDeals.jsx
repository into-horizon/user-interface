import React, { Children } from "react";
import ProductCard from "./ProductCard";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CButton, CCol, CRow } from "@coreui/react";

const ProductView = ({ title, id, products, t }) => {
  const navigate = useNavigate();
  return (
    <CRow className="mt-4">
      <CCol className=" d-flex ">
        <h2 className="mx-3">{title}</h2>
        <CButton
          size="lg"
          onClick={() => navigate(`/products?parent_category_id=${id}`)}
        >{`${t("VIEW_MORE")} >`}</CButton>
      </CCol>

      <Row className="my-5 align-items-center justify-content-center">
        {Children.toArray(
          products?.map((product) => (
            <Col xs={8} sm={6} md={6} lg={4} xl={4} xxl={3} className="my-2">
              <ProductCard product={product} />
            </Col>
          ))
        )}
      </Row>
    </CRow>
  );
};

export default ProductView;
