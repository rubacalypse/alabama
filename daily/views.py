from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.utils import timezone
from django.utils.dateparse import parse_time

from .models import Project, Employee, Phone

import datetime

def index(request):
  today = timezone.now().date()
  todays_schedule = Project.objects.filter(date=today)
  employee_names = Employee.objects.all()
  context = {'schedule': todays_schedule, 'date': today, 'emp_names':
      employee_names}
  return render(request, 'daily/div-test.html/', context)

def show_schedule(request, year, month, day):
  date = datetime.date(int(year), int(month), int(day))
  return render(request, 'daily/boot-test.html', {'date': date})

def new_project(request):
  print(request.POST)
  pname = request.POST['proj-name']
  ptime = request.POST['proj-time']
  pemps = request.POST['proj-emps']
  pphones = request.POST['proj-phone']
  print(pemps[0])
  
  p = Project()
  p.name=pname
  p.date=timezone.now().date()
  p.time=parse_time(ptime)
  p.save()
  p.employee.add(Employee.objects.get(name=pemps))
  p.phone.add(Phone.objects.get(number=pphones))
  
  p.save()
  
  #add new project
  return HttpResponseRedirect('/daily')
