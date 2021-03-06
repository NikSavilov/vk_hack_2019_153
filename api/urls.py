from django.conf.urls import url
from django.urls import include
from rest_framework import routers

from api import views

router = routers.DefaultRouter()
router.register(r'customers', views.CustomerViewSet)
router.register(r'donations', views.DonationViewSet)
router.register(r'challenges', views.ChallengeViewSet)


urlpatterns = [
	url(r'^', include(router.urls)),
]
