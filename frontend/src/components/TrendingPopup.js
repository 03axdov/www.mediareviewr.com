import React from 'react'

function TrendingPopup(props) {

  return (props.trigger) ? (
    <div className="trending-popup">
        <div className="trending-popup-container">
            <div className="trending-row">
              <div className="card trending-detail-container trending-total">
                <div className="card-header"><h3 className="title-total">Total</h3></div>
                <div className="card-body trending-detail-body">
                  <ul className="trending-list">
                    {props.trending[0].map((trend) => {
                        return (
                        <li className="trending-element" key={trend.id} onClick={props.trendOnClick}>
                            <p className="trending-name">{trend.media}</p>
                        </li>
                        )
                    })}
                  </ul>     
                </div>
              </div>
              <div className="card trending-detail-container trending-movies">
                <div className="card-header"><h3 className="title-movies">Movies</h3></div>
                <div className="card-body trending-detail-body">
                  <ul className="trending-list">
                      {props.trending[1].map((trend) => {
                          return (
                          <li className="trending-element" key={trend.id} onClick={props.trendOnClick}>
                              <p className="trending-name">{trend.media}</p>
                          </li>
                          )
                      })}
                  </ul>  
                </div>
              </div>
              <div className="card trending-detail-container trending-series">
                <div className="card-header"><h3 className="title-series">Series</h3></div>
                <div className="card-body trending-detail-body">
                  <ul className="trending-list">
                      {props.trending[2].map((trend) => {
                          return (
                          <li className="trending-element" key={trend.id} onClick={props.trendOnClick}>
                              <p className="trending-name">{trend.media}</p>
                          </li>
                          )
                      })}
                  </ul>  
                </div>
              </div>

              <div className="card trending-detail-container trending-games">
                <div className="card-header"><h3 className="title-games">Games</h3></div>
                <div className="card-body trending-detail-body">
                  <ul className="trending-list">
                      {props.trending[3].map((trend) => {
                          return (
                          <li className="trending-element" key={trend.id} onClick={props.trendOnClick}>
                              <p className="trending-name">{trend.media}</p>
                          </li>
                          )
                      })}
                  </ul>  
                </div>
              </div>
              <div className="card trending-detail-container trending-anime">
                <div className="card-header"><h3 className="title-anime">Anime</h3></div>
                <div className="card-body trending-detail-body">
                  <ul className="trending-list">
                        {props.trending[4].map((trend) => {
                            return (
                            <li className="trending-element" key={trend.id} onClick={props.trendOnClick}>
                                <p className="trending-name">{trend.media}</p>
                            </li>
                            )
                        })}
                  </ul> 
                </div>
              </div>
              <div className="card trending-detail-container trending-literature">
                <div className="card-header"><h3 className="title-literature">Literature</h3></div>
                <div className="card-body trending-detail-body">
                  <ul className="trending-list">
                        {props.trending[5].map((trend) => {
                            return (
                            <li className="trending-element" key={trend.id} onClick={props.trendOnClick}>
                                <p className="trending-name">{trend.media}</p>
                            </li>
                            )
                        })}
                  </ul> 
                </div>
              </div>
            </div>
        </div>
    </div>
  ) : "";
}

export default TrendingPopup