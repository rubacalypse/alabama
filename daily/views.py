from pprint import pprint
from django.db import transaction
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.utils import timezone
from django.utils.dateparse import parse_time
from .models import Project, Employee, Phone, Vehicle, Category
import json
import datetime

def index(request):
  today = timezone.now().date()
  #todays_schedule = Project.objects.filter(date=today)
  projects = Project.objects.all()
  employees = Employee.objects.all()
  phones = Phone.objects.all()
  vehicles = Vehicle.objects.all()
  date = datetime.date(int(today.year), int(today.month), int(today.day))
  context = {'date': date, 'schedule': projects, 'date': today,
      'emp_names': employees, 'phones': phones, 'vehicles': vehicles}
  
  return render(request, 'daily/daily.html/', context)

def show_schedule(request, year, month, day):
  date = datetime.date(int(year), int(month), int(day))
  return render(request, 'daily/daily.html', {'date': date})

@transaction.atomic
def update_schedule(request):
  schedule = json.loads(request.POST.get('schedule'))
  pprint(schedule)
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
    proj.vehicle.clear()

    pemps = s['proj-emps']
    pphones = s['proj-phones']
    pvehicles = s['proj-vehicles']

    for emp in pemps:
      proj.employee.add(Employee.objects.get(name=emp))

    for phone in pphones:
      proj.phone.add(Phone.objects.get(number=phone))

    for v in pvehicles:
      proj.vehicle.add(Vehicle.objects.get(name=v))

    proj.save()

  return HttpResponseRedirect('/daily')

def manage_employees(request):
  employees = Employee.objects.all()
  categories = Category.objects.all()
  context = {'employees': employees, 'cats': categories}
  return render(request, 'daily/employees.html', context)

def update_employee_list(request):
  emps = json.loads(request.POST.get('list'))
  pprint(emps)
  for e in emps:
    pprint(e)
    if int(e['emp-id']) == -1:
      emp = Employee()
    else:
      emp = Employee.objects.get(pk=e['emp-id'])
    emp.name = e['emp-name']
    emp.save()
    emp.category.clear()
    ecats = e['emp-cats']
    pprint(ecats)
    for cat in ecats:
      emp.category.add(Category.objects.get(name=cat))

    emp.save()
  return HttpResponseRedirect('employees')

def manage_phones(request):
  phones = Phone.objects.all()
  context = {'phones': phones}
  return render(request, 'daily/phones.html', context)

def update_phone_list(request):
  phones = json.loads(request.POST.get('list'))
  pprint(phones)
  for p in phones:
    pprint(p)
    if int(p['phone-id']) == -1:
      phone = Phone()
    else:
      phone = Phone.objects.get(pk=p['phone-id'])

    phone.number = p['phone-number']
    phone.save()
  
  return HttpResponseRedirect('phones')

def manage_vehicles(request):
  vehicles = Vehicle.objects.all()
  context = {'vehicles': vehicles}
  return render(request, 'daily/vehicles.html', context)

def update_vehicle_list(request):
  vehicles = json.loads(request.POST.get('list'))
  pprint(vehicles)
  for v in vehicles:
    pprint(v)
    if int(v['vehicle-id']) == -1:
      vehicle = Vehicle()
    else:
      vehicle = Vehicle.objects.get(pk=v['vehicle-id'])

    vehicle.name = v['vehicle-name']
    vehicle.save()
  return HttpResponseRedirect('vehicles')
