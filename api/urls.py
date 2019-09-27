from django.conf.urls import url
from django.urls import include
from rest_framework import routers

from api import views

router = routers.DefaultRouter()
router.register(r'customer', views.CustomerViewSet)

urlpatterns = [
	url(r'^', include(router.urls)),
]
