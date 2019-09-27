from django.db import models


# Create your models here.
class Customer(models.Model):
	vk_id = models.IntegerField()
	weight = models.FloatField()
	height = models.FloatField()
	year_of_birth = models.IntegerField
	gender = models.CharField(max_length=20, choices=(("male", "male"), ("female", "female")))
	smoked = models.BooleanField(default=False)
	drunk = models.BooleanField(default=False)

	challenges = models.ManyToManyField("Challenge", related_name="customers", blank=True)


class Challenge(models.Model):
	title = models.CharField(max_length=300)
	description = models.CharField(max_length=300)
	question = models.ForeignKey("Question", on_delete=models.CASCADE, related_name="challenges")


class Question(models.Model):
	text = models.CharField(max_length=300)


class Variant(models.Model):
	text = models.CharField(max_length=50)
	question = models.ForeignKey("Question", related_name="variants", blank=True, on_delete=models.CASCADE)
	type = models.CharField(max_length=30)


class Answer(models.Model):
	customer = models.ForeignKey("Customer", related_name="answers", on_delete=models.CASCADE)
	question = models.ForeignKey("Question", related_name="answers", on_delete=models.CASCADE)
	variant = models.ForeignKey("Variant", related_name="answer", on_delete=models.CASCADE)

