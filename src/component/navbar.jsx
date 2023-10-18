import React, { useState, useEffect, Children } from "react";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  DropdownButton,
  ButtonGroup,
  Dropdown,
  Form,
  FormControl,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { connect } from "react-redux";
import { parentCategoryHandler } from "../store/parent";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const MainNavbar = ({ parentData }) => {
  const { t, i18n } = useTranslation();
  const { parentCategory, childCategory, grandChildCategory } = parentData;
  const [lang, setLang] = useState("");
  const navigate = useNavigate();

  return (
    <Navbar bg="light" variant="light" className="min-vw-100 ">
      <Row className="justify-content-center w-100">
        <Col md={12} lg={8} xl={8} xxl={6}>
          <Nav className="px-1">
            {Children.toArray(
              parentCategory?.slice(0, 6).map((parent) => {
                const children = childCategory.filter(
                  (element) => element.parent_id === parent.id
                );
                return (
                  children.length > 0 && (
                    <NavDropdown
                      title={parent[`${i18n.language}title`]}
                      className="text-capitalize mx-auto"
                    >
                      {Children.toArray(
                        children.map((child) => {
                          const grandChildren = grandChildCategory.filter(
                            (element) => element.parent_id === child.id
                          );
                          return grandChildren.length > 0 ? (
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
        <Col lg={4} xl={2} xxl={2} className="lg-show">
          <Form
            className="d-flex "
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/products?key=${e.target.key.value}`);
            }}
          >
            <FormControl
              type="search"
              placeholder="Search for products"
              className="me-2"
              aria-label="Search"
              id="key"
            />
            <Button variant="outline-success" type="submit">
              Search
            </Button>
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
