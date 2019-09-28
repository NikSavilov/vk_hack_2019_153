import datetime
import random

from django.http import Http404
from django.shortcuts import render
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from rest_framework.response import Response
import traceback

from api.models import Customer, Challenge, Question, Answer, Donation, ChallengeChoice
# Create your views here.
from api.serializers import CustomerSerializer, CustomerWriteSerializer, DonationSerializer, DonationWriteSerializer, \
	ChallengeSerializer, ChallengeWriteSerializer


class MyApiView(
	viewsets.ModelViewSet,
	RetrieveUpdateDestroyAPIView):
	serializer_class = None
	parser_classes = [JSONParser, MultiPartParser, FormParser]


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

	@action(detail=False, methods=["get"])
	def registered(self, request):
		try:
			user_id = request.query_params.get("user_id", None)
			customer = Customer.objects.filter(vk_id=user_id)
			if customer:
				if customer[0].last_online < (timezone.now() - datetime.timedelta(hours=24)):
					customer[0].diff_risk = 0
					customer[0].save()
				else:
					customer[0].last_online = timezone.now()
					customer[0].save()
				return Response(data={"is": True})
			else:
				return Response(data={"is": False})
		except:
			return Response(data={"is": False})

	@action(detail=False, methods=["get"])
	def new(self, request):
		try:
			q = request.query_params
			q_d = {k: v[0] if len(v) == 1 else v for k, v in q.lists()}
			customer = Customer(**q_d)
			customer.save()
			return Response(data=CustomerSerializer(customer).data)
		except:
			print(traceback.format_exc())
			return Response(data={"is": "false"})

	@action(detail=False, methods=["get"])
	def get_main_page(self, request):
		try:
			user_id = request.query_params.get("user_id", None)
			customer = Customer.objects.filter(vk_id=int(user_id))
			if customer.count() == 1:
				customer = customer[0]
				recommended_query = customer.get_recommended()
				current_query = customer.get_current()
				recommended = []
				for item in recommended_query:
					new = {
						"title": item.question.text,
						"diffRiskValue": item.risk_value,
						"days": item.days,
						"description": item.description,
						"id": item.id
					}
					recommended.append(new)

				current = []
				for item in current_query:
					new = {
						"title": item.challenge.question.text,
						"diffRiskValue": item.challenge.risk_value,
						"days": item.challenge.days,
						"daysLeft": random.randint(15, 25),
						"description": item.challenge.description,
						"id": item.challenge.id
					}
					line = item.challenge.question.answers.filter(customer__vk_id=user_id).order_by("date")
					if line:
						new["completed"] = line[0].value
					else:
						new["completed"] = False
					current.append(new)
				answer = {
					"amount": sum([item["sum"] for item in customer.donations.values("sum")]),
					"risk": customer.risk,
					"diff_risk": customer.diff_risk,
					"recommended": recommended,
					"current": current,
					"vk_id": user_id,
					"subscribed": customer.subscribed
				}
				return Response(data=answer)
			else:
				return Response(data={"is": False})
		except:
			print(traceback.format_exc())
			return Response(data={"is": False})

	@action(detail=False, methods=["get"])
	def apply_challenge(self, request):
		try:
			user_id = request.query_params.get("user_id", None)
			completed = request.query_params.get("completed", None)
			id = request.query_params.get("id", None)
			risk = request.query_params.get("risk", None)
			diff_risk = request.query_params.get("diff_risk", None)
			if user_id and completed and id and risk and diff_risk:
				customer = Customer.objects.filter(vk_id=user_id)
				if customer.count() == 1:
					customer = customer[0]
					customer.risk = float(risk)
					challenge = Challenge.objects.get(id=id)
					answers = challenge.question.answers \
						.filter(customer__vk_id=user_id).order_by("date")
					if answers:
						ans = answers[0]
						ans.value = True if completed.lower() == "true" else False
						ans.save()
					else:
						ans = Answer(customer=customer,
									 value=True if completed.lower() == "true" else False,
									 question=challenge.question)
						ans.save()
					customer.diff_risk = float(diff_risk)
					customer.save()
					return Response(data={"is": True})
			return Response(data={"is": False})
		except:
			print(traceback.format_exc())
			return Response(data={"is": False})


class DonationViewSet(MyApiView):
	queryset = Donation.objects.all()
	serializer_class = DonationSerializer
	update_serializer_class = DonationWriteSerializer

	@action(detail=False, methods=["get"])
	def of_user(self, request):
		user_id = request.query_params.get("user_id", None)
		if user_id:
			donations = Donation.objects.filter(customer__vk_id=user_id)
			count = donations.count()
			donations = [DonationSerializer(donation).data for donation in donations]
			return Response(data={"count": count, "donations": donations})
		else:
			raise Http404("User_id wasn't provided.")

	@action(detail=False, methods=["get"])
	def new(self, request):
		user_id = request.query_params.get("user_id", None)
		sum = request.query_params.get("sum", None)
		own = request.query_params.get("own", None)
		subscription = request.query_params.get("subscription", None)
		try:
			if user_id and sum and own:

				customer = Customer.objects.filter(vk_id=int(user_id))
				customer = customer[0] if customer.count() else None
				if customer:
					if subscription and subscription.lower() == "true":
						customer.subscribed = True
						customer.save()
					donation = Donation(customer=customer, sum=int(sum), own=True if own == "true" else False)
					donation.date = timezone.now()
					donation.save()
					return Response(data=DonationSerializer(donation).data)
				else:
					raise Http404("Wrong params.")
			else:
				raise Http404("Wrong params.")
		except:

			raise Http404("Wrong params.")


class ChallengeViewSet(MyApiView):
	queryset = Challenge.objects.all()
	serializer_class = ChallengeSerializer
	update_serializer_class = ChallengeWriteSerializer

	@action(detail=False, methods=["get"])
	def choose(self, request):
		try:
			user_id = request.query_params.get("user_id", None)
			challenge_id = request.query_params.get("challenge_id", None)
			# subs
			if user_id and challenge_id:
				customer = Customer.objects.filter(vk_id=user_id)
				challenge = Challenge.objects.get(id=challenge_id)
				if customer:
					ChallengeChoice(customer=customer[0], challenge=challenge, active=True).save()
					return Response(data={"is": True})
			return Response(data={"is": False})
		except:
			return Response(data={"is": False})
