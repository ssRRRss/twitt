# Generated by Django 4.0.1 on 2022-03-24 08:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('twitter', '0004_alter_tweet_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tweet',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
