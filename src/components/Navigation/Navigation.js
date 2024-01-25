import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => {
    if(isSignedIn) {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
              <div className="ph3">
                 <p onClick={() => onRouteChange('signout')} className="f6 link dim ph3 pv2 mb2 dib white bg-dark-gray pointer" href="#0">Sign Out</p>
              </div>
            </nav>
        );
    }
    else {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <div className="ph3">
                <p onClick={() => onRouteChange('signin')} className="f6 link dim ph3 pv2 mb2 dib white bg-dark-gray pointer" href="#0">Sign In</p>
                <p onClick={() => onRouteChange('register')} className="f6 link dim ph3 pv2 mb2 dib white bg-dark-gray pointer" href="#0">Register</p>
                </div>
            </nav>
    );
    }
}

export default Navigation;