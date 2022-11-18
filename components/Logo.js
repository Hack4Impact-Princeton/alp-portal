import React from 'react'

const Logo = ({ logo }) => {
    return (
        <div>
            <img
                src={logo.logoImage.file.url}
                alt="alp-logo"
            />
        </div>
    )
}

export default Logo;