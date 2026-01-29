# 🐍 Django Backend Implementation Guide

This document contains the complete Django REST Framework backend code for the Smart Expense Tracker project.

---

## 📁 Project Structure

```
backend/
├── manage.py
├── requirements.txt
├── expense_tracker/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── users/
│   ├── __init__.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── income/
│   ├── __init__.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── expense/
│   ├── __init__.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
└── analytics/
    ├── __init__.py
    ├── views.py
    └── urls.py
```

---

## 📦 requirements.txt

```txt
Django==4.2.7
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.0
python-decouple==3.8
```

---

## ⚙️ settings.py

```python
"""
Django settings for expense_tracker project.
Smart Expense Tracker - Final Year Project
"""

from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'your-secret-key-here-change-in-production'

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    # Local apps
    'users',
    'income',
    'expense',
    'analytics',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be first
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'expense_tracker.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'expense_tracker.wsgi.application'

# Database - SQLite for development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

# CORS Settings - Allow React frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True
```

---

## 🔗 Main urls.py

```python
"""
URL configuration for expense_tracker project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('income.urls')),
    path('api/', include('expense.urls')),
    path('api/', include('analytics.urls')),
]
```

---

## 👤 Users App

### models.py
```python
"""
User model - Uses Django's built-in User model
The default Django User model provides:
- username, email, password
- first_name, last_name
- is_active, is_staff, is_superuser
- date_joined, last_login
"""
from django.contrib.auth.models import User
# We use the built-in User model, no custom model needed
```

### serializers.py
```python
"""
User serializers for registration and authentication
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    Handles password validation and user creation
    """
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    name = serializers.CharField(source='first_name', required=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'password', 'password2')

    def validate(self, attrs):
        """Ensure passwords match"""
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs

    def validate_email(self, value):
        """Ensure email is unique"""
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        return value.lower()

    def create(self, validated_data):
        """Create new user with validated data"""
        user = User.objects.create(
            username=validated_data['email'],  # Use email as username
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user data (read-only)
    """
    name = serializers.CharField(source='first_name')

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'date_joined')
```

### views.py
```python
"""
User views for registration and authentication
"""
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .serializers import UserRegistrationSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration
    POST /api/register/
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens for immediate login
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveAPIView):
    """
    API endpoint to get current user profile
    GET /api/profile/
    """
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
```

### urls.py
```python
"""
User URL patterns
"""
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, UserProfileView

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
]
```

---

## 💰 Income App

### models.py
```python
"""
Income model for tracking user income
"""
from django.db import models
from django.contrib.auth.models import User


class Income(models.Model):
    """
    Income model to store user income records
    
    Fields:
    - user: ForeignKey to User (owner of the income)
    - amount: Decimal field for income amount
    - source: Description of income source (e.g., Salary, Freelance)
    - date: Date when income was received
    - created_at: Timestamp of record creation
    """
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='incomes'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    source = models.CharField(max_length=255)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = 'Income'
        verbose_name_plural = 'Incomes'

    def __str__(self):
        return f"{self.user.email} - {self.source}: {self.amount}"
```

### serializers.py
```python
"""
Income serializers
"""
from rest_framework import serializers
from .models import Income


class IncomeSerializer(serializers.ModelSerializer):
    """
    Serializer for Income model
    Handles validation and transformation of income data
    """
    class Meta:
        model = Income
        fields = ('id', 'amount', 'source', 'date', 'created_at')
        read_only_fields = ('id', 'created_at')

    def validate_amount(self, value):
        """Ensure amount is positive"""
        if value <= 0:
            raise serializers.ValidationError(
                "Amount must be greater than zero."
            )
        return value

    def create(self, validated_data):
        """Automatically set user from request"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
```

### views.py
```python
"""
Income views - CRUD operations
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Income
from .serializers import IncomeSerializer


class IncomeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Income CRUD operations
    
    Endpoints:
    - GET /api/income/ - List all income for current user
    - POST /api/income/ - Create new income
    - GET /api/income/{id}/ - Retrieve specific income
    - PUT /api/income/{id}/ - Update income
    - DELETE /api/income/{id}/ - Delete income
    """
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only income belonging to current user"""
        return Income.objects.filter(user=self.request.user)
```

### urls.py
```python
"""
Income URL patterns
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IncomeViewSet

router = DefaultRouter()
router.register(r'income', IncomeViewSet, basename='income')

urlpatterns = [
    path('', include(router.urls)),
]
```

---

## 💸 Expense App

### models.py
```python
"""
Expense model for tracking user expenses
"""
from django.db import models
from django.contrib.auth.models import User


class Expense(models.Model):
    """
    Expense model to store user expense records
    
    Fields:
    - user: ForeignKey to User (owner of the expense)
    - amount: Decimal field for expense amount
    - category: Choice field for expense category
    - description: Description of the expense
    - date: Date when expense occurred
    - created_at: Timestamp of record creation
    """
    CATEGORY_CHOICES = [
        ('food', 'Food & Dining'),
        ('travel', 'Travel'),
        ('shopping', 'Shopping'),
        ('bills', 'Bills & Utilities'),
        ('other', 'Other'),
    ]

    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='expenses'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.CharField(max_length=500)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = 'Expense'
        verbose_name_plural = 'Expenses'

    def __str__(self):
        return f"{self.user.email} - {self.category}: {self.amount}"
```

### serializers.py
```python
"""
Expense serializers
"""
from rest_framework import serializers
from .models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    """
    Serializer for Expense model
    Handles validation and transformation of expense data
    """
    category_display = serializers.CharField(
        source='get_category_display', 
        read_only=True
    )

    class Meta:
        model = Expense
        fields = (
            'id', 'amount', 'category', 'category_display',
            'description', 'date', 'created_at'
        )
        read_only_fields = ('id', 'created_at', 'category_display')

    def validate_amount(self, value):
        """Ensure amount is positive"""
        if value <= 0:
            raise serializers.ValidationError(
                "Amount must be greater than zero."
            )
        return value

    def validate_category(self, value):
        """Ensure category is valid"""
        valid_categories = ['food', 'travel', 'shopping', 'bills', 'other']
        if value not in valid_categories:
            raise serializers.ValidationError(
                f"Invalid category. Must be one of: {', '.join(valid_categories)}"
            )
        return value

    def create(self, validated_data):
        """Automatically set user from request"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
```

### views.py
```python
"""
Expense views - CRUD operations
"""
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Expense
from .serializers import ExpenseSerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Expense CRUD operations
    
    Endpoints:
    - GET /api/expense/ - List all expenses for current user
    - POST /api/expense/ - Create new expense
    - GET /api/expense/{id}/ - Retrieve specific expense
    - PUT /api/expense/{id}/ - Update expense
    - DELETE /api/expense/{id}/ - Delete expense
    """
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only expenses belonging to current user"""
        return Expense.objects.filter(user=self.request.user)
```

### urls.py
```python
"""
Expense URL patterns
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet

router = DefaultRouter()
router.register(r'expense', ExpenseViewSet, basename='expense')

urlpatterns = [
    path('', include(router.urls)),
]
```

---

## 📊 Analytics App

### views.py
```python
"""
Analytics views for monthly reports and smart tips
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from datetime import datetime, timedelta
from income.models import Income
from expense.models import Expense


class MonthlyAnalyticsView(APIView):
    """
    API endpoint for monthly analytics
    GET /api/analytics/monthly/
    
    Query params:
    - month: Month number (1-12), defaults to current month
    - year: Year, defaults to current year
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get month and year from query params
        now = datetime.now()
        month = int(request.query_params.get('month', now.month))
        year = int(request.query_params.get('year', now.year))

        # Calculate total income for the month
        total_income = Income.objects.filter(
            user=request.user,
            date__month=month,
            date__year=year
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Calculate total expenses for the month
        total_expenses = Expense.objects.filter(
            user=request.user,
            date__month=month,
            date__year=year
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Calculate category breakdown
        category_breakdown = {}
        categories = ['food', 'travel', 'shopping', 'bills', 'other']
        
        for category in categories:
            amount = Expense.objects.filter(
                user=request.user,
                date__month=month,
                date__year=year,
                category=category
            ).aggregate(total=Sum('amount'))['total'] or 0
            category_breakdown[category] = float(amount)

        # Calculate savings
        savings = float(total_income) - float(total_expenses)

        # Month name
        month_names = [
            '', 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]

        return Response({
            'month': month_names[month],
            'year': year,
            'total_income': float(total_income),
            'total_expenses': float(total_expenses),
            'savings': savings,
            'category_breakdown': category_breakdown,
        })


class SavingTipsView(APIView):
    """
    API endpoint for smart saving tips
    GET /api/analytics/tips/
    
    Generates personalized tips based on spending behavior
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tips = []
        now = datetime.now()

        # Get current month analytics
        total_income = Income.objects.filter(
            user=request.user,
            date__month=now.month,
            date__year=now.year
        ).aggregate(total=Sum('amount'))['total'] or 0

        total_expenses = Expense.objects.filter(
            user=request.user,
            date__month=now.month,
            date__year=now.year
        ).aggregate(total=Sum('amount'))['total'] or 0

        total_income = float(total_income)
        total_expenses = float(total_expenses)
        savings = total_income - total_expenses

        # Tip 1: Overspending warning
        if total_expenses > total_income and total_income > 0:
            tips.append({
                'id': 'overspending',
                'type': 'warning',
                'title': 'Overspending Alert!',
                'message': f'Your expenses (₹{total_expenses:,.0f}) exceed your income (₹{total_income:,.0f}). Consider cutting back on non-essential expenses.',
                'icon': '⚠️'
            })

        # Tip 2: Food expense warning (> 40%)
        food_expense = Expense.objects.filter(
            user=request.user,
            date__month=now.month,
            date__year=now.year,
            category='food'
        ).aggregate(total=Sum('amount'))['total'] or 0

        if total_expenses > 0:
            food_percentage = (float(food_expense) / total_expenses) * 100
            if food_percentage > 40:
                tips.append({
                    'id': 'food-high',
                    'type': 'warning',
                    'title': 'High Food Expenses',
                    'message': f'Food expenses are {food_percentage:.1f}% of your total spending. Try meal prepping or cooking at home more often to save money.',
                    'icon': '🍔'
                })

        # Tip 3: Shopping tip (> 30%)
        shopping_expense = Expense.objects.filter(
            user=request.user,
            date__month=now.month,
            date__year=now.year,
            category='shopping'
        ).aggregate(total=Sum('amount'))['total'] or 0

        if total_expenses > 0:
            shopping_percentage = (float(shopping_expense) / total_expenses) * 100
            if shopping_percentage > 30:
                tips.append({
                    'id': 'shopping-high',
                    'type': 'info',
                    'title': 'Shopping Tip',
                    'message': f'Shopping is {shopping_percentage:.1f}% of expenses. Consider waiting 24 hours before non-essential purchases.',
                    'icon': '🛍️'
                })

        # Tip 4: Good savings rate celebration
        if total_income > 0:
            savings_rate = (savings / total_income) * 100
            if savings_rate >= 20:
                tips.append({
                    'id': 'good-savings',
                    'type': 'success',
                    'title': 'Great Savings Rate!',
                    'message': f"You're saving {savings_rate:.1f}% of your income. Keep up the great work!",
                    'icon': '🎉'
                })
            elif savings_rate > 0:
                tips.append({
                    'id': 'improve-savings',
                    'type': 'info',
                    'title': 'Savings Goal',
                    'message': f"You're saving {savings_rate:.1f}%. Aim for 20% savings rate for financial security.",
                    'icon': '💡'
                })

        # Tip 5: Suggested monthly savings
        if total_income > 0:
            suggested_savings = total_income * 0.2
            tips.append({
                'id': 'suggested-savings',
                'type': 'info',
                'title': 'Recommended Savings',
                'message': f'Based on your income, aim to save ₹{suggested_savings:,.0f} per month (20% rule).',
                'icon': '📊'
            })

        return Response(tips)
```

### urls.py
```python
"""
Analytics URL patterns
"""
from django.urls import path
from .views import MonthlyAnalyticsView, SavingTipsView

urlpatterns = [
    path('analytics/monthly/', MonthlyAnalyticsView.as_view(), name='monthly-analytics'),
    path('analytics/tips/', SavingTipsView.as_view(), name='saving-tips'),
]
```

---

## 🚀 Backend Setup Instructions

```bash
# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create Django project
django-admin startproject expense_tracker .

# 4. Create apps
python manage.py startapp users
python manage.py startapp income
python manage.py startapp expense
python manage.py startapp analytics

# 5. Apply migrations
python manage.py makemigrations
python manage.py migrate

# 6. Create superuser (optional)
python manage.py createsuperuser

# 7. Run development server
python manage.py runserver
```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/register/ | User registration |
| POST | /api/login/ | Get JWT tokens |
| POST | /api/token/refresh/ | Refresh JWT token |
| GET | /api/profile/ | Get user profile |
| GET | /api/income/ | List all income |
| POST | /api/income/ | Create income |
| GET | /api/income/{id}/ | Get income details |
| PUT | /api/income/{id}/ | Update income |
| DELETE | /api/income/{id}/ | Delete income |
| GET | /api/expense/ | List all expenses |
| POST | /api/expense/ | Create expense |
| GET | /api/expense/{id}/ | Get expense details |
| PUT | /api/expense/{id}/ | Update expense |
| DELETE | /api/expense/{id}/ | Delete expense |
| GET | /api/analytics/monthly/ | Monthly analytics |
| GET | /api/analytics/tips/ | Smart saving tips |

---

## 🔧 Common Errors & Fixes

### CORS Error
**Error**: "Access-Control-Allow-Origin" header missing
**Fix**: Ensure `corsheaders` is installed and CORS settings are configured

### JWT Token Expired
**Error**: Token is invalid or expired
**Fix**: Use refresh token endpoint or re-login

### Migration Error
**Error**: No such table
**Fix**: Run `python manage.py makemigrations` and `python manage.py migrate`

---

**Note**: This Django backend code is provided as documentation for your final year project. The React frontend currently uses localStorage for demo purposes, but can be easily connected to this Django backend by updating the API calls.
