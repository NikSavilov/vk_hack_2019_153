# Generated by Django 2.2.5 on 2019-09-27 18:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20190927_2136'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='answer',
            name='type',
        ),
    ]
