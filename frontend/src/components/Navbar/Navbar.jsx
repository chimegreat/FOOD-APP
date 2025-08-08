import React, { useContext, useState } from 'react'
import './Navbar.css'
import {assets} from "../../assets/frontend_assets/assets"
import {Link, useNavigate} from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
const Navbar = ({setShowLogin}) => {
  
  const [menu, setMenu] = useState("home")

  const {getTotalCartAmount, token , setToken} = useContext(StoreContext)
  
  const navigate = useNavigate();

  const Logout = () =>{
    localStorage.removeItem("token");
    setToken("");
    navigate("/")
  }
  
  return (
    <div className='navbar'>
      <Link to={'/'}> <img src={assets.logo} alt="" className="logo" /> </Link>
      
      <ul className="navbar-menu">
        <Link to='/' onClick={()=> setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
        <a onClick={()=> setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu </a>
        <a onClick={()=> setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile app</a>
        <a onClick={()=> setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</a>
      </ul>
      
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <Link to={'/cart'}>
        <div className="navbar-search-icon">
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>        
        </Link>
        {!token ? <button onClick={()=> setShowLogin(true)} >sign in</button> 
        : <div className="navbar-profile">
          <img src={assets.profile_icon} alt="" />

          <ul className="navbar-profile-dropdown">
            <li onClick={()=> navigate("/myorders")}><img src={assets.bag_icon} alt="" /> 
            <p>Orders</p>
            </li>
            <hr />
            <li onClick={() => Logout()}> 
            <img src={assets.logout_icon} alt=""/>
            <p>Logout</p>
            </li>
          </ul>
        </div>
        }
      </div>
    </div>
  )
}

export default Navbar