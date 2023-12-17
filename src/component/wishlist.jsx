import React, { useEffect, Children } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  deleteItemHandler,
  getItemsHandler,
} from "../store/wishlist";
import { addItem, addCartItemHandler } from "../store/cart";
import image from "../assets/no-image.png";
import LoadingSpinner from "./common/LoadingSpinner";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardImage,
  CCardSubtitle,
  CCardTitle,
  CCol,
  CRow,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { namespaces } from "../i18n";
const Wishlist = ({ deleteItemHandler }) => {
  const { t, i18n } = useTranslation([
    namespaces.WISHLIST.ns,
    namespaces.PRODUCT.ns,
    namespaces.GLOBAL.ns,
  ]);
  const dispatch = useDispatch();
  const { loading, items: wishlist } = useSelector((state) => state.wishlist);
  useEffect(() => {
    dispatch(getItemsHandler());
  }, [dispatch]);
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className=" min-vh-100-header pb-5">
      <h2 className="text-align-center pb-3 mb-3 border-bottom d-block pb-2 mx-auto px-5 border-info w-fit-content">
        {t("Wishlist".toUpperCase())}
      </h2>

      <CRow className=" d-flex  justify-content-center w-75 m-auto  gx-1  ">
        {wishlist.length > 0 ? (
          Children.toArray(
            wishlist.map((item) => (
              <CCard className="mb-3 col-lg-9">
                <CRow className="g-0">
                  <CCol xs={4} lg={3}>
                    <CCardImage
                      src={
                        item.picture ?? item.pictures?.product_picture ?? image
                      }
                      alt="wishlist"
                    />
                  </CCol>
                  <CCol xs={8}>
                    <CCardBody>
                      <CCardTitle>{item[`${i18n.language}title`]}</CCardTitle>
                      <CCardSubtitle>
                        {`${t("PRICE", namespaces.PRODUCT)}: ${
                          item.final_price
                        } ${t(
                          item.currency.toUpperCase(),
                          namespaces.PRODUCT
                        )}`}
                      </CCardSubtitle>
                    </CCardBody>
                  </CCol>
                  <CCol xs={12}>
                    <CCardFooter className=" d-flex  justify-content-between ">
                      <Link
                        className="btn btn-outline-info   "
                        to={`/product/${item.product_id}`}
                      >
                        {t("VISIT_PRODUCT")}
                      </Link>
                      <CButton
                        color="danger "
                        variant="outline"
                        onClick={() => deleteItemHandler(item)}
                      >
                        {t("Remove".toUpperCase(), namespaces.GLOBAL)}
                      </CButton>
                    </CCardFooter>
                  </CCol>
                </CRow>
              </CCard>
            ))
          )
        ) : (
          <h3 className=" mx-auto  w-fit-content mt-2">{t('EMPTY_WISHLIST')}</h3>
        )}
      </CRow>
    </div>
  );
};
const mapStateToProps = (state) => ({
  wishlist: state.wishlist.items,
  cart: state.cart,
});

const mapDispatchToProps = {
  deleteProduct,
  addItem,
  deleteItemHandler,
  addCartItemHandler,
};
export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
