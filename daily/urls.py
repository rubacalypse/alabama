from django.conf.urls import url
import django.contrib.auth.views

from . import views
import datetime

urlpatterns = [
        url(r'^$', views.schedule, name='schedule'),
        url(r'^dailyschedule', views.schedule, name='schedule'),
#        url(r'^daily/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})/$', views.show_schedule, name='show_schedule'),
        url(r'^update_schedule', views.update_schedule, name='update_schedule'),
        url(r'^employees', views.manage_employees, name="employees"),
        url(r'^update_employee_list', views.update_employee_list, name='update_employee_list'),
        url(r'^phones', views.manage_phones, name='phones'),
        url(r'^update_phone_list', views.update_phone_list, name='update_phone_list'),
        url(r'^vehicles', views.manage_vehicles, name='vehicles'),
        url(r'^update_vehicle_list', views.update_vehicle_list,
        name='update_vehicle_list'),
        url(r'^categories', views.manage_categories,
        name='categories'),
        url(r'^update_category_list', views.update_category_list,
          name='update_category_list'),
        url(r'^login', views.login_user, name='login'), 
        url(r'^logout', views.logout_user, name='logout'),
        ]
