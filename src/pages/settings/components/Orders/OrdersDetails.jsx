import {
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
} from "@coreui/react";
import React, { useEffect, useState, Children } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ProductReviewModal from "./ProductReviewModal";
import { Table } from "react-bootstrap";
import { namespaces } from "../../../../i18n";
import { useTranslation } from "react-i18next";
import CIcon from "@coreui/icons-react";
import { cilOptions, cilSync, cilThumbUp } from "@coreui/icons";
import LoadingSpinner from "../../../../component/common/LoadingSpinner";
import { getOrderHandler } from "../../../../store/order";

export const OrdersDetails = () => {
  const {
    orders: { data: orders },
    loading,
  } = useSelector((state) => state.order);
  const { t, i18n } = useTranslation([
    namespaces.ORDERS.ns,
    namespaces.PRODUCT.ns,
    namespaces.CART.ns,
  ]);
  const [items, setItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [visible, setVisible] = useState(false);
  const [itemForReview, setItemForReview] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    if (orders.length === 0) {
      dispatch(getOrderHandler({ id, limit: 1, offset: 0 }));
    } else {
      setItems(orders.find((order) => order.id === id)?.items);
      setOrderStatus(orders.find((order) => order.id === id).status);
    }
  }, [dispatch, id, orders]);
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <>
      <ProductReviewModal
        visible={visible}
        onClose={() => setVisible(false)}
        id={itemForReview}
      />
      <h2 className="mb-3">{t('ORDER_ITEMS')}</h2>
      <Table responsive striped bordered className=" w-100  mx-auto ">
        <thead>
          <tr>
            <th>{t("PRODUCT_NAME", namespaces.CART)}</th>
            <th>{t("PRICE", namespaces.PRODUCT)}</th>
            <th>{t("COLOR", namespaces.PRODUCT)}</th>
            <th>{t("SIZE", namespaces.PRODUCT)}</th>
            <th>{t("QUANTITY", namespaces.CART)}</th>
            <th>{t("SUBTOTAL", namespaces.CART)}</th>
            <th>{t("ACTIONS", namespaces.ORDERS)}</th>
          </tr>
        </thead>

        <tbody>
          {Children.toArray(
            items?.map((item) => (
              <tr>
                <td>
                  <Link to={`/product/${item.product_id}`} target="_blank">
                    {item[`${i18n.language}title`]}
                  </Link>
                </td>
                <td>{`${item.price} ${t("JOD", namespaces.PRODUCT)}`}</td>
                <td>{t(item.color, namespaces.COLOR) ?? "-"}</td>
                <td>{item.size ?? "-"}</td>
                <td>
                  <span className="in">{item.quantity ?? 1}</span>
                </td>
                <td>{`${item.price * (item.quantity ?? 1)} ${t(
                  "JOD",
                  namespaces.PRODUCT
                )}`}</td>
                <td>
                  <CDropdown
                    variant="btn-group"
                    className=" position-absolute "
                    // direction="dropcenter"
                  >
                    <CDropdownToggle color="secondary" className="rounded-5 ">
                      <CIcon icon={cilOptions} />{" "}
                    </CDropdownToggle>
                    <CDropdownMenu>
                      {orderStatus === "delivered" &&
                        !item.rated &&
                        item.status === "accepted" && (
                          <>
                            <CDropdownItem
                              component={CButton}
                              onClick={() => {
                                setVisible(true);
                                setItemForReview(item.id);
                              }}
                              className=" d-flex  gap-2 align-items-center "
                            >
                              <CIcon icon={cilThumbUp} className="xl" />
                              {t("SUBMIT_REVIEW")}
                            </CDropdownItem>
                            <CDropdownDivider />
                          </>
                        )}
                      {orderStatus === "delivered" &&
                        item.status === "accepted" && (
                          <CDropdownItem
                            component={CButton}
                            className=" d-flex  gap-2 align-items-center "
                          >
                            <CIcon icon={cilSync} />
                            {t("REQUEST_RETURN")}
                          </CDropdownItem>
                        )}
                    </CDropdownMenu>
                  </CDropdown>
                  <CButton
                    color="secondary"
                    variant="outline"
                    className=" rounded-5 "
                  >
                    <CIcon icon={cilOptions} />
                  </CButton>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  );
};

export default OrdersDetails;
