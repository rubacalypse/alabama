from django.conf.urls import url

from . import views
import datetime

urlpatterns = [
        url(r'^$', views.index, name='index'),
        url(r'^(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})/$',
          views.show_schedule, name='show_schedule'),
        url(r'^new_project', views.update_schedule, name='new'),
        ]
