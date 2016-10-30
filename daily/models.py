from __future__ import unicode_literals
from django.db import models
from django.utils import timezone

class Category(models.Model):
  name = models.CharField(max_length=100)
    
  def __str__(self):
    return self.name

class Vehicle(models.Model):
  name = models.CharField(max_length=100)

  def __str__(self):
    return self.name

class Employee(models.Model):
  name = models.CharField(max_length=100)
  category = models.ManyToManyField(Category)

  def __str__(self):
    return self.name

#idea: use a regex to ensure only valid phone numbers are entered
class Phone(models.Model):
  number = models.CharField(max_length=10)

  def __str__(self):
    return self.number

class Project(models.Model):
  #TODO: check out this timezone.now().time() business
  complete = 'CMP'
  incomplete = 'INCMP'
  status_choices = (
      (complete, 'complete'), 
      (incomplete, 'incomplete'),
      )
  name = models.CharField(max_length=200)
  #date = models.DateField('Date', default=timezone.now().date())
  #time = models.TimeField('Time', default=timezone.now().time())
  dtime = models.DateTimeField('DTime', default=timezone.now)
  employee = models.ManyToManyField(Employee)
  phone = models.ManyToManyField(Phone)
  vehicle = models.ManyToManyField(Vehicle)
  status = models.CharField(
      max_length=5,
      choices=status_choices,
      default=incomplete
      )
  
  def __str__(self):
    return self.name

