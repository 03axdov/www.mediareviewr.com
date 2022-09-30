from django.urls import path
from .views import index
from .views import index_no_login
 
urlpatterns = [
    path('', index_no_login),
    path('post/<str:postId>/', index_no_login),
    path('create-post/', index),
    path('create-post/<str:postType>/', index),
    path('profile/<str:name>/', index_no_login),
    path('profiles/<str:name>/', index_no_login),
    path('edit-profile/', index),
    path('groups/', index_no_login, name="groups"),
    path('groups/<str:name>/', index_no_login),
    path('create-group/', index),
]