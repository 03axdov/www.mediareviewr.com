from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.

@login_required(login_url="/accounts/login")
def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')

def index_no_login(request, *args, **kwargs):
    return render(request, 'frontend/index.html')