import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class LoginBtn extends React.Component {
    constructor() {
        super();

        this.state = {
            dropdownOpen: false
        };
    }

    logout = () => {
        // kalau admin logout, supaya ga stay di /dashboard, diarahkan ke home
        if (this.props.data.role == "Admin") {
            window.location.replace("/");
            axios.delete(`http://localhost:3007/session/${this.props.data.id}`);
            localStorage.removeItem("user_session");
        }
        else {
            //saat user logout, delete local storage dan set state kosong
            axios.delete(`http://localhost:3007/session/${this.props.data.id}`);
            localStorage.removeItem("user_session");

            // refresh supaya check session jalan lagi
            document.location.reload();
        }
    };


    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    displayDropDown() {
        return (
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret className="btn btn-outline-secondary mr-3 login">
                    <img src={this.props.data.profpict} style={{ borderRadius: "50%", border: "1px solid black", width: 30, height: 30, marginRight: 8 }} />
                    {this.props.data.name}
                </DropdownToggle>
                <DropdownMenu>
                    <Link to="/editProfile" className="text-dark"><DropdownItem style={{ cursor: "pointer" }}> Edit Profile</DropdownItem></Link>
                    {this.props.data.role == "Admin" && <a href="/dashboard"><DropdownItem style={{ cursor: "pointer" }}>Dashboard</DropdownItem></a>}
                    <DropdownItem divider />
                    <DropdownItem onClick={this.logout} style={{ cursor: "pointer" }}>Log Out</DropdownItem>
                </DropdownMenu>
            </ButtonDropdown>
        )
    }

    displayLoginBtn(x) {
        return (
            <Link to="/login">
                <a href="" type="button" className="btn btn-outline-secondary mr-3 login" style={{ visibility: x }} href=""><i className="fas fa-sign-in-alt"></i>Log In / Register</a>
            </Link>
        )
    }

    render() {
        // kalau proses check session masih berjalan, show nothing dulu.
        if (this.props.isCheckSession == true) {
            return (
                this.displayLoginBtn("hidden")
            )
        }
        // proses check session selesai, di cek apakah ada data user yang didapat sbg props? kalau ada, berarti sudah ke log in dan ditampilkan button dropdown. Kalau gaada, tampilkan button login.
        else {
            return (
                <React.Fragment>
                    {this.props.data ? this.displayDropDown() : this.displayLoginBtn("visible")}
                </React.Fragment>
            )
        }

    }
}

export default LoginBtn;