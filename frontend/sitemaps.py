from django.contrib.sitemaps import Sitemap
from django.shortcuts import reverse
from api.models import Group

class StaticViewSitemap(Sitemap):

    def items(self):
        return ['groups']

    def location(self, item):
        return reverse(item)


class GroupSitemap(Sitemap):

    def items(self):
        return Group.objects.all()
