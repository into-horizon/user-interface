import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { getOrderHandler, getOrderLogs } from "../../../../store/order";
import {
  CCard,
  CCardHeader,
  CCardTitle,
  CButton,
  CCardBody,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
} from "@coreui/react";
import { Link } from "react-router-dom";
import Paginator from "../../../../component/common/Paginator";
import { Placeholder } from "react-bootstrap";
import { Children } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { namespaces } from "../../../../i18n";
import { formatLocalizationKey } from "../../../../services/utils";

export const Orders = ({ getOrderHandler, getOrderLogs }) => {
  const { t, i18n } = useTranslation([
    namespaces.ORDERS.ns,
    namespaces.SETTINGS.ns,
    namespaces.GLOBAL.ns,
    namespaces.PRODUCT.ns,
    namespaces.CHECKOUT.ns,
  ]);
  const {
    orders: { data, count },
    logs,
    loading,
  } = useSelector((state) => state.order);
  const [visible, setVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const [params, setParams] = useState({ offset: 0, limit: 5 });

  const logsModal = (id) => {
    setModalLoading(true);
    Promise.all([getOrderLogs(id)]).then(() => setModalLoading(false));
    setVisible(!visible);
  };
  const styles = {
    maxWidth: "90%",
    margin: "1rem auto",
  };
  const onCloseModal = () => {
    setVisible(false);
  };

  const handlePageChange = (n) => {
    setParams((oldParams) => {
      const newParams = { ...oldParams, offset: oldParams?.limit * (n - 1) };
      getOrderHandler(newParams);
      return newParams;
    });
  };
  useEffect(() => {
    getOrderHandler(params);
  }, [getOrderHandler, params]);
  const dateLocales = {
    en: "en-US",
    ar: "ar-EG",
  };
  return (
    <div>
      <CModal
        backdrop={false}
        alignment="center"
        visible={visible}
        onClose={onCloseModal}
      >
        <CModalHeader>
          <CModalTitle>{t("ORDER_TRACKING")}</CModalTitle>
        </CModalHeader>
        {modalLoading ? (
          <CRow className=" justify-content-center  align-items-center ">
            <CCol xs="auto">
              <CSpinner color="primary" />
            </CCol>
          </CRow>
        ) : (
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">{t("STATUS")}</CTableHeaderCell>
                <CTableHeaderCell scope="col">{t("DATE")}</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {logs?.map((log) => (
                <CTableRow key={log.id}>
                  <CTableDataCell>
                    {t(formatLocalizationKey(log.status))}
                  </CTableDataCell>
                  <CTableDataCell>
                    {new Date(log.at).toLocaleString(
                      dateLocales[i18n.language]
                    )}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
        <CModalFooter>
          <CButton color="secondary" onClick={onCloseModal}>
            {t("CLOSE", namespaces.GLOBAL)}
          </CButton>
        </CModalFooter>
      </CModal>
      <h2 className="mb-3">{t("YOUR_ORDERS")}</h2>
      <CRow xs={{ gutterY: 2 }}>
        {loading ? (
          Children.toArray(
            _.range(0, 3).map(() => (
              <CCol xl={12}>
                <CCard>
                  <Placeholder as={CCardHeader} animation="glow">
                    <Placeholder xs={4} />
                  </Placeholder>
                  <CCardBody>
                    <CRow>
                      <CCol xl={4}>
                        <Placeholder as={CCardTitle} animation="glow">
                          <Placeholder xs={6} />
                        </Placeholder>
                      </CCol>
                      <CCol xl={4}>
                        <Placeholder as={CCardTitle} animation="glow">
                          <Placeholder xs={6} />
                        </Placeholder>
                      </CCol>
                      <CCol xl={4}>
                        <Placeholder as={CCardTitle} animation="glow">
                          <Placeholder xs={6} />
                        </Placeholder>
                      </CCol>
                      <hr style={styles} />
                      <CCol xl={4}>
                        <Placeholder as={CCardTitle} animation="glow">
                          <Placeholder xs={6} />
                        </Placeholder>
                      </CCol>
                      <CCol xl={4}>
                        <Placeholder as={CCardTitle} animation="glow">
                          <Placeholder xs={6} />
                        </Placeholder>
                      </CCol>

                      <hr style={styles} />
                    </CRow>
                    <CRow>
                      <CCol sm="auto">
                        <Placeholder.Button
                          animation="wave"
                          variant="primary"
                          size="lg"
                        />
                      </CCol>
                      <CCol sm="auto">
                        <Placeholder.Button
                          animation="wave"
                          variant="secondary"
                          size="lg"
                        />
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
            ))
          )
        ) : data?.length === 0 ? (
          <h4>{t("NO_ORDERS")}</h4>
        ) : (
          <>
            {React.Children.toArray(
              data?.map(
                ({
                  id,
                  customer_order_id,
                  grand_total,
                  payment_method,
                  status,
                  address: { first_name, last_name },
                  created_at,
                }) => (
                  <CCol xs={12}>
                    <CCard>
                      <CCardHeader component="h5">
                        {t("ORDER_NUMBER")} {customer_order_id}
                      </CCardHeader>
                      <CCardBody>
                        <CRow>
                          <CCol xs={6} md={6} lg={4}>
                            <CCardTitle>
                              <strong>{t("RECIPIENT_NAME")}</strong>
                              {`: ${first_name} ${last_name}`}
                            </CCardTitle>
                          </CCol>
                          <CCol xs={6} md={6} lg={4}>
                            <CCardTitle>
                              <strong>
                                {t("TOTAL_PRICE", namespaces.CHECKOUT)}
                              </strong>
                              {`: ${grand_total} ${t(
                                "JOD",
                                namespaces.PRODUCT
                              )}`}{" "}
                            </CCardTitle>
                          </CCol>
                          <CCol xs={6} md={6} lg={4}>
                            <CCardTitle>
                              <strong>{t("STATUS")}: </strong>
                              {t(formatLocalizationKey(status))}{" "}
                            </CCardTitle>
                          </CCol>
                          <hr style={styles} />
                          <CCol xs={6} md={6} lg={4}>
                            <CCardTitle>
                              <strong>{t("PLACED_AT")}</strong>
                              {`: ${Intl.DateTimeFormat(
                                dateLocales[i18n.language],
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              ).format(new Date(created_at))}`}
                            </CCardTitle>
                          </CCol>
                          <CCol xs={6} md={6} lg={4}>
                            <CCardTitle>
                              <strong>{t("PAYMENT_METHOD")}</strong>
                              {`: ${t(payment_method)}`}
                            </CCardTitle>
                          </CCol>

                          <hr style={styles} />
                        </CRow>
                        <CRow>
                          <CCol sm="auto">
                            <Link to={`/settings/orderItems/${id}`}>
                              <CButton>{t("VIEW_DETAILS")}</CButton>
                            </Link>
                          </CCol>
                          <CCol sm="auto">
                            <CButton
                              color="secondary"
                              onClick={() => logsModal(id)}
                            >
                              {t("TRACK")}
                            </CButton>
                          </CCol>
                        </CRow>
                      </CCardBody>
                    </CCard>
                  </CCol>
                )
              )
            )}
            <Paginator
              count={count}
              params={params}
              // changeData={getOrderHandler}
              onPageChange={handlePageChange}
              // cookieName="orders"
            />
          </>
        )}
      </CRow>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { getOrderHandler, getOrderLogs };

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
