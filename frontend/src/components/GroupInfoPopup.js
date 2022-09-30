import React from 'react'

export default function GroupInfoPopup(props) {
  return (props.trigger) ? (
    <div className="group-info-popup">
        <div className="group-info-popup-inner">
          <img className="close-btn" onClick={() => props.setTrigger(false)} src="/static/images/X.png" />
          <h2 className="group-popup-title">Groups</h2>
          <div className="group-popup-description">
            Anyone can create a group, and anyone can add posts to a group, even if they're not a member.
            A group must have a "type" attribute, such as "Movie", although posts that do not share the type can be uploaded to a group.
            <div className='new-line'></div>
            <div className='line-break'></div>
            A post can be part of at most three groups. You can specify which groups you want to add you're post to, in the post-creation page.
            Joining a group means that more posts from that group will show up in your feed.
            <div className='new-line'></div>
            <div className='line-break'></div>
            In the "Groups" page, you can click the plus in the additional navbar or in the header to create a group. Once a group is created it's name cannot be changed.
            The creator of a group can posts from their group, however this will not delete the post from other groups it has been uploaded to.
            <div className='new-line'></div>
            <div className='line-break'></div>
            Posts that have been uploaded to groups will show up in the feed, just like posts that have not been uploaded to a group.
          </div>
        </div>
    </div>
  ) : "";
}