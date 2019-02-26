import React from 'react';
import { Route, Link, Redirect, Switch } from 'react-router-dom';
import Home from './pages/Home';
import JoinUs from './pages/JoinUs';
// import FAQ from './pages/FAQ';
import ProductList from './pages/ProductList';
import Contact from './pages/Contact';
import ConfirmPayment from './pages/ConfirmPayment';
import LoginRegister from './pages/LoginRegister';
import Navbar from './components/Navbar';
import BackToTop from './components/BackToTop';
import SmallNavbar from './components/SmallNavbar';
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetails';
import AboutUs from './pages/AboutUs';
import axios from 'axios';
import Dashboard from './dashboard/Dashboard';
import EditProfile from './pages/EditProfile';
import swal from 'sweetalert';
import NotFound from './pages/NotFound';
import faq from './pages/Faq';
import ChangePassword from './pages/ChangePassword';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import CheckoutSuccess from './pages/CheckoutSuccess';



class App extends React.Component {

    constructor() {
        super();
        this.state = {
            cart: "",
            cartQty: 0,
            data_user: "",
            files: "",
            isLoggedIn: false,
            isCheckingSession: true,
            isCheckOut: false
        }
    }

    checkUserSession = () => {
        //di cek apakah ada sessionnya di local storage
        if (localStorage.getItem("user_session")) {
            // kalau ada di local storage, di cek apakah sessionnya ada di table session
            axios.post("http://localhost:3007/session", {
                user_session: localStorage.getItem("user_session")
            }).then((x) => {
                console.log(x.data.status)
                if (x.data.status == "wrongSession") {
                    localStorage.removeItem("user_session");
                    this.setState({
                        isCheckingSession: false
                    });
                }
                else {
                    // kalau ada sessionnya di table session, kita minta data user yg login
                    axios.get(`http://localhost:3007/users/${x.data[0].id_user}`).then((y) => {
                        this.getCartData(y.data[0].id);
                        // dan kita kasi data2 user yg mau dipakai
                        //buat object sementara
                        let data_user_temp = {
                            id: y.data[0].id,
                            name: y.data[0].name,
                            username: y.data[0].username,
                            email: y.data[0].email,
                            address: y.data[0].address,
                            phone_number: y.data[0].phone_number,
                            profpict: y.data[0].profpict,
                            role: y.data[0].role
                        };
                        // dikasi ke state objectnya
                        this.setState({
                            isLoggedIn: true,
                            data_user: data_user_temp,
                            isCheckingSession: false
                        });
                    });
                }
            });
        }
        // kalau session gaada di local storage, user harus login
        else {
            this.setState({
                isCheckingSession: false
            });
        }
    }

    componentDidMount() {
        this.checkUserSession();
    }

    getCartData = (id_user) => {
        axios.get(`http://localhost:3007/cart/${id_user}`).then((x) => {
            this.setState({
                cartQty: x.data.length
            });
        });
    }

    isCheckOut = () => {
        this.setState({
            isCheckOut: true
        })
    }


    render() {
        return (
            <React.Fragment>
                <SmallNavbar />
                <Navbar cart={this.state.cart} data_user={this.state.data_user} isCheckingSession={this.state.isCheckingSession} isLoggedIn={this.state.isLoggedIn} cartQty={this.state.cartQty} />


                {this.state.isCheckingSession == false &&
                    <Switch>
                        <Route exact path="/" component={Home}></Route>

                        {/* Jika user yg login adalah admin, route dashboard aktif, jika bukan, akan menampilkan halaman tidak ada. */}
                        {
                            this.state.data_user.role == "Admin"
                            &&
                            <Route
                                path='/dashboard'
                                render={(props) => <Dashboard {...props} role={this.state.data_user.role} />} />
                        }

                        <Route
                            path='/login'
                            render={(props) => <LoginRegister {...props} role={this.state.data_user.role} checkUserSession={this.checkUserSession} isLoggedIn={this.state.isLoggedIn} />}
                        />

                        <Route
                            path='/shop/:productID'
                            render={(props) => <ProductDetail {...props} id_user={this.state.data_user.id} />}
                        />

                        <Route
                            path='/shop'
                            render={(props) => <ProductList {...props} id_user={this.state.data_user.id} getCartData={this.getCartData} />}
                        />

                        <Route
                            exact path='/cart'
                            render={(props) => <Cart {...props} id_user={this.state.data_user.id} isLoggedIn={this.state.isLoggedIn} checkoutClicked={this.checkoutClicked} getCartData={this.getCartData} />}
                        />


                        <Route
                            exact path='/cart/shipment/'
                            render={(props) => <Checkout {...props} id_user={this.state.data_user.id} isLoggedIn={this.state.isLoggedIn} username={this.state.data_user.username} isCheckOut={this.isCheckOut} />}
                        />

                        {this.state.isCheckOut && <Route
                            exact path='/checkout-success/'
                            render={(props) => <CheckoutSuccess {...props} email={this.state.data_user.email} />}
                        />}





                        {this.state.isLoggedIn &&
                            <Route
                                path='/editProfile'
                                render={(props) => <EditProfile {...props} data={this.state.data_user} checkUserSession={this.checkUserSession} />}
                            />
                        }

                        {this.state.isLoggedIn &&
                            <Route
                                path='/my-orders'
                                render={(props) => <MyOrders {...props} id_user={this.state.data_user.id} data={this.state.data_user} checkUserSession={this.checkUserSession} />}
                            />
                        }

                        {this.state.isLoggedIn &&
                            <Route
                                path='/changePassword'
                                render={(props) => <ChangePassword {...props} data={this.state.data_user} checkUserSession={this.checkUserSession} />}
                            />
                        }

                        {/* {this.state.isLoggedIn && */}
                        <Route
                            path='/confirmPayment'
                            render={(props) => <ConfirmPayment {...props} data={this.state.data_user} checkUserSession={this.checkUserSession} isLoggedIn={this.state.isLoggedIn} />}
                        />
                        {/* } */}

                        <Route path="/joinUs" component={JoinUs}></Route>
                        <Route path="/contact" component={Contact}></Route>


                        <Route path="/faq" component={faq}></Route>
                        <Route path="/aboutUs" component={AboutUs}></Route>
                        <Route path="/404" component={NotFound}></Route>
                        <Route component={NotFound}></Route> {/*  Route untuk menampilkan halaman jika user ke path yang tidak ada. */}
                    </Switch>
                }


                <Footer />
                <BackToTop />


            </React.Fragment >
        )
    }
}

export default App;