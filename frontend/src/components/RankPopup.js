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
    <div>
      <div className="account-popup" onClick={() => {setClick(click + 1)}}>
        <div className="popup-inner" onMouseEnter={() => {setOutside(false)}} onMouseLeave={() => {setOutside(true)}}>
            <img className="close-btn" onClick={() => {
              props.setTrigger(false)

            }} src="https://mediareviewer.s3.amazonaws.com/static/images/X.png" />
            <h4 className="rank-popup-title">Ranks</h4>
            <p className="account-popup-text">Your rank is entirely determined by how many points you have collected.
             Points are awarded for every like and dislike that your posts get. The different ranks are:</p>
            <div className="rank-list">
                <p><span className="star-critic">Star Critic</span> (1000+ points)</p>
                <p><span className="critic">Critic</span> (500 - 999 points)</p>
                <p><span className="pro">Pro</span> (250 - 499 points)</p>
                <p><span className="intermediate">Intermediate</span> (150 - 249 points)</p>
                <p><span className="casual">Casual</span> (100 - 149 points)</p>
                <p><span className="beginner">Beginner</span> (25 - 99 points)</p>
                <p><span className="rookie">Rookie</span> (0 - 24 points)</p>
            </div>
        </div>
      </div>
    </div>
    
    
  ) : "";
}

export default AccountPopup