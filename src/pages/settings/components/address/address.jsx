import React, { Children, Fragment, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Row, Col, ListGroup, Placeholder } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { CButton, CTooltip } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPen, cilPlus } from "@coreui/icons";
import AddressModal from "./AddressModal";
import Paginator from "../../../../component/common/Paginator";
import DeleteModal from "../../../../component/common/DeleteModal";
import {
  updateAddressHandler,
  addAddressHandler,
  myAddressHandler,
  removeAddressHandler,
} from "../../../../store/address";
import { useState } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { namespaces } from "../../../../i18n";

const Address = ({
  updateAddressHandler,
  addAddressHandler,
  removeAddressHandler,
  myAddressHandler,
}) => {
  const [params, setParams] = useState({ limit: 5, offset: 0 });
  const { t } = useTranslation([
    namespaces.ADDRESS.ns,
    namespaces.GLOBAL.ns,
    namespaces.SIGN_UP.ns,
  ]);
  const {
    data: addresses,
    count,
    loading,
  } = useSelector((state) => state.address);
  // const dispatch = useDispatch();
  const deleteHandler = async (id) => {
    await removeAddressHandler({ id: id });
  };

  const AddBtnComponent = (props) => (
    <CTooltip content={t("ADD_ADDRESS_TOOLTIP")}>
      <CButton className="my-2" {...props}>
        <CIcon icon={cilPlus} />
      </CButton>
    </CTooltip>
  );
  const UpdateBtnComponent = (props) => (
    <CTooltip content={t("EDIT", namespaces.GLOBAL)}>
      <CButton color="secondary" {...props} size="sm">
        <CIcon icon={cilPen} size="sm" />
      </CButton>
    </CTooltip>
  );
  const handleDelete = async (id) => {
    await deleteHandler(id);
    myAddressHandler(params);
  };
  const handlePageChange = (pageNumber) => {
    setParams((currentParams) => {
      const newParams = {
        ...currentParams,
        offset: currentParams.limit * (pageNumber - 1),
      };
      myAddressHandler(newParams);
      return newParams;
    });
  };

  useEffect(() => {
    myAddressHandler(params);
  }, [myAddressHandler, params]);
  const AddressItem = ({ label, value }) => (
    <Fragment>
      {value && (
        <>
          {label}: <bdi>{value}</bdi>
          <br />
        </>
      )}
    </Fragment>
  );

  return (
    <>
      <AddressModal
        BtnComponent={AddBtnComponent}
        setCurrentAddress
        handleSubmit={async (address, close) => {
          await addAddressHandler(address);
          myAddressHandler(params);
          close();
        }}
      />
      <div>
        {loading ? (
          Children.toArray(
            _.range(0, 3).map(() => (
              <ListGroup>
                <ListGroup.Item
                  action
                  variant="info"
                  as={"div"}
                  className="col-12 my-1"
                >
                  <Row>
                    <Col xs={"10"}>
                      <Placeholder animation="glow" as={"p"}>
                        <Placeholder xs={2} /> <Placeholder xs={9} />
                      </Placeholder>
                      <Placeholder animation="glow" as={"p"}>
                        <Placeholder xs={2} /> <Placeholder xs={6} />
                      </Placeholder>
                      <Placeholder animation="glow" as={"p"}>
                        <Placeholder xs={2} />{" "}
                        <Placeholder as={"span"} xs={4} />
                      </Placeholder>
                    </Col>
                    <Col xs={"2"}>
                      <Placeholder.Button
                        animation="wave"
                        xs={3}
                        variant="secondary"
                      />
                      <Placeholder.Button
                        animation="wave"
                        xs={3}
                        variant="danger"
                      />
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            ))
          )
        ) : addresses.length === 0 ? (
          <h3>{t("NO_ADDRESSES")}</h3>
        ) : (
          <>
            <ListGroup>
              {Children.toArray(
                addresses?.map((el) => (
                  <ListGroup.Item
                    action
                    variant="info"
                    key={el.id}
                    as={"div"}
                    className="col-12 my-1"
                  >
                    <Row>
                      <Col xs={"10"}>
                        <p>
                          <AddressItem
                            value={`${el.first_name}  ${el.last_name}`}
                            label={t("NAME")}
                          />
                          <AddressItem
                            value={t(el.city, namespaces.SIGN_UP)}
                            label={t("CITY")}
                          />
                          <AddressItem value={el.region} label={t("REGION")} />
                          <AddressItem
                            value={el.street_name}
                            label={t("STREET")}
                          />
                          <AddressItem value={el.mobile} label={t("MOBILE")} />
                        </p>
                      </Col>

                      <Col xs={"2"} className=" d-flex gap-1  ">
                        <div>
                          <AddressModal
                            addressProp={el}
                            BtnComponent={UpdateBtnComponent}
                            handleSubmit={async (address, close) => {
                              await updateAddressHandler(address);
                              myAddressHandler(params);
                              close();
                            }}
                          />
                        </div>
                        <div>
                          <DeleteModal
                            onConfirm={() => handleDelete(el.id)}
                            btnSize={"sm"}
                          />
                        </div>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
            <Paginator
              count={count}
              params={params}
              // changeData={myAddressHandler}
              // cookieName="addresses"
              // updateParams={setParams}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </>
  );
};

const mapDispatchToProps = {
  updateAddressHandler,
  addAddressHandler,
  myAddressHandler,
  removeAddressHandler,
};

export default connect(null, mapDispatchToProps)(Address);
