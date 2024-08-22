import Button from '@mui/material/Button';

function LandingPage() {
  const landingButtonStyle = {
    color: "white",
    borderColor: "white",
    borderRadius: "10%",
    borderWidth: "0.1cm",
    width: "10vw",
    fontFamily: '"Epilogue", sans-serif', 
    marginRight: "3vw",

  }
  return (
    <div className="landing-div" style={{margin:'0px'}}>
      <div style={{height:"52vh"}}></div>
      <h1 style={{fontSize: "7vh", color: "white", fontWeight: "300", margin: "0", marginBottom: "2vh", marginTop: "2vh"}}>African Library Project</h1>
      <h3 style={{fontSize: "9vh", color: "white", fontWeight: "600", margin: "0", marginBottom: "4vh", marginTop: "2vh"}}>Organizer Platform</h3>
      <Button variant="outlined" href='/auth/login' sx={landingButtonStyle} >log in</Button>
      <Button variant="outlined" href='/auth/signup' sx={landingButtonStyle}>sign up</Button>
    </div>
  );
}

export default LandingPage
