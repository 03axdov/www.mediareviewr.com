import React from 'react'

function Popup(props) {

  const [outside, setOutside] = React.useState(true)
  const [click, setClick] = React.useState(0)

  React.useEffect(() => {
    if (outside === true) {
      props.setTrigger(false)
      props.setFormSubmit(props.formSubmit + 1)
      props.setFriendName('')
    }
  }, [click])

  return (props.trigger) ? (
    <div className="ppop">
      <div className="popup" onClick={() => {setClick(click + 1)}}>
        <div className="popup-inner" onMouseEnter={() => {setOutside(false)}} onMouseLeave={() => {setOutside(true)}}>
            <img className="close-btn" onClick={() => {
              props.setTrigger(false)
              props.setFormSubmit(props.formSubmit + 1)
              props.setFriendName('')
            }} src="https://mediareviewer.s3.amazonaws.com/static/images/X.png" alt="close-popup" />
            { props.children }
        </div>
      </div>
      <div className="popup-phone">
        <div className="popup-inner">
            <img className="close-btn" onClick={() => props.setTrigger(false)} src="https://mediareviewer.s3.amazonaws.com/static/images/X.png" alt="close-popup" />
            { props.children }
        </div>
      </div>
    </div>
    
    
  ) : "";
}

export default Popup