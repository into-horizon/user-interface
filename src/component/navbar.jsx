import React, { Children } from "react";
import { Navbar, Nav, NavDropdown, Form, Row, Col } from "react-bootstrap";
import { connect, useSelector } from "react-redux";
import { parentCategoryHandler } from "../store/parent";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";
import { CButton, CFormInput } from "@coreui/react";
import LocalizedInputGroup from "./common/LocalizedInputGroup";
const MainNavbar = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.category);

  return (
    <Navbar bg="light" variant="light" className="min-vw-100 mx-auto">
      <Row className="justify-content-center mx-auto w-100 ">
        <Col md={12} lg={8} xl={8} xxl={6}>
          <Nav className="px-1">
            {Children.toArray(
              data?.slice(0, 6).map((parent) => {
                const children = parent.children;
                return (
                  children?.length > 0 && (
                    <NavDropdown
                      title={parent[`${i18n.language}title`]}
                      className="text-capitalize mx-auto"
                    >
                      {Children.toArray(
                        children.map((child) => {
                          const grandChildren = child.children;
                          return grandChildren?.length > 0 ? (
                            <NavDropdown
                              title={child[`${i18n.language}title`]}
                              className="text-capitalize"
                            >
                              {Children.toArray(
                                grandChildren.map((grandchild) => (
                                  <Link
                                    to={`/products?grandchild_category_id=${grandchild.id}`}
                                    className="nav-link text-capitalize"
                                  >
                                    {grandchild[`${i18n.language}title`]}
                                  </Link>
                                ))
                              )}
                            </NavDropdown>
                          ) : (
                            <Link
                              to={`/products?child_category_id=${child.id}`}
                              className="nav-link text-capitalize"
                            >
                              {child[`${i18n.language}title`]}
                            </Link>
                          );
                        })
                      )}
                    </NavDropdown>
                  )
                );
              })
            )}
          </Nav>
        </Col>
        <Col lg={3} xl={3} xxl={2} className="lg-show">
          <Form
            className="d-flex"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/products?key=${e.target.key.value}`);
            }}
          >
            <LocalizedInputGroup>
              <CFormInput
                type="search"
                placeholder="Search for products"
                aria-label="Search"
                id="key"
                required
              />
              <CButton color="outline-success" type="submit">
                <CIcon icon={cilSearch} />
              </CButton>
            </LocalizedInputGroup>
          </Form>
        </Col>
      </Row>
    </Navbar>
  );
};
const mapStateToProps = (state) => ({
  parentData: state.parent ? state.parent : null,
});
const mapDispatchToProps = { parentCategoryHandler };

export default connect(mapStateToProps, mapDispatchToProps)(MainNavbar);
