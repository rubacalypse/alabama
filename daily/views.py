from django.shortcuts import render
from django.http import HttpResponse
from django.utils import timezone

from .models import Project

import datetime

def index(request):
  today = timezone.now().date()
  todays_schedule = Project.objects.filter(date=today)
  context = {'schedule': todays_schedule, 'date': today}
  return render(request, 'daily/boot-test.html/', context)

def show_schedule(request, year, month, day):
  date = datetime.date(int(year), int(month), int(day))
  return render(request, 'daily/boot-test.html', {'date': date})
