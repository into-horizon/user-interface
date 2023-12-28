import React, { Children, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { namespaces } from "../../i18n";
import { useDispatch, useSelector } from "react-redux";
import { CSpinner, CFormSelect, CFormInput, CFormCheck } from "@coreui/react";
import { Button, Form } from "react-bootstrap";
import {
  resetSearchQuery,
  searchProductsHandler,
  updateSearchQuery,
} from "../../store/products";

const ProductFilter = ({ setShow }) => {
  const { t, i18n } = useTranslation([
    namespaces.PRODUCT.ns,
    namespaces.GLOBAL.ns,
  ]);
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.category);
  const {
    loading,
    searchedProducts: { data: searchedProducts },
    searchQuery,
  } = useSelector((state) => state.products);
  const [secondCategory, setSecondCategory] = useState([]);
  const [thirdCategory, setThirdCategory] = useState([]);
  const [store, setStore] = useState([]);
  const [brand, setBrand] = useState([]);
  const [firstLand, setFirstLand] = useState(true);

  const query = window.location.search.split(/[?,&,=]/);
  const onChange = (e, v = {}) => {
    v[e.target.name] = e.target.value;
    dispatch(updateSearchQuery({ ...searchQuery, ...v }));
  };
  useEffect(() => {
    let search = {};
    let _query = new URLSearchParams(window.location.search);

    for (const key of _query.keys()) {
      search[key] = _query.get(key);
    }
    dispatch(updateSearchQuery(search));

    dispatch(searchProductsHandler());
    setFirstLand(false);
  }, [dispatch]);

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
    if (searchQuery.key !== query.filter((value) => value)[1]) {
      setStore([]);
      setBrand([]);
    }
    dispatch(searchProductsHandler());
    setShow(false);
  };

  const resetHandler = (e) => {
    e.target.reset();
    dispatch(resetSearchQuery());
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
    dispatch(
      updateSearchQuery({
        ...searchQuery,
        [name]: checked
          ? searchQuery[name]?.concat(value) ?? [value]
          : searchQuery[name].filter((item) => item !== value),
      })
    );
  };
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    dispatch(updateSearchQuery({ ...searchQuery, [name]: value }));
  };
  return (
    <div className="bg-light p-3 d-flex  justify-content-center ">
      {loading && firstLand ? (
        <CSpinner color="primary" />
      ) : (
        <Form onSubmit={submitHandler} onReset={resetHandler}>
          <CFormInput
            type="search"
            placeholder={t("SEARCH_PLACEHOLDER", namespaces.LANDING_PAGE)}
            floatingLabel={t("SEARCH_PLACEHOLDER", namespaces.LANDING_PAGE)}
            className=" mb-3"
            id="key"
            value={searchQuery.key}
            name="key"
            onChange={onChangeHandler}
          />
          {store.length !== 0 && (
            <div>
              <h5>{t("STORE")}</h5>
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
            </div>
          )}

          {
            <div className=" my-3">
              <h5>{t("PRICE", namespaces.PRODUCT)}</h5>
              <div>
                <CFormCheck
                  type={"radio"}
                  id={t("ALL", namespaces.PRODUCT)}
                  name={`price`}
                  value={""}
                  label={t("ALL", namespaces.PRODUCT)}
                  checked={!searchQuery.price}
                  onChange={onChangeHandler}
                />
                {Children.toArray(
                  [
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
                      checked={searchQuery.price === value}
                      onChange={onChangeHandler}
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
                name="parent_category_id"
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
                        onClick={() => setSecondCategory(val.children ?? [])}
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
                  name="child_category_id"
                  onChange={(e) => onChange(e, { grandchild_category_id: "" })}
                  label={t("SECOND_CATEGORY")}
                  floatingLabel={t("SECOND_CATEGORY")}
                >
                  <option value={""}>{t("ALL")}</option>
                  {secondCategory.length > 0 &&
                    Children.toArray(
                      secondCategory.map((val) => (
                        <option
                          value={val.id}
                          onClick={() => setThirdCategory(val.children ?? [])}
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
                    name="grandchild_category_id"
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

          <Button variant="secondary" type="reset" className=" w-100 mt-3">
            {t("RESET_FILTER")}
          </Button>
          <Button variant="primary" type="submit" className=" w-100  mt-3">
            {t("SEARCH")}
          </Button>
        </Form>
      )}
    </div>
  );
};

export default ProductFilter;
