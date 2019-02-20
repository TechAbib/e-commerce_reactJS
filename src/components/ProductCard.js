import React from 'react';
import axios from 'axios';
import ModalCart from './ModalCart';
import { Link } from 'react-router-dom';

class ProductCard extends React.Component {

    constructor() {
        super();
        this.state = {
            cart: 0,
            tooltip: "Click for details!",
            modal: false,
            dataCartTemp: ""
        };
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }


    onClickCart = (id_product, name, image, size) => {
        // ini untuk dioper ke modal datanya
        var dataCartTemp = {
            name: name,
            image: image,
            size: size
        }
        this.setState({
            dataCartTemp: dataCartTemp
        });
        // sampai sini

        // ini utk di post ke database table cart
        axios.post('http://localhost:3007/cart', {
            id_user: this.props.id_user,
            id_product: id_product,
            quantity: 1,
        }).then((x) => {
            console.log(x);
        }).catch(() => {
            console.log("Error post");
        })
        // sampai sini
    }

    render() {
        const { id, url, image, name, price, description, location, size, index } = this.props;
        return (
            <React.Fragment>
                <div className="col-lg-3 col-sm-4 my-1">
                    <a href={"/shop/" + name.split(" ").join("-") + "-" + id}>
                        <div className="card p-1 text-center text-dark productCard" style={{ width: "15rem", height: "25rem", cursor: "pointer" }}>
                            <span className="tooltiptext">{this.state.tooltip}</span>
                            <img className="card-img-top mx-auto" src={image} style={{ width: "7rem", maxHeight: "13rem" }} alt="Product photo" />
                            <div className="card-body">
                                <h5 className="card-title">{name}</h5>
                                <p className="card-text">Rp {price.toLocaleString()}</p>
                                <p className="card-text"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>(67)</p>
                                <ul class="list-group list-group-flush mb-2">
                                    <li className="list-group-item">
                                        <p className="card-text">{`${size} mm`}</p>
                                        <p className="card-text" x><i class="fas fa-shipping-fast mr-1"></i>{location}</p>
                                    </li>
                                </ul>
                                <button type="button" name="addToCart" className="btn btn-warning mx-3 cart" onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.toggle(); this.onClickCart(id, name, image, size) }}><i className="fas fa-cart-plus"></i>Add to cart</button>
                            </div>
                        </div>
                    </a>
                </div>

                <ModalCart modal={this.state.modal} toggle={this.toggle} data={this.state.dataCartTemp ? this.state.dataCartTemp : "null"} />

            </React.Fragment >
        )
    }
}

export default ProductCard;