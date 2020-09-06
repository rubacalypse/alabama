from __future__ import unicode_literals
from django.db import models
from django.utils import timezone
import datetime

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
  print("in Project")
  complete = 'CMP'
  incomplete = 'INCMP'
  status_choices = (
      (complete, 'complete'), 
      (incomplete, 'incomplete'),
      )
  name = models.CharField(max_length=200)
  start_date = models.DateTimeField('StartDate', null=True)
  end_date = models.DateTimeField('EndDate', null=True)
  employee = models.ManyToManyField(Employee)
  phone = models.ManyToManyField(Phone)
  vehicle = models.ManyToManyField(Vehicle)
  status = models.CharField(
      max_length=5,
      choices=status_choices,
      default=incomplete
      )
  print("status")
  
  def __str__(self):
    return self.name

