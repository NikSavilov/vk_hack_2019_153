# Generated by Django 2.2.5 on 2019-09-28 20:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_customer_last_online'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='subscribed',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]