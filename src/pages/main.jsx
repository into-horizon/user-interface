import React, { useState, useEffect, useMemo } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import MainNavbar from '../component/navbar';
import ProductView from '../component/featuredDeals';
import CarouselItem from '../component/carousel';
import { useSelector } from 'react-redux';
import { Children } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { selectStores } from '../store/landingPage';
import StarRatings from 'react-star-ratings';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../i18n';
import LoadingSpinner from '../component/common/LoadingSpinner';

const initialOffset = 68;
const Main = () => {
  const { t, i18n } = useTranslation([
    namespaces.LANDING_PAGE.ns,
    namespaces.GLOBAL.ns,
  ]);
  const { childCategory } = useSelector((state) => state.parent);
  const { landingPageCategories, isLoading } = useSelector(
    (state) => state.category
  );
  const stores = useSelector(selectStores);
  const navigate = useNavigate();
  const [offset, setOffset] = useState(initialOffset);
  const style = useMemo(
    () => ({
      top: offset,
    }),
    [offset]
  );

  useEffect(() => {
    const offsetHandler = () => {
      if (initialOffset - window.scrollY > 0) {
        setOffset(initialOffset - window.scrollY);
      } else {
        setOffset(0);
      }
    };
    window.addEventListener('scroll', offsetHandler);
    return () => window.removeEventListener('scroll', offsetHandler);
  }, []);

  return (
    <Row className=' justify-content-center main w-100 '>
      <div
        className='min-vw-100 p-0 md-show w-100 start-0 position-fixed  z-3  '
        style={style}
      >
        <MainNavbar />
      </div>

      <Col xs={12} lg={12} className='h-md-50 w-100 '>
        <CarouselItem />
      </Col>

      <Col xs={12} className='p-5 w-100 '>
        <Row className=' justify-content-center w-100 m-auto w-auto w-100 '>
          <Col xs={3} xl={3} xxl={3} className='lg-show'>
            <Card className='m-auto' style={{ height: 'min-content' }}>
              <Card.Title className='my-1'>
                {t('Discover'.toUpperCase())}
              </Card.Title>
              <hr className='w-75 mx-auto my-3 ' />
              <Row className=' w-100  m-auto'>
                {Children.toArray(
                  childCategory?.map((category) => (
                    <>
                      <Col xs={10}>
                        <Link
                          to={`/products?child_category_id=${category.id}`}
                          className='text-dark'
                        >
                          <h6 className='px-2 text-capitalize my-2'>
                            {category[`${i18n.language}title`]}
                          </h6>
                        </Link>
                      </Col>
                      <Col xs={2}>
                        <span className='text-align-center m-auto'>
                          {category.products_count}
                        </span>
                      </Col>
                    </>
                  ))
                )}
              </Row>
            </Card>
          </Col>
          <Col md={12} lg={8} xl={9} xxl={8}>
            <Row className='justify-content-center align-items-center w-100 '>
              {Children.toArray(
                stores?.slice(0, 2).map((store) => (
                  <Col md={6} xs={10} sm={8} xl={5} className='mt-2'>
                    <Card className='h-75'>
                      <Card.Img
                        variant='top'
                        className='w-100 p-2'
                        src={store.store_picture}
                      />
                      <Card.Header>
                        {t('Store_Name'.toUpperCase())}:{' '}
                        <span className='fw-bold'>{store.store_name}</span>
                      </Card.Header>
                      <Card.Body>
                        <span className='fw-bold'>{t('RATING')}: </span>
                        <StarRatings
                          rating={store.store_rating}
                          starDimension='1.5rem'
                          starSpacing='.05rem'
                          starRatedColor='yellow'
                        />
                      </Card.Body>
                      <Card.Body className=' d-flex justify-content-between '>
                        <Card.Link as={Button} variant='secondary'>
                          {t('Follow_Store'.toUpperCase())}
                        </Card.Link>
                        <Card.Link
                          as={Button}
                          variant='primary'
                          onClick={() => navigate(`/store/${store.id}`)}
                        >
                          {t('Visit_Store'.toUpperCase())}
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
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        Children.toArray(
          landingPageCategories?.map((item) => (
            <Col xs={12} className='w-100 mx-auto '>
              <Row className='justify-content-center w-100 mx-auto  '>
                <Col xs={12} xl={10}>
                  <ProductView
                    {...item}
                    t={t}
                    title={item[`${i18n.language}title`]}
                  />
                </Col>
              </Row>
            </Col>
          ))
        )
      )}
    </Row>
  );
};

export default Main;
