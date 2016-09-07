from django.contrib import admin

from .models import Category, Phone, Employee, Project

admin.site.register(Category)
admin.site.register(Phone)
admin.site.register(Employee)
admin.site.register(Project)
