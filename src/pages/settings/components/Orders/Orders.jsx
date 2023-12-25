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

export const Orders = ({ getOrderHandler, getOrderLogs }) => {
  const { t } = useTranslation([
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
  return (
    <div>
      <CModal
        backdrop={false}
        alignment="center"
        visible={visible}
        onClose={onCloseModal}
      >
        <CModalHeader>
          <CModalTitle>order tracking</CModalTitle>
        </CModalHeader>
        {modalLoading ? (
          <CSpinner />
        ) : (
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">status</CTableHeaderCell>
                <CTableHeaderCell scope="col">date</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {logs?.map((log) => (
                <CTableRow key={log.id}>
                  <CTableDataCell>{log.status}</CTableDataCell>
                  <CTableDataCell>
                    {new Date(log.at).toLocaleString()}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
        <CModalFooter>
          <CButton color="secondary" onClick={onCloseModal}>
            Close
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
        ) : data.length === 0 ? (
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
                  <CCol xl={12}>
                    <CCard>
                      <CCardHeader component="h5">
                        order# {customer_order_id}
                      </CCardHeader>
                      <CCardBody>
                        <CRow>
                          <CCol xl={4}>
                            <CCardTitle>{`shipped to: ${first_name} ${last_name}`}</CCardTitle>
                          </CCol>
                          <CCol xl={4}>
                            <CCardTitle>
                              {`${t(
                                "TOTAL_PRICE",
                                namespaces.CHECKOUT
                              )}: ${grand_total}`}{" "}
                            </CCardTitle>
                          </CCol>
                          <CCol xl={4}>
                            <CCardTitle>status: {status} </CCardTitle>
                          </CCol>
                          <hr style={styles} />
                          <CCol xl={4}>
                            <CCardTitle>{`Placed At: ${
                              created_at.split("T")[0]
                            }`}</CCardTitle>
                          </CCol>
                          <CCol xl={4}>
                            <CCardTitle>{`Payment Method: ${payment_method}`}</CCardTitle>
                          </CCol>

                          <hr style={styles} />
                        </CRow>
                        <CRow>
                          <CCol sm="auto">
                            <Link to={`/settings/orderItems/${id}`}>
                              <CButton>order details</CButton>
                            </Link>
                          </CCol>
                          <CCol sm="auto">
                            <CButton
                              color="secondary"
                              onClick={() => logsModal(id)}
                            >
                              order tracking
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
