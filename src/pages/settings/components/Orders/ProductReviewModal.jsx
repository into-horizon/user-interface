import CIcon from "@coreui/icons-react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CRow,
  CCol,
  CFormTextarea,
} from "@coreui/react";
import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { addReviewHandler } from "../../../../store/products";
import { cilStar } from "@coreui/icons";
import { Star, StarFill } from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";
import {
  AnimationType,
  DialogType,
  OutAnimationType,
  PopupProvider,
  usePopup,
  ToastPosition,
} from "react-custom-popup";
export const ProductReviewModal = ({
  addReviewHandler,
  visible,
  onClose,
  id,
}) => {
  const { showModal, showToast } = usePopup();
  const [rating, setRating] = useState(1);
  const submitHandler = (e) => {
    e.preventDefault();
    Promise.all([
      addReviewHandler({
        order_item_id: id,
        rate: rating,
        review: e.target.review.value,
      }),
    ]).then(() =>
      showToast({
        text: "Thanks for you review",
        type: DialogType.INFO,
        position: ToastPosition.BOTTOM_RIGHT,
        timeoutDuration: 5000,
      })
    );
    e.target.reset();
    closeDialog();
  };

  const closeDialog = () => {
    onClose();
    setRating(1);
  };
  return (
    <div>
      <CModal
        alignment="center"
        visible={visible}
        onClose={closeDialog}
        backdrop={false}
      >
        <CModalHeader>
          <CModalTitle>product review</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={submitHandler}>
          <CRow className="justify-content-md-center mg-1">
            <CCol xs="auto" className="pointer" onClick={() => setRating(1)}>
              <StarFill size={25} />
            </CCol>
            <CCol xs="auto" className="pointer" onClick={() => setRating(2)}>
              {rating > 1 ? <StarFill size={25} /> : <Star size={25} />}
            </CCol>
            <CCol xs="auto" className="pointer" onClick={() => setRating(3)}>
              {rating > 2 ? <StarFill size={25} /> : <Star size={25} />}
            </CCol>
            <CCol xs="auto" className="pointer" onClick={() => setRating(4)}>
              {rating > 3 ? <StarFill size={25} /> : <Star size={25} />}
            </CCol>
            <CCol xs="auto" className="pointer" onClick={() => setRating(5)}>
              {rating > 4 ? <StarFill size={25} /> : <Star size={25} />}
            </CCol>
            <CCol xs={11} className="mg-1">
              <CFormTextarea
                id="review"
                label="Write Review"
                rows="3"
              ></CFormTextarea>
            </CCol>
          </CRow>
          <CModalFooter>
            <CRow>
              <CCol>
                <CButton color="primary" type="submit">
                  submit
                </CButton>
              </CCol>
              <CCol>
                <CButton color="secondary" onClick={closeDialog}>
                  close
                </CButton>
              </CCol>
            </CRow>
          </CModalFooter>
        </CForm>
      </CModal>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { addReviewHandler };

export default connect(mapStateToProps, mapDispatchToProps)(ProductReviewModal);
