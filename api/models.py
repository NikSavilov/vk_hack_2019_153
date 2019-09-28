from django.db import models

# Create your models here.
from django.utils import timezone


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

	challenges = models.ManyToManyField("Challenge", related_name="customers", blank=True, through="ChallengeChoice")

	def __str__(self):
		return str(self.vk_id)


class Challenge(models.Model):
	title = models.CharField(max_length=300)
	description = models.CharField(max_length=300, blank=True, null=True, default=None)
	question = models.ForeignKey("Question", on_delete=models.CASCADE, related_name="challenges")

	def __str__(self):
		return "{t} - {d} - {q}".format(t=self.title, d=self.description, q=self.question)


class ChallengeChoice(models.Model):
	customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
	challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
	active = models.BooleanField()
	date_of_start = models.DateTimeField(null=True, default=timezone.now, blank=True)

	def __str__(self):
		return "{c} of {cus}".format(c=self.challenge, cus=self.customer)


class Question(models.Model):
	text = models.CharField(max_length=300)

	def __str__(self):
		return self.text


class Variant(models.Model):
	value = models.CharField(max_length=100, null=True, default=None, blank=True)
	question = models.ForeignKey("Question", related_name="variants", blank=True, on_delete=models.CASCADE)
	type = models.CharField(max_length=30, choices=(
		("choice", "choice"),
		("number", "number"),
		("string", "string")))  # choice / number / string

	def __str__(self):
		return self.value


class Answer(models.Model):
	date = models.DateTimeField(null=True, default=timezone.now)
	customer = models.ForeignKey("Customer", related_name="answers", on_delete=models.CASCADE)

	variant = models.ForeignKey("Variant", related_name="answer", on_delete=models.CASCADE)
	value = models.CharField(max_length=100, null=True, default=None, blank=True)

	def __str__(self):
		return str(self.value if self.value else (self.variant.value if self.variant.value else None))


class Donation(models.Model):
	date = models.DateTimeField(null=True, default=timezone.now)
	own = models.BooleanField(default=True)
	sum = models.IntegerField()
	customer = models.ForeignKey(
		"Customer", on_delete=models.CASCADE, related_name="donations", default=None,
		null=True, blank=True)

	def __str__(self):
		return "Sum: {}".format(self.sum)
