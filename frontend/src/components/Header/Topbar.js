import React from "react";
import { useEffect, useState } from "react";

import {
  Navbar,
  Nav,
  NavDropdown,
  Container,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import "./topbar.scss";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import GroupsIcon from "@mui/icons-material/Groups";
import TtyIcon from "@mui/icons-material/Tty";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PURGE } from "redux-persist";

import { useDispatch, useSelector } from "react-redux";
import { logoutRequest, clear } from "../../redux/features/user/userSlice";
import Loading from "../../more/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#FF9933",
    color: "white",
  },
}));

export default function Topbar(props) {
  const { isAuthenticated, user, status } = useSelector((state) => {
    return state.user;
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch({
      type: PURGE,
      key: "root", // Whatever you chose for the "key" value when initialising redux-persist in the **persistCombineReducers** method - e.g. "root"
      result: () => null, // Func expected on the submitted action.
    });
    // localStorage.removeItem("persist:root");
    window.localStorage.removeItem("persist:root");

    dispatch(logoutRequest());
  };
  // Search
  const [keyword, setKeyword] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/books/${keyword}`);
    } else {
      navigate("/books");
    }
  };
  // done
  useEffect(() => {
    if (isAuthenticated === false && user === null && status === true) {
      toast.success("????ng xu???t th??nh c??ng, vui l??ng ch??? trong 3s ????? quay l???i trang ????ng nh???p nh?? ????");
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
      dispatch(clear());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        setIsAdmin(true);
      }
    }
  }, [user]);

  const handleIsAuthenticated = () => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  };

  const { cartItems } = useSelector((state) => state.cart);
  const { pathname } = useLocation();
  return (
    <header id="section-header">
      <section className="header-main border-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-3 col-lg-3 col-md-12">
              <Navbar.Brand as={Link} to="/">
                <img
                  className="logo"
                  src="https://drive.google.com/uc?id=11dvknjzd0PYAK4D__KHpwxldlwahSi1g"
                  alt="UITBook-logo"
                />
              </Navbar.Brand>
            </div>
            <div className="col-xl-6 col-lg-5 col-md-6">
              <form action="#" className="search-header">
                <div className="input-group w-100">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="T??m ki???m s??ch theo"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <div className="input-group-append">
                    <Button variant="dark" onClick={handleSearch}>
                      <SearchIcon /> T??m ki???m
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6">
              <div className="widgets-wrap float-md-right">
                <div className="widget-header mr-3">
                  <Nav.Item>
                    <Nav.Link eventKey="link-2">
                      <div className="d-flex flex-column align-items-center">
                        <NotificationsIcon className="nav-icon" />
                        {/* Th??ng b??o */}
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                </div>
                <div className="widget-header mr-3">
                  <Nav.Link as={Link} to="/my-basket" eventKey="link-2">
                    <div className="d-flex flex-column align-items-center">
                      <IconButton aria-label="cart" style={{ padding: "0" }}>
                        <StyledBadge badgeContent={cartItems ? cartItems.length : 0}>
                          <ShoppingCartIcon className="nav-icon" />
                        </StyledBadge>
                      </IconButton>
                      {/* Gi??? h??ng */}
                    </div>
                  </Nav.Link>
                </div>
                <div className="widget-header">
                  <NavDropdown
                    align="end"
                    title={
                      <div
                        className="d-flex flex-column align-items-center"
                        onClick={handleIsAuthenticated}
                      >
                        <AccountBoxIcon className="nav-icon" />
                        {/* T??i kho???n */}
                      </div>
                    }
                    className="user-dropdown"
                    id="basic-nav-dropdown"
                  >
                    {isAuthenticated ? (
                      <>
                        <NavDropdown.Item as={Link} to="/my-account">
                          T??i kho???n
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/my-favorite-book">
                          S??ch y??u th??ch
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin-blog-new">
                          Vi???t blog
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        {isAdmin ? (
                          <NavDropdown.Item as={Link} to="/admin-user-list">
                            Trang qu???n l??
                          </NavDropdown.Item>
                        ) : (
                          <></>
                        )}
                        <NavDropdown.Item onClick={handleLogout}>
                          ????ng xu???t
                        </NavDropdown.Item>
                      </>
                    ) : (
                      <>
                        <Link to="/signin"></Link>
                      </>
                    )}
                  </NavDropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </section>

      <Navbar variant="light" expand="lg">
        <Container fluid="md">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              {/* <Nav className="d-flex"> */}
              <Nav.Link as={Link} to="/books" className={`d-flex ${pathname === "/books" ? "active" : ""}`}>
                <ListAltIcon className="nav-icons" />
                Danh m???c
              </Nav.Link>
              {/* </Nav> */}

              <Nav.Link as={Link} to="/blogs" className={`d-flex nav-link-items ${pathname === "/blogs" ? "active" : ""}`}>
                <RssFeedIcon className="nav-icons" />
                Chia s???
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/about-us"
                className={`d-flex nav-link-items ${pathname === "/about-us" ? "active" : ""}`}
              >
                <GroupsIcon className="nav-icons" />
                Gi???i thi???u
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <div className="telephone">
            <TtyIcon />
            Li??n h???: 083.457.7251
          </div>
        </Container>
      </Navbar>
    </header>
  );
}
