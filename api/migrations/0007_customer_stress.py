# Generated by Django 2.2.5 on 2019-09-28 07:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20190928_1008'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='stress',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
    ]
