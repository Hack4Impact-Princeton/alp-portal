import React from 'react';

const Footer:React.FC = () => {
  return (
    <div style={footerStyle}>
      {/* Your footer content goes here */}
      <p style={{display: 'inline', margin:"5px"}}>Questions?</p>
     <a href="https://www.africanlibraryproject.org/book-drive-registration/" target="_blank" style={{display: 'inline',color:"black",fontStyle:"italic"}}>Contact Us</a>
     <p style={{display: 'inline', margin:"3px", fontStyle:"italic"}}>or</p>
     <a href="https://www.africanlibraryproject.org/book-drive-registration/" target="_blank" style={{display: 'inline',color:"black",fontStyle:"italic"}}>Register for New Book Drive</a>

    </div>
  );
};

const footerStyle:React.CSSProperties = {
  padding: '10px',
  paddingRight:"15px",
  textAlign: 'right',
  position: 'fixed',
  left: '0',
  bottom: '0',
  width: '100%',
};

export default Footer;