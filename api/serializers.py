from .models import *
from rest_framework import serializers
from django.contrib.auth.models import User

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"


class CreatePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('post_type', 'title', 'media', 'type', 'season', 'episode', 'rating', 'body', 'image', 'streaming1', 'streaming2', 'streaming3', 'streaming4', 'streaming5')   


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"

class ProfileEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        exclude= ('followers', 'following', 'name', 'post_count', 'user')


class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['name', 'picture', 'user']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"


class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['comment']


class TrendingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = "__all__"


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"


class CreateGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name', 'description', 'type', 'image', 'header_image')


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = "__all__"