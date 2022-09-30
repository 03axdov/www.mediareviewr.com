import React from 'react'

function AccountPopup(props) {

  const [outside, setOutside] = React.useState(true)
  const [click, setClick] = React.useState(0)

  React.useEffect(() => {
    if (outside === true) {
      props.setTrigger(false)
    }
  }, [click])

  return (props.trigger) ? (
    <div className="acc-popup">
      <div className="account-popup" onClick={() => {setClick(click + 1)}}>
        <div className="popup-inner" onMouseEnter={() => {setOutside(false)}} onMouseLeave={() => {setOutside(true)}}>
            <h4 className="account-popup-title">You aren't logged in</h4>
            <p className="account-popup-text">You must have an account in order to create posts, join groups, collect points, comment, like posts and more.</p>
            <div className="account-popup-buttons">
                <button className="login-button" onClick={() => {
                window.location.href = window.location.origin + "/accounts/login/"
                }}>Sign in</button>
                <button className="register-button" onClick={() => {
                window.location.href = window.location.origin + "/accounts/signup/"
                }}>Register</button>
                <button className="cancel-button" onClick={() => props.setTrigger(false)}>Cancel</button>
            </div>
        </div>
      </div>
    </div>
    
    
  ) : "";
}

export default AccountPopup