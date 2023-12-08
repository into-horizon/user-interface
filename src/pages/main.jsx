import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import MainNavbar from "../component/navbar";
import ProductView from "../component/featuredDeals";
// import escapes from "../static-data/escapes";
import CarouselItem from "../component/carousel";
import { useSelector } from "react-redux";
import { Children } from "react";
import { Link, useNavigate } from "react-router-dom";
import { selectStores } from "../store/landingPage";
import StarRatings from "react-star-ratings";
import Product from "../services/Product";

const Main = () => {
  const { parentCategory, childCategory } = useSelector(
    (state) => state.parent
  );
  const stores = useSelector(selectStores);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  let o = 68;
  const [offset, setOffset] = useState(o);
  let style = {
    // position: "fixed",
    top: offset,
    // zIndex: 22,
  };
  window.addEventListener("scroll", () => {
    if (o - window.pageYOffset > 0) {
      setOffset(o - window.pageYOffset);
    } else {
      setOffset(0);
    }
  });
  const getProducts = () => {
    return parentCategory.slice(0, 3).map(async (category) => {
      const {
        data: { data: products },
      } = await Product.productsSearch({
        parent_category_id: category.id,
        limit: 4,
      });
      setCategories((state) => [
        ...state,
        { id: category.id, title: category.entitle, products },
      ]);
    });
  };
  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentCategory]);

  return (
    <Row className=" justify-content-center main-container w-100 ">
      <div className="min-vw-100 p-0 md-show w-100 start-0 position-fixed  z-3  " style={style}>
        <MainNavbar />
      </div>

      <Col xs={12} lg={12} className="h-md-50 w-100 ">
        <CarouselItem />
      </Col>

      <Col xs={12} className="p-5 w-100 ">
        <Row className=" justify-content-center w-100 m-auto w-auto w-100 ">
          <Col xs={3} xl={3} xxl={3} className="lg-show">
            <Card className="m-auto" style={{ height: "min-content" }}>
              <Card.Title className="my-1">Discover</Card.Title>
              <hr className="w-75 mx-auto my-3 " />
              <Row className=' w-100 '> 
                {Children.toArray(
                  childCategory?.map((category) => (
                    <>
                      <Col xs={10}>
                        <Link
                          to={`/products?child_category_id=${category.id}`}
                          className="text-dark"
                        >
                          <h6 className="px-2 text-capitalize my-2">
                            {category.entitle}
                          </h6>
                        </Link>
                      </Col>
                      <Col xs={2}>
                        <span className="text-align-center m-auto">
                          {category.products_count}
                        </span>
                      </Col>
                    </>
                  ))
                )}
              </Row>
            </Card>
          </Col>
          <Col md={12} lg={8} xl={9} xxl={8} >
            <Row className="justify-content-center align-items-center w-100 ">
              {Children.toArray(
                stores.slice(0, 2).map((store) => (
                  <Col md={6} xs={10} sm={8} xl={5} className="mt-2">
                    <Card className="h-75">
                      <Card.Img
                        variant="top"
                        className="w-100 p-2"
                        src={store.store_picture}
                      />
                      <Card.Header>
                        Store Name:{" "}
                        <span className="fw-bold">{store.store_name}</span>
                      </Card.Header>
                      <Card.Body>
                        <span className="fw-bold">Rating: </span>
                        <StarRatings
                          rating={store.store_rating}
                          starDimension="1.5rem"
                          starSpacing=".05rem"
                          starRatedColor="yellow"
                        />
                      </Card.Body>
                      <Card.Body>
                        <Card.Link as={Button} variant="secondary">
                          Follow Store
                        </Card.Link>
                        <Card.Link
                          as={Button}
                          variant="primary"
                          onClick={() => navigate(`/store/${store.id}`)}
                        >
                          Visit Store
                        </Card.Link>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Col>
        </Row>
      </Col>
      {Children.toArray(
        categories?.map((item) => (
          <Col xs={12} className="w-100 mx-auto ">
            <Row className="justify-content-center w-100 mx-auto  ">
              <Col xs={12} xl={10}>
                <ProductView {...item} />
              </Col>
            </Row>
          </Col>
        ))
      )}
    </Row>
  );
};

export default Main;
