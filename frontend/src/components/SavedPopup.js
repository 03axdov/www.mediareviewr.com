import React, { useRef, useCallback } from 'react'
import axios from 'axios'
import PostElement from "./PostElement"

function TrendingPopup(props) {
    const [posts, setPosts] = React.useState([])
    const [pageNumber, setPageNumber] = React.useState(1)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(false)
    const [hasMore, setHasMore] = React.useState(false)

    const observer = useRef()
    const lastPostElementRef = useCallback(node => {
        if (loading) return 
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [loading, hasMore])

    React.useEffect(() => {
        axios({
            method: 'GET',
            url: window.location.origin + '/api/get-saved/',
            params: {name:props.currentProfile.name}
        }).then(res => {
            setHasMore(res.data.next != null)
            setLoading(false)
            setPosts(prevPosts => {
    
                let arr = [...prevPosts, ...res.data.results]
                const ids = arr.map(o => o.id)
                const filtered = arr.filter(({id}, index) => !ids.includes(id, index + 1))
                
                return filtered
            })
    
        }).catch(e => {
            setError(true)
            console.log(e)
        })
    }, [])

    function postOnClick() {

    }

    return (props.trigger) ? (
        <div className="trending-popup">
            <div className="trending-popup-container">
                {posts.map((post, index) => {
                    if (posts.length === index + 1) {
                        return (
                            <div ref={lastPostElementRef} key={post.id} className="last-element">
                                <PostElement
                                {...post}
                                postOnClick={postOnClick}
                                currentProfile={props.currentProfile}
                                />
                            </div>
                        )
                    } else {
                        return (
                        <div key={post.id}>
                            <PostElement
                            {...post}
                            postOnClick={postOnClick}
                            currentProfile={props.currentProfile}
                            />
                        </div>
                        )
                    }
                    
                })}
            </div>
        </div>
    ) : "";
}

export default TrendingPopup