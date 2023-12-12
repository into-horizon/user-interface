import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { productHandler, searchProductsHandler } from "../../store/products";
import {
  Button,
  Col,
  Row,
  Form,
  FormControl,
  Offcanvas,
} from "react-bootstrap";
import "./products.css";
import { CSpinner, CFormSelect, CCol } from "@coreui/react";
import ProductCard from "../../component/productCard";
import Paginator from "../../component/common/Paginator";
import CIcon from "@coreui/icons-react";
import { cilFilter } from "@coreui/icons";

const Products = ({ productsData, productHandler, searchProductsHandler }) => {
  const {
    searchedProducts: { data: searchedProducts, count },
  } = useSelector((state) => state.products);
  const { parentCategory, childCategory, grandChildCategory } = useSelector(
    (state) => state.parent
  );
  const initialSearchQuery = {
    key: "",
    store_id: "",
    parent_category_id: "",
    child_category_id: "",
    grandchild_category_id: "",
    brand_name: "",
    price: "",
    limit: 10,
    offset: 0,
  };

  const [store, setStore] = useState([]);
  const [brand, setBrand] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLand, setFirstLand] = useState(true);
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState({});

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
    let params = Object.keys(initialSearchQuery);
    let data = { limit: 10, offset: 0 };
    new URLSearchParams(window.location.search).append(
      "key",
      e.target.key.value
    );
    params.forEach((param) => {
      if (e.target[param]?.value && e.target[param]?.value !== "") {
        data[param] = e.target[param].value;
      } else if (param === "store_id" && e.target[param]) {
        let stores = Object.values(e.target[param])
          .filter((store) => store.checked)
          ?.map((val) => val.value)
          ?.join(",");
        stores && (data[param] = stores);
      } else if (param === "brand_name" && e.target[param]) {
        let brands = Object.values(e.target[param])
          .filter((brand) => brand.checked)
          ?.map((val) => val.value)
          ?.join(",");
        brands && (data[param] = brands);
      }
    });
    setLoading(true);
    searchQuery.key !== query.filter((value) => value)[1] &&
      setStore([]) &&
      setBrand([]);
    Promise.all([searchProductsHandler(data)]).then(() => setLoading(false));
    setSearchQuery(data);
    setShow(false);
  };

  const resetHandler = (e) => {
    e.target.reset();
    setSearchQuery(initialSearchQuery);
    setBrand([]);
    setStore([]);
  };
  return (
    <div>
      <Offcanvas show={show} onHide={() => setShow(false)} backdrop={"static"}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Products Filter</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="filter m-2rem">
            {loading && firstLand ? (
              <CSpinner />
            ) : (
              <Form onSubmit={submitHandler} onReset={resetHandler}>
                <label htmlFor="key">Search</label>
                <FormControl
                  type="search"
                  placeholder="Search for products"
                  className="me-2"
                  aria-label="Search"
                  id="key"
                  defaultValue={searchQuery.key}
                  name="key"
                />
                {store.length !== 0 && (
                  <div className="mb-3 m-2rem">
                    {" "}
                    Seller
                    {store.map(({ storeName, id }, index) => (
                      <Form.Check
                        key={`store${index}`}
                        type={"checkbox"}
                        id="store_id"
                        name={`seller`}
                        value={id}
                        label={storeName}
                      />
                    ))}
                  </div>
                )}

                {
                  <div key={`Price`} className="mb-3 m-2rem">
                    {" "}
                    Price
                    {[
                      { name: "All", value: "" },
                      { name: "Under 15JO", value: "0-15" },
                      { name: "15JO to 30JO", value: "15-30" },
                      { name: "30JO to 45JO", value: "30-45" },
                      { name: "45JO to 60JO", value: "45-60" },
                      { name: "60JO & Above", value: "60-10000000" },
                    ].map(({ name, value }, index) => (
                      <Form.Check
                        key={`price${index}`}
                        type={"radio"}
                        id={`price_${index}`}
                        name={`price`}
                        value={value}
                        label={name}
                      />
                    ))}
                  </div>
                }

                {brand.length !== 0 && (
                  <div key={`Brand`} className="mb-3 m-2rem">
                    {" "}
                    Brand
                    {brand.map((brand, index) => (
                      <Form.Check
                        key={`brand${index}`}
                        type="checkbox"
                        id="brand_name"
                        name="brand"
                        value={brand}
                        label={brand}
                      />
                    ))}
                  </div>
                )}
                {(!!searchQuery.parent_category_id ||
                  searchQuery.parent_category_id === "") && (
                  <div className="m-2rem">
                    {" "}
                    <label>first category</label>{" "}
                    <CFormSelect
                      aria-label="Default select example"
                      value={searchQuery.parent_category_id}
                      id="parent_category_id"
                      onChange={(e) =>
                        onChange(e, {
                          child_category_id: "",
                          grandchild_category_id: "",
                        })
                      }
                    >
                      <option value={""}>All</option>
                      {parentCategory.length > 0 &&
                        parentCategory.map((val, i) => (
                          <option value={val.id} key={`parent${i}`}>
                            {val.entitle}
                          </option>
                        ))}
                    </CFormSelect>
                  </div>
                )}
                {searchQuery.parent_category_id && (
                  <div className="m-2rem">
                    {" "}
                    <label>second category</label>
                    <CFormSelect
                      aria-label="Default select example"
                      value={searchQuery.child_category_id}
                      id="child_category_id"
                      onChange={(e) =>
                        onChange(e, { grandchild_category_id: "" })
                      }
                    >
                      <option value={""}>All</option>
                      {childCategory.length > 0 &&
                        childCategory
                          .filter(
                            (x) =>
                              x.parent_id === searchQuery.parent_category_id
                          )
                          .map((val, i) => (
                            <option value={val.id} key={`child${i}`}>
                              {val.entitle}
                            </option>
                          ))}
                    </CFormSelect>
                  </div>
                )}
                {searchQuery.child_category_id &&
                  searchQuery.parent_category_id && (
                    <div className="m-2rem">
                      {" "}
                      <label>third category</label>
                      <CFormSelect
                        aria-label="Default select example"
                        value={searchQuery.grandchild_category_id}
                        id="grandchild_category_id"
                        onChange={onChange}
                      >
                        <option value={""}>All</option>
                        {grandChildCategory.length > 0 &&
                          grandChildCategory
                            .filter(
                              (x) =>
                                x.parent_id === searchQuery.child_category_id
                            )
                            .map((val, i) => (
                              <option value={val.id} key={`grand${i}`}>
                                {val.entitle}
                              </option>
                            ))}
                      </CFormSelect>
                    </div>
                  )}

                <Button
                  variant="secondary"
                  type="reset"
                  style={{ width: "100%", margin: "1rem 0" }}
                >
                  reset filter
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  style={{ width: "100%", marginBottom: "1rem 0" }}
                >
                  Search
                </Button>
              </Form>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Row>
        <Col xs={5} sm={4} md={4} lg={3} xl={2} key="col1" className="lg-show">
          <div className="filter m-2rem">
            {loading && firstLand ? (
              <CSpinner />
            ) : (
              <Form onSubmit={submitHandler} onReset={resetHandler}>
                <label htmlFor="key">Search</label>
                <FormControl
                  type="search"
                  placeholder="Search for products"
                  className="me-2"
                  aria-label="Search"
                  id="key"
                  defaultValue={searchQuery.key}
                  name="key"
                />
                {store.length !== 0 && (
                  <div className="mb-3 m-2rem">
                    {" "}
                    Seller
                    {store.map(({ storeName, id }, index) => (
                      <Form.Check
                        key={`store${index}`}
                        type={"checkbox"}
                        id="store_id"
                        name={`seller`}
                        value={id}
                        label={storeName}
                      />
                    ))}
                  </div>
                )}

                {
                  <div key={`Price`} className="mb-3 m-2rem">
                    {" "}
                    Price
                    {[
                      { name: "All", value: "" },
                      { name: "Under 15JO", value: "0-15" },
                      { name: "15JO to 30JO", value: "15-30" },
                      { name: "30JO to 45JO", value: "30-45" },
                      { name: "45JO to 60JO", value: "45-60" },
                      { name: "60JO & Above", value: "60-10000000" },
                    ].map(({ name, value }, index) => (
                      <Form.Check
                        key={`price${index}`}
                        type={"radio"}
                        id={`price_${index}`}
                        name={`price`}
                        value={value}
                        label={name}
                      />
                    ))}
                  </div>
                }

                {brand.length !== 0 && (
                  <div key={`Brand`} className="mb-3">
                    {" "}
                    Brand
                    {brand.map((brand, index) => (
                      <Form.Check
                        key={`brand${index}`}
                        type="checkbox"
                        id="brand_name"
                        name="brand"
                        value={brand}
                        label={brand}
                      />
                    ))}
                  </div>
                )}
                {(!!searchQuery.parent_category_id ||
                  searchQuery.parent_category_id === "") && (
                  <div className="m-2rem">
                    {" "}
                    <label>first category</label>{" "}
                    <CFormSelect
                      value={searchQuery.parent_category_id}
                      id="parent_category_id"
                      onChange={(e) =>
                        onChange(e, {
                          child_category_id: "",
                          grandchild_category_id: "",
                        })
                      }
                    >
                      <option value={""}>All</option>
                      {parentCategory.length > 0 &&
                        parentCategory.map((val, i) => (
                          <option value={val.id} key={`parent${i}`}>
                            {val.entitle}
                          </option>
                        ))}
                    </CFormSelect>
                  </div>
                )}
                {searchQuery.parent_category_id && (
                  <div className="m-2rem">
                    {" "}
                    <label>second category</label>
                    <CFormSelect
                      aria-label="Default select example"
                      value={searchQuery.child_category_id}
                      id="child_category_id"
                      onChange={(e) =>
                        onChange(e, { grandchild_category_id: "" })
                      }
                    >
                      <option value={""}>All</option>
                      {childCategory.length > 0 &&
                        childCategory
                          .filter(
                            (x) =>
                              x.parent_id === searchQuery.parent_category_id
                          )
                          .map((val, i) => (
                            <option value={val.id} key={`child${i}`}>
                              {val.entitle}
                            </option>
                          ))}
                    </CFormSelect>
                  </div>
                )}
                {searchQuery.child_category_id &&
                  searchQuery.parent_category_id && (
                    <div className="m-2rem">
                      {" "}
                      <label>third category</label>
                      <CFormSelect
                        aria-label="Default select example"
                        value={searchQuery.grandchild_category_id}
                        id="grandchild_category_id"
                        onChange={onChange}
                      >
                        <option value={""}>All</option>
                        {grandChildCategory.length > 0 &&
                          grandChildCategory
                            .filter(
                              (x) =>
                                x.parent_id === searchQuery.child_category_id
                            )
                            .map((val, i) => (
                              <option value={val.id} key={`grand${i}`}>
                                {val.entitle}
                              </option>
                            ))}
                      </CFormSelect>
                    </div>
                  )}

                <Button
                  variant="secondary"
                  type="reset"
                  style={{ width: "100%", margin: "1rem 0" }}
                >
                  reset filter
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  style={{ width: "100%", marginBottom: "1rem 0" }}
                >
                  Search
                </Button>
              </Form>
            )}
          </div>
        </Col>

        {loading ? (
          <CSpinner color="primary" />
        ) : (
          <Col key="col2">
            <Row className="py-1">
              <Col xs="auto" className="filter-btn">
                <Button onClick={() => setShow(true)} variant="secondary">
                  <CIcon icon={cilFilter} />
                </Button>
              </Col>
              <Col>
                <h3 className="d-block text-align-center">Results</h3>
              </Col>
            </Row>

            <Row className="justify-content-center align-content-center">
              {searchedProducts &&
                searchedProducts.map((product, index) => (
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    xl={4}
                    xxl={3}
                    className="my-2"
                    key={`product${index}`}
                  >
                    <ProductCard itemType="product" product={product} />
                  </Col>
                ))}
              <CCol xs={12}>
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
