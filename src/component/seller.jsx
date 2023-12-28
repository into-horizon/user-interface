import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { Tabs, Tab } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import ProductCard from "./productCard";
import Store from "../services/Store";
import { CButton, CRow, CCol } from "@coreui/react";
import {
  getStoreProductsHandler,
  searchProductsHandler,
  updateSearchQuery,
} from "../store/products";
import { Col, Row } from "react-bootstrap";
import { cilUserFollow, cilUserUnfollow } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  followStoreHandler,
  getStore,
  unFollowStoreHandler,
} from "../store/following";
import LoadingSpinner from "./common/LoadingSpinner";
import Paginator from "./common/Paginator";

const Seller = ({
  getStoreProductsHandler,
  followStoreHandler,
  unFollowStoreHandler,
}) => {
  const { login } = useSelector((state) => state.sign);
  const { following, store, isLoading } = useSelector((state) => state.follow);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const { id } = useParams();
  const [params, setParams] = useState({
    limit: 10,
    offset: 0,
    store_id: [id],
  });
  const {
    searchedProducts: { data: storeProducts, count },
    loading,
  } = useSelector((state) => state.products);
  const [followed, setFollowed] = useState(false);
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    dispatch(updateSearchQuery(params));
    dispatch(searchProductsHandler());
    dispatch(getStore(id));
    setFollowers(Number(store.followers ?? 0));
  }, [dispatch, id, params, store.followers]);

  useEffect(() => {
    setProducts(storeProducts);
  }, [storeProducts]);

  useEffect(() => {
    setFollowed(() => !!following.find((s) => s.store_id === store.id));
  }, [following, store.id]);

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

  if (loading || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <CRow className="main-container p-xl-5 mx-xl-5 justify-content-center w-100  ">
      <CCol className="row border-5 border-light rounded border p-2 " xxl={8}>
        <CCol xs={12} sm="auto " className=" d-flex ">
          <Image
            src={store?.store_picture}
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
              <h3>{store.store_name}</h3>
            </CCol>
            <CCol xs="auto">
              <StarRatings
                rating={store.rate}
                starDimension="1.5rem"
                starSpacing=".05rem"
                starRatedColor="yellow"
              />
            </CCol>
            <CCol xs={12}>
              <p>{store.caption}</p>
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
                        unFollowStoreHandler(store.id).then(() =>
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
                        followStoreHandler(store.id).then(() =>
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
