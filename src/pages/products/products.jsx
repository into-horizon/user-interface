import React, { Children, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  productHandler,
  searchProductsHandler,
  updateSearchQuery,
} from "../../store/products";
import { Button, Col, Row, Offcanvas } from "react-bootstrap";
import { CCol } from "@coreui/react";
import ProductCard from "../../component/productCard";
import Paginator from "../../component/common/Paginator";
import CIcon from "@coreui/icons-react";
import { cilFilter } from "@coreui/icons";
import { useTranslation } from "react-i18next";
import { namespaces } from "../../i18n";
import LoadingSpinner from "../../component/common/LoadingSpinner";
import ProductFilter from "./ProductFilter";

const Products = ({ searchProductsHandler }) => {
  const { t } = useTranslation([namespaces.PRODUCT.ns, namespaces.GLOBAL.ns]);
  const {
    searchedProducts: { data: searchedProducts, count },
    loading,
    searchQuery,
  } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const onPageChange = (n) => {
    updateSearchQuery({ ...searchQuery, offset: searchQuery.limit * (n - 1) });
    dispatch(searchProductsHandler());
  };
  return (
    <div className=" w-100">
      <Offcanvas show={show} onHide={() => setShow(false)} backdrop={"static"}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t("PRODUCTS_FILTER")}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ProductFilter setShow={setShow} />
        </Offcanvas.Body>
      </Offcanvas>

      <Row className=" w-100 ">
        <Col xs={5} sm={4} md={4} lg={4} xl={3} xxl={2} className="lg-show">
          <ProductFilter setShow={setShow} />
        </Col>

        {loading ? (
          <Col>
            <LoadingSpinner />
          </Col>
        ) : (
          <Col>
            <Row className="p-3 bg-body-tertiary rounded-2 ">
              <Col xs="auto" className="lg-hide">
                <Button
                  onClick={() => setShow(true)}
                  variant="outline-secondary"
                  size="lg"
                >
                  <CIcon icon={cilFilter} size="lg" />
                </Button>
              </Col>
              <Col className=" d-flex  align-items-center justify-content-center  ">
                <h3>{t("SEARCH_RESULT")}</h3>
              </Col>
            </Row>

            <Row className="justify-content-center align-content-center gap-3 py-2">
              {searchedProducts.length === 0 ? (
                <h5 className=" text-center mt-3">{t("NO_RESULTS")}</h5>
              ) : (
                <>
                  {Children.toArray(
                    searchedProducts.map((product) => (
                      <Col lg={5} md={5} sm={5} xs={10} xl={5} xxl={3}>
                        <ProductCard itemType="product" product={product} />
                      </Col>
                    ))
                  )}
                  <CCol xs={12} className=" mb-5">
                    <Paginator
                      count={count}
                      onPageChange={onPageChange}
                      pageSize={10}
                    />
                  </CCol>
                </>
              )}
            </Row>
          </Col>
        )}
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({
  productsData: state.products ? state.products : null,
});
const mapDispatchToProps = { productHandler, searchProductsHandler };
export default connect(mapStateToProps, mapDispatchToProps)(Products);
