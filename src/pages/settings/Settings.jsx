import React, {
  useState,
  useEffect,
  Children,
  useCallback,
  Fragment,
} from 'react';
import { useSelector } from 'react-redux';
import {
  Link,
  useLocation,
  useNavigate,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { CSidebar, CSidebarBrand, CSidebarNav, CButton } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilUser,
  cilMap,
  cilNotes,
  cilTruck,
  cilExpandLeft,
  cilExpandRight,
} from '@coreui/icons';
import { useTranslation } from 'react-i18next';
import { namespaces } from '../../i18n';
import Header from '../../component/common/Header';

const routes = [
  {
    path: '/account',
    exact: true,
    sidebar: 'ACCOUNT',
    icon: cilUser,
  },
  {
    path: '/address',
    exact: true,
    sidebar: 'ADDRESSES',
    icon: cilMap,
  },
  {
    path: '/notification',
    exact: true,
    sidebar: 'NOTIFICATIONS',
    icon: cilNotes,
  },

  {
    path: '/orders',
    exact: true,
    sidebar: 'ORDERS',
    icon: cilTruck,
  },
  {
    path: '/orderItems/:id',
    exact: true,
    sidebar: 'Orders details',
    secondary: true,
  },
];
export const SideNavbar = ({ show, setShow, width }) => {
  const [narrow, setNarrow] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation([namespaces.SETTINGS.ns]);
  const navigate = useNavigate();
  const [icon, setIcon] = useState(cilExpandLeft);
  const [iconPosition, setIconPosition] = useState('text-end');
  const hideSidebar = useCallback(() => {
    width < 700 && setShow(false);
  }, [setShow, width]);

  useEffect(() => {
    width < 1000 && setNarrow(true);
  }, [width]);
  useEffect(() => {
    if (location.pathname === '/settings') {
      navigate('/settings/account');
    }
  }, [location.pathname, navigate]);
  useEffect(() => {
    if (
      (narrow && i18n.language === 'ar') ||
      (!narrow && i18n.language === 'en')
    ) {
      setIcon(cilExpandLeft);
    } else setIcon(cilExpandRight);
    if (narrow) {
      setIconPosition('text-center');
    } else if (i18n.language === 'ar') {
      setIconPosition('text-start');
    } else if (i18n.language === 'en') {
      setIconPosition('text-end');
    }
  }, [narrow, i18n.language]);
  return (
    <Fragment>
      <CSidebar narrow={narrow} visible={show} onHide={hideSidebar}>
        <CSidebarBrand className='bg-primary border-top border-light'>
          {t('SETTINGS')}
        </CSidebarBrand>
        <CSidebarNav className='bg-light'>
          {Children.toArray(
            routes.map((route) =>
              route.secondary ? null : (
                <li className='nav-item'>
                  <Link className='nav-link' to={`/settings${route.path}`}>
                    <CIcon
                      customClassName='nav-icon'
                      icon={route.icon}
                      className='mx-auto'
                    />
                    {t(route.sidebar)}
                  </Link>
                </li>
              )
            )
          )}
        </CSidebarNav>

        <CButton
          className={`rounded-0 bg-primary  position-relative p-2 ${iconPosition}`}
          onClick={() => setNarrow(!narrow)}
        >
          <CIcon
            icon={icon}
            size='xl'
            className=' mx-0 '
            style={{ '--ci-primary-color': '#fff' }}
          />
        </CButton>
      </CSidebar>
    </Fragment>
  );
};
const Settings = () => {
  const { t } = useTranslation([namespaces.SETTINGS.ns]);
  const { login } = useSelector((state) => state.sign);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [show, setShow] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!login) {
    return <Navigate to={'/signin'} />;
  }
  return (
    <Row className='justify-content-start w-100 '>
      <Header />
      {!show && (
        <CButton
          color='info'
          className=' position-relative'
          onClick={() => setShow(true)}
        >
          {t('SETTINGS_MENU')}
        </CButton>
      )}
      <Col xs={'auto'}>
        <SideNavbar show={show} setShow={setShow} width={windowWidth} />
      </Col>

      <Col lg={6} md={9} sm={11} xs={12} className='m-3'>
        <Outlet />
      </Col>
    </Row>
  );
};

export default Settings;
