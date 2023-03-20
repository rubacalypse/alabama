import django.contrib.auth.views
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, re_path
from django.contrib import admin

from . import views
import datetime
app_name = "daily"
urlpatterns = [
        re_path(r'^$', views.schedule, name='schedule'),
        re_path(r'^dailyschedule', views.schedule, name='schedule'),
        re_path(r'^daily/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})/$', views.schedule, name='schedule'),
        re_path(r'^update_schedule', views.update_schedule, name='update_schedule'),
        re_path(r'^employees', views.manage_employees, name="employees"),
        re_path(r'^update_employee_list', views.update_employee_list, name='update_employee_list'),
        re_path(r'^phones', views.manage_phones, name='phones'),
        re_path(r'^update_phone_list', views.update_phone_list, name='update_phone_list'),
        re_path(r'^vehicles', views.manage_vehicles, name='vehicles'),
        re_path(r'^update_vehicle_list', views.update_vehicle_list,
        name='update_vehicle_list'),
        re_path(r'^categories', views.manage_categories,
        name='categories'),
        re_path(r'^update_category_list', views.update_category_list,
          name='update_category_list'),
        re_path(r'^login', views.login_user, name='login'),
        #re_path(r'^login', views.login_user), 
        re_path(r'^logout', views.logout_user, name='logout'),
        path(r'^admin/', admin.site.urls),
        ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
