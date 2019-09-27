from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.generics import RetrieveUpdateDestroyAPIView

from api.models import Customer, Challenge, Question, Variant, Answer, Donation
# Create your views here.
from api.serializers import CustomerSerializer, CustomerWriteSerializer


class MyApiView(
	viewsets.ModelViewSet,
	RetrieveUpdateDestroyAPIView):
	serializer_class = None


class MyPatchApiView(MyApiView):
	def get_serializer_class(self):
		serializer_class = self.serializer_class

		if self.request.method == 'PATCH' or self.request.method == 'POST' and self.update_serializer_class:
			serializer_class = self.update_serializer_class

		return serializer_class


class CustomerViewSet(MyApiView):
	queryset = Customer.objects.all()
	serializer_class = CustomerSerializer
	update_serializer_class = CustomerWriteSerializer
