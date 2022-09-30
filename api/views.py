from ast import Return
from tokenize import Name
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics, status
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count
from django.utils import timesince
from django.utils import timezone
import math
import random
import os
import datetime
from itertools import chain

# Create your views here

class GroupPagination(PageNumberPagination):
    page_size = 32
    page_size_query_param = 'page_size'
    max_page_size = 32

class FriendsPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size=50

class GetCurrentProfile(APIView):
    serializer_class = ProfileSerializer
    pagination_class = FriendsPagination

    def get(self, request, format=None):
        following_names = []
        following_pictures = []
        following_statuses = []
        if request.user.id == None:
            return Response('', status=status.HTTP_200_OK)
        profile = request.user.profile
        for t, i in enumerate(profile.following.all().order_by("-post_count")):
            if t < 30:
                following_names.append(i.name)
        for t, i in enumerate(profile.following.all().order_by("-post_count")):
            if t < 30:
                following_pictures.append(i.picture.url)
        for t, i in enumerate(profile.following.all().order_by("-post_count")):
            if t < 30:
                following_statuses.append(i.status)
        profile = ProfileSerializer(profile)
        data = profile.data
        data['following_names'] = following_names
        data['following_pictures'] = following_pictures
        data['following_statuses'] = following_statuses
        return Response(data, status=status.HTTP_200_OK)


class UpdateWatchlist(APIView):
    serializer_class = ProfileSerializer
    parser_classes = [JSONParser]

    def post(self, request, form=None):
        watchlist = request.data
        profile = request.user.profile
        profile.watchlist = watchlist
        profile.save()

        serializer = self.serializer_class(profile)

        return Response(serializer.data, status=status.HTTP_200_OK)


class FollowView(APIView):
    serializer_class = ProfileSerializer
    lookup_url_kwarg = 'user'

    def get(self, request, format=None):
        user = request.GET.get(self.lookup_url_kwarg)

        if request.user.id == None:
            return Response({'Bad Request': 'You must be logged in to follow another user.'}, status=status.HTTP_400_BAD_REQUEST)
        if str(request.user.id) == str(user):
            return Response({'Bad Request': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)
        instance = UserProfile.objects.get(user=user)
        followers = instance.followers.all()
        new_followers = []
        new_following = []
        currentProfile = request.user.profile
        if currentProfile not in followers:
            for follow in currentProfile.following.all():
                new_following.append(follow)
            new_following.append(instance)
            currentProfile.following.set(new_following)
            for follower in followers:
                new_followers.append(follower)
            new_followers.append(currentProfile)
            instance.followers.set(new_followers)
        else:
            for follow in currentProfile.following.all():
                if follow != instance:
                    new_following.append(follow)
            currentProfile.following.set(new_following)
            for follower in followers:
                if follower != currentProfile:
                    new_followers.append(follower)
            instance.followers.set(new_followers)

        serializer = ProfileSerializer(instance)
        data = serializer.data
        return Response(data, status=status.HTTP_200_OK)


class EditProfile(APIView):
    serializer_class = ProfileEditSerializer
    lookup_url_kwarg = 'name'
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        name = request.GET.get(self.lookup_url_kwarg)
        picture = request.data['picture']
        banner = request.data['banner']
        location = request.data['location']
        try:
            currentStatus = request.data['currentStatus']
        except: 
            return Response({'Bad Request': 'You cannot edit your profile manually / directly through the API'}, status=status.HTTP_400_BAD_REQUEST)
        bio = request.data['bio']

        if request.user.id == None:
            return Response({'Bad Request': 'You must be logged in to edit your profile'}, status=status.HTTP_400_BAD_REQUEST)

        instance = UserProfile.objects.get(name=name)
        if picture != '':
            instance.picture = picture
        if banner != '':
            instance.banner = banner
        instance.location = location
        instance.status = currentStatus
        instance.bio = bio

        instance.first_movie = request.data['first_movie']
        instance.second_movie = request.data['second_movie']
        instance.third_movie = request.data['third_movie']
        instance.fourth_movie = request.data['fourth_movie']
        instance.fifth_movie = request.data['fifth_movie']

        instance.first_anime = request.data['first_anime']
        instance.second_anime = request.data['second_anime']
        instance.third_anime = request.data['third_anime']
        instance.fourth_anime = request.data['fourth_anime']
        instance.fifth_anime = request.data['fifth_anime']

        instance.first_series = request.data['first_series']
        instance.second_series = request.data['second_series']
        instance.third_series = request.data['third_series']
        instance.fourth_series = request.data['fourth_series']
        instance.fifth_series = request.data['fifth_series']

        instance.first_game = request.data['first_game']
        instance.second_game = request.data['second_game']
        instance.third_game = request.data['third_game']
        instance.fourth_game = request.data['fourth_game']
        instance.fifth_game = request.data['fifth_game']

        instance.first_literature = request.data['first_literature']
        instance.second_literature = request.data['second_literature']
        instance.third_literature = request.data['third_literature']
        instance.fourth_literature = request.data['fourth_literature']
        instance.fifth_literature = request.data['fifth_literature']

        instance.save()

        posts = Post.objects.filter(author_name=name)
        for post in posts:
            post.author_image = instance.picture
            post.save()

        comments = Comment.objects.filter(author_name=name)
        for comment in comments:
            comment.author_image = instance.picture
            post.save()

        serializer = self.serializer_class(instance)

        return Response(serializer.data, status=status.HTTP_200_OK)

class UpdateProfile(APIView):
    serializer_class = ProfileSerializer
    lookup_url_kwarg = 'user'
    parser_classes = [JSONParser]

    def post(self, request, format=None):
        if request.user.id == None:
            return Response({'Bad Request': 'You must be logged in to edit your profile'}, status=status.HTTP_400_BAD_REQUEST)
        user = request.GET.get(self.lookup_url_kwarg)
        if str(request.user.id) == str(user):
            return Response({'Bad Request': 'You cannot update your own profile'}, status=status.HTTP_400_BAD_REQUEST)
        followers = request.data['followers']

        instances = UserProfile.objects.filter(user=user)
        instance = instances[0]
        instance.followers.set(followers)

        if instance in request.user.profile.following.all():
            li = request.user.profile.following.all().exclude(user=instance.user)
            request.user.profile.following.set(li)
        else:
            li = request.user.profile.following.all() | instances
            request.user.profile.following.set(li)

        serializer = self.serializer_class(instance)

        return Response(serializer.data, status=status.HTTP_200_OK)


class SavePostView(APIView):
    serializer_class = PostSerializer
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        post = Post.objects.get(id=id)

        if post in request.user.profile.saved.all():
            new_saved = []
            for el in request.user.profile.saved.all():
                if el != post:
                    new_saved.append(el)
            request.user.profile.saved.set(new_saved)
            return Response('save', status=status.HTTP_200_OK)
        else:
            new_saved = []
            for el in request.user.profile.saved.all():
                new_saved.append(el)
            new_saved.append(post)
            request.user.profile.saved.set(new_saved)
            return Response('saved', status=status.HTTP_200_OK)


class GetTrending(generics.ListAPIView):
    serializer_class= TrendingSerializer

    def get_queryset(self):
        return Media.objects.all().order_by("-popularity", "-average_rating")[:5]


class GetTrendingDetails(APIView):
    serializer_class = TrendingSerializer

    def get(self, request, format=None):
        total = TrendingSerializer(Media.objects.all().order_by("-popularity", "-average_rating")[:5], many=True)
        movies = TrendingSerializer(Media.objects.filter(type="Movie").order_by("-popularity", "-average_rating")[:5], many=True)
        series = TrendingSerializer(Media.objects.filter(type="Series").order_by("-popularity", "-average_rating")[:5], many=True)
        games = TrendingSerializer(Media.objects.filter(type="Game").order_by("-popularity", "-average_rating")[:5], many=True)
        anime = TrendingSerializer(Media.objects.filter(type="Anime").order_by("-popularity", "-average_rating")[:5], many=True)
        literature = TrendingSerializer(Media.objects.filter(type="Literature").order_by("-popularity", "-average_rating")[:5], many=True)
        
        data = [total.data, movies.data, series.data, games.data, anime.data, literature.data]
        return Response(data, status=status.HTTP_200_OK)
        


class PostView(generics.ListAPIView):

    serializer_class = PostSerializer
    pagination_class = PageNumberPagination
    
    def get_queryset(self):
        filters = self.request.query_params.get("type", None)
        media = self.request.query_params.get("media", None)
        name = self.request.query_params.get("name", None)
        current = self.request.query_params.get("current", None)
        saved = self.request.query_params.get("saved", None)
        group = self.request.query_params.get("group", None)
        group_type = self.request.query_params.get("group_type", None)
        profile_filter = self.request.query_params.get('profile_filter', None)
        randnum = self.request.query_params.get('randnum', 0)
        
        streaming1 = self.request.query_params.get("streaming1", False)
        streaming2 = self.request.query_params.get("streaming2", False)
        streaming3 = self.request.query_params.get("streaming3", False)
        streaming4 = self.request.query_params.get("streaming4", False)
        streaming5 = self.request.query_params.get("streaming5", False)

        ranking="-ranking"

        if int(randnum) == 0:
            ranking = "-ranking"
        if int(randnum) == 1:
            ranking = "-ranking2"
        if int(randnum) == 2:
            ranking = "-ranking3"
        if int(randnum) == 3:
            ranking = "-ranking4"
        if int(randnum) == 4:
            ranking = "-ranking5"
        
        try:
            currentProfile = self.request.user.profile
            currentMax = 0
            currentIndex = 0

            for t, i in enumerate([currentProfile.movie, currentProfile.anime, currentProfile.series, currentProfile.game, currentProfile.literature]):
                if i > currentMax + 30:
                    currentMax = i
                    currentIndex = t

            if currentMax > 0:
                if currentIndex == 0:
                    ranking = "-rankingMovie"
                if currentIndex == 1:
                    ranking = "-rankingAnime"
                if currentIndex == 2:
                    ranking = "-rankingSeries"
                if currentIndex == 3:
                    ranking = "-rankingGame"
                if currentIndex == 4:
                    ranking = "-rankingLiterature"
        except:
            pass

        if saved != None and saved != '':

            current_profile = UserProfile.objects.filter(name=current)

            if len(current_profile) > 0:
                posts = current_profile[0].saved.all()

                if streaming1 or streaming2 or streaming3 or streaming4 or streaming5:
                    pass

                if media == "":
                    media = None

                if filters == "Movie Anime Series Game Literature Other" or filters == "Movie Anime Series Game Literature Other ":
                    if media != None:
                        return posts.filter(Q(media__icontains=media) | Q(Q(post_type='post') & Q(Q(title__icontains=media) | Q(body__icontains=media)))).order_by(ranking)
                    else:
                        return posts.order_by(ranking)
                else:
                    filters = list(filters.split(" "))
                    if media != None:
                        return posts.filter(Q(media__icontains=media) | Q(title__icontains=media)).filter(Q(type__in=filters) | Q(post_type='post')).order_by(ranking)
                    else:
                        return posts.filter(Q(type__in=filters)).exclude(type="").order_by(ranking)

        posts = Post.objects.all()

        if group != None:
            group = Group.objects.filter(name=group)
            if len(group) > 0:
                if group_type == "popular":
                    return posts.filter(Q(group1=group[0]) | Q(group2=group[0]) | Q(group3=group[0])).order_by(ranking)
                if group_type == "top":
                    return posts.filter(Q(group1=group[0]) | Q(group2=group[0]) | Q(group3=group[0])).order_by("-popularity")
                if group_type == "recent":
                    return posts.filter(Q(group1=group[0]) | Q(group2=group[0]) | Q(group3=group[0])).order_by("-created_on")
            else:
                return []

        # posts = posts.filter()
        
        if media == "":
            media = None

        if name != None:
            if profile_filter == 'recent':
                return posts.filter(author_name=name).order_by("-created_on")
            if profile_filter == 'top':
                return posts.filter(author_name=name).order_by("-popularity")
            else:
                return posts.filter(author_name=name).order_by("-created_on")

        groups = []
        posts = []
        ids = []
        try:
            currentProfile = self.request.user.profile
            groups = Group.objects.filter(members__in=[currentProfile])
            for group in groups:
                for post in posts.filter(Q(group1=group) | Q(group2=group) | Q(group3=group)):
                    since = timesince.timesince(post.created_on).replace(u'\xa0', u' ').split(" ")
                    if 'years' not in since and 'months' not in since and 'days' not in since and 'day' not in since and 'month' not in since and 'year' not in since:
                        if currentProfile not in post.likes.all() and currentProfile not in post.dislikes.all() and post.popularity >= 3:
                            posts.append(post)
                            ids.append(post.id)
        except:
            pass

        if streaming1 != 'None' and streaming2 != 'None' and streaming3 != 'None' and streaming4 != 'None' and streaming5 != 'None':
            posts = Post.objects.all()
        elif streaming1 != 'None' or streaming2 != 'None' or streaming3 != 'None' or streaming4 != 'None' or streaming5 != 'None':
            posts = Post.objects.filter(Q(streaming1=streaming1) | Q(streaming2=streaming2) | Q(streaming3=streaming3) | Q(streaming4=streaming4) | Q(streaming5=streaming5))
        else:
            posts = Post.objects.all()
        
        if filters == "Movie Anime Series Game Literature Other" or filters == "Movie Anime Series Game Literature Other ":
            if media != None:
                print("HERE")
                queryset = posts.filter(Q(media__icontains=media) | Q(Q(post_type='post') & Q(Q(title__icontains=media) | Q(body__icontains=media)))).order_by(ranking)
            else:
                queryset = posts.exclude(id__in=ids).order_by(ranking)
                return list(chain(posts, queryset))
        else:
            filters = list(filters.split(" "))

            if media != None:
                queryset = posts.filter(Q(media__icontains=media) | Q(title__icontains=media)).filter(Q(type__in=filters)).order_by(ranking)
            else:
                queryset = posts.filter(Q(type__in=filters)).exclude(type="").order_by(ranking)

        return queryset


class GroupView(generics.ListAPIView):
    serializer_class = GroupSerializer
    pagination_class = GroupPagination

    def get_queryset(self):
        filters = self.request.query_params.get("type", None)
        name = self.request.query_params.get("name", None)
        isPost = self.request.query_params.get("isPost", None)

        if isPost:
            profile = self.request.user.profile
            users = Group.objects.filter(members__in=[profile]).order_by("-members_count")
            names = users.values('name')
            all = Group.objects.all().exclude(name__in=names)
            result_list = list(chain(users, all))
            return result_list

        if filters == None or filters == '':
            if name == None or name == '':
                return Group.objects.all().order_by("-members_count")
            else:
                return Group.objects.filter(name__istartswith=name).order_by("-members_count")
        else:
            if name == None or name == '':
                return Group.objects.filter(Q(type=filters)|Q(type="Any")).order_by("-members_count")
            else:
                return Group.objects.filter(Q(type=filters)|Q(type="Any")).filter(name__istartswith=name).order_by("-members_count")


class GetGroup(APIView):
    serializer_class = GroupSerializer
    lookup_url_kwarg = 'name'

    def get(self, request, format=None):
        name = request.GET.get(self.lookup_url_kwarg)
        if name != None:
            group = Group.objects.filter(name=name)
            if len(group) > 0:
                serializer = GroupSerializer(group[0])
                data = serializer.data
                data['isAuthor'] = request.user == group[0].author
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Group not found': 'Invalid Group Id'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Name parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class GetProfileGroups(APIView):
    serializer_class = GroupSerializer
    lookup_url_kwarg = 'name'

    def get(self, request, format=None):
        name = request.GET.get(self.lookup_url_kwarg)
        if name != '' and name != None:
            profile = UserProfile.objects.get(name=name)
            groups = Group.objects.filter(members__in=[profile]).order_by("-members_count")

            serializer = self.serializer_class(groups, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response([], status=status.HTTP_200_OK)


class GroupMemberView(APIView):
    serializer_class = GroupSerializer
    lookup_url_kwarg = 'name'

    def post(self, request, format=None):
        name = request.GET.get(self.lookup_url_kwarg)
        group = Group.objects.get(name=name)

        updated_members = []

        currentProfile = request.user.profile

        if currentProfile in group.members.all():
            group.members_count -= 1
            for member in group.members.all():
                if member != currentProfile:
                    updated_members.append(member)
            if group.type == 'Movie':
                currentProfile.movie -= 3
                currentProfile.save()
            if group.type == 'Anime':
                currentProfile.anime -= 3
                currentProfile.save()
            if group.type == 'Series':
                currentProfile.series -= 3
                currentProfile.save()
            if group.type == 'Game':
                currentProfile.game -= 3
                currentProfile.save()
            if group.type == 'Literature':
                currentProfile.literature -= 3
                currentProfile.save()
        else:
            group.members_count += 1
            for member in group.members.all():
                updated_members.append(member)
            updated_members.append(currentProfile)
            if group.type == 'Movie':
                currentProfile.movie += 3
                currentProfile.save()
            if group.type == 'Anime':
                currentProfile.anime += 3
                currentProfile.save()
            if group.type == 'Series':
                currentProfile.series += 3
                currentProfile.save()
            if group.type == 'Game':
                currentProfile.game += 3
                currentProfile.save()
            if group.type == 'Literature':
                currentProfile.literature += 3
                currentProfile.save()

        group.members.set(updated_members)
        group.save()

        serializer = GroupSerializer(group)

        return Response(serializer.data, status=status.HTTP_200_OK)


class GroupCreateView(APIView):
    serializer_class = CreateGroupSerializer
    parser_classes = [MultiPartParser, FormParser]
    # permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user.profile, author_name=request.user.profile.name)

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'An error occurred'}, status=status.HTTP_400_BAD_REQUEST)


class GetPostInfo(APIView):
    serializer_class = PostSerializer
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        if id != None:
            post = Post.objects.filter(id=id)
            if len(post) > 0:
                serializer = PostSerializer(post[0])
                data = serializer.data
                if request.user.id == None:
                    data['isAuthor'] = False
                    data['isSaved'] = False
                    return Response(data, status=status.HTTP_200_OK)
                else:
                    data['isAuthor'] = request.user == post[0].author.user
                    data['isSaved'] = post[0] in request.user.profile.saved.all()
                    return Response(data, status=status.HTTP_200_OK)
                
               
            return Response({'Post not found': 'Invalid Post Id'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad Request': 'Id parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class UpdatePost(APIView):
    serializer_class = PostSerializer
    lookup_url_kwarg = 'id'
    parser_classes = [JSONParser]

    def post(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        likes = request.data['likes']
        dislikes = request.data['dislikes']

        isInteracted = request.data['isInteracted']
        wasInteracted = request.data['wasInteracted']

        instance = Post.objects.get(id=id)

        currentProfile = request.user.profile
        if not isInteracted:
            if instance.type == "Movie":
                currentProfile.movie += 1
                currentProfile.save()
            if instance.type == "Anime":
                currentProfile.anime += 1
                currentProfile.save()
            if instance.type == "Series":
                currentProfile.series += 1
                currentProfile.save()
            if instance.type == "Game":
                currentProfile.game += 1
                currentProfile.save()
            if instance.type == "Literature":
                currentProfile.literature += 1
                currentProfile.save()
            author = instance.author
            author.points += 1
            author.save()
        if wasInteracted:
            if instance.type == "Movie":
                currentProfile.movie -= 1
                currentProfile.save()
            if instance.type == "Anime":
                currentProfile.anime -= 1
                currentProfile.save()
            if instance.type == "Series":
                currentProfile.series -= 1
                currentProfile.save()
            if instance.type == "Game":
                currentProfile.game -= 1
                currentProfile.save()
            if instance.type == "Literature":
                currentProfile.literature -= 1
                currentProfile.save()
            author = instance.author
            author.points -= 1
            author.save()

        instance.likes.set(likes)
        instance.dislikes.set(dislikes)
        instance.popularity = len(likes) + len(dislikes)

        since = str(timesince.timesince(instance.created_on))
        since = since.replace(u'\xa0', u' ')
        since = since.replace(u',', u'')
        since = since.split(" ")
        since_time = 0
        current = ''
        for i in reversed(since):
            if current == '':
                current = i
            else:
                if current == 'minutes':
                    current = ''
                if current == 'hours':
                    since_time += int(i)
                    current = ''
                if current == 'days':
                    since_time += int(i) * 24
                    current = ''
                if current == 'months':
                    since_time += int(i) * 30 * 24
                    current = ''
                if current == 'years':
                    since_time += int(i) * 30 * 12 * 24
                    current = ''
        if instance.image:
            instance.ranking = math.ceil((len(likes) + 0.75 * len(dislikes)) / 0.5) - math.ceil(since_time / 25) + math.ceil(len(instance.body) / 125)
            if instance.post_type != 'post':
                instance.ranking2 = math.ceil((len(likes) * 2 + len(dislikes) * 1.2) / 0.1) - math.ceil(since_time / 3) + math.ceil(len(instance.body) / 20) + math.ceil((7 - instance.ranking) * 7)
                instance.ranking3 = math.ceil((1.4 * len(likes) + len(dislikes) * 0.75) / 0.75) - math.ceil(since_time / 7) + math.ceil((70 -  len(instance.title)) / 5)
                instance.ranking4 = math.ceil((2 * len(likes) + len(dislikes)) / 0.3) - math.ceil(since_time / 10) + math.ceil(len(instance.body) / 100) - math.ceil((7 - instance.ranking) * 5)
                instance.ranking5 = math.ceil((5 * len(likes) - 2 * len(dislikes)) / 0.2) - math.ceil(since_time) + math.ceil(len(instance.body) / 25) - math.ceil((7 - instance.ranking) * 10)
            else:
                instance.ranking2 = math.ceil((len(likes) * 2 + len(dislikes) * 1.2) / 0.1) - math.ceil(since_time / 3) + math.ceil(len(instance.body) / 20)
                instance.ranking3 = math.ceil((1.4 * len(likes) + len(dislikes) * 0.75) / 0.75) - math.ceil(since_time / 7) + math.ceil((70 -  len(instance.title)))
                instance.ranking4 = math.ceil((2 * len(likes) + len(dislikes)) / 0.35) - math.ceil(since_time / 10) + math.ceil(len(instance.body) / 100) - math.ceil((60 -  len(instance.title)))
                instance.ranking5 = math.ceil((3 * len(likes) - 2 * len(dislikes)) / 0.2) - math.ceil(since_time) + math.ceil(len(instance.body) / 25)

            if instance.type == 'Movie':
                instance.rankingMovie = instance.ranking + 100
                instance.rankingAnime = instance.ranking
                instance.rankingSeries = instance.ranking
                instance.rankingGame = instance.ranking
                instance.rankingLiterature = instance.ranking
            if instance.type == 'Anime':
                instance.rankingMovie = instance.ranking
                instance.rankingAnime = instance.ranking + 100
                instance.rankingSeries = instance.ranking
                instance.rankingGame = instance.ranking
                instance.rankingLiterature = instance.ranking
            if instance.type == 'Series':
                instance.rankingMovie = instance.ranking
                instance.rankingAnime = instance.ranking
                instance.rankingSeries = instance.ranking + 100
                instance.rankingGame = instance.ranking
                instance.rankingLiterature = instance.ranking
            if instance.type == 'Game':
                instance.rankingMovie = instance.ranking
                instance.rankingAnime = instance.ranking
                instance.rankingSeries = instance.ranking
                instance.rankingGame = instance.ranking + 100
                instance.rankingLiterature = instance.ranking
            if instance.type == 'Literature':
                instance.rankingMovie = instance.ranking
                instance.rankingAnime = instance.ranking
                instance.rankingSeries = instance.ranking
                instance.rankingGame = instance.ranking
                instance.rankingLiterature = instance.ranking + 100
        else:
            instance.ranking = math.ceil((len(likes) + 0.75 * len(dislikes)) / 0.5) - math.ceil(since_time / 5) + math.ceil(len(instance.body) / 125) - 80
            if instance.post_type != 'post':
                instance.ranking2 = math.ceil((len(likes) * 2 + len(dislikes) * 1.2) / 0.1) - math.ceil(since_time / 3) + math.ceil(len(instance.body) / 40) + math.ceil((7 - instance.ranking) * 3) - 80
                instance.ranking3 = math.ceil((1.4 * len(likes) + len(dislikes) * 0.75) / 0.75) - math.ceil(since_time / 7) + math.ceil((70 -  len(instance.title)) / 5) + math.ceil((5 - instance.ranking) * 4) - 80
                instance.ranking4 = math.ceil((2 * len(likes) + len(dislikes)) / 0.35) - math.ceil(since_time / 10) + math.ceil(len(instance.body) / 25) - math.ceil((60 -  len(instance.title))) - math.ceil((7 - instance.ranking) * 5) - 80
                instance.ranking5 = math.ceil((3 * len(likes) - 2 * len(dislikes)) / 0.2) - math.ceil(since_time / 2) + math.ceil(len(instance.body) / 50) - math.ceil((7 - instance.ranking) * 10) -80
            else:
                instance.ranking2 = math.ceil((len(likes) * 2 + len(dislikes) * 1.2) / 0.1) - math.ceil(since_time / 3) + math.ceil(len(instance.body) / 40) - 80
                instance.ranking3 = math.ceil((1.4 * len(likes) + len(dislikes) * 0.75) / 0.75) - math.ceil(since_time / 7) + math.ceil((70 -  len(instance.title))) - 80
                instance.ranking4 = math.ceil((2 * len(likes) + len(dislikes)) / 0.35) - math.ceil(since_time / 10) + math.ceil(len(instance.body) / 25) - math.ceil((60 -  len(instance.title))) - 80
                instance.ranking5 = math.ceil((3 * len(likes) - 2 * len(dislikes)) / 0.2) - math.ceil(since_time / 2) + math.ceil(len(instance.body) / 50) - 80
            if instance.type == 'Movie':
                instance.rankingMovie = instance.ranking + 100
                instance.rankingAnime = instance.ranking
                instance.rankingSeries = instance.ranking
                instance.rankingGame = instance.ranking
                instance.rankingLiterature = instance.ranking
            if instance.type == 'Anime':
                instance.rankingMovie = instance.ranking
                instance.rankingAnime = instance.ranking + 100
                instance.rankingSeries = instance.ranking
                instance.rankingGame = instance.ranking
                instance.rankingLiterature = instance.ranking
            if instance.type == 'Series':
                instance.rankingMovie = instance.ranking
                instance.rankingAnime = instance.ranking
                instance.rankingSeries = instance.ranking + 100
                instance.rankingGame = instance.ranking
                instance.rankingLiterature = instance.ranking
            if instance.type == 'Game':
                instance.rankingMovie = instance.ranking
                instance.rankingAnime = instance.ranking
                instance.rankingSeries = instance.ranking
                instance.rankingGame = instance.ranking + 100
                instance.rankingLiterature = instance.ranking
            if instance.type == 'Literature':
                instance.rankingMovie = instance.ranking
                instance.rankingAnime = instance.ranking
                instance.rankingSeries = instance.ranking
                instance.rankingGame = instance.ranking
                instance.rankingLiterature = instance.ranking + 100
        if instance.type == 'Movie':
            instance.ranking3 += 120
            instance.ranking5 += 100
        extension = str(instance.image).split(".")[-1]
        if extension == 'MP4':
            instance.ranking += 300
            instance.ranking2 += 150
            instance.ranking3 += 50
            instance.ranking4 += 20
            instance.ranking5 += 300
        if extension == 'mp4':
            instance.ranking += 300
            instance.ranking2 += 150
            instance.ranking3 += 50
            instance.ranking4 += 20
            instance.ranking5 += 100
        instance.save()

        serializer = self.serializer_class(instance)

        return Response(serializer.data, status=status.HTTP_200_OK)


class PostCreateView(APIView):
    serializer_class = CreatePostSerializer
    parser_classes = [MultiPartParser, FormParser]
    # permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            if request.user.id == None:
                return Response({'Bad Request': 'You must be logged in to create posts'}, status=status.HTTP_400_BAD_REQUEST)
            if request.data['post_type'] not in ['review', 'character-review', 'post']:
                return Response({'Bad Request': 'Invalid post type'}, status=status.HTTP_400_BAD_REQUEST)
            if request.data['type'] not in ['Movie', 'Anime', 'Series', 'Game', 'Literature', 'Other']:
                return Response({'Bad Request': 'Invalid type'}, status=status.HTTP_400_BAD_REQUEST)
            group1 = ''
            group2 = ''
            group3 = ''
            if request.data['group1'] != '0':
                group1 = Group.objects.get(id=request.data['group1'])
            if request.data['group2'] != '0':
                group2 = Group.objects.get(id=request.data['group2'])
            if request.data['group3'] != '0':
                group3 = Group.objects.get(id=request.data['group3'])
            if group1 != '':
                if group2 != '':
                    if group3 != '':
                        serializer.save(author=request.user.profile, author_name=request.user.profile.name, author_image=request.user.profile.picture, group1=group1, group2=group2, group3=group3)
                        group1.post_count = group1.post_count + 1
                        group1.save()
                        group2.post_count = group2.post_count + 1
                        group2.save()
                        group3.post_count = group3.post_count + 1
                        group3.save()
                    else:
                        serializer.save(author=request.user.profile, author_name=request.user.profile.name, author_image=request.user.profile.picture, group1=group1, group2=group2)
                        group1.post_count = group1.post_count + 1
                        group1.save()
                        group2.post_count = group2.post_count + 1
                        group2.save()
                else:
                    if group3 != '':
                        serializer.save(author=request.user.profile, author_name=request.user.profile.name, author_image=request.user.profile.picture, group1=group1, group3=group3)
                        group1.post_count = group1.post_count + 1
                        group1.save()
                        group3.post_count = group3.post_count + 1
                        group3.save()
                    else:
                        serializer.save(author=request.user.profile, author_name=request.user.profile.name, author_image=request.user.profile.picture, group1=group1)
                        group1.post_count = group1.post_count + 1
                        group1.save()
            else:
                serializer.save(author=request.user.profile, author_name=request.user.profile.name, author_image=request.user.profile.picture,)
            
            if serializer['post_type'].value == 'review':
                media = Media.objects.filter(media=serializer['media'].value)
                if len(media) == 0:
                    Media.objects.create(media=serializer['media'].value, average_rating=serializer['rating'].value, popularity=1, total_popularity=1, type=serializer['type'].value) # media_image=serializer['image'].value[6:],
                else:
                    media = media[0]
                    media.popularity += 1
                    media.total_popularity += 1
                    media.average_rating = (media.average_rating + float(serializer['rating'].value)) / media.total_popularity
                    media.save()
            request.user.profile.post_count += 1
            request.user.profile.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'An error occurred'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileList(generics.ListAPIView):
    serializer_class = ProfileSerializer
    queryset = UserProfile.objects.all()


class AddFriendView(generics.ListAPIView):
    serializer_class = FriendSerializer
    pagination_class = FriendsPagination

    def get_queryset(self):
        name = self.request.query_params.get("name", None)
        queryset = []

        if name == "" or name == None:
            queryset = UserProfile.objects.all().order_by('-post_count')[:50]
            # queryset = UserProfile.objects.annotate(f_count=Count('profile_followers')).order_by('f_count')[:15]
        else:
            queryset = UserProfile.objects.filter(name__istartswith=name).order_by('-post_count')[:50]
        
        return queryset

        
class MutualFriendsView(generics.ListAPIView):
    serializer_class = ProfileSerializer

    def get_queryset(self):
        name = self.request.query_params.get("name", None)
        queryset = []

        if name != None:
            profile = UserProfile.objects.get(name=name)
            queryset = UserProfile.objects.filter(profile_following__in=[profile]).order_by("-points")
        
        return queryset


class GetTopPosters(generics.ListAPIView):
    serializer_class = ProfileSerializer

    def get_queryset(self):
        name = self.request.query_params.get("name", None)
        group = Group.objects.get(name=name)
        members = {}
        queryset = []

        posts = Post.objects.filter(Q(group1=group) | Q(group2=group) | Q(group3=group))

        for post in posts:
            if post.author not in members.keys():
                members[post.author] = 1
            else:
                members[post.author] += 1
        authors = sorted(members.items(), key=lambda x: x[1], reverse=True)[:20]
        for author in authors:
            queryset.append(author[0])
        return queryset



class GetProfile(APIView):
    serializer_class = ProfileSerializer
    lookup_url_kwarg = 'name'

    def get(self, request, format=None):
        name = request.GET.get(self.lookup_url_kwarg)
        if name != None:
            profile = UserProfile.objects.filter(name=name)
            if len(profile) > 0:
                data = ProfileSerializer(profile[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Profile not found': 'Invalid username'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad Request': 'Username parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class GetComments(APIView):
    serializer_class = CommentSerializer
    lookup_url_kwarg = 'post'
    
    def get(self, request, format=None):
        post = request.GET.get(self.lookup_url_kwarg)
        if post != None:
            comments = Comment.objects.filter(post=post).order_by("-created_on")
            for t in range(len(comments)):
                comments[t].author_name = comments[t].author.name
            if len(comments) > 0:
                data = CommentSerializer(comments, many=True).data
                return Response(data, status=status.HTTP_200_OK)
            return Response(['None'], status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Post parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class CommentCreateView(APIView):
    serializer_class = CreateCommentSerializer
    parser_classes = [MultiPartParser, FormParser]
    lookup_url_kwarg = 'post'
    # permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        post = Post.objects.get(id=id)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user.profile, author_name=request.user.profile.name, author_image=request.user.profile.picture, post=post)

            post.popularity += 1
            post.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'An error occurred'}, status=status.HTTP_400_BAD_REQUEST)


class UpdateComment(APIView):
    serializer_class = CommentSerializer
    lookup_url_kwarg = 'id'
    parser_classes = [JSONParser]

    def post(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        likes = request.data['likes']
        dislikes = request.data['dislikes']

        instance = Comment.objects.get(id=id)
        instance.likes.set(likes)
        instance.dislikes.set(dislikes)

        serializer = self.serializer_class(instance)

        return Response(serializer.data, status=status.HTTP_200_OK)


class GetMedia(APIView):
    serializer_class = MediaSerializer
    lookup_url_kwarg = 'media'

    def get(self, request, format=None):
        media = request.GET.get(self.lookup_url_kwarg)
        if media != '':
            if len(media) > 5:
                media = Media.objects.filter(media__istartswith=media)
            else:
                media = Media.objects.filter(media__iexact=media)
            if len(media) > 0:
                media = media[0]
                serializer = self.serializer_class(media)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response('', status=status.HTTP_200_OK)