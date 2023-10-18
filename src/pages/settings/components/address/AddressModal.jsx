import React, { useEffect, useRef, useState } from "react";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { cilPlus } from "@coreui/icons";
import Map from "./Map";

const AddressModal = ({
  handleSubmit,
  BtnComponent,
  addressProp,
  close,
  setCurrentAddress,
}) => {
  const [address, setAddress] = useState(addressProp ?? {});
  const [showModal, setShowModal] = useState(false);
  const submitBtn = useRef(null);
  useEffect(() => {
    if (close) {
      setShowModal(false);
    }
  }, [close]);
  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(address, () => setShowModal(false));
  };

  const onChange = (e) => {
    setAddress({ ...address, [e?.target?.id]: e?.target?.value });
  };
  const setStr = (e) => {
    setAddress((a) => {
      return {
        ...a,
        building_number:
          e.address_components.find((x) => x.types.includes("street_number"))
            ?.long_name ?? "",
        street_name:
          e.address_components.find((x) => x.types.includes("route"))
            ?.long_name ?? "",
        region:
          e.address_components.find((x) => x.types.includes("sublocality"))
            ?.long_name ?? "",
        city:
          e.address_components.find((x) => x.types.includes("locality"))
            ?.long_name ?? "",
        lat: e.geometry.location.lat ?? "",
        lng: e.geometry.location.lng ?? "",
      };
    });
  };
  return (
    <>
      {BtnComponent && <BtnComponent onClick={() => setShowModal(true)} />}
      <CModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        alignment="center"
        scrollable
      >
        <CModalHeader>
          <CModalTitle>Address</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <Form onSubmit={onSubmit}>
            <Row>
              <Col xs={"12"} md={"6"}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    placeholder="City"
                    name="city"
                    id="city"
                    value={address.city ?? ""}
                    onChange={onChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={"12"} md={"6"}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name </Form.Label>
                  <Form.Control
                    placeholder="first name"
                    name="first_name"
                    id="first_name"
                    value={address.first_name ?? ""}
                    onChange={onChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={"12"} md={"6"}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    placeholder="last name"
                    name="last_name"
                    id="last_name"
                    value={address.last_name ?? ""}
                    onChange={onChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={"12"} md={"6"}>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    placeholder="Mobile"
                    name="mobile"
                    id="mobile"
                    value={address.mobile ?? ""}
                    onChange={onChange}
                  />
                </Form.Group>
              </Col>

              <Col xs={"12"} md={"6"}>
                <Form.Group className="mb-3">
                  <Form.Label>Region</Form.Label>
                  <Form.Control
                    placeholder="region"
                    name="region"
                    id="region"
                    value={address.region ?? ""}
                    onChange={onChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={"12"} md={"6"}>
                <Form.Group className="mb-3">
                  <Form.Label>Street Name</Form.Label>
                  <Form.Control
                    placeholder="street name"
                    name="street_name"
                    id="street_name"
                    value={address.street_name ?? ""}
                    onChange={onChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={"12"} md={"6"}>
                <Form.Group className="mb-3">
                  <Form.Label>building Name OR building Number </Form.Label>
                  <Form.Control
                    placeholder="building"
                    name="building"
                    id="building_number"
                    value={address.building_number ?? ""}
                    onChange={onChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={"12"} md={"6"}>
                <Form.Group className="mb-3">
                  <Form.Label> apartment Number </Form.Label>
                  <Form.Control
                    placeholder="apartment number"
                    name="apartment_number"
                    id="apartment_number"
                    value={address.apartment_number ?? ""}
                    onChange={onChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={"12"} md={"6"}>
                {["checkbox"].map((type) => (
                  <div key={`default-${type}`} className="mb-3">
                    <Form.Check
                      type={type}
                      name="default_address"
                      id={`default-${type}`}
                      label={`default address`}
                      checked={!!address.default}
                      onChange={(e) =>
                        setAddress((address) => ({
                          ...address,
                          default: e.target.checked,
                        }))
                      }
                    />
                  </div>
                ))}
              </Col>
              <input type="hidden" id="lat" />
              <input type="hidden" id="lng" />
            </Row>
            <div className="m-auto">
              <Map onClick={setStr} setCurrentAddress={setCurrentAddress} />
            </div>
            <button type="submit" hidden ref={submitBtn}></button>
          </Form>
        </CModalBody>
        <CModalFooter>
          <Button variant="primary" onClick={() => submitBtn.current.click()}>
            Finish
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default AddressModal;
