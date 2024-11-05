import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
  CForm,
  CRow,
  CCol,
  CFormTextarea,
} from "@coreui/react";
import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { addReviewHandler } from "../../../../store/products";
import { Star, StarFill } from "react-bootstrap-icons";
import { PopupType } from "react-custom-popup";
import { triggerToast } from "../../../../store/toast";
import { useTranslation } from "react-i18next";
import { namespaces } from "../../../../i18n";
export const ProductReviewModal = ({
  addReviewHandler,
  visible,
  onClose,
  id,
}) => {
  const [rating, setRating] = useState(1);
  const { t } = useTranslation([namespaces.ORDERS.ns, namespaces.GLOBAL.ns]);
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    Promise.all([
      addReviewHandler({
        order_item_id: id,
        rate: rating,
        review: e.target.review.value,
      }),
    ]).then(() =>
      dispatch(
        triggerToast({
          message: t("REVIEW_SUBMITTED"),
          type: PopupType.INFO,
        })
      )
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
          <CModalTitle>{t("PRODUCT_REVIEW")}</CModalTitle>
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
                floatingLabel={t("WRITE_REVIEW")}
                label={t("WRITE_REVIEW")}
                rows="3"
              ></CFormTextarea>
            </CCol>
          </CRow>
          <CModalFooter>
            <CRow>
              <CCol>
                <CButton color="primary" type="submit">
                  {t("SUBMIT", namespaces.GLOBAL)}
                </CButton>
              </CCol>
              <CCol>
                <CButton color="secondary" onClick={closeDialog}>
                  {t("CLOSE", namespaces.GLOBAL)}
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
