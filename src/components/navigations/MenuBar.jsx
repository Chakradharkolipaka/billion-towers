import React from 'react';
import { Link } from 'react-router-dom';

import './MenuBar.css'


const MenuBar = () => {
    return (
        <nav className="header">
            <div className="nav-wrapper">
                <Link className="logo" to="/">
                    <svg width="30" height="35" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="15" cy="20" r="10" stroke="#006EFF"/>
                        <circle cx="15" cy="20" r="6" stroke="#006EFF" strokeWidth="3"/>
                    </svg>                 
                    Billion Towers
                </Link>
                <input className="menu-btn" type="checkbox" id="menu-btn"/>
                <label className="menu-icon" htmlFor="menu-btn"><span className="navicon"></span></label>

                <ul className="menu">
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/marketplace">Marketplace</Link></li>
                    <li><Link to="/faq">FAQ</Link></li>
                    <li><button className='button'>Connect</button></li>                
                </ul>
            </div>
        </nav>
    )
}

export default MenuBar;
