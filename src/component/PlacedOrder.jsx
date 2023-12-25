import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearPlacedOrder } from "../store/order";
import { useDispatch } from "react-redux";
import { Trans, useTranslation } from "react-i18next";
import { namespaces } from "../i18n";
import { CCol, CContainer, CRow } from "@coreui/react";

const PlacedOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(namespaces.CHECKOUT.ns);
  const [orderId, setOrderId] = useState("");
  const { placedOrder } = useSelector((state) => state.order);
  useEffect(() => {
    placedOrder.id ? setOrderId(placedOrder.customer_order_id) : navigate("/");
    dispatch(clearPlacedOrder({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate]);
  return (
    <div
      className="cart min-vh-100-header min-vw-100  d-flex  justify-content-center align-items-center  "
      // style={{
      //   alignItems: "center",
      //   justifyContent: "center",
      //   textAlign: "center",
      //   padding: "10% 0",
      // }}
    >
      <CContainer>
        <CRow className=" justify-content-center  align-items-center ">
          <CCol xs={12}>
            <h1 className=" text-center w-100  ">
              <Trans
                defaults={t("SUCCESSFUL_ORDER")}
                values={{ orderNumber: orderId }}
              />
            </h1>
          </CCol>
          <CCol xs="auto">
            <Link className=" mx-auto " to="/">
              Home
            </Link>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default PlacedOrder;
