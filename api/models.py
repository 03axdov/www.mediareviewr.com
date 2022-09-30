from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from .validators import file_size

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, primary_key=True, verbose_name='user', related_name='profile', on_delete=models.CASCADE)
    name = models.CharField(max_length=30, blank=True, null=True, unique=True)
    post_count = models.IntegerField(default=0)
    location = models.CharField(max_length=30, blank=True, default="")
    bio = models.TextField(max_length=5000, blank=True, default="")
    status = models.CharField(max_length=100, blank=True, default="")

    picture = models.ImageField(upload_to='uploads/profile_pictures', default='uploads/profile_pictures/default.jpg', blank=True, null=True)
    banner = models.ImageField(upload_to="uploads/banners", blank=True, null=True)

    followers = models.ManyToManyField('self', blank=True, related_name='profile_followers', symmetrical=False)
    following = models.ManyToManyField('self', blank=True, related_name='profile_following', symmetrical=False)
    saved = models.ManyToManyField('Post', blank=True, related_name='saved')
    watchlist = models.TextField(max_length=10000, blank=True, default="")
    points = models.IntegerField(default=0)

    movie = models.IntegerField(default=0)
    anime = models.IntegerField(default=0)
    series = models.IntegerField(default=0)
    game = models.IntegerField(default=0)
    literature = models.IntegerField(default=0)

    first_movie = models.CharField(max_length=100, blank=True, default='')
    second_movie = models.CharField(max_length=100, blank=True, default='')
    third_movie = models.CharField(max_length=100, blank=True, default='')
    fourth_movie = models.CharField(max_length=100, blank=True, default='')
    fifth_movie = models.CharField(max_length=100, blank=True, default='')

    first_anime = models.CharField(max_length=100, blank=True, default='')
    second_anime = models.CharField(max_length=100, blank=True, default='')
    third_anime = models.CharField(max_length=100, blank=True, default='')
    fourth_anime = models.CharField(max_length=100, blank=True, default='')
    fifth_anime = models.CharField(max_length=100, blank=True, default='')

    first_series = models.CharField(max_length=100, blank=True, default='')
    second_series = models.CharField(max_length=100, blank=True, default='')
    third_series = models.CharField(max_length=100, blank=True, default='')
    fourth_series = models.CharField(max_length=100, blank=True, default='')
    fifth_series = models.CharField(max_length=100, blank=True, default='')

    first_game = models.CharField(max_length=100, blank=True, default='')
    second_game = models.CharField(max_length=100, blank=True, default='')
    third_game = models.CharField(max_length=100, blank=True, default='')
    fourth_game = models.CharField(max_length=100, blank=True, default='')
    fifth_game = models.CharField(max_length=100, blank=True, default='')

    first_literature = models.CharField(max_length=100, blank=True, default='')
    second_literature = models.CharField(max_length=100, blank=True, default='')
    third_literature = models.CharField(max_length=100, blank=True, default='')
    fourth_literature = models.CharField(max_length=100, blank=True, default='')
    fifth_literature = models.CharField(max_length=100, blank=True, default='')

    def __str__(self):
        return self.name


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance, name=instance.username)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class Group(models.Model):
    name = models.CharField(max_length=150, blank=True, unique=True)
    author = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True)
    author_name = models.CharField(max_length=30, blank=True, null=True)
    description = models.CharField(max_length=400, blank=True)
    type = models.CharField(max_length=50)
    members = models.ManyToManyField('UserProfile', blank=True, related_name="members")
    members_count = models.IntegerField(default=0)
    post_count = models.IntegerField(default=0)
    header_image = models.ImageField(upload_to='images/', blank=True, null=True)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    created_on = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name


class Post(models.Model):
    post_type = models.CharField(max_length=50, default="review")
    title = models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(max_length=50, blank=True, null=True)
    season = models.CharField(max_length=25, blank=True, null=True)
    episode = models.IntegerField(blank=True, null=True)
    media = models.CharField(max_length=100, blank=True, null=True)
    rating = models.FloatField(blank=True, null=True)
    body = models.TextField(max_length=20000, blank=True, null=True)

    image = models.FileField(upload_to='images/', blank=True, null=True, validators=[file_size])
    
    created_on = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    author_name = models.CharField(max_length=30, blank=True, null=True)
    author_image = models.ImageField(upload_to="images/", blank=True, null=True)
    likes = models.ManyToManyField(UserProfile, blank=True, related_name='post_likes')
    dislikes = models.ManyToManyField(UserProfile, blank=True, related_name='post_dislikes')
    popularity = models.IntegerField(default=0)

    ranking = models.IntegerField(default=10000)
    ranking2 = models.IntegerField(default=10000)
    ranking3 = models.IntegerField(default=10000)
    ranking4 = models.IntegerField(default=10000)
    ranking5 = models.IntegerField(default=10000)
    rankingMovie = models.IntegerField(default=0)
    rankingAnime = models.IntegerField(default=0)
    rankingSeries = models.IntegerField(default=0)
    rankingGame = models.IntegerField(default=0)
    rankingLiterature = models.IntegerField(default=0)

    group1 = models.ForeignKey("Group", blank=True, null=True, on_delete=models.SET_NULL, related_name="group1")
    group2 = models.ForeignKey("Group", blank=True, null=True, on_delete=models.SET_NULL, related_name="group2")
    group3 = models.ForeignKey("Group", blank=True, null=True, on_delete=models.SET_NULL, related_name="group3")

    streaming1 = models.CharField(max_length=2000, blank=True, null=True)
    streaming2 = models.CharField(max_length=2000, blank=True, null=True)
    streaming3 = models.CharField(max_length=2000, blank=True, null=True)
    streaming4 = models.CharField(max_length=2000, blank=True, null=True)
    streaming5 = models.CharField(max_length=2000, blank=True, null=True)

    def __str__(self):
        return str(self.media) + " (" + self.title + ")"


class Media(models.Model):
    media = models.CharField(max_length=100)
    popularity = models.IntegerField()
    total_popularity = models.IntegerField(default=0)
    average_rating = models.FloatField(default=0)
    type = models.CharField(max_length=50, blank=True, null=True)
    media_image = models.ImageField(upload_to="images/", blank=True, null=True)

    def __str__(self):
        return self.media


class Comment(models.Model):
    comment = models.TextField(max_length=200)
    created_on = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    author_name = models.CharField(max_length=30, blank=True, null=True)
    author_image = models.ImageField(upload_to="images/", blank=True, null=True)
    post = models.ForeignKey('Post', on_delete=models.CASCADE)
    likes = models.ManyToManyField(UserProfile, blank=True, related_name='comment_likes')
    dislikes = models.ManyToManyField(UserProfile, blank=True, related_name='comment_dislikes')


class Notification(models.Model):
    # 1 = Like, 2 = Comment, 3 = Follow
    notification_type = models.IntegerField()
    to_user = models.ForeignKey(User, related_name='notification_to', on_delete=models.CASCADE, null=True)
    from_user = models.ForeignKey(User, related_name='notification_from', on_delete=models.CASCADE, null=True)
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='+', blank=True, null=True)
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE, related_name='+', blank=True, null=True)
    date = models.DateTimeField(default=timezone.now)
    user_has_seen = models.BooleanField(default=False)