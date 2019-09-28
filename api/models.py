from django.db import models

# Create your models here.
from django.utils import timezone


class Challenge(models.Model):
	title = models.CharField(max_length=300)
	description = models.CharField(max_length=300, blank=True, null=True, default=None)
	question = models.ForeignKey("Question", on_delete=models.CASCADE, related_name="challenges")
	days = models.IntegerField(null=True, default=30)
	risk_value = models.FloatField(default=0, blank=True)

	def __str__(self):
		return "{t} - {d} - {q}".format(t=self.title, d=self.description, q=self.question)


class Customer(models.Model):
	vk_id = models.IntegerField(unique=True)
	weight = models.FloatField(blank=True, null=True, default=None)
	height = models.FloatField(blank=True, null=True, default=None)
	mass_index = models.FloatField(blank=True, null=True, default=None)
	years = models.IntegerField(blank=True, null=True, default=None)
	gender = models.CharField(max_length=20, choices=(("male", "male"), ("female", "female")), blank=True, null=True)
	smoked = models.IntegerField(blank=True, null=True, default=None)
	heart_disease = models.IntegerField(blank=True, null=True, default=None)
	do_sports = models.IntegerField(blank=True, null=True, default=None)
	sleep_hours = models.IntegerField(blank=True, null=True, default=None)
	eat_fruits = models.IntegerField(blank=True, null=True, default=None)
	stress = models.IntegerField(blank=True, null=True, default=None)

	last_online = models.DateTimeField(blank=True, null=True, default=timezone.now)
	risk = models.FloatField(blank=True, null=True, default=None)
	diff_risk = models.FloatField(blank=True, null=True, default=0)

	challenges = models.ManyToManyField("Challenge", related_name="customers", blank=True, through="ChallengeChoice")

	def __str__(self):
		return str(self.vk_id)

	def get_recommended(self):
		choices = Challenge.objects.all().exclude(challengechoice__customer=self)
		return choices

	def get_current(self):
		choices = ChallengeChoice.objects.filter(customer=self)
		return choices

class ChallengeChoice(models.Model):
	customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
	challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
	active = models.BooleanField()
	date_of_start = models.DateTimeField(null=True, default=timezone.now, blank=True)

	def __str__(self):
		return "{c} of {cus}".format(c=self.challenge, cus=self.customer)


class ChallengeRecommended(models.Model):
	customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
	challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)

	def __str__(self):
		return "{c} of {cus}".format(c=self.challenge, cus=self.customer)


class Question(models.Model):
	text = models.CharField(max_length=300)

	def __str__(self):
		return self.text


class Answer(models.Model):
	date = models.DateTimeField(null=True, default=timezone.now)
	customer = models.ForeignKey("Customer", related_name="answers", on_delete=models.CASCADE)
	value = models.BooleanField(null=True, default=None, blank=True)
	question = models.ForeignKey("Question", related_name="answers", on_delete=models.CASCADE, null=True, default=None,
								 blank=True)

	def __str__(self):
		return str(self.value)


class Donation(models.Model):
	date = models.DateTimeField(null=True, default=timezone.now)
	own = models.BooleanField(default=True)
	sum = models.IntegerField()
	customer = models.ForeignKey(
		"Customer", on_delete=models.CASCADE, related_name="donations", default=None,
		null=True, blank=True)

	def __str__(self):
		return "Sum: {}".format(self.sum)
