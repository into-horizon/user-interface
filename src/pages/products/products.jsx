import React, { useState, useEffect, Children } from "react";
import { connect, useSelector } from "react-redux";
import { productHandler, searchProductsHandler } from "../../store/products";
import { Button, Col, Row, Form, Offcanvas } from "react-bootstrap";
import {
  CSpinner,
  CFormSelect,
  CCol,
  CFormInput,
  CFormCheck,
} from "@coreui/react";
import ProductCard from "../../component/productCard";
import Paginator from "../../component/common/Paginator";
import CIcon from "@coreui/icons-react";
import { cilFilter } from "@coreui/icons";
import { useTranslation } from "react-i18next";
import { namespaces } from "../../i18n";
import LoadingSpinner from "../../component/common/LoadingSpinner";

const Products = ({ searchProductsHandler }) => {
  const { t, i18n } = useTranslation([
    namespaces.PRODUCT.ns,
    namespaces.GLOBAL.ns,
  ]);
  const {
    searchedProducts: { data: searchedProducts, count },
  } = useSelector((state) => state.products);
  const { data } = useSelector((state) => state.category);
  const [secondCategory, setSecondCategory] = useState([]);
  const [thirdCategory, setThirdCategory] = useState([]);

  const initialSearchQuery = {
    key: "",
    store_id: [],
    parent_category_id: "",
    child_category_id: "",
    grandchild_category_id: "",
    brand_name: [],
    price: "",
    limit: 10,
    offset: 0,
  };

  const [store, setStore] = useState([]);
  const [brand, setBrand] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLand, setFirstLand] = useState(true);
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  let query = window.location.search.split(/[?,&,=]/);
  useEffect(() => {}, [searchQuery.key]);
  const onChange = (e, v = {}) => {
    v[e.target.id] = e.target.value;
    setSearchQuery((x) => ({ ...x, ...v }));
  };

  useEffect(() => {
    let search = { offset: 0, limit: 10 };
    let _query = new URLSearchParams(window.location.search);

    for (const key of _query.keys()) {
      search[key] = _query.get(key);
    }

    Promise.all([searchProductsHandler(search)]).then(() => {
      setLoading(false);
      setFirstLand(false);
    });
    setSearchQuery(search);
  }, [searchProductsHandler]);

  useEffect(() => {
    let _store = [];
    let _brand = searchedProducts
      .filter(
        (product, i, a) =>
          i === a.findIndex((z) => z.brand_name === product.brand_name) &&
          product.brand_name
      )
      .map((product) => product.brand_name);
    setBrand(() => _brand);

    searchedProducts.map((product) =>
      _store.push({ storeName: product.store_name, id: product.store_id })
    );

    _store.length &&
      setStore(() =>
        _store.filter(
          (s, i, a) => i === a.findIndex((z) => z.storeName === s.storeName)
        )
      );
  }, [searchedProducts]);

  const submitHandler = (e) => {
    e.preventDefault();
    const { parent_category_id, child_category_id, grandchild_category_id } =
      e.target;
    setLoading(true);
    if (searchQuery.key !== query.filter((value) => value)[1]) {
      setStore([]);
      setBrand([]);
    }
    Promise.all([searchProductsHandler(searchQuery)]).then(() =>
      setLoading(false)
    );
    setShow(false);
  };

  const resetHandler = (e) => {
    e.target.reset();
    setSearchQuery(initialSearchQuery);
    setBrand([]);
    setStore([]);
  };

  useEffect(() => {
    if (searchQuery.parent_category_id) {
      setSecondCategory(() => {
        const { children } = data.find(
          (category) => category.id === searchQuery.parent_category_id
        );
        if (searchQuery.child_category_id) {
          setThirdCategory(
            children.find(
              (category) => category.id === searchQuery.child_category_id
            )?.children ?? []
          );
        }
        return children;
      });
    }
  }, [
    data,
    searchQuery.child_category_id,
    searchQuery.grandchild_category_id,
    searchQuery.parent_category_id,
  ]);
  const handleChange = (e) => {
    const { checked, value, name } = e.target;
    setSearchQuery((search) => ({
      ...search,
      [name]: checked
        ? search[name]?.concat(value) ?? [value]
        : search[name].filter((item) => item !== value),
    }));
  };
  return (
    <div className=" w-100">
      <Offcanvas show={show} onHide={() => setShow(false)} backdrop={"static"}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t("PRODUCTS_FILTER")}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className=" bg-light p-3 ">
            {loading && firstLand ? (
              <CSpinner />
            ) : (
              <Form onSubmit={submitHandler} onReset={resetHandler}>
                <CFormInput
                  type="search"
                  placeholder={t("SEARCH_PLACEHOLDER", namespaces.LANDING_PAGE)}
                  floatingLabel={t(
                    "SEARCH_PLACEHOLDER",
                    namespaces.LANDING_PAGE
                  )}
                  className=" mb-3"
                  id="key"
                  defaultValue={searchQuery.key}
                  name="key"
                />
                <div>
                  <h5>{t("STORE")}</h5>
                  {store.length !== 0 && (
                    <div className=" d-flex gap-1 flex-column ">
                      {" "}
                      {Children.toArray(
                        store.map(({ storeName, id }, index) => (
                          <CFormCheck
                            type={"checkbox"}
                            id={storeName}
                            name="store_id"
                            value={id}
                            checked={searchQuery.store_id?.includes(id)}
                            label={storeName}
                            floatingLabel={storeName}
                            onChange={handleChange}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>

                {
                  <div className=" my-3">
                    <h5>{t("PRICE", namespaces.PRODUCT)}</h5>
                    <div>
                      {Children.toArray(
                        [
                          { name: t("ALL", namespaces.PRODUCT), value: "" },
                          {
                            name: t("UNDER_15", namespaces.PRODUCT),
                            value: "0-15",
                          },
                          {
                            name: t("15_30", namespaces.PRODUCT),
                            value: "15-30",
                          },
                          {
                            name: t("30_45", namespaces.PRODUCT),
                            value: "30-45",
                          },
                          {
                            name: t("45_60", namespaces.PRODUCT),
                            value: "45-60",
                          },
                          {
                            name: t("OVER_60", namespaces.PRODUCT),
                            value: "60-10000000",
                          },
                        ].map(({ name, value }) => (
                          <CFormCheck
                            type={"radio"}
                            id={name}
                            name={`price`}
                            value={value}
                            label={name}
                          />
                        ))
                      )}
                    </div>
                  </div>
                }

                {brand.length !== 0 && (
                  <div>
                    <h5>{t("BRAND", namespaces.PRODUCT)}</h5>
                    <div className="mb-3">
                      {" "}
                      {Children.toArray(
                        brand.map((brand) => (
                          <CFormCheck
                            type="checkbox"
                            id={brand}
                            name="brand_name"
                            value={brand}
                            label={brand}
                            checked={searchQuery.brand_name?.includes(brand)}
                            onChange={handleChange}
                          />
                        ))
                      )}
                    </div>
                  </div>
                )}
                <div className=" d-flex  gap-2  flex-column ">
                  <div>
                    <CFormSelect
                      value={searchQuery.parent_category_id}
                      id="parent_category_id"
                      onChange={(e) =>
                        onChange(e, {
                          child_category_id: "",
                          grandchild_category_id: "",
                        })
                      }
                      label={t("FIRST_CATEGORY")}
                      floatingLabel={t("FIRST_CATEGORY")}
                    >
                      <option value={""}>{t("ALL")}</option>
                      {data.length > 0 &&
                        Children.toArray(
                          data.map((val) => (
                            <option
                              value={val.id}
                              onClick={() =>
                                setSecondCategory(val.children ?? [])
                              }
                            >
                              {val[`${i18n.language}title`]}
                            </option>
                          ))
                        )}
                    </CFormSelect>
                  </div>
                  {searchQuery.parent_category_id && (
                    <div>
                      {" "}
                      <CFormSelect
                        value={searchQuery.child_category_id}
                        id="child_category_id"
                        onChange={(e) =>
                          onChange(e, { grandchild_category_id: "" })
                        }
                        label={t("SECOND_CATEGORY")}
                        floatingLabel={t("SECOND_CATEGORY")}
                      >
                        <option value={""}>{t("ALL")}</option>
                        {secondCategory.length > 0 &&
                          Children.toArray(
                            secondCategory.map((val, i) => (
                              <option
                                value={val.id}
                                onClick={() =>
                                  setThirdCategory(val.children ?? [])
                                }
                              >
                                {val[`${i18n.language}title`]}
                              </option>
                            ))
                          )}
                      </CFormSelect>
                    </div>
                  )}
                  {searchQuery.child_category_id &&
                    searchQuery.parent_category_id && (
                      <div>
                        <CFormSelect
                          value={searchQuery.grandchild_category_id}
                          id="grandchild_category_id"
                          onChange={onChange}
                          label={t("THIRD_CATEGORY")}
                          floatingLabel={t("THIRD_CATEGORY")}
                        >
                          <option value={""}>{t("ALL")}</option>
                          {thirdCategory.length > 0 &&
                            Children.toArray(
                              thirdCategory.map((val, i) => (
                                <option value={val.id}>
                                  {val[`${i18n.language}title`]}
                                </option>
                              ))
                            )}
                        </CFormSelect>
                      </div>
                    )}
                </div>

                <Button
                  variant="secondary"
                  type="reset"
                  className=" w-100 mt-3"
                >
                  {t("RESET_FILTER")}
                </Button>
                <Button variant="primary" type="submit" className=" w-100 mt-3">
                  {t("SEARCH")}
                </Button>
              </Form>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Row className=" w-100 ">
        <Col xs={5} sm={4} md={4} lg={4} xl={3} xxl={2} className="lg-show">
          <div className="bg-light p-3 d-flex  justify-content-center ">
            {loading && firstLand ? (
              <CSpinner color="primary" />
            ) : (
              <Form onSubmit={submitHandler} onReset={resetHandler}>
                <CFormInput
                  type="search"
                  placeholder={t("SEARCH_PLACEHOLDER", namespaces.LANDING_PAGE)}
                  floatingLabel={t(
                    "SEARCH_PLACEHOLDER",
                    namespaces.LANDING_PAGE
                  )}
                  className=" mb-3"
                  id="key"
                  defaultValue={searchQuery.key}
                  name="key"
                />
                <div>
                  <h5>{t("STORE")}</h5>
                  {store.length !== 0 && (
                    <div className=" d-flex gap-1 flex-column ">
                      {" "}
                      {Children.toArray(
                        store.map(({ storeName, id }, index) => (
                          <CFormCheck
                            type={"checkbox"}
                            id={storeName}
                            name="store_id"
                            value={id}
                            checked={searchQuery.store_id?.includes(id)}
                            label={storeName}
                            floatingLabel={storeName}
                            onChange={handleChange}
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>

                {
                  <div className=" my-3">
                    <h5>{t("PRICE", namespaces.PRODUCT)}</h5>
                    <div>
                      {Children.toArray(
                        [
                          { name: t("ALL", namespaces.PRODUCT), value: "" },
                          {
                            name: t("UNDER_15", namespaces.PRODUCT),
                            value: "0-15",
                          },
                          {
                            name: t("15_30", namespaces.PRODUCT),
                            value: "15-30",
                          },
                          {
                            name: t("30_45", namespaces.PRODUCT),
                            value: "30-45",
                          },
                          {
                            name: t("45_60", namespaces.PRODUCT),
                            value: "45-60",
                          },
                          {
                            name: t("OVER_60", namespaces.PRODUCT),
                            value: "60-10000000",
                          },
                        ].map(({ name, value }) => (
                          <CFormCheck
                            type={"radio"}
                            id={name}
                            name={`price`}
                            value={value}
                            label={name}
                          />
                        ))
                      )}
                    </div>
                  </div>
                }

                {brand.length !== 0 && (
                  <div>
                    <h5>{t("BRAND", namespaces.PRODUCT)}</h5>
                    <div className="mb-3">
                      {" "}
                      {Children.toArray(
                        brand.map((brand) => (
                          <CFormCheck
                            type="checkbox"
                            id={brand}
                            name="brand_name"
                            value={brand}
                            label={brand}
                            checked={searchQuery.brand_name?.includes(brand)}
                            onChange={handleChange}
                          />
                        ))
                      )}
                    </div>
                  </div>
                )}
                <div className=" d-flex  gap-2  flex-column ">
                  <div>
                    <CFormSelect
                      value={searchQuery.parent_category_id}
                      id="parent_category_id"
                      onChange={(e) =>
                        onChange(e, {
                          child_category_id: "",
                          grandchild_category_id: "",
                        })
                      }
                      label={t("FIRST_CATEGORY")}
                      floatingLabel={t("FIRST_CATEGORY")}
                    >
                      <option value={""}>{t("ALL")}</option>
                      {data.length > 0 &&
                        Children.toArray(
                          data.map((val) => (
                            <option
                              value={val.id}
                              onClick={() =>
                                setSecondCategory(val.children ?? [])
                              }
                            >
                              {val[`${i18n.language}title`]}
                            </option>
                          ))
                        )}
                    </CFormSelect>
                  </div>
                  {searchQuery.parent_category_id && (
                    <div>
                      {" "}
                      <CFormSelect
                        value={searchQuery.child_category_id}
                        id="child_category_id"
                        onChange={(e) =>
                          onChange(e, { grandchild_category_id: "" })
                        }
                        label={t("SECOND_CATEGORY")}
                        floatingLabel={t("SECOND_CATEGORY")}
                      >
                        <option value={""}>{t("ALL")}</option>
                        {secondCategory.length > 0 &&
                          Children.toArray(
                            secondCategory.map((val, i) => (
                              <option
                                value={val.id}
                                onClick={() =>
                                  setThirdCategory(val.children ?? [])
                                }
                              >
                                {val[`${i18n.language}title`]}
                              </option>
                            ))
                          )}
                      </CFormSelect>
                    </div>
                  )}
                  {searchQuery.child_category_id &&
                    searchQuery.parent_category_id && (
                      <div>
                        <CFormSelect
                          value={searchQuery.grandchild_category_id}
                          id="grandchild_category_id"
                          onChange={onChange}
                          label={t("THIRD_CATEGORY")}
                          floatingLabel={t("THIRD_CATEGORY")}
                        >
                          <option value={""}>{t("ALL")}</option>
                          {thirdCategory.length > 0 &&
                            Children.toArray(
                              thirdCategory.map((val, i) => (
                                <option value={val.id}>
                                  {val[`${i18n.language}title`]}
                                </option>
                              ))
                            )}
                        </CFormSelect>
                      </div>
                    )}
                </div>

                <Button
                  variant="secondary"
                  type="reset"
                  className=" w-100 mt-3"
                >
                  {t("RESET_FILTER")}
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className=" w-100  mt-3"
                >
                  {t("SEARCH")}
                </Button>
              </Form>
            )}
          </div>
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
                <h3>Results</h3>
              </Col>
            </Row>

            <Row className="justify-content-center align-content-center gap-3 py-2">
              {searchedProducts &&
                searchedProducts.map((product, index) => (
                  <Col
                    lg={5}
                    md={5}
                    sm={5}
                    xs={10}
                    xl={5}
                    xxl={3}
                    key={`product${index}`}
                  >
                    <ProductCard itemType="product" product={product} />
                  </Col>
                ))}
              <CCol xs={12} className=" mb-5">
                <Paginator
                  count={count}
                  changeData={searchProductsHandler}
                  params={searchQuery}
                  cookieName="products"
                  updateParams={setSearchQuery}
                />
              </CCol>
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
