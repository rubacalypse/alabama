from django.conf.urls import url

from . import views
import datetime

urlpatterns = [
        url(r'^$', views.index, name='index'),
        url(r'^(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})/$',
          views.show_schedule, name='show_schedule'),
        url(r'^update_schedule', views.update_schedule, name='update_schedule'),
        url(r'^employees', views.manage_employees, name="employees"),
        url(r'^update_employee_list', views.update_employee_list, name='update_employee_list'),
        ]
