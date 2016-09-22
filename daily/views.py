from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.utils import timezone
from django.utils.dateparse import parse_time
from .models import Project, Employee, Phone
import json
import datetime

def index(request):
  today = timezone.now().date()
  #todays_schedule = Project.objects.filter(date=today)
  todays_schedule = Project.objects.all()
  employees = Employee.objects.all()
  phones = Phone.objects.all()
  date = datetime.date(int(today.year), int(today.month), int(today.day))
   
  context = {'date': date, 'schedule': todays_schedule, 'date': today, 'emp_names': employees, 'phones': phones}
  
  return render(request, 'daily/div-test.html/', context)

def show_schedule(request, year, month, day):
  date = datetime.date(int(year), int(month), int(day))
  return render(request, 'daily/boot-test.html', {'date': date})

def new_project(request):
  print(request.POST)
  pname = request.POST['proj-name']
  ptime = request.POST['proj-time']
  pemps = json.loads(request.POST['proj-emps'])
  pphones = json.loads(request.POST['proj-phone'])
  
  p = Project()
  p.name=pname
  p.date=timezone.now().date()
  p.time=parse_time(ptime)
  p.save()
  
  
  for emp in pemps:
    p.employee.add(Employee.objects.get(name=emp))

  for phone in pphones:
    p.phone.add(Phone.objects.get(number=phone))

  p.save()
  
  #add new project
  return HttpResponseRedirect('/daily')
