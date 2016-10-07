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
  
  return render(request, 'daily/daily.html/', context)

def show_schedule(request, year, month, day):
  date = datetime.date(int(year), int(month), int(day))
  return render(request, 'daily/boot-test.html', {'date': date})

def update_schedule(request):
  print(request.POST)
  schedule = json.loads(request.POST['schedule'])
  for s in schedule:
    if int(s['proj-id']) == -1:
      proj = Project()
      proj.date = timezone.now().date()
    else:
      proj = Project.objects.get(pk=s['proj-id'])
    proj.name = s['proj-name']
    new_time = s['proj-time']
    proj.time = parse_time(new_time)
    proj.save()
    #TODO: add date

    proj.employee.clear()
    proj.phone.clear()
    pemps = s['proj-emps']
    pphones = s['proj-phones']

    #import pdb
    #pdb.set_trace()
    for emp in pemps:
      proj.employee.add(Employee.objects.get(name=emp))

    for phone in pphones:
      proj.phone.add(Phone.objects.get(number=phone))

    proj.save()

  return HttpResponseRedirect('/daily')
