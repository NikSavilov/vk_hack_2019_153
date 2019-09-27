from rest_framework import serializers

from api.models import Customer, Challenge, Answer


class ChallengeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Challenge
		fields = "__all__"
		depth = 3


class ChallengeWriteSerializer(serializers.ModelSerializer):
	class Meta:
		model = Challenge
		fields = "__all__"
		depth = 1


class AnswerSerializer(serializers.ModelSerializer):
	class Meta:
		model = Answer
		fields = ["id", "date", "value", "variant"]
		depth = 1


class AnswerWriteSerializer(serializers.ModelSerializer):
	class Meta:
		model = Answer
		fields = "__all__"
		depth = 1


class CustomerSerializer(serializers.ModelSerializer):
	challenges = ChallengeSerializer(required=False, many=True)
	answers = AnswerSerializer(required=False, many=True)

	class Meta:
		model = Customer
		fields = "__all__"
		depth = 3


class CustomerWriteSerializer(serializers.ModelSerializer):
	class Meta:
		model = Customer
		fields = "__all__"
		depth = 1
