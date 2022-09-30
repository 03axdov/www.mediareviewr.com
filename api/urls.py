from django.urls import path
from .views import *

urlpatterns = [
    path('posts/', PostView.as_view()),
    path('post-create/', PostCreateView.as_view()),
    path('get-post-info/', GetPostInfo.as_view()),
    path('update-post/', UpdatePost.as_view()),
    path('group-member/', GroupMemberView.as_view()),
    path('group-create/', GroupCreateView.as_view()),
    path('profiles/', ProfileList.as_view()),
    path('add-friend/', AddFriendView.as_view()),
    path('follow/', FollowView.as_view()),
    path('get-profile/', GetProfile.as_view()),
    path('get-current-profile/', GetCurrentProfile.as_view()),
    path('update-profile/', UpdateProfile.as_view()),
    path('edit-profile/', EditProfile.as_view()),
    path('profile-get-groups/', GetProfileGroups.as_view()),
    path('get-comments/', GetComments.as_view()),
    path('create-comment/', CommentCreateView.as_view()),
    path('update-comment/', UpdateComment.as_view()),
    path('trending/', GetTrendingDetails.as_view()),
    path('groups/', GroupView.as_view()),
    path('get-group/', GetGroup.as_view()),
    path('save-post/', SavePostView.as_view()),
    path('update-watchlist/', UpdateWatchlist.as_view()),
    path('get-media/', GetMedia.as_view()),
    path('get-mutual-friends/', MutualFriendsView.as_view()),
    path('top-posters/', GetTopPosters.as_view())
]