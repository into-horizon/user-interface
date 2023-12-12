import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { Tabs, Tab } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import ProductCard from "./ProductCard";
import Store from "../services/Store";
import { CButton, CRow, CCol } from "@coreui/react";
import { getStoreProductsHandler } from "../store/products";
import { Col, Row } from "react-bootstrap";
import { cilUserFollow, cilUserUnfollow } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { followStoreHandler, unFollowStoreHandler } from "../store/following";
import LoadingSpinner from "./common/LoadingSpinner";
import Paginator from "./common/Paginator";

const Seller = ({
  getStoreProductsHandler,
  followStoreHandler,
  unFollowStoreHandler,
}) => {
  const { login } = useSelector((state) => state.sign);
  const { following } = useSelector((state) => state.follow);
  const [seller, setSeller] = useState({});
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { id } = useParams();
  const [params, setParams] = useState({ limit: 10, offset: 0, store_id: id });
  const { data:storeProducts, count  } = useSelector((state) => state.products.storeProducts );
  const [followed, setFollowed] = useState(false);
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    Promise.all([Store.getStore(id), getStoreProductsHandler(params)]).then(
      ([{ data, status }]) => {
        setSeller(data);
        setLoading(false);
        setFollowers(Number(data.followers));
      }
    );
  }, [getStoreProductsHandler, id, params]);

  useEffect(() => {
    setProducts(storeProducts);
  }, [storeProducts]);

  useEffect(() => {
    setFollowed(() => !!following.find((s) => s.store_id === seller.id));
  }, [following, seller.id]);

  const handlePageChange = (n) => {
    setParams((currentParams) => {
      const newParams = {
        ...currentParams,
        offset: currentParams?.limit * (n - 1),
      };
      getStoreProductsHandler(newParams);
      return newParams;
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <CRow className="main-container p-xl-5 mx-xl-5 justify-content-center w-100  ">
      <CCol className="row border-5 border-light rounded border p-2 " xxl={8}>
        <CCol xs={12} sm="auto " className=" d-flex ">
          <Image
            src={seller?.store_picture}
            alt="avatar"
            thumbnail={true}
            rounded={true}
            width={200}
            height={200}
            xs={12}
            className=" mx-auto "
          />
        </CCol>
        <CCol className="p-3  ">
          <CRow className="gy-1">
            <CCol xs="auto">
              <h3>{seller.store_name}</h3>
            </CCol>
            <CCol xs="auto">
              <StarRatings
                rating={seller.rate}
                starDimension="1.5rem"
                starSpacing=".05rem"
                starRatedColor="yellow"
              />
            </CCol>
            <CCol xs={12}>
              <p>{seller.caption}</p>
            </CCol>
            <CCol xs="auto" className="my-2">
              <span className="border border-1 rounded border-black p-2 ">
                followers: {followers}
              </span>
            </CCol>
            <CCol xs={12} className="">
              {login && (
                <>
                  {followed ? (
                    <CButton
                      color="danger"
                      onClick={() =>
                        unFollowStoreHandler(seller.id).then(() =>
                          setFollowers((x) => --x)
                        )
                      }
                    >
                      <CIcon icon={cilUserUnfollow} size="lg" />
                      unfollow
                    </CButton>
                  ) : (
                    <CButton
                      color="secondary"
                      onClick={() =>
                        followStoreHandler(seller.id).then(() =>
                          setFollowers((x) => ++x)
                        )
                      }
                    >
                      <CIcon icon={cilUserFollow} size="lg" />
                      follow
                    </CButton>
                  )}
                </>
              )}
            </CCol>
          </CRow>
          <br />
        </CCol>
      </CCol>
      <hr />
      <CCol>
        <Tabs defaultActiveKey="Products" className="mb-3">
          <Tab eventKey="Products" title="Products" className="mx-auto">
            <h2 className=" border-1 border-bottom  border-info text-center pb-3 w-50 mx-auto ">
              Our Products
            </h2>
            <div>
              <Row className="pb-5 w-100 justify-content-center gy-4  ">
                {React.Children.toArray(
                  products.map((product) => (
                    <Col lg={6} md={6} sm={8} xs={10} xl={4} xxl={4}>
                      <ProductCard
                        product={product}
                        itemType="product"
                        pic="array"
                      />
                    </Col>
                  ))
                )}
                <Col xs={12}>
                  <Paginator
                    onPageChange={handlePageChange}
                    count={count}
                    pageSize={10}
                    params={params}
                  />
                </Col>
              </Row>
            </div>
          </Tab>
          <Tab eventKey="contact" title="Offers (Coming Soon)" disabled>
            <p>
              Take all my loves, my love, yea take them all; What hast thou then
              more than thou hadst before? No love, my love, that thou mayst
              true love call; All mine was thine, before thou hadst this more.
              Then, if for my love, thou my love receivest, I cannot blame thee,
              for my love thou usest; But yet be blam'd, if thou thy self
              deceivest By wilful taste of what thyself refusest. I do forgive
              thy robbery, gentle thief, Although thou steal thee all my
              poverty:
            </p>
          </Tab>
        </Tabs>
      </CCol>
    </CRow>
  );
};
const mapDispatchToProps = {
  getStoreProductsHandler,
  followStoreHandler,
  unFollowStoreHandler,
};
export default connect(null, mapDispatchToProps)(Seller);
