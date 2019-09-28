from django.contrib import admin
from api.models import *

# Register your models here.

admin.site.register(Customer)
admin.site.register(Challenge)
admin.site.register(Question)
admin.site.register(ChallengeRecommended)
admin.site.register(Answer)
admin.site.register(Donation)
admin.site.register(ChallengeChoice)
