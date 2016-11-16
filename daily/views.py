from pprint import pprint
from django.db import transaction
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.utils import timezone
from django.utils.dateparse import parse_time
from django.contrib.auth import authenticate, login, logout
from .models import Project, Employee, Phone, Vehicle, Category
import json
import datetime
import time
from django.contrib.auth.decorators import login_required
from django.urls import reverse

def logout_user(request):
  logout(request);
  return HttpResponseRedirect(reverse('schedule'))

@transaction.atomic
def login_user(request):
  username = request.POST.get('username')
  password = request.POST.get('password')
  next = request.POST.get('next')
  print(username)
  print(password)
  print(next)
  user = authenticate(username=username, password=password)
  if user is not None:
    if user.is_active:
      login(request, user)
      response = next
    else:
      print("inactive user")
  else:
      response = next + '#login-invalid'
    #response = HttpResponse(json.dumps({'login': 'invalid'}), content_type='application/json')
  return HttpResponseRedirect(response)

def show_schedule(request, year, month, day): 
  print("do we come to show schedule?")
  date = datetime.datetime(int(year), int(month), int(day)) 
  #incompletes = Project.objects.filter(status='INCMP')
  incompletes = Project.objects.filter(dtime__year=year, dtime__month=month, dtime__day=day, status='INCMP')
  employees = Employee.objects.all().order_by('name')
  phones = Phone.objects.all()
  vehicles = Vehicle.objects.all()
  #date = datetime.date(int(today.year), int(today.month), int(today.day))
  context = {'schedule': incompletes, 'date': date,
      'emp_names': employees, 'phones': phones, 'vehicles': vehicles}
 
  return render(request, 'daily/daily.html/', context)


def schedule(request):
  print("do we come here again?")
  today = timezone.now()
  date = request.POST.get('date')
  pprint(date) 
  if date is None:
    date = timezone.now()
  else:
    date = datetime.datetime.strptime(date, "%B %d, %Y")
  
  #incompletes = Project.objects.filter(status='INCMP')
  incompletes = Project.objects.filter(dtime__year=date.year, dtime__month=date.month, dtime__day=date.day, status='INCMP')
  employees = Employee.objects.all().order_by('name')
  phones = Phone.objects.all()
  vehicles = Vehicle.objects.all()
  context = {'schedule': incompletes, 'date': date,
      'emp_names': employees, 'phones': phones, 'vehicles': vehicles}

  return render(request, 'daily/daily.html/', context)

@login_required
@transaction.atomic
def update_schedule(request):
  deleted = json.loads(request.POST.get('deleted'))
  pprint(deleted)
  
  for projID in deleted:
    pprint(projID)
    proj = Project.objects.get(pk=projID)
    pprint(proj)
    proj.delete()

  schedule = json.loads(request.POST.get('schedule'))
  pprint(schedule)
  for s in schedule:
    if int(s['proj-id']) == -1:
      proj = Project()
      proj.dtime = timezone.now()
    else:
      pprint(s['proj-id'])
      proj = Project.objects.get(pk=s['proj-id'])
    proj.name = s['proj-name']
    new_time = s['proj-time']
    complete = s['proj-status']
    if (complete):
      proj.status = 'CMP'
    else:
      proj.status = 'INCMP'

    t_st = time.strptime(new_time, "%I:%M %p")
    formatted_time = datetime.time(t_st.tm_hour, t_st.tm_min)

    proj.dtime = datetime.datetime.combine(proj.dtime.date(), formatted_time) 
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

@login_required
def manage_employees(request):
  employees = Employee.objects.all()
  print employees
  categories = Category.objects.all()
  context = {'employees': employees, 'cats': categories}
  return render(request, 'daily/employees.html', context)

@login_required
def update_employee_list(request):
  deleted = json.loads(request.POST.get('deleted'))
  pprint(deleted)
  
  for empID in deleted:
    pprint(empID)
    emp = Employee.objects.get(pk=empID)
    pprint(emp)
    emp.delete()
  
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

@login_required
def manage_phones(request):
  phones = Phone.objects.all()
  context = {'phones': phones}
  return render(request, 'daily/phones.html', context)

@login_required
def update_phone_list(request):
  deleted = json.loads(request.POST.get('deleted'))
  pprint(deleted)
  
  for phoneID in deleted:
    pprint(phoneID)
    phone = Phone.objects.get(pk=phoneID)
    pprint(phone)
    phone.delete()
  
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

@login_required
def manage_categories(request):
  categories = Category.objects.all()
  context = {'categories': categories}
  return render(request, 'daily/categories.html', context)

@login_required
def update_category_list(request):
  deleted = json.loads(request.POST.get('deleted'))
  pprint(deleted)
  
  for catID in deleted:
    pprint(catID)
    category = Category.objects.get(pk=catID)
    pprint(category)
    category.delete()
  
  categories = json.loads(request.POST.get('list'))
  pprint(categories)
  for c in categories:
    pprint(c)
    if int(c['cat-id']) == -1:
      category = Category()
    else:
      category = Category.objects.get(pk=c['cat-id'])

    category.name = c['cat-name']
    category.save()
  return HttpResponseRedirect('categories')

@login_required
def manage_vehicles(request):
  vehicles = Vehicle.objects.all()
  context = {'vehicles': vehicles}
  return render(request, 'daily/vehicles.html', context)

@login_required
def update_vehicle_list(request):
  deleted = json.loads(request.POST.get('deleted'))
  pprint(deleted)
  
  for vehicleID in deleted:
    pprint(vehicleID)
    vehicle = Vehicle.objects.get(pk=vehicleID)
    pprint(vehicle)
    vehicle.delete()
  
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
